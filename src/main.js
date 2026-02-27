/**
 * PROJECT: CHLOE (Clinical Helper for Locomotion Objective Evaluation)
 * AUTHOR: Belén Gómez Martínez
 * PART OF: Bachelor's Thesis (TFG)
 * DESCRIPTION: Frontend visualization engine using Three.js and Plotly.js.
 * DOCUMENTATION: Refer to Thesis Chapter 4 for architectural details.
 */

import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { updateAvatarPose } from './kinematics.js';
import { openPlotsPanel, updatePlotlyTimeLine, isAnalogPlotsOpen, closePlotsPanel, createAnalogPlots, updateVectorPlotLine } from './plots.js';
import { TRANSLATIONS, t, updateToggleText, updateTextContent, updateTitle, updateThemeButtons, updatePlotsTranslations } from './i18n.js';
import { MARKER_CATEGORIES, CONECTIONS, MARKERS_COLOURS, HAND_MARKERS_SET, HEAD_MARKERS, ANALOG_COLOURS} from './constants.js';
import { toggleTrajectory, clearAllTrajectories, trajectories, updateTrajectoriesPanel} from './trajectories.js';
import { addMarkerVector, updateVectors3D, isVectorPanelOpen, setVectorPanelState, clearAllVectors, activeVectors} from './vectors.js';


// ======================================================================================
// Global variables
// ======================================================================================

export let lastLoadedData = null; 
export let currentLang = 'es';
export let scene;
export let animationData = null; 
export let avatar = null;
export let avatarBones = {
    RightArm: null, RightForeArm: null, RightHand: null,     
    Head: null, Neck: null,          
    LeftArm: null, LeftForeArm: null, LeftHand: null, 
    
    RightFingers: { Thumb: [], Index: [], Middle: [], Ring: [], Pinky: [] },
    LeftFingers:  { Thumb: [], Index: [], Middle: [], Ring: [], Pinky: [] },

    RightUpLeg: null, RightLeg: null, RightFoot: null, RightToe:null,
    LeftUpLeg: null, LeftLeg: null, LeftFoot: null, LeftToe:null,

    Spine: null, Spine1: null, Spine2: null,
    Hips: null
};
export let avatarLoaded = false;
export let isAvatarMode = true; // true = the avatar is shown, false = the lines are shown
export let originalFPS = 0;

let camera, renderer, controls, ambientLight;
let markers = {}; 
let lines = [];   
let cabezaMarker; 
let frameIndex = 0;
let isPlaying = false;
let playbackSpeed = 1;
let frameAccumulator = 0;
let lastTime = 0;
let currentFileName = '';
let skeletonHelper = null;

// ======================================================================================
// DOM references for UI control
// ======================================================================================

const viewModeToggle = document.getElementById('view-mode-toggle');
const statusEl = document.getElementById('status-message');
const uploadInput = document.getElementById('c3d-upload');
const controlsContainer = document.getElementById('controls-container');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnReset = document.getElementById('btn-reset');
const btnPrevFrame = document.getElementById('btn-prev-frame');
const btnNextFrame = document.getElementById('btn-next-frame');
const frameSlider = document.getElementById('frame-slider');
const frameCounter = document.getElementById('frame-counter');
const markersPanel = document.getElementById('markers-panel');
const panelToggle = document.getElementById('panel-toggle');
const markersCategories = document.getElementById('markers-categories');
const fpsDisplay = document.getElementById('fps-display');
const originalFpsDisplay = document.getElementById('original-fps');
const speedButtons = document.querySelectorAll('.speed-btn');
const metadataPanel = document.getElementById('metadata-panel');
const metadataToggle = document.getElementById('metadata-toggle');
const metadataContent = document.getElementById('metadata-content');
const trajectoriesPanel = document.getElementById('trajectories-panel');
const trajectoriesToggle = document.getElementById('trajectories-toggle');
export const trajectoriesList = document.getElementById('trajectories-list');
const clearTrajectoriesBtn = document.getElementById('clear-trajectories');
const analogPanel = document.getElementById('analog-panel');
const analogToggle = document.getElementById('analog-toggle');
const analogContent = document.getElementById('analog-content');
const vectorsToggle = document.getElementById('vectors-toggle');
const vectorsPanel = document.getElementById('vectors-panel');


// ============================================================================================================================================
// INTERNATIONALIZATION (i18n) ENGINE
// ============================================================================================================================================

/**
 * Orchestrates the language change across the entire application.
 * Updates static labels, dynamic panels, and 3D view controls.
 * @param {string} lang - The language code to switch to ('es', 'en', 'fr').
 */
function changeLanguage(lang) {
    if (!TRANSLATIONS[lang]) return; 
    currentLang = lang;
    
    // Update Static UI Elements
    updateTextContent('upload-label-text', t('app.select_file'));
    updateTextContent('markers-title', t('markers.control'));
    updateTextContent('trajectories-title', t('trajectories.title'));
    updateTextContent('analog-title', t('analog.title'));
    updateTextContent('metadata-title', t('metadata.title'));
    updateTextContent('clear-trajectories', t('trajectories.clear_all'));
    updateTextContent('vectors-title', t('vectors.title'));
    updateTextContent('btn-add-vector', t('vectors.add'));
    updateTextContent('btn-remove-vector', t('vectors.remove'));
    updateTextContent('btn-select-start-marker', t('vectors.select_start'));
    updateTextContent('btn-select-end-marker', t('vectors.select_end'));
    updateTextContent('vectors-title', t('vectors.title'));

    // Update Control Tooltips
    updateTitle('btn-reset', t('controls.reset'));
    updateTitle('btn-play-pause', t('controls.play'));
    updateTitle('btn-prev-frame', t('controls.prev_frame'));
    updateTitle('btn-next-frame', t('controls.next_frame'));
    
    // Update Playback Labels
    updateTextContent('lbl-frame', t('controls.frame') + ':');
    updateTextContent('lbl-speed', t('controls.speed') + ':');
    updateTextContent('lbl-fps', t('controls.fps') + ':');
    updateTextContent('lbl-original', t('controls.original_rate') + ':');
    

    // Update Toggle Buttons
    updateToggleText(panelToggle, 'ui.markers', markersPanel);
    updateToggleText(metadataToggle, 'ui.metadata', metadataPanel);
    updateToggleText(trajectoriesToggle, 'ui.trajectories', trajectoriesPanel);
    updateToggleText(analogToggle, 'ui.analog', analogPanel);
    updateToggleText(vectorsToggle, 'ui.vectors', vectorsPanel);

    // Initial prompt if no file loaded
    if (!animationData) {
        setStatus(t('app.select_file_prompt'), 'info');
    }

    // Update dynamic panels if data is loaded
    if (animationData) {
        createMarkersPanel(); 
        if (lastLoadedData) createMetadataPanel(lastLoadedData);
        if (lastLoadedData && lastLoadedData.analog_data) createAnalogPanel(lastLoadedData.analog_data);
        updateTrajectoriesPanel();
        createVectorsPanel();
    }
    
    // Visual feedback on active language
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const isActive = btn.textContent.toLowerCase() === lang;
        btn.classList.toggle('active', isActive);
    });

    // Update theme buttons text (Dark/Light)
    updateThemeButtons();

    if (viewModeToggle) {
        //button Avatar/Rig
        viewModeToggle.textContent = isAvatarMode ? t('ui.view_lines') : t('ui.view_avatar');
    }

    // Graphs title and labels if open
    if (isAnalogPlotsOpen) {
        updatePlotsTranslations();
        if (lastLoadedData?.analog_data) {
            createAnalogPlots(lastLoadedData.analog_data); // Re-render plots 
        }
    }

    console.log(`Idioma cambiado a: ${lang}`);
}

window.changeLanguage = changeLanguage;

// ============================================================================================================================================
// SCENE MANAGEMENT 
// ============================================================================================================================================

/**
 * Initializes the 3D environment including scene, camera, renderer, and controls.
 * Sets up geometries, materials, and starts the main animation loop.
 */
function init() {
    console.log("Inicializando Three.js...");
    try {
        scene = new THREE.Scene();
        const isLightMode = document.body.classList.contains('light-mode');
        scene.background = new THREE.Color(isLightMode ? 0xf5f5f5 : 0x1a1a1a);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(2, 1.5, 2);
        camera.lookAt(0, 1, 0);

        // Connects Three.js to the HTML Canvas defined in the DOM
        const canvas = document.getElementById('scene-canvas');
        if (!canvas) {
            console.error("No se encontró el canvas en el HTML");
            return;
        }

        renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            canvas: canvas  
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


        controls = new OrbitControls(camera, renderer.domElement); //Enables user to rotate and zoom around the model
        controls.target.set(0, 1, 0);
        controls.enableDamping = true; //Smoother rotation movement
        controls.dampingFactor = 0.05;

        ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight); 

        // Ground grid for better spatial reference
        const gridHelper = new THREE.GridHelper(10, 20,0x444444, 0x222222);
        gridHelper.position.y = -0.01; 
        scene.add(gridHelper);

        const lineColor = isLightMode ? 0x333333 : 0xffffff;
        
        scene.userData.geometries = {
            marker: new THREE.SphereGeometry(0.02, 8, 8),
            head: new THREE.SphereGeometry(0.08, 16, 16),
        };
        scene.userData.materials = {
            default: new THREE.MeshLambertMaterial({ color: 0xcccccc }),
            cabeza: new THREE.MeshLambertMaterial({ color: 0xff00ff, transparent: true, opacity: 0.4 }),
            line: new THREE.LineBasicMaterial({ color: lineColor, linewidth: 1 })
        };
        
        loadAvatar(); 
        animate();
        changeLanguage('es'); // Initial language is Spanish, can be changed by user
        initThemeToggle();
        
    } catch (error) {
        console.error("Error inicializando Three.js:", error);
        //setStatus(t('app.error', {message: "Inicialización 3D fallida"}), "error");
        setStatus(t('app.error', {message: error.stack}), "error");
    }
}

/**
 * Updates the visual status message for the user.
 * @param {string} text - The localized message to display.
 * @param {string} type - The state type ('info', 'loading', 'success', 'error') to apply CSS styles.
 */
function setStatus(text, type = 'info') {
    if (statusEl) {
        statusEl.textContent = text;
        statusEl.className = type;
    }
}


// ============================================================================================================================================
// DATA PROCESSING 
// ============================================================================================================================================

/**
 * Handles the C3D file upload process.
 * Sends the file to the Python backend via a POST request and processes the JSON response.
 * @param {File} file - The C3D file object from the input field or drag-and-drop event.
 */
async function handleFileUpload(file) {
    if (!file) return;

    clearScene(); 
    setStatus(t('app.processing'), 'loading');
    currentFileName = file.name;

    //Use FormData to send the binary file to the server
    const formData = new FormData();
    formData.append('c3d_file', file);

    try {
        //Asynchronous call to the '/upload_c3d' endpoint
        const response = await fetch('/upload_c3d', { method: 'POST', body: formData });
        
        if (!response.ok) {
            // Attempt to extract specific error messages sent by the Python server
            let errorMessage = `HTTP ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error) errorMessage = errorData.error; 
            } catch (e) {/* Fallback to generic HTTP error */}
            throw new Error(errorMessage);
        }

        //Parse the JSON containing frames, analog data, and metadata
        const data = await response.json();
        if (!data.frames || data.frames.length === 0) throw new Error("No frames data");
        
        lastLoadedData = data; 
        originalFPS = data.original_fps || 100;
        
        setStatus(t('app.success', { frames: data.frames.length, fps: originalFPS }), 'success');
        setupSceneFromData(data); 

    } catch (error) {
        console.error('Error:', error);
        // localized error message in the status bar 
        setStatus(t('app.error', { message: error.message }), 'error');
    }
}

/**
 * Reconstructs the 3D scene based on the biomechanical data received from the backend.
 * Creates markers (spheres), skeletal connections (lines), and populates UI panels.
 * @param {Object} data - The parsed JSON data from the C3D file.
 */
function setupSceneFromData(data) {
    animationData = data.frames;
    const { geometries } = scene.userData;

    // Collect all unique marker names across all frames (at first it was assumed that all frames have the same markers, but this ensures we capture any variations, its common to find markers in posterior frames and not in the first ones)
    const allMarkerNames = new Set();
    animationData.forEach(frame => {
        Object.keys(frame).forEach(key => allMarkerNames.add(key));
    });

    // For every detected marker, create a sphere mesh and add it to the scene
    allMarkerNames.forEach(name => {
        const material = getMaterialForMarker(name);
        const sphere = new THREE.Mesh(geometries.marker, material);
        
        sphere.position.set(0, 0, 0);
        sphere.visible = false; 

        // Scale down markers for fingers to avoid visual clutter
        if (HAND_MARKERS_SET.has(name)) {
            sphere.scale.set(0.6, 0.6, 0.6); 
        }

        sphere.userData = { 
            name: name,
            userVisible: true 
        };
        
        scene.add(sphere);
        markers[name] = sphere; // Store reference for later updates
    });

    // Add a larger semi-transparent sphere for the head area
    cabezaMarker = new THREE.Mesh(geometries.head, scene.userData.materials.cabeza);
    scene.add(cabezaMarker);

    // Create lines between markers based on the CONNECTIONS map
    CONECTIONS.forEach(([m1, m2]) => {
        if (markers[m1] && markers[m2]) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(6); // 2 points * 3 coordinates (x,y,z)
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const line = new THREE.Line(geometry, scene.userData.materials.line);
            line.userData = { m1: markers[m1], m2: markers[m2] };
            scene.add(line);
            lines.push(line);
        }
    });

    // UI
    createMarkersPanel();
    createMetadataPanel(data);
    
    if (data.analog_data) createAnalogPanel(data.analog_data);
    else if (analogContent) analogContent.innerHTML = `<div class="no-analog-data">${t('analog.no_data')}</div>`;

    createVectorsPanel();

    // Playback Initialization
    isPlaying = true; 
    if (btnPlayPause) btnPlayPause.textContent = '⏸'; 
    if (controlsContainer) controlsContainer.style.display = 'flex'; 
    if (frameSlider) { frameSlider.max = animationData.length - 1; frameSlider.disabled = false; }
    
    updateFPSDisplays();
    updateFrameButtons();
    updateSceneToFrame(0); // Display the first frame immediately
}

/**
 * Resets the 3D scene and UI to their default empty states.
 * Disposes of existing markers and lines to prevent memory leaks.
 */
function clearScene() {
    // Remove all marker meshes and skeletal lines from the scene
    Object.values(markers).forEach(marker => scene.remove(marker));
    lines.forEach(line => scene.remove(line));
    if (cabezaMarker) { scene.remove(cabezaMarker); cabezaMarker = null; }
    clearAllVectors();
    clearAllTrajectories();

    // Avatar returns to T-pose and default position
    resetAvatar();

    markers = {};
    lines = [];
    animationData = null;
    lastLoadedData = null;
    frameIndex = 0;
    isPlaying = false;
    
    Object.values(MARKER_CATEGORIES).forEach(category => category.visible = true);
    
    [controlsContainer, markersPanel, metadataPanel, trajectoriesPanel, analogPanel, vectorsPanel].forEach(el => {
        if(el) el.style.display = 'none';
    });
    
    if (btnPlayPause) btnPlayPause.textContent = '▶️';
    if (frameSlider) { frameSlider.value = 0; frameSlider.disabled = true; }
    if (frameCounter) frameCounter.textContent = '0 / 0';
    
    updateToggleText(panelToggle, 'ui.markers', markersPanel);
    updateToggleText(metadataToggle, 'ui.metadata', metadataPanel);
    updateToggleText(trajectoriesToggle, 'ui.trajectories', trajectoriesPanel);
    updateToggleText(analogToggle, 'ui.analog', analogPanel);
    updateToggleText(vectorsToggle, 'ui.vectors', vectorsPanel);

    updateFrameButtons();
}

/**
 * Assigns a specific material/color to a marker mesh.
 * @param {string} name - The name of the marker to color-code.
 * @returns {THREE.MeshLambertMaterial} The material configured for the marker.
 */
function getMaterialForMarker(name) {
    const color = MARKERS_COLOURS[name] || 0x888888;
    return new THREE.MeshLambertMaterial({ color: color });
}

/**
 * Updates the state of the frame navigation buttons based on the current timeline position.
 * Disables buttons when the boundaries of the animation data are reached.
 */
function updateFrameButtons() {
    if (btnPrevFrame) btnPrevFrame.disabled = !animationData || frameIndex <= 0;
    if (btnNextFrame) btnNextFrame.disabled = !animationData || frameIndex >= (animationData ? animationData.length - 1 : 0);
}
/**
 * Refreshes the frames-per-second (FPS) labels in the UI.
 * Displays both the acquisition frequency of the C3D file and the current simulated playback speed.
 */
function updateFPSDisplays() {
    if (originalFpsDisplay) originalFpsDisplay.textContent = `${originalFPS} Hz`;
    if (fpsDisplay) fpsDisplay.textContent = `${Math.round(originalFPS * playbackSpeed)} Hz (x${playbackSpeed})`;
}

// ============================================================================================================================================
// DYNAMIC UI GENERATION 
// ============================================================================================================================================

/**
 * Helper to determine if a marker name exists in the standardized biomechanical set.
 * @param {string} markerName - The name of the marker to check.
 * @returns {boolean} True if standardized, false otherwise.
 */
function isMarkerStandardized(markerName) {
    return MARKERS_COLOURS.hasOwnProperty(markerName);
}

/**
 * Dynamically builds the Marker Control panel.
 * Organizes markers into categories, handles localized names, and attaches
 * visibility and trajectory toggle events.
 */
function createMarkersPanel() {
    if (!markersCategories) return;
    markersCategories.innerHTML = ''; // Reset existing UI
    
    //Categorize non-standard markers into the 'Otro' group
    const nonStandardMarkers = Object.keys(markers).filter(marker => !isMarkerStandardized(marker));
    MARKER_CATEGORIES.otros.markers = nonStandardMarkers;
    
    Object.entries(MARKER_CATEGORIES).forEach(([categoryId, category]) => {
        // Only render categories that actually contain markers found in the loaded file
        const existingMarkers = category.markers.filter(markerName => markers[markerName]);
        if (existingMarkers.length === 0) return;
        
        const catName = t(`markers.${category.translationKey}`);

        const categoryEl = document.createElement('div');
        categoryEl.className = 'marker-category';
        categoryEl.innerHTML = `
            <div class="category-header">
                <button class="category-expand" data-category="${categoryId}">▶</button>
                <h4>${catName} <span class="category-count">(${existingMarkers.length})</span></h4>
                <button class="category-toggle ${!category.visible ? 'category-hidden' : ''}" 
                        data-category="${categoryId}">
                    ${category.visible ? t('markers.hide_all') : t('markers.show_all')}
                </button>
            </div>
            <div class="marker-list" id="marker-list-${categoryId}" style="display:none;"></div>
        `;
        markersCategories.appendChild(categoryEl);
        
        // Populate markers within the category
        const markerList = document.getElementById(`marker-list-${categoryId}`);
        existingMarkers.forEach(markerName => {
            const markerItem = document.createElement('div');
            markerItem.className = 'marker-item';
            const isStandard = isMarkerStandardized(markerName);
            const markerColor = MARKERS_COLOURS[markerName] || category.color;
            const hasTrajectory = trajectories[markerName] !== undefined;
            
            markerItem.innerHTML = `
                <div class="marker-checkbox ${category.visible ? 'checked' : ''}" data-marker="${markerName}"></div>
                <div class="marker-color" style="background-color: #${markerColor.toString(16).padStart(6, '0')}"></div>
                <span class="marker-name">${markerName}${!isStandard ? '<span class="non-standard-badge">*</span>' : ''}</span>
                <button class="marker-trajectory-btn ${hasTrajectory ? 'active' : ''}" 
                        data-marker="${markerName}" 
                        title="${hasTrajectory ? t('trajectories.hide') : t('trajectories.show')}">
                    ${hasTrajectory ? '📈' : '📉'}
                </button>
            `;
            
            if (!isStandard) markerItem.title = t('markers.non_standard');
            
        
            // Logic for visibility toggle is triggered only if the main area is clicked (not the trajectory button)
            markerItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('marker-trajectory-btn')) toggleMarkerVisibility(markerName);
            });
            // Needed to prevent conflict with the row's click listener (Event Bubbling) 
            const trajBtn = markerItem.querySelector('.marker-trajectory-btn');
            if (trajBtn) trajBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleTrajectory(markerName); });
            
            markerList.appendChild(markerItem);
        });

        // Category-level UI logic (Expansion and Bulk visibility)
        const expandBtn = categoryEl.querySelector('.category-expand');
        const toggleBtn = categoryEl.querySelector('.category-toggle');
        const header = categoryEl.querySelector('.category-header');
        
        if (expandBtn) expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const list = document.getElementById(`marker-list-${categoryId}`);
            const isHidden = list.style.display === 'none';
            list.style.display = isHidden ? 'grid' : 'none';
            expandBtn.textContent = isHidden ? '▼' : '▶';
        });

        if (header && toggleBtn) {
            header.addEventListener('click', (e) => {
                if (e.target === header || e.target.tagName === 'H4' || e.target.classList.contains('category-count')) {
                    toggleCategoryVisibility(categoryId);
                }
            });
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleCategoryVisibility(categoryId);
            });
        }
    });
}


/**
 * Builds the Metadata panel containing general C3D file information.
 * Calculates duration, frame rates, and marker counts.
 * @param {Object} data - The raw data processed from the backend.
 */
function createMetadataPanel(data) {
    if (!metadataContent) return;
    metadataContent.innerHTML = '';
    
    const filenameEl = document.createElement('div');
    filenameEl.className = 'metadata-filename';
    filenameEl.textContent = currentFileName;
    metadataContent.appendChild(filenameEl);
    
    const section = document.createElement('div');
    section.className = 'metadata-section';
    section.innerHTML = `<h4>${t('metadata.basic_info')}</h4>`;
    
    // Helper function to add a metadata item to the panel
    const addMeta = (labelKey, val) => {
        const div = document.createElement('div');
        div.className = 'metadata-item';
        div.innerHTML = `<span class="metadata-label">${t(labelKey)}</span><span class="metadata-value">${val}</span>`;
        section.appendChild(div);
    };

    addMeta('metadata.total_frames', data.total_frames || animationData.length);
    addMeta('metadata.original_fps', `${originalFPS} Hz`);
    addMeta('metadata.duration', formatDuration(data.duration_seconds || (animationData.length / originalFPS)));
    addMeta('metadata.total_markers', Object.keys(markers).length);
    
    const stdCount = Object.keys(markers).filter(m => isMarkerStandardized(m)).length;
    addMeta('metadata.standardized', stdCount);
    addMeta('metadata.non_standardized', Object.keys(markers).length - stdCount);
    
    if (data.has_analog_data) {
        addMeta('metadata.analog_data', t('metadata.yes'));
        if (data.analog_tipos_detectados) {
            addMeta('metadata.detected_types', data.analog_tipos_detectados.join(', '));
        }
    } else {
        addMeta('metadata.analog_data', t('metadata.no'));
    }
    
    metadataContent.appendChild(section);
}

/**
 * Dynamically generates the Analog Data Panel.
 * This function processes signal metadata, calculates statistical summaries (Min, Max, Avg), and builds the UI for channel filtering and classification.
 * @param {Object} analogData - Object containing all analog channels and metadata from the C3D file.
 */
function createAnalogPanel(analogData) {
    if (!analogContent) return;
    analogContent.innerHTML = '';
    
    // if no analog data is present in the file, show a friendly message instead of an empty panel
    if (!analogData || !analogData.channels || Object.keys(analogData.channels).length === 0) {
        analogContent.innerHTML = `<div class="no-analog-data">${t('analog.no_data')}</div>`;
        return;
    }
    
    // Helper to translate analog type keys (EMG, Force, etc.)
    const transType = (typeKey) => t(`analog_types.${typeKey}`) || typeKey;

    // General Information Section: Sample rate, total samples, number of active channels and duration
    const generalInfo = document.createElement('div');
    generalInfo.className = 'analog-channel';
    generalInfo.innerHTML = `
        <div class="channel-header"><span class="channel-name">${t('analog.general_info')}</span></div>
        <div class="channel-stats">
            <div class="stat-item"><span class="stat-label">${t('analog.sample_rate')}:</span><span class="stat-value">${analogData.sample_rate_hz} Hz</span></div>
            <div class="stat-item"><span class="stat-label">${t('analog.samples')}:</span><span class="stat-value">${analogData.total_samples}</span></div>
            <div class="stat-item"><span class="stat-label">${t('analog.active_channels')}:</span><span class="stat-value">${analogData.active_channels}/${analogData.total_channels}</span></div>
            <div class="stat-item"><span class="stat-label">${t('analog.duration')}:</span><span class="stat-value">${analogData.duration_seconds}s</span></div>
        </div>
    `;
    analogContent.appendChild(generalInfo);

    // Summary of detected types (EMG, Force, etc.) 
    if (analogData.classification) {
        const statsEl = document.createElement('div');
        statsEl.className = 'type-stats';
        calcularEstadisticasPorTipo(analogData.classification).forEach(stat => {
            const statEl = document.createElement('div');
            statEl.className = 'type-stat-item';
            statEl.innerHTML = `<span>${transType(stat.tipo)}</span><span class="type-stat-count">${stat.cantidad}</span>`;
            statsEl.appendChild(statEl);
        });
        analogContent.appendChild(statsEl);
    }

    // Controls to filter channels by their classified type 
    const filterControls = document.createElement('div');
    filterControls.className = 'channel-type-controls';
    filterControls.innerHTML = `<span style="font-size: 0.8em; color: #ccc;">${t('analog.filter_by_type')}:</span>
        <button class="type-filter-btn active" data-type="todos">${t('analog_types.todos')}</button>
        ${(analogData.tipos_disponibles || []).map(tipo => 
            `<button class="type-filter-btn" data-type="${tipo}">${transType(tipo)}</button>`
        ).join('')}`;
    analogContent.appendChild(filterControls);

    const helpInfo = document.createElement('div');
    helpInfo.className = 'classification-help';
    helpInfo.innerHTML = `<strong>${t('analog.classification_help')}</strong>`;
    analogContent.appendChild(helpInfo);

    // For each analog channel, create a UI block with its name, type badge, and statistics (Min, Max, Avg, Valid Samples)
    Object.entries(analogData.channels).forEach(([channelName, channelData]) => {
        if (channelData.length === 0 || channelData.every(v => v === 0 || Object.is(v, -0))) return;
        
        const info = analogData.classification ? analogData.classification[channelName] : null;
        const tipoKey = info ? info.tipo : 'desconocido';
        const tipoTraducido = transType(tipoKey);
        const color = info ? info.color : 0x888888;
        
        // --- REAL-TIME STATISTICAL CALCULATION ---
        const validData = channelData.filter(val => val !== null && val !== undefined);
        const minVal = validData.length ? Math.min(...validData).toFixed(3) : 'N/A';
        const maxVal = validData.length ? Math.max(...validData).toFixed(3) : 'N/A';
        const avgVal = validData.length ? (validData.reduce((a, b) => a + b, 0) / validData.length).toFixed(3) : 'N/A';
        
        const div = document.createElement('div');
        div.className = 'analog-channel';
        div.dataset.channelType = tipoKey; // Used for the CSS filtering logic
        div.style.borderLeftColor = `#${color.toString(16).padStart(6, '0')}`;
        
        div.innerHTML = `
            <div class="channel-header">
                <div style="display: flex; align-items: center; flex: 1;">
                    <span class="channel-name">${channelName}</span>
                    <span class="analog-type-badge" style="background-color: #${color.toString(16).padStart(6, '0')}20; color: #${color.toString(16).padStart(6, '0')}">${tipoTraducido}</span>
                </div>
                <span class="channel-index">#${info ? info.index + 1 : '?'}</span>
            </div>
            <div class="channel-stats">
                <div class="stat-item"><span class="stat-label">${t('analog.samples')}:</span><span class="stat-value">${channelData.length}</span></div>
                <div class="stat-item"><span class="stat-label">${t('analog.valid_samples')}:</span><span class="stat-value">${validData.length}</span></div>
                <div class="stat-item"><span class="stat-label">${t('analog.min')}:</span><span class="stat-value">${minVal}</span></div>
                <div class="stat-item"><span class="stat-label">${t('analog.max')}:</span><span class="stat-value">${maxVal}</span></div>
                <div class="stat-item"><span class="stat-label">${t('analog.average')}:</span><span class="stat-value">${avgVal}</span></div>
                <div class="stat-item"><span class="stat-label">${t('analog.nan_null')}:</span><span class="stat-value">${channelData.length - validData.length}</span></div>
            </div>
            ${analogData.tipos_disponibles ? `
            <div class="channel-type-controls">
                <span style="font-size: 0.75em; color: #ccc;">${t('analog.type')}:</span>
                <select class="channel-type-select" data-channel="${channelName}">
                    ${['desconocido', ...analogData.tipos_disponibles].map(tKey => 
                        `<option value="${tKey}" ${tKey === tipoKey ? 'selected' : ''}>${transType(tKey)}</option>`
                    ).join('')}
                </select>
                <button class="type-filter-btn" onclick="aplicarCambioTipo('${channelName}')" style="font-size: 0.7em; padding: 2px 6px;">${t('analog.apply')}</button>
            </div>` : ''}
        `;
        analogContent.appendChild(div);
    });

    setupFilterControls();

    //Button to open the Plotly-based signal visualization panel
    const plotsButton = document.createElement('button');
    plotsButton.className = 'plots-btn';
    plotsButton.innerHTML = '📈 ' + t('plots.view'); 
    plotsButton.addEventListener('click', () => {
        openPlotsPanel(analogData, () => lastLoadedData); // Pass a callback to ensure we always get the latest data when opening the plots
    });
    analogContent.appendChild(plotsButton);
}

/**
 * Generates the Vectors Panel UI, allowing users to select pairs of markers to visualize their relative angles over time.
 */
function createVectorsPanel() {
    const panel = document.getElementById('vectors-panel-content');
    if (!panel) return;

    const markerNames = Object.keys(markers);
    panel.innerHTML = `
        <div class="vector-selector-group">
            <label>${t('vectors.select_start')}:</label>
            <select id="vec-start" class="vector-select">
                ${markerNames.map(m => `<option value="${m}">${m}</option>`).join('')}
            </select>
            
            <label>${t('vectors.select_end')}:</label>
            <select id="vec-end" class="vector-select">
                ${markerNames.map(m => `<option value="${m}">${m}</option>`).join('')}
            </select>
            
            <button id="btn-add-vector" class="primary-btn">${t('vectors.add')}</button>
        </div>
        <div id="vector-graphs-section"></div>
    `;
    
    const btnAdd = document.getElementById('btn-add-vector');
    if (btnAdd) {
        btnAdd.onclick = () => { 
            const start = document.getElementById('vec-start').value;
            const end = document.getElementById('vec-end').value;
            if (start !== end) {
                addMarkerVector(start, end);
            } else {
                alert("Selecciona marcadores diferentes");
            }
        };
    }
    
        /*const labels = panel.querySelectorAll('.vector-selector-group label');
        if (labels.length >= 2) {
            labels[0].textContent = `${t('vectors.select_start')}:`;
            labels[1].textContent = `${t('vectors.select_end')}:`;
        }
        const btnAdd = document.getElementById('btn-add-vector');
        if (btnAdd) btnAdd.textContent = t('vectors.add');*/

    Object.keys(activeVectors).forEach(id => {
        const graphDiv = document.getElementById(`plot-${id}`);
        if (graphDiv && graphDiv.layout) {
            Plotly.relayout(graphDiv, {
                'xaxis.title.text': t('vectors.axis_seconds'),
                'yaxis.title.text': t('vectors.axis_degrees')
            });
        }
    });
    

    /*const graphsSection = document.getElementById('vector-graphs-section');
    if (graphsSection && graphsSection.innerHTML === '') {
        Object.keys(activeVectors).forEach(id => {
            import('./plots.js').then(m => m.createVectorPlots(id));
        });
    }*/
}

/**
 * Toggles the visibility of an entire biomechanical category (e.g., Pelvis, Torso).
 * Updates the internal state, the 3D meshes, and the UI checkboxes simultaneously.
 * @param {string} categoryId - The ID of the category defined in MARKER_CATEGORIES.
 */
function toggleCategoryVisibility(categoryId) {
    const category = MARKER_CATEGORIES[categoryId];
    if (!category) return;
    category.visible = !category.visible;
    
    category.markers.forEach(m => { 
        if(markers[m]) {
            // userData.userVisible is used in order to differentiate between the preference of the user and the actual visibility of the mesh, which can be affected by other factors (like being in a frame where the marker is not detected)
            markers[m].userData.userVisible = category.visible;
        }
    });
    
    // Update the UI
    category.markers.forEach(m => {
        const cb = document.querySelector(`.marker-checkbox[data-marker="${m}"]`);
        if(cb) cb.classList.toggle('checked', category.visible);
    });

    const btn = document.querySelector(`.category-toggle[data-category="${categoryId}"]`);
    if(btn) {
        btn.textContent = category.visible ? t('markers.hide_all') : t('markers.show_all');
        btn.classList.toggle('category-hidden', !category.visible);
    }
    
    // Trigger an inmediate scene update to reflect changes
    updateSceneToFrame(frameIndex);
}

/**
 * Toggles visibility for a single marker mesh.
 * @param {string} markerName - Unique identifier for the marker.
 */
function toggleMarkerVisibility(markerName) {
    const marker = markers[markerName];
    if (!marker) return;
    
    marker.userData.userVisible = !marker.userData.userVisible;
    
    const cb = document.querySelector(`.marker-checkbox[data-marker="${markerName}"]`);
    if(cb) cb.classList.toggle('checked', marker.userData.userVisible);
    
    updateSceneToFrame(frameIndex);
}


/**
 * Calculates a summary of active channels grouped by their signal type.
 * @param {Object} classification - Mapping of channel names to their types/colors.
 * @returns {Array} Sorted array of types and their respective counts.
 */
function calcularEstadisticasPorTipo(classification) {
    const stats = {};
    Object.values(classification).forEach(info => {
        stats[info.tipo] = (stats[info.tipo] || 0) + 1;
    });
    return Object.entries(stats).map(([tipo, cantidad]) => ({tipo, cantidad})).sort((a,b) => b.cantidad - a.cantidad);
}

/**
 * Initializes the filtering logic for analog channels using CSS-based toggling.
 */
function setupFilterControls() {
    const btns = document.querySelectorAll('.type-filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.dataset.type;
            document.querySelectorAll('.analog-channel[data-channel-type]').forEach(ch => {
                // Show only channels matching the selected type, or show all if 'todos' is active
                if (type === 'todos' || ch.dataset.channelType === type) ch.classList.remove('hidden');
                else ch.classList.add('hidden');
            });
        });
    });
}

/**
 * Manually re-classifies an analog channel type and updates the UI styling.
 * Useful when the backend auto-classification needs clinical correction.
 * @param {string} channelName - The name of the analog channel to update.
 */
function aplicarCambioTipo(channelName) {
    const select = document.querySelector(`.channel-type-select[data-channel="${channelName}"]`);
    if (!select) return;
    
    const nuevoTipoKey = select.value;
    const channelEl = select.closest('.analog-channel');
    
    if (channelEl) {
        // Update dataset for future filtering logic
        channelEl.dataset.channelType = nuevoTipoKey;
        
        const newColor = ANALOG_COLOURS[nuevoTipoKey] || ANALOG_COLOURS['desconocido'];
        const hex = `#${newColor.toString(16).padStart(6, '0')}`;
        channelEl.style.borderLeftColor = hex;
        
        const badge = channelEl.querySelector('.analog-type-badge');
        if (badge) {
            badge.textContent = t(`analog_types.${nuevoTipoKey}`) || nuevoTipoKey;
            badge.style.color = hex;
            badge.style.backgroundColor = hex + '20';
        }
    }
}
window.aplicarCambioTipo = aplicarCambioTipo;

/**
 * Formats duration from seconds into a human-readable 'Mm Ss' string.
 * @param {number} sec - Duration in seconds.
 */
function formatDuration(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ============================================================================================================================================
// AVATAR MANAGEMENT
// ============================================================================================================================================

/**
 * Loads the FBX humanoid avatar and maps its skeletal structure.
 * Iterates through the model's bones to link them with the 'avatarBones' object 
 * for kinematic animation.
 */
function loadAvatar() {
    const loader = new FBXLoader();
    loader.load('maniqui.fbx', (object) => {
        avatar = object;
        avatar.scale.set(0.01, 0.01, 0.01);  

        avatar.traverse((child) => {
            if (child.isBone) {
                const n = child.name;

                // --- Finger Mapping --- 
                // Pattern: Side (Right/Left) + Finger Name (Thumb/Index...) + Joint Index (1,2,3,4)
                //const fingerRegex = /mixamorig1(Right|Left)Hand(Thumb|Index|Middle|Ring|Pinky)([1-4])/;
                const fingerRegex = /mixamorig1(Right|Left)Hand(Thumb|Index|Middle|Ring|Pinky)([1-4])/;
                const match = n.match(fingerRegex);

                if (match) {
                    const side = match[1];      // Right/Left
                    const finger = match[2];    // Finger name
                    const index = parseInt(match[3]) - 1; // Index (1-4 -->0-3) 
                    
                    if (side === "Right") avatarBones.RightFingers[finger][index] = child;
                    else avatarBones.LeftFingers[finger][index] = child;
                }
                
                // --- Upper Body Mapping ---
                if (n.includes("RightArm") || n === "mixamorig1RightArm" || n === "mixamorigRightArm") avatarBones.RightArm = child;
                if (n.includes("RightForeArm") || n === "mixamorig1RightForeArm"|| n === "mixamorigRightForeArm") avatarBones.RightForeArm = child;
                if (n === "mixamorig1RightHand" || n === "mixamorigRightHand") avatarBones.RightHand = child;
                
                if (n.includes("LeftArm") || n === "mixamorig1LeftArm"|| n === "mixamorigLeftArm") avatarBones.LeftArm = child;
                if (n.includes("LeftForeArm") || n === "mixamorig1LeftForeArm"|| n === "mixamorigLeftForeArm") avatarBones.LeftForeArm = child;
                if (n === "mixamorig1LeftHand"||n === "mixamorigLeftHand") avatarBones.LeftHand = child;
                
                // --- Head & Spine Mapping ---
                if (n === "mixamorig1Head"||n === "mixamorigHead") avatarBones.Head = child;
                if (n.includes("Neck") || n === "mixamorig1Neck" || n === "mixamorigNeck") avatarBones.Neck = child;
                if (n === "mixamorig1Spine"||n === "mixamorigSpine") avatarBones.Spine = child;
                if (n === "mixamorig1Spine1"||n === "mixamorigSpine1") avatarBones.Spine1 = child;
                if (n === "mixamorig1Spine2"||n === "mixamorigSpine2") avatarBones.Spine2 = child;
                if (n === "mixamorig1Hips" || n === "mixamorigHips" || n.includes("Hips")) avatarBones.Hips = child;                
                
                // --- Lower Body Mapping ---
                if (n.includes("RightUpLeg") || n === "mixamorig1RightUpLeg"|| n === "mixamorigRightUpLeg") avatarBones.RightUpLeg = child;
                if (n.includes("RightLeg") || n === "mixamorig1RightLeg"|| n === "mixamorigRightLeg") avatarBones.RightLeg = child;
                if (n.includes("RightFoot") || n === "mixamorig1RightFoot" || n === "mixamorigRightFoot") avatarBones.RightFoot = child;
                if (n.includes("RightToeBase") || n === "mixamorig1RightToeBase"|| n === "mixamorigRightToeBase") avatarBones.RightToe = child;
                
                if (n.includes("LeftUpLeg") || n === "mixamorig1LeftUpLeg"|| n === "mixamorigLeftUpLeg") avatarBones.LeftUpLeg = child;
                if (n.includes("LeftLeg") || n === "mixamorig1LeftLeg"|| n === "mixamorigLeftLeg") avatarBones.LeftLeg = child;
                if (n.includes("LeftFoot") || n === "mixamorig1LeftFoot"|| n === "mixamorigLeftFoot") avatarBones.LeftFoot = child;
                if (n.includes("LeftToeBase") || n === "mixamorig1LeftToeBase"|| n === "mixamorigLeftToeBase") avatarBones.LeftToe = child;

            }
        });

        scene.add(avatar);
        avatarLoaded = true;
        console.log("Avatar cargado y huesos detectados:", avatarBones);
        
        // Visualizes the skeleton wireframe for debugging purposes
        skeletonHelper = new THREE.SkeletonHelper(avatar);
        scene.add(skeletonHelper);

    }, undefined, (error) => {
        console.error("Error cargando el avatar:", error);
    });

}

/**
 * Resets the avatar to its default state and T-Pose.
 * Clears accumulated rotations and ensures numerical stability by removing NaNs.
 */
function resetAvatar() {
    if (!avatar) return;

    avatar.position.set(0, 0, 0);
    avatar.rotation.set(0, 0, 0);
    avatar.quaternion.identity();
    avatar.scale.set(0.01, 0.01, 0.01); 


    // Reset every individual bone to identity rotation
    avatar.traverse((child) => {
        if (child.isBone) {
            child.quaternion.set(0, 0, 0, 1);
            child.scale.set(1, 1, 1);
            // Prevents the engine from breaking due to invalid backend data
            if (isNaN(child.position.x)) child.position.set(0,0,0);
            child.updateMatrix();
        }
    });

    // T-Pose
    avatar.traverse((child) => {
        if (child.isSkinnedMesh && child.skeleton) {
            try {
                child.skeleton.pose(); 
            } catch (e) {
                console.warn("Advertencia: No se pudo resetear la pose de una malla", e);
            }
        }
    });
    
    if (skeletonHelper) {
        try {
            skeletonHelper.update();
        } catch (e) {
            console.warn("SkeletonHelper falló al actualizarse durante el reset (ignorable).");
        }
    }
}


// ============================================================================================================================================
// THEME & UI CUSTOMIZATION
// ============================================================================================================================================

/**
 * Initializes the Light/Dark mode toggle logic.
 * Checks local storage for user preferences.
 */
function initThemeToggle() {
    const themeDarkBtn = document.getElementById('theme-dark');
    const themeLightBtn = document.getElementById('theme-light');

    const savedTheme = localStorage.getItem('chloe-theme');
    
    if (savedTheme === 'light') enableLightMode();
    else enableDarkMode();

    if (themeDarkBtn) {
        themeDarkBtn.addEventListener('click', () => {
            enableDarkMode();
            localStorage.setItem('chloe-theme', 'dark');
        });
    }

    if (themeLightBtn) {
        themeLightBtn.addEventListener('click', () => {
            enableLightMode();
            localStorage.setItem('chloe-theme', 'light');
        });
    }
}

/**
 * Applies Dark Theme styles to the DOM and the 3D Scene.
 */
function enableDarkMode() {
    const body = document.body;
    body.classList.remove('light-mode');
    
    const themeDarkBtn = document.getElementById('theme-dark');
    const themeLightBtn = document.getElementById('theme-light');
    
    if (themeDarkBtn) themeDarkBtn.classList.add('active');
    if (themeLightBtn) themeLightBtn.classList.remove('active');
    
    if (ambientLight) ambientLight.intensity = 0.6;

    if (scene) scene.background = new THREE.Color(0x1a1a1a);
    

    if (scene.userData.materials && scene.userData.materials.line) {
        scene.userData.materials.line.color.setHex(0xffffff); 
        scene.userData.materials.line.needsUpdate = true;
    }

    console.log("Modo oscuro activado");

}

/**
 * Applies Light Theme styles to the DOM and the 3D Scene.
 */
function enableLightMode() {
    const body = document.body;
    body.classList.add('light-mode');
    
    const themeDarkBtn = document.getElementById('theme-dark');
    const themeLightBtn = document.getElementById('theme-light');
    
    if (themeDarkBtn) themeDarkBtn.classList.remove('active');
    if (themeLightBtn) themeLightBtn.classList.add('active');
    
    if (ambientLight) ambientLight.intensity = 1.5;

    if (scene) scene.background = new THREE.Color(0xf5f5f5);
    

    if (scene.userData.materials && scene.userData.materials.line) {
        scene.userData.materials.line.color.setHex(0x333333); 
        scene.userData.materials.line.needsUpdate = true;
    }
    
    console.log("Modo claro activado");
}


// ============================================================================================================================================
// ANIMATION LOGIC
// ============================================================================================================================================

/**
 * Main animation loop. Calculates delta time to ensure smooth playback
 * regardless of the screen's refresh rate.
 * @param {number} currentTime - Timestamp provided by requestAnimationFrame.
 */
function animate(currentTime = 0) {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    
    // Calculate time elapsed since last frame
    // 0.016s is the ideal frame duration for a 60Hz display, used as a fallback during the first execution cycle when 'lastTime' is not yet defined, ensuring 
    // that the animation accumulator starts with a stable, standard delta value to prevent motion jitters.
    const deltaTime = lastTime ? (currentTime - lastTime) / 1000 : 0.016;
    lastTime = currentTime;
    
    if (isPlaying && animationData && animationData.length > 1) {
        frameAccumulator += deltaTime * playbackSpeed;
        const frameTime = 1 / originalFPS;
        // Determine how many frames to advance based on elapsed time
        const framesToAdvance = Math.floor(frameAccumulator / frameTime);
        
        if (framesToAdvance > 0) {
            frameIndex = (frameIndex + framesToAdvance) % animationData.length;
            frameAccumulator %= frameTime;
            updateSceneToFrame(frameIndex);
        }
    }
    if (renderer && scene && camera) renderer.render(scene, camera);
}

/**
 * Updates every object in the scene (markers, lines, avatar) to match a specific data frame.
 * Handles visibility logic and synchronizes with external plotting modules.
 * @param {number} index - The current frame index to display.
 */
function updateSceneToFrame(index) {
    if (!animationData || index >= animationData.length) return;
    const frame = animationData[index];
    
    // Markers: Set position based on frame data, but visibility depends on both data presence and user preference
    Object.keys(markers).forEach(name => {
        const marker = markers[name];
        const coords = frame[name];
        
        const hasData = coords && coords.length === 3 && !isNaN(coords[0]);
        const userWantsVisible = marker.userData.userVisible;

        if (hasData) {
            marker.position.set(coords[0], coords[1], coords[2]);
            marker.visible = userWantsVisible;
        } else {
            // Automatically hide markers with missing data
            marker.visible = false;
        }
        
    });
    
    // Head
    if (cabezaMarker) {
        const center = new THREE.Vector3();
        let count = 0;
        HEAD_MARKERS.forEach(name => {
            if (frame[name]) { center.add(new THREE.Vector3(...frame[name])); count++; }
        });

        // Hide if avatar mode is on to avoid overlapping meshes
        if (count > 0 && !isAvatarMode) { 
            cabezaMarker.position.copy(center.divideScalar(count)); 
            cabezaMarker.visible = true; 
        } else { 
            cabezaMarker.visible = false; 
        }
    }
    
    // Skeletal Lines
    lines.forEach(line => {
        const { m1, m2 } = line.userData;
        
        // A line is drawn between two markers only if:
        // 1. we're not in Avatar mode
        // 2. both markers have valid data for the current frame (visible)
        if (!isAvatarMode && m1.visible && m2.visible) {
            line.visible = true;
            const pos = line.geometry.attributes.position.array;
            pos[0] = m1.position.x; pos[1] = m1.position.y; pos[2] = m1.position.z;
            pos[3] = m2.position.x; pos[4] = m2.position.y; pos[5] = m2.position.z;
            line.geometry.attributes.position.needsUpdate = true;
        } else {
            line.visible = false;
        }
    });

    if (avatar) {
        avatar.visible = isAvatarMode;
    }
    if (skeletonHelper) {
        skeletonHelper.visible = isAvatarMode;
    }
    updateAvatarPose(frame);

    updateVectors3D(frame);

    const currentTime = index / originalFPS;
    if (isAnalogPlotsOpen) {
        updatePlotlyTimeLine(currentTime);
    }
    if (isVectorPanelOpen) {
        updateVectorPlotLine(currentTime);
    }
    
    frameIndex = index;
    if (frameSlider && frameSlider.value != index) frameSlider.value = index;
    if (frameCounter) frameCounter.textContent = `${index} / ${animationData.length - 1}`;
    updateFrameButtons();

}

// ============================================================================================================================================
// EVENT LISTENERS 
// ============================================================================================================================================

window.addEventListener('resize', () => {
    if (camera && renderer) {
        const leftPanel = document.getElementById('left-panel');
        if (!leftPanel) return;

        const width = leftPanel.clientWidth;
        const height = leftPanel.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }
});

// Playback Controls
if (btnPlayPause) btnPlayPause.addEventListener('click', () => {
    if (!animationData) return;
    isPlaying = !isPlaying;
    btnPlayPause.textContent = isPlaying ? '⏸️' : '▶️';
});

if (btnReset) btnReset.addEventListener('click', () => {
    if (!animationData) return;
    isPlaying = false;
    updateSceneToFrame(0);
    if (btnPlayPause) btnPlayPause.textContent = '▶️';
});

if (btnPrevFrame) btnPrevFrame.addEventListener('click', () => { isPlaying = false; updateSceneToFrame(Math.max(0, frameIndex - 1)); });
if (btnNextFrame) btnNextFrame.addEventListener('click', () => { isPlaying = false; updateSceneToFrame(Math.min(animationData.length - 1, frameIndex + 1)); });

if (frameSlider) frameSlider.addEventListener('input', (e) => {
    if (!animationData) return;
    isPlaying = false;
    if (btnPlayPause) btnPlayPause.textContent = '▶️';
    updateSceneToFrame(parseInt(e.target.value));
});

speedButtons.forEach(btn => btn.addEventListener('click', () => {
    playbackSpeed = parseFloat(btn.dataset.speed);
    speedButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateFPSDisplays();
}));

// View Mode Toggle (Avatar vs Lines), uses updateSceneToFrame
if (viewModeToggle) {
    viewModeToggle.addEventListener('click', () => {
        isAvatarMode = !isAvatarMode;
        viewModeToggle.textContent = isAvatarMode ? t('ui.view_lines') : t('ui.view_avatar');
        
        if (avatar) {
            avatar.visible = isAvatarMode;
        }
        
        updateSceneToFrame(frameIndex);
    });
}

// Panel Toggles: Show/hide different information panels and ensure only one is open at a time
const togglePanel = (panel) => {
    const isVisible = window.getComputedStyle(panel).display === 'block';
    [markersPanel, trajectoriesPanel, analogPanel, metadataPanel, vectorsPanel].forEach(p => { 
        if(p) p.style.display = 'none'; 
    });

    if (!isVisible) {
        panel.style.display = 'block';
        if (panel === vectorsPanel) {
            setVectorPanelState(true);
            if (animationData) createVectorsPanel();
        }
    } else {
        if (panel === vectorsPanel) setVectorPanelState(false)
    }

    updateToggleText(panelToggle, 'ui.markers', markersPanel);
    updateToggleText(trajectoriesToggle, 'ui.trajectories', trajectoriesPanel);
    updateToggleText(analogToggle, 'ui.analog', analogPanel);
    updateToggleText(metadataToggle, 'ui.metadata', metadataPanel);
    updateToggleText(vectorsToggle, 'ui.vectors', vectorsPanel);
};

// Events handled with onclick to ensure that only one panel can be open at a time, and that the toggle buttons reflect the current state
if (panelToggle) panelToggle.onclick = () => togglePanel(markersPanel);
if (trajectoriesToggle) trajectoriesToggle.onclick = () => togglePanel(trajectoriesPanel);
if (analogToggle) analogToggle.onclick = () => togglePanel(analogPanel);
if (metadataToggle) metadataToggle.onclick = () => togglePanel(metadataPanel);
if (vectorsToggle) vectorsToggle.onclick = () => togglePanel(vectorsPanel);

if (clearTrajectoriesBtn) clearTrajectoriesBtn.addEventListener('click', clearAllTrajectories);

/*document.addEventListener('click', (e) => {
    const isPanel = e.target.closest('#markers-panel, #trajectories-panel, #analog-panel, #metadata-panel, #vectors-panel');
    const isBtn = e.target.closest('.panel-toggle, .trajectories-toggle, .analog-toggle, .metadata-toggle, .vectors-toggle');
    const isLang = e.target.closest('.language-selector');
    
    if (!isPanel && !isBtn && !isLang) {
        [markersPanel, trajectoriesPanel, analogPanel, metadataPanel, vectorsPanel].forEach(p => { if(p) p.style.display = 'none'; });
        updateToggleText(panelToggle, 'ui.markers', markersPanel);
        updateToggleText(trajectoriesToggle, 'ui.trajectories', trajectoriesPanel);
        updateToggleText(analogToggle, 'ui.analog', analogPanel);
        updateToggleText(metadataToggle, 'ui.metadata', metadataPanel);
        updateToggleText(vectorsToggle, 'ui.vectors', vectorsPanel);
        setVectorPanelState(false);
    }
});*/


// Event Listeners for uploading c3d files via Drag & Drop or File Input    
document.addEventListener('dragover', (e) => { e.preventDefault(); document.body.style.backgroundColor = 'rgba(0, 123, 255, 0.1)'; });
document.addEventListener('dragleave', (e) => { e.preventDefault(); document.body.style.backgroundColor = ''; });
document.addEventListener('drop', (e) => {
    e.preventDefault(); document.body.style.backgroundColor = '';
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.c3d')) handleFileUpload(files[0]);
});

if (uploadInput) uploadInput.addEventListener('change', (e) => handleFileUpload(e.target.files[0]));

window.openPlotsPanel = openPlotsPanel;
window.closePlotsPanel = closePlotsPanel;


console.log("Iniciando aplicación...");
init();