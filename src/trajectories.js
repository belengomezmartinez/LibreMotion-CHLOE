import * as THREE from "three";
import { t } from './i18n.js';
import { scene, animationData, trajectoriesList } from './main.js';
import { range } from "three/tsl";

export let trajectories = {};
let trajectoryColors = [
    0xff6b6b, 0x4ecdc4, 0x45aaf2, 0x26de81, 0xa55eea, 0xf7b731, 0xfd9644,
    0xff9ff3, 0x54a0ff, 0x5f27cd, 0x00d2d3, 0xff9f43, 0x10ac84, 0xee5a24
];
let nextTrajectoryColorIndex = 0;
export let trajectoryRange = { start: 0, end: Infinity };
let rangeStartSlider, rangeEndSlider, rangeStartLabel, rangeEndLabel;

/**
 * Initializes the trajectory range sliders and their event listeners for real-time updates.
 */
export function initTrajectoryRangeControls() {
    rangeStartSlider = document.getElementById('trajectory-range-start');
    rangeEndSlider = document.getElementById('trajectory-range-end');
    rangeStartLabel = document.getElementById('trajectory-range-start-label');
    rangeEndLabel = document.getElementById('trajectory-range-end-label');
    
    if (rangeStartSlider && rangeEndSlider) {
        rangeStartSlider.addEventListener('input', updateTrajectoryRange);
        rangeEndSlider.addEventListener('input', updateTrajectoryRange);
    }
}

/**
 * Updates the trajectory range based on slider inputs, ensuring start is not greater than end.
 */
function updateTrajectoryRange() {
    if(!animationData) return;
    const totalFrames = animationData.length - 1;
    let start = parseInt(rangeStartSlider.value);
    let end = parseInt(rangeEndSlider.value);

    if (start > end) {
        if (this === rangeStartSlider){
            end = start;
            rangeEndSlider.value = end;
        } 
        else{
            start = end;  
            rangeStartSlider.value = start; 
        } 
    }
    
    trajectoryRange.start = start;
    trajectoryRange.end = end;

    if (rangeStartLabel) {
        rangeStartLabel.textContent = `${t('controls.frame')} ${start}`;
    }
    if (rangeEndLabel) {
        rangeEndLabel.textContent = `${t('controls.frame')} ${end}`;
    }
    updateAllTrajectoryPoints();
}

/**
 * Configures the range sliders based on the total number of frames in the animation data.
 */
export function setupTrajectoryRangeControls() {
    if (!animationData) return;
    
    const totalFrames = animationData.length - 1;
    
    if (rangeStartSlider && rangeEndSlider) {
        rangeStartSlider.max = totalFrames;
        rangeStartSlider.value = 0;
        rangeEndSlider.max = totalFrames;
        rangeEndSlider.value = totalFrames;
        
        rangeStartSlider.disabled = false;
        rangeEndSlider.disabled = false;
        
        trajectoryRange.start = 0;
        trajectoryRange.end = totalFrames;
        
        if (rangeStartLabel) {
            rangeStartLabel.textContent = `${t('controls.frame')} 0`;
        }
        if (rangeEndLabel) {
            rangeEndLabel.textContent = `${t('controls.frame')} ${totalFrames}`;
        }
    }
}

/**
 * Updates the trajectory points for all active trajectories, ensuring they reflect the current range selection.
 * This is called whenever the trajectory range sliders are adjusted to ensure the displayed paths are accurate.
 */
function updateAllTrajectoryPoints() {
    Object.keys(trajectories).forEach(markerName => {
        updateTrajectoryPoints(markerName);
    });
}


/**
 * Orchestrates the creation or removal of a 3D movement trajectory for a marker.
 * @param {string} markerName - Target marker name.
 */
export function toggleTrajectory(markerName) {
    if (trajectories[markerName]) removeTrajectory(markerName);
    else addTrajectory(markerName);
    updateTrajectoriesPanel(trajectoriesList);
    
    const btn = document.querySelector(`.marker-trajectory-btn[data-marker="${markerName}"]`);
    if (btn) {
        const hasT = !!trajectories[markerName];
        btn.classList.toggle('active', hasT);
        btn.textContent = hasT ? '📈' : '📉';
        btn.title = hasT ? t('trajectories.hide') : t('trajectories.show');
    }
}

/**
 * Creates a THREE.Line object representing the full path of a marker over time.
 * Uses BufferGeometry for high-performance rendering of path points.
 * @param {string} markerName - Target marker name.
 */
function addTrajectory(markerName) {
    if (trajectories[markerName] || !animationData) return;
    const color = trajectoryColors[nextTrajectoryColorIndex++ % trajectoryColors.length];
    
    const start = trajectoryRange.start;
    const end = Math.min(trajectoryRange.end, animationData.length - 1);
    const numPoints = end - start + 1;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numPoints * 3); // Pre-allocate memory for the active range
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.LineBasicMaterial({ color: color, linewidth: 2, transparent: true, opacity: 0.7 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    
    trajectories[markerName] = { line, points: [], color };
    updateTrajectoryPoints(markerName);
}

/**
 * Populates the trajectory geometry with X, Y, Z coordinates for every frame.
 * @param {string} markerName - Target marker name.
 */
function updateTrajectoryPoints(markerName) {
    const t = trajectories[markerName];
    if (!t || !animationData) return;

    const start = trajectoryRange.start;
    const end = Math.min(trajectoryRange.end, animationData.length - 1);
    
    const points = [];
    for (let i = start; i <= end; i++) {
        const frame = animationData[i];
        const c = frame[markerName];
        if (c && c.length === 3) points.push(c[0], c[1], c[2]);
        else points.push(0,0,0); // Fill with zeros if data is missing to maintain index alignment
    }
    
    const pos = t.line.geometry.attributes.position.array;
    if (pos.length !== points.length) {
        const newGeometry = new THREE.BufferGeometry();
        const newPositions = new Float32Array(points);
        newGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
        t.line.geometry.dispose();
        t.line.geometry = newGeometry;
    } else {
        for(let i = 0; i < points.length; i++) {
            pos[i] = points[i];
        }
        t.line.geometry.attributes.position.needsUpdate = true;
    }
    //for(let i=0; i<points.length; i++) pos[i] = points[i];
    //t.line.geometry.attributes.position.needsUpdate = true;
}

/**
 * Removes a trajectory mesh from the scene and disposes of its GPU resources.
 * @param {string} markerName - Target marker name.
 */
function removeTrajectory(markerName) {
    const t = trajectories[markerName];
    if (!t) return;
    scene.remove(t.line);
    t.line.geometry.dispose(); // Clean up GPU memory
    t.line.material.dispose();
    delete trajectories[markerName];
    
    const btn = document.querySelector(`.marker-trajectory-btn[data-marker="${markerName}"]`);
    if (btn) {
        btn.classList.remove('active');
        btn.textContent = '📉';
    }
}

/**
 * Removes every trajectory mesh from the scene and disposes of its GPU resources.
 */
export function clearAllTrajectories() {
    getActiveTrajectories().forEach(m => removeTrajectory(m));
    trajectories = {};
    updateTrajectoriesPanel();
    if (rangeStartSlider && rangeEndSlider) {
        rangeStartSlider.disabled = true;
        rangeEndSlider.disabled = true;
    }

}

function getActiveTrajectories() {
    return Object.keys(trajectories);
}

/**
 * Updates the Trajectories sidebar list based on currently active 3D trajectories.
 */
export function updateTrajectoriesPanel() {
    if (!trajectoriesList) return;
    trajectoriesList.innerHTML = '';
    
    const activeTrajectories = getActiveTrajectories();
    
    if (activeTrajectories.length === 0) {
        trajectoriesList.innerHTML = `<div style="text-align: center; color: #888; font-size: 0.9em; padding: 20px;">${t('trajectories.no_active')}</div>`;
        return;
    }
    
    activeTrajectories.forEach(markerName => {
        const trajectory = trajectories[markerName];
        const item = document.createElement('div');
        item.className = 'trajectory-item';
        item.style.borderLeftColor = `#${trajectory.color.toString(16).padStart(6, '0')}`;
        
        item.innerHTML = `
            <div class="trajectory-info">
                <div class="trajectory-color" style="background-color: #${trajectory.color.toString(16).padStart(6, '0')}"></div>
                <span class="trajectory-name">${markerName}</span>
            </div>
            <div class="trajectory-actions">
                <button class="trajectory-btn remove" data-marker="${markerName}" title="${t('trajectories.remove')}">✕</button>
            </div>
        `;
        item.querySelector('.remove').addEventListener('click', () => { removeTrajectory(markerName); updateTrajectoriesPanel(); });
        trajectoriesList.appendChild(item);
    });
}