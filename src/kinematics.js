import * as THREE from "three";
import { avatar, avatarBones, avatarLoaded } from './main.js';
import { FINGER_MARKERS } from "./constants.js";

/**
 * Updates the 3D avatar's skeletal pose based on the current frame's marker cloud.
 * Implements a hierarchical positioning strategy and localized bone alignment.
 * @param {Object} frameData - Dictionary of marker coordinates for the current frame.
 */
export function updateAvatarPose(frameData) {
    if (!avatarLoaded || !frameData) return;

    // --- ROOT POSITIONING ---
    // Ideal scenario: use pelvis markers to determine the avatar's global position
    const pelvisMarkers = ['SACR', 'RASI', 'LASI', 'RPSI', 'LPSI', 'VSAC']; 
    let pelvisPos = new THREE.Vector3(0, 0, 0);
    let activePelvis = 0;

    pelvisMarkers.forEach(name => {
        const vec = getVectorFromMarker(frameData, name);
        if (vec) {
            pelvisPos.add(vec);
            activePelvis++;
        }
    });

    // Backup scenario (no pelvis data): use head markers to estimate position
    const headMarkersList = ['RFHD', 'LFHD', 'RBHD', 'LBHD', 'HEAD'];
    let headPos = new THREE.Vector3(0, 0, 0);
    let activeHead = 0;

    headMarkersList.forEach(name => {
        const vec = getVectorFromMarker(frameData, name);
        if (vec) {
            headPos.add(vec);
            activeHead++;
        }
    });

    let finalRootPos = new THREE.Vector3();
    let positionFound = false;

    if (activePelvis > 0) {
        // Ideal scenario
        pelvisPos.divideScalar(activePelvis);
        finalRootPos.copy(pelvisPos);
        positionFound = true;
    } 
    else if (activeHead > 0) {
        // Backup scenario
        // Estimate hip position based on head position minus an average head-to-pelvis distance
        headPos.divideScalar(activeHead);
        finalRootPos.set(headPos.x, headPos.y - 0.80, headPos.z); 
        positionFound = true;
    }

    if (positionFound) {
        avatar.position.x = finalRootPos.x;
        avatar.position.z = finalRootPos.z;
        //avatar.position.y = finalRootPos.y - 1.0;

        // Grounding Logic: Find the lowest foot marker to prevent floating
        const footMarkers = ['LHEE', 'LTOE', 'LMT5', 'RHEE', 'RTOE', 'RMT5', 'LANK', 'RANK'];
        let lowestY = Infinity;
        
        footMarkers.forEach(name => {
            const vec = getVectorFromMarker(frameData, name);
            if (vec && vec.y < lowestY) {
                lowestY = vec.y;
            }
        });

        if (lowestY !== Infinity) {
            avatar.position.y = lowestY; 
            console.log(`Posicionando avatar a nivel del suelo usando marcador ${footMarkers.find(name => getVectorFromMarker(frameData, name)?.y === lowestY)}`);
        }
        else {
            // estimate a leg large of 0.9m
            avatar.position.y = finalRootPos.y - 0.9; 
            console.log(`Estimando posición del avatar a nivel del suelo con altura de 0.9m`);
        }
    }

    // --- GLOBAL ROTATION ---
    // Determine the forward vector using the hip axis cross product
    let forwardDir = null;
    const RASI = getVectorFromMarker(frameData, 'RASI');
    const LASI = getVectorFromMarker(frameData, 'LASI');

    if (RASI && LASI) {
        const hipVector = new THREE.Vector3().subVectors(LASI, RASI);
        forwardDir = new THREE.Vector3().crossVectors(hipVector, new THREE.Vector3(0, 1, 0));
    }

    // Secondary rotation fallback: Use shoulders or head direction
    if (!forwardDir) {
        const rsho = getVectorFromMarker(frameData, 'RSHO');
        const lsho = getVectorFromMarker(frameData, 'LSHO');
        if (rsho && lsho) {
            const shoulderVector = new THREE.Vector3().subVectors(lsho, rsho);
            forwardDir = new THREE.Vector3().crossVectors(shoulderVector, new THREE.Vector3(0, 1, 0));
            console.log("Usando hombros para rotación");
        }
        else if (getVectorFromMarker(frameData, 'RFHD') && getVectorFromMarker(frameData, 'LFHD')) {
            const headVector = new THREE.Vector3().subVectors(
                getVectorFromMarker(frameData, 'LFHD'), 
                getVectorFromMarker(frameData, 'RFHD')
            );
            forwardDir = new THREE.Vector3().crossVectors(headVector, new THREE.Vector3(0, 1, 0));
            console.log("Usando cabeza para rotación");
        }
    }


    // Apply look-at rotation if a valid forward direction is calculated
    if (forwardDir && forwardDir.lengthSq() > 0.001) {
        forwardDir.normalize(); 
        const targetPoint = avatar.position.clone().add(forwardDir);
        targetPoint.y = avatar.position.y; // Keep character upright (to prevent tilting)
        avatar.lookAt(targetPoint);
    }

    // --- SEGMENTAL ALIGNMENT (Kinematic Chain) ---
    // This section aligns individual bones between marker pairs to reconstruct the pose

    // -- Spine & Torso ---
    // Define the origin (Sacrum) and the target (midpoint of the upper chest/neck)
    const sacr = getVectorFromMarker(frameData, 'SACR') || finalRootPos; 
    const c7 = getVectorFromMarker(frameData, 'C7'); 
    const clav = getVectorFromMarker(frameData, 'CLAV');
    const rsho = getVectorFromMarker(frameData, 'RSHO');
    const lsho = getVectorFromMarker(frameData, 'LSHO');

    let spineTopTarget = null;

    if (c7 && clav) {
        // Ideal: Midpoint between the back (C7) and front (Clavicle) markers
        spineTopTarget = new THREE.Vector3().addVectors(c7, clav).multiplyScalar(0.5);
    } 
    else if (c7 || clav) {
        spineTopTarget = c7 || clav;
    } 
    else if (rsho && lsho) {
        // Fallback: Midpoint between shoulders
        spineTopTarget = new THREE.Vector3().addVectors(rsho, lsho).multiplyScalar(0.5);
    }

    if (sacr && spineTopTarget) {
        if (avatarBones.Spine) alignBone(avatarBones.Spine, sacr, spineTopTarget);
        if (avatarBones.Spine1) alignBone(avatarBones.Spine1, sacr, spineTopTarget);
        if (avatarBones.Spine2) alignBone(avatarBones.Spine2, sacr, spineTopTarget);
    }

    // --- Head ---
    const rfhd = getVectorFromMarker(frameData, 'RFHD');
    const lfhd = getVectorFromMarker(frameData, 'LFHD');
    const rbhd = getVectorFromMarker(frameData, 'RBHD');
    const lbhd = getVectorFromMarker(frameData, 'LBHD');

    if (rfhd && lfhd && rbhd && lbhd && avatarBones.Head) {
        // Calculate the face direction vector (Back-to-Front)
        const frontMidpoint = new THREE.Vector3().addVectors(rfhd, lfhd).multiplyScalar(0.5);
        const backMidpoint = new THREE.Vector3().addVectors(rbhd, lbhd).multiplyScalar(0.5);
        const lookDir = new THREE.Vector3().subVectors(frontMidpoint, backMidpoint).normalize();
        
        // Project a target point in front of the head to apply the lookAt transformation
        const headPos = new THREE.Vector3();
        avatarBones.Head.getWorldPosition(headPos);
        const lookTarget = new THREE.Vector3().addVectors(headPos, lookDir); 
        avatarBones.Head.lookAt(lookTarget);
    }

    // --- Upper Limbs ---
    const rShoulder = getVectorFromMarker(frameData, 'RSHO');
    const rElbow = getVectorFromMarker(frameData, 'RELB');
    const RForeArm = getVectorFromMarker(frameData, 'RFRM');
    const rWRT = getVectorFromMarker(frameData, 'RWRT') 
    const rWRA = getVectorFromMarker(frameData, 'RWRA')
    const rWRB = getVectorFromMarker(frameData, 'RWRB');
    const rHand = getVectorFromMarker(frameData, 'RPLM') || getVectorFromMarker(frameData, 'RFIN');

    let wristRTarget = null;
    if (rWRA && rWRB) wristRTarget = new THREE.Vector3().addVectors(rWRA, rWRB).multiplyScalar(0.5);
    else wristRTarget = rWRA || rWRB || rWRT;
    
    if (rShoulder && rElbow && avatarBones.RightArm) alignBone(avatarBones.RightArm, rShoulder, rElbow);
    if (rElbow && wristRTarget && avatarBones.RightForeArm) alignBone(avatarBones.RightForeArm, rElbow, RForeArm || wristRTarget);
    if (wristRTarget && rHand && avatarBones.RightHand) alignBone(avatarBones.RightHand, wristRTarget, rHand); 
    
    
    const lShoulder = getVectorFromMarker(frameData, 'LSHO');
    const lElbow = getVectorFromMarker(frameData, 'LELB');
    const lForeArm = getVectorFromMarker(frameData, 'LFRM');
    const lWRT = getVectorFromMarker(frameData, 'LWRT') 
    const lWRA = getVectorFromMarker(frameData, 'LWRA')
    const lWRB = getVectorFromMarker(frameData, 'LWRB');
    const lHand = getVectorFromMarker(frameData, 'LPLM') || getVectorFromMarker(frameData, 'LFIN');

    let wristLTarget = null;
    if (lWRA && lWRB) wristLTarget = new THREE.Vector3().addVectors(lWRA, lWRB).multiplyScalar(0.5);
    else wristLTarget = lWRT || lWRA || lWRB;
    
    if (lShoulder && lElbow && avatarBones.LeftArm) alignBone(avatarBones.LeftArm, lShoulder, lElbow);
    if (lElbow && wristLTarget && avatarBones.LeftForeArm) alignBone(avatarBones.LeftForeArm, lElbow, lForeArm || wristLTarget);
    if (wristLTarget && lHand && avatarBones.LeftHand) alignBone(avatarBones.LeftHand, wristLTarget, lHand); 
    

    // --- Lower Limbs ---
    const rKnee = getVectorFromMarker(frameData, 'RKNE');
    const rAnkle = getVectorFromMarker(frameData, 'RANK');
    const rHeel = getVectorFromMarker(frameData, 'RHEE');
    const rToe = getVectorFromMarker(frameData, 'RTOE') || getVectorFromMarker(frameData, 'RMT5');

    // Hip -> Knee 
    if (rKnee && avatarBones.RightUpLeg) {
        const rHipPos = new THREE.Vector3();
        avatarBones.RightUpLeg.getWorldPosition(rHipPos);
        alignBone(avatarBones.RightUpLeg, rHipPos, rKnee);
    }

    // Knee -> Ankle
    if (rKnee && rAnkle && avatarBones.RightLeg) {
        alignBone(avatarBones.RightLeg, rKnee, rAnkle);
    }

    // Ankle -> Toe
    if (rAnkle && rToe && avatarBones.RightFoot) {
        const rAnkleAdjusted = rAnkle.clone();
        const offsetHeight = 0.05;
        rAnkleAdjusted.y += offsetHeight;
        alignBone(avatarBones.RightFoot, rAnkleAdjusted, rToe);
    }
    // Heel -> Toe
    if (rHeel && rToe && avatarBones.RightToe) {
        alignBone(avatarBones.RightToe, rHeel, rToe);
    }

    const lKnee = getVectorFromMarker(frameData, 'LKNE');
    const lAnkle = getVectorFromMarker(frameData, 'LANK');
    const lHeel = getVectorFromMarker(frameData, 'LHEE');
    const lToe = getVectorFromMarker(frameData, 'LTOE') || getVectorFromMarker(frameData, 'LMT5');

    if (lKnee && avatarBones.LeftUpLeg) {
        const lHipPos = new THREE.Vector3();
        avatarBones.LeftUpLeg.getWorldPosition(lHipPos);
        alignBone(avatarBones.LeftUpLeg, lHipPos, lKnee);
    }

    if (lKnee && lAnkle && avatarBones.LeftLeg) {
        alignBone(avatarBones.LeftLeg, lKnee, lAnkle);
    }

    if (lAnkle && lToe && avatarBones.LeftFoot) {
        const lAnkleAdjusted = lAnkle.clone();
        const offsetHeight = 0.05;
        lAnkleAdjusted.y += offsetHeight;
        alignBone(avatarBones.LeftFoot, lAnkleAdjusted, lToe);
    }
    if (lHeel && lToe && avatarBones.LeftToe) {
        alignBone(avatarBones.LeftToe, lHeel, lToe);
    }

    // --- Hand Extremities ---
    updateHandFingers('Right', frameData);
    updateHandFingers('Left', frameData);
    
} 

/**
 * Calculates joint rotations for hand fingers based on marker pairs.
 * @param {string} side - 'Right' or 'Left'.
 * @param {Object} frameData - Current frame marker coordinates.
 */
function updateHandFingers(side, frameData) {
    let handBone
    let foreArmBone, ArmBone;
    let palmMarkerName;
    let wristMarkerName;

    if (side === 'Right') {
        foreArmBone = avatarBones.RightForeArm;
        ArmBone = avatarBones.RightArm;
        handBone = avatarBones.RightHand;
        palmMarkerName = 'RPLM';
        wristMarkerName = 'RWRT'|| 'RWRA' || 'RWRB';
    } else {
        foreArmBone = avatarBones.LeftForeArm;
        ArmBone = avatarBones.LeftArm;
        handBone = avatarBones.LeftHand;
        palmMarkerName = 'LPLM';
        wristMarkerName = 'LWRT'|| 'LWRA' || 'LWRB';
    }
    const palmMarker = getVectorFromMarker(frameData, palmMarkerName);
    const wristMarker = getVectorFromMarker(frameData, wristMarkerName);

    // Avoids the T-pose when there is no info for the arm/forearm 
    if (palmMarker && ArmBone && foreArmBone) {
        const armWorldPos = new THREE.Vector3();
        ArmBone.getWorldPosition(armWorldPos);
        alignBone(ArmBone, armWorldPos, palmMarker);

        const foreArmWorldPos = new THREE.Vector3();
        foreArmBone.getWorldPosition(foreArmWorldPos);
        alignBone(foreArmBone, foreArmWorldPos, palmMarker);
    }

    // Optional: It forces the hand to emulate the wrist marker position, only works if there is no info for the forearm/arm 
    /*if (handBone && wristMarker) {
        const localPosition = handBone.parent.worldToLocal(wristMarker.clone());
        handBone.position.copy(localPosition);
    }*/

    const markersMap = FINGER_MARKERS[side];
    let fingersMap;
    if(side === 'Right')
        fingersMap = avatarBones.RightFingers;
    else
        fingersMap = avatarBones.LeftFingers;

    Object.keys(fingersMap).forEach(fingerName => {
        const bones = fingersMap[fingerName];      
        const markerNames = markersMap[fingerName]; 

        // Orient each phalange (bone) toward the next marker in the chain
        for (let i = 0; i < 3; i++) {
            const bone = bones[i];
            const mStartName = markerNames[i]; 
            const mEndName = markerNames[i+1];

            if (bone && mStartName && mEndName) {
                const vStart = getVectorFromMarker(frameData, mStartName);
                const vEnd = getVectorFromMarker(frameData, mEndName);

                if (vStart && vEnd) {
                    alignBone(bone, vStart, vEnd);
                    
                }
            }
        }
    });
}

/**
 * Safely extracts a 3D vector from the frame data for a specific marker.
 * @param {Object} frame - The current animation frame object containing marker keys.
 * @param {string} name - The specific marker name to retrieve (e.g., 'RASI').
 * @returns {THREE.Vector3|null} A Three.js Vector3 object or null if data is missing/invalid.
 */
function getVectorFromMarker(frame, name) {
        const coords = frame[name]; 
        if (coords && coords.length === 3 && !isNaN(coords[0])) {
            return new THREE.Vector3(coords[0], coords[1], coords[2]);
        }
        return null;
}

/**
 * Core Mathematical Helper: Orientates a 3D bone toward a target point.
 * Converts world-space directions into the bone's local rotation space.
 * @param {THREE.Bone} bone - Target bone mesh.
 * @param {THREE.Vector3} pointStart - Origin point.
 * @param {THREE.Vector3} pointEnd - Target destination point.
 */
function alignBone(bone, pointStart, pointEnd) {
    const targetDir = new THREE.Vector3().subVectors(pointEnd, pointStart).normalize();
    const parentRotation = new THREE.Quaternion();
    if (bone.parent) {
        bone.parent.getWorldQuaternion(parentRotation);
    }
    const invParentRotation = parentRotation.clone().invert();
    const localTargetDir = targetDir.clone().applyQuaternion(invParentRotation);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), localTargetDir); //quaternion needed to rotate the bone's default up vector (0,1,0) to the target direction
    bone.quaternion.copy(quaternion);
}