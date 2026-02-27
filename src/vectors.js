import * as THREE from 'three';
import { animationData, scene, originalFPS } from './main.js';
import { createVectorPlots } from './plots.js';

export let activeVectors = {};
export let isVectorPanelOpen = false;
let vectorColors = [0xffa500, 0xff00ff, 0xd48806, 0x00ffff];

/** 
 * Adds a vector representation between two markers in the 3D scene (THREE.ArrowHelper) 
 * and prepares data for angle plotting.
 * @param {string} nameA - The name of the first marker.
 * @param {string} nameB - The name of the second marker.
 */
export function addMarkerVector(nameA, nameB){
    const id = `${nameA}-${nameB}`;
    if (activeVectors[id]) return; // Already exists

    const color = vectorColors[Object.keys(activeVectors).length % vectorColors.length];

    const arrowHelper = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0), // Direction 
        new THREE.Vector3(0, 0, 0), // Origin 
        1, // Length (will be updated)
        color
    );
    scene.add(arrowHelper);

    const axesHelper = new THREE.AxesHelper(0.1); 
    scene.add(axesHelper);

    const angleData = calculateVectorAnglesOverTime(nameA, nameB);

    activeVectors[id] = {
        nameA, nameB, 
        arrow: arrowHelper,
        axes: axesHelper,
        color, 
        angleData
    };

    createVectorPlots(id);
}

/** 
 * Calculates the angles of the vector defined by two markers relative to the global axes for each frame.
 * @param {string} nameA - The name of the first marker.
 * @param {string} nameB - The name of the second marker.
 * @returns {Object} An object containing arrays of angles (in degrees) for x, y, z axes and corresponding time points.
 */

function calculateVectorAnglesOverTime(nameA, nameB) {
    const results = { x: [], y: [], z: [], time: [] };

    animationData.forEach((frame, index) => {
        const posA = frame[nameA];
        const posB = frame[nameB];
        if (posA && posB) {
            const vector = new THREE.Vector3(posB[0] - posA[0], posB[1] - posA[1], posB[2] - posA[2]);
            const length = vector.length();
            // Calculate angles in degrees (.radToDeg) relative to the global axes
            if(length > 0.0001) {
                results.x.push(THREE.MathUtils.radToDeg(Math.acos(vector.x / length)));
                results.y.push(THREE.MathUtils.radToDeg(Math.acos(vector.y / length)));
                results.z.push(THREE.MathUtils.radToDeg(Math.acos(vector.z / length)));
            } else {
                results.x.push(null);
                results.y.push(null);
                results.z.push(null);
            }
        } else {
            results.x.push(null);
            results.y.push(null);
            results.z.push(null);
        }
        results.time.push(index / originalFPS);
    });
    return results;
}

/**
 * Updates the position and orientation of all active vectors based on the current frame data.
 * This should be called on every frame of the animation loop.
 * @param {Object} frameData - An object containing the 3D coordinates of all markers for the current frame.
 */
export function updateVectors3D(frameData) {
    Object.values(activeVectors).forEach(vector => {
        const posA = frameData[vector.nameA];
        const posB = frameData[vector.nameB];
        if (posA && posB) {
            const start = new THREE.Vector3(...posA);
            const end = new THREE.Vector3(...posB);
            const dir = new THREE.Vector3().subVectors(end, start);
            const len = dir.length();
            
            vector.arrow.position.copy(start);
            if (len > 0) {
                vector.arrow.setDirection(dir.normalize());
                vector.arrow.setLength(len);
            }
            vector.arrow.visible = true;

            if (vector.axes) {
                vector.axes.position.copy(start);
                vector.axes.visible = true;
            }

        } else {
            vector.arrow.visible = false;
            if (vector.axes) vector.axes.visible = false;
        }
    });
}

/**
 * Changes the state of the vector panel (open/closed)
 * @param {boolean} isOpen - Whether the vector panel should be open or closed.
 */
export function setVectorPanelState(isOpen) {
    isVectorPanelOpen = isOpen;
}

/**
 * Removes all active vectors from the scene and clears the activeVectors object.
 * Also clears any associated vector plots from the UI.
 */
export function clearAllVectors() {
    Object.values(activeVectors).forEach(v => {
        scene.remove(v.arrow);
        if (v.axes) scene.remove(v.axes);
    });
    for (let key in activeVectors) delete activeVectors[key]; // Clear the activeVectors object (Instead of reassigning to a new empty object to preserve references)
    const container = document.getElementById('vector-graphs-section');
    if (container) container.innerHTML = '';
}

/**
 * Removes a specific vector from the scene and deletes its data from activeVectors.
 * Also removes the associated vector plot from the UI.
 * @param {string} id - The unique identifier of the vector to be removed (format: "MarkerA-MarkerB").
 */
export function removeVector(id) {
    if(activeVectors[id]) {
        scene.remove(activeVectors[id].arrow);
        if (activeVectors[id].axes) scene.remove(activeVectors[id].axes);
        delete activeVectors[id];
        const plotDiv = document.getElementById(`wrapper-${id}`);
        if (plotDiv) plotDiv.remove();

        console.log(`Vector ${id} eliminado.`);
    }
}