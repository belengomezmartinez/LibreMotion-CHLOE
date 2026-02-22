import Plotly from 'plotly.js-dist-min';
import { t, updatePlotsTranslations } from './i18n.js';
import { lastLoadedData } from './main.js';
import { activeVectors, isVectorPanelOpen } from './vectors.js';

let plotsPanel = null;
let selectedChannels = [];
let plotlyGraphs = {};

export let isAnalogPlotsOpen = false;

//==============================================================================
// Helper functions (used internally by the plotting panel and animation loop)
//==============================================================================

/**
 * Sanitizes a string to be used as a valid HTML ID by removing non-alphanumeric characters.
 * @param {string} name - The raw channel name.
 * @returns {string} - A sanitized string.
 */
function sanitizeId(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '_');
}

/**
 * Returns a color hex code based on a palette index for visual differentiation of signals.
 * @param {number} index - The current iteration index.
 * @returns {string} - Hex color code.
 */
function getColorForIndex(index) {
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45aaf2', '#26de81', '#a55eea',
        '#f7b731', '#fd9644', '#ff9ff3', '#54a0ff', '#5f27cd'
    ];
    return colors[index % colors.length];
}

/**
 * Sets up initial event listeners for the plotting panel controls.
 */
function initializePlotsPanel() {
    plotsPanel = document.getElementById('right-panel');
    document.getElementById('close-plots').addEventListener('click', closePlotsPanel);
    
    document.getElementById('apply-channels').addEventListener('click', function() {
        const analogData = lastLoadedData?.analog_data;
        if (analogData) {
            updateSelectedChannels();
            createAnalogPlots(analogData);
        }
    });
}

/**
 * Generates a checkbox list for all available analog channels.
 * @param {Object} analogData - Signal data dictionary.
 */
function loadChannelsSelector(analogData) {
    const channels = Object.keys(analogData.channels);
    const container = document.getElementById('channels-checkboxes');
    const selectorSection = document.querySelector('.channel-selector-section');
    
    selectorSection.style.display = 'block';
    container.innerHTML = '';
    
    channels.forEach((channel, idx) => {
        const isSelected = selectedChannels.includes(channel);
        const div = document.createElement('div');
        div.className = 'channel-checkbox';
        div.innerHTML = `
            <input type="checkbox" id="ch-${idx}" value="${channel}" ${isSelected ? 'checked' : ''}>
            <label for="ch-${idx}">${channel}</label>
        `;
        container.appendChild(div);
    });
    updateSelectedCount();
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
    });
}

/**
 * Renders interactive line charts using Plotly's WebGL engine (scattergl).
 * High-performance rendering is required for clinical data with high sample rates.
 * @param {Object} analogData - Dictionary containing channel arrays and sample rates.
 */
export function createAnalogPlots(analogData) {
    if (!analogData || selectedChannels.length === 0) return;
    
    const fs = analogData.sample_rate_hz || 1000;
    const graphSection = document.getElementById('graphs-section');
    graphSection.innerHTML = ''; 
    
    const isLightMode = document.body.classList.contains('light-mode');
    const textColor = isLightMode ? '#333' : '#fff';

    selectedChannels.forEach((channel, index) => {
        const yValues = analogData.channels[channel];
        if (!yValues) return;
        
        const sId = sanitizeId(channel);
        const plotItem = document.createElement('div');
        plotItem.className = 'plot-item';
        plotItem.style.marginBottom = "20px"; 
        
        plotItem.innerHTML = `
            <h5 style="color: ${textColor}; margin-bottom: 10px; border-bottom: 1px solid #444;">
                ${channel} 
            </h5>
            <div id="plot-${sId}" style="height:200px; width:100%;"></div>
        `;
        graphSection.appendChild(plotItem);
        
        // Define signal trace with WebGL support for smooth rendering
        const trace = {
            x: yValues.map((_, i) => i / fs), // Convert sample index to seconds
            y: yValues,
            type: 'scattergl',
            mode: 'lines',
            line: { color: getColorForIndex(index), width: 0.8 }
        };

        const layout = {
            height: 200,
            autosize: true,
            margin: { t: 5, b: 30, l: 50, r: 20 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'rgba(0,0,0,0.1)',
            font: { color: textColor },
            xaxis: { title: { 
                    text: 'Secs', 
                    font: { size: 11 }
                }, 
                gridcolor: isLightMode ? '#ddd' : '#444' },
            yaxis: { autorange: true, gridcolor: isLightMode ? '#ddd' : '#444' },
            // Add a vertical dashed line to represent the current time in the animation
            shapes: [{
                type: 'line', x0: 0, x1: 0, y0: 0, y1: 1, xref: 'x', yref: 'paper',
                line: { color: 'red', width: 1, dash: 'dash' }
            }]
        };

        Plotly.newPlot(`plot-${sId}`, [trace], layout, { responsive: true, displaylogo: false });
        plotlyGraphs[channel] = document.getElementById(`plot-${sId}`);
    });
}


/**
 * Updates the visual counter of selected analog channels in the plotting panel.
 * Triggered every time a channel checkbox is toggled.
 */
function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('#channels-checkboxes input:checked');
    const countElement = document.getElementById('plots-count');
    if (countElement) countElement.textContent = `${checkboxes.length} ${t('plots.selected_channels')}`;
}

/**
 * Syncs the global 'selectedChannels' array with the current state of the checkboxes.
 * Converts the DOM NodeList into a standard string array for the plotting engine.
 */
function updateSelectedChannels() {
    const checkboxes = document.querySelectorAll('#channels-checkboxes input:checked');
    selectedChannels = Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Safely removes all Plotly instances from the DOM and clears the internal cache.
 */
function clearPlots() {
    if (plotlyGraphs) {
        Object.values(plotlyGraphs).forEach(g => { if(g) Plotly.purge(g); });
    }
    plotlyGraphs = {};
    const gs = document.getElementById('graphs-section');
    if (gs) gs.innerHTML = '';
}


//==============================================================================
// Public functions (ANAL0G PLOTS, called from main.js and animation loop)
//==============================================================================

/**
 * Closes the plotting panel and clears memory resources associated with Plotly.
 */
export function closePlotsPanel() {
    const mainWrapper = document.getElementById('main-wrapper');
    const rightPanel = document.getElementById('right-panel');
    
    mainWrapper.classList.remove('with-plots');
    if (rightPanel) rightPanel.style.display = 'none';
    
    isAnalogPlotsOpen = false;
    clearPlots();
    
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
}

/**
 * Opens the right-side plotting panel and prepares the dual-pane layout.
 * @param {Object} analogData - The full analog data object from the C3D file.
 * @param {Function} getLatestAnalogData - A callback function that returns the latest analog data.
 */
export function openPlotsPanel(analogData) {
    if (!analogData || !analogData.channels) return;
    
    const mainWrapper = document.getElementById('main-wrapper');
    const rightPanel = document.getElementById('right-panel'); 

    // Update CSS class to trigger the split-screen layout
    mainWrapper.classList.add('with-plots');
    if (rightPanel) rightPanel.style.display = 'flex'; 
    
    isAnalogPlotsOpen = true;
    
    if (!plotsPanel) {
        initializePlotsPanel();
    }
    
    selectedChannels = []; // Reset selection on open
    loadChannelsSelector(analogData);
    updatePlotsTranslations();

    // Trigger a window resize event to force Three.js and Plotly to recalculate their containers
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
}

/**
 * Synchronizes the vertical "time line" on all active Plotly charts.
 * This is called on every frame of the 3D animation loop.
 * @param {number} currentTime - The current playback time in seconds.
 */
export function updatePlotlyTimeLine(currentTime) {
    if (!isAnalogPlotsOpen || !plotlyGraphs || selectedChannels.length === 0) return;
    
    selectedChannels.forEach(channel => {
        const graphDiv = plotlyGraphs[channel];
        
        if (graphDiv && graphDiv.layout) {
            // Efficiently update only the vertical line shape without re-rendering the whole plot
            Plotly.relayout(graphDiv, {
                'shapes[0].x0': currentTime,
                'shapes[0].x1': currentTime
            });
        }
    });
}

//==============================================================================
// Public functions (VECTOR PLOTS)
//==============================================================================

/**
 * Placeholder function for creating angle plots for vectors defined by marker pairs.
 * This will be called after calculating angles in vectors.js
 * @param {string} id - Unique identifier for the vector (e.g., "RSHO-RUPA").
 */
export function createVectorPlots(id) {
    const vec = activeVectors[id];
    const container = document.getElementById('vector-graphs-section');
    if (!vec || !container) return;

    const isLightMode = document.body.classList.contains('light-mode');
    const textColor = isLightMode ? '#333' : '#fff';

    const div = document.createElement('div');
    div.id = `wrapper-${id}`;
    div.className = 'vector-plot-item';
    div.innerHTML = `
        <div class="vector-plot-header" style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px;">
            <h5 style="margin:0;">Vector: ${vec.nameA} → ${vec.nameB}</h5>
            <button class="remove-vector-btn" data-id="${id}" title="${t('vectors.remove')}" 
                    style="background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 2px 8px;">
                ✕
            </button>
        </div>
        <div id="plot-${id}"></div>
    `;
    container.appendChild(div);

    div.querySelector('.remove-vector-btn').addEventListener('click', (e) => {
        const vectorId = e.target.getAttribute('data-id');
        import('./vectors.js').then(m => m.removeVector(vectorId));
    });

    const traces = [
        { x: vec.angleData.time, y: vec.angleData.x, name: 'Ang X', line: {color: 'red'} },
        { x: vec.angleData.time, y: vec.angleData.y, name: 'Ang Y', line: {color: 'green'} },
        { x: vec.angleData.time, y: vec.angleData.z, name: 'Ang Z', line: {color: 'blue'} }
    ];

    const layout = {
        height: 300,
        margin: { t: 30, b: 50, l: 60, r: 20 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'rgba(0,0,0,0.1)',
        font: { color: textColor },
        xaxis: { 
            title: { text: t('vectors.axis_seconds'), standoff: 15 },
            automargin: true,
            gridcolor: isLightMode ? '#ddd' : '#444'
        },
        yaxis: { 
            title: { text: t('vectors.axis_degrees'), standoff: 15 },
            range: [0, 180],
            gridcolor: isLightMode ? '#ddd' : '#444'
        },
        showlegend: true,
        legend: { orientation: "h", y: 1.1 },
        shapes: [{ 
            type: 'line', x0: 0, x1: 0, y0: 0, y1: 1, xref: 'x', yref: 'paper', 
            line: { color: 'red', dash: 'dash' } 
        }]  
    };

    Plotly.newPlot(`plot-${id}`, traces, layout);

}

/**
 * Updates the vertical time line on all vector angle plots to synchronize with the 3D animation.
 * This should be called on every frame of the animation loop.
 * @param {number} currentTime - The current playback time in seconds.
 */
export function updateVectorPlotLine(currentTime) {
    if (!isVectorPanelOpen || Object.keys(activeVectors).length === 0) return;
    Object.keys(activeVectors).forEach(id => {
        const graphDiv = document.getElementById(`plot-${id}`);
        if (graphDiv && graphDiv.layout) {
            Plotly.relayout(graphDiv, {
                'shapes[0].x0': currentTime,
                'shapes[0].x1': currentTime
            });
        }
    });
}