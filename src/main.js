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
import Plotly from 'plotly.js-dist-min';

let currentLang = 'es';
let lastLoadedData = null; 

// ============================================================================================================================================
// CONSTANTS AND GLOBAL VARIABLES
// ============================================================================================================================================

// ====================
// i18n TRANSLATIONS
// ====================

const TRANSLATIONS = {
    es: {
        app: {
            title: "CHLOE: Ayudante Clínico para Evaluación Objetiva de la Locomoción",
            select_file: "Seleccionar Archivo .c3d",
            processing: "Procesando archivo C3D...",
            success: "Archivo procesado! {{frames}} frames @ {{fps}}Hz",
            error: "Error: {{message}}",
            select_file_prompt: "Selecciona un archivo .c3d para comenzar"
        },
        markers: {
            control: "Control de Marcadores",
            torso: "Torso y Cuello",
            pelvis: "Pelvis",
            brazo_derecho: "Brazo Derecho",
            brazo_izquierdo: "Brazo Izquierdo",
            pierna_derecha: "Pierna Derecha",
            pierna_izquierda: "Pierna Izquierda",
            mano_derecha: "Mano Derecha",
            mano_izquierda: "Mano Izquierda",
            cabeza: "Cabeza",
            otros: "Otros Marcadores",
            hide_all: "Ocultar Todo",
            show_all: "Mostrar Todo",
            non_standard: "Marcador no estandarizado"
        },
        trajectories: {
            title: "Trayectorias Activas", 
            active: "Trayectorias Activas",
            no_active: "No hay trayectorias activas",
            remove: "Eliminar trayectoria",
            clear_all: "Limpiar Todas las Trayectorias",
            show: "Mostrar Trayectoria",
            hide: "Ocultar Trayectoria" 
        },
        analog: {
            title: "Datos Analógicos",
            no_data: "No se encontraron datos analógicos en el archivo",
            general_info: "Información General",
            sample_rate: "Frecuencia",
            samples: "Muestras",
            active_channels: "Canales Activos",
            duration: "Duración",
            filter_by_type: "Filtrar por tipo",
            all: "Todos",
            classification_help: "Clasificación Automática: Los canales se clasifican automáticamente según su nombre.",
            type: "Tipo",
            apply: "Aplicar",
            valid_samples: "Válidas",
            min: "Mín",
            max: "Máx",
            average: "Promedio",
            nan_null: "NaN/Null"
        },
        analog_types: {
            fuerza: "Fuerza",
            momento: "Momento",
            emg: "EMG",
            acelerometro: "Acelerómetro",
            giroscopio: "Giroscopio",
            angulo: "Ángulo",
            desconocido: "Desconocido",
            todos: "Todos"
        },
        metadata: {
            title: "Información del Archivo",
            basic_info: "Información Básica",
            total_frames: "Total Frames",
            original_fps: "FPS Original",
            duration: "Duración",
            total_markers: "Marcadores Totales",
            standardized: "Marcadores Estandarizados",
            non_standardized: "Marcadores No Estandarizados",
            analog_data: "Datos Analógicos",
            detected_types: "Tipos Detectados",
            yes: "Sí",
            no: "No"
        },
        controls: {
            reset: "Reiniciar",
            play: "Reproducir/Pausar",
            prev_frame: "Frame Anterior",
            next_frame: "Frame Siguiente",
            frame: "Frame",
            speed: "Velocidad",
            fps: "FPS",
            original_rate: "Tasa Original"
        },
        ui: {
            markers: "📋 Marcadores",
            close: "✕ Cerrar",
            trajectories: "🔄 Trayectorias",
            analog: "📊 Datos Analógicos",
            metadata: "📈 Metadatos", 
            view_avatar: "👤 Ver Avatar",
            view_lines: "🕸 Ver Esqueleto"
        },
        plots: {
            title: "Gráficas Analógicas",
            view: "Ver Gráficas",
            update: "Aplicar Selección",
            selected_channels: "Canales Seleccionados",
            close: "Cerrar gráficas"
        },
        theme: {
            dark: "Modo Oscuro",
            light: "Modo Claro",
            dark_icon: "🌙",
            light_icon: "☀️"
        }
    },
    en: {
        app: {
            title: "CHLOE: Clinical Helper for Locomotion Objective Evaluation",
            select_file: "Select .c3d File",
            processing: "Processing C3D file...",
            success: "File processed! {{frames}} frames @ {{fps}}Hz",
            error: "Error: {{message}}",
            select_file_prompt: "Select a .c3d file to start"
        },
        markers: {
            control: "Marker Control",
            torso: "Torso & Neck",
            pelvis: "Pelvis",
            brazo_derecho: "Right Arm",
            brazo_izquierdo: "Left Arm",
            pierna_derecha: "Right Leg",
            pierna_izquierda: "Left Leg",
            mano_derecha: "Right Hand",
            mano_izquierda: "Left Hand",
            cabeza: "Head",
            otros: "Other Markers",
            hide_all: "Hide All",
            show_all: "Show All",
            non_standard: "Non-standard marker"
        },
        trajectories: {
            title: "Active Trajectories",
            active: "Active Trajectories",
            no_active: "No active trajectories",
            remove: "Remove trajectory",
            clear_all: "Clear All Trajectories",
            show: "Show Trajectory",
            hide: "Hide Trajectory"
        },
        analog: {
            title: "Analog Data",
            no_data: "No analog data found in file",
            general_info: "General Info",
            sample_rate: "Rate",
            samples: "Samples",
            active_channels: "Active Channels",
            duration: "Duration",
            filter_by_type: "Filter by type",
            all: "All",
            classification_help: "Auto-classification: Channels are automatically classified by name.",
            type: "Type",
            apply: "Apply",
            valid_samples: "Valid",
            min: "Min",
            max: "Max",
            average: "Avg",
            nan_null: "NaN/Null"
        },
        analog_types: {
            fuerza: "Force",
            momento: "Moment",
            emg: "EMG",
            acelerometro: "Accelerometer",
            giroscopio: "Gyroscope",
            angulo: "Angle",
            desconocido: "Unknown",
            todos: "All"
        },
        metadata: {
            title: "File Information",
            basic_info: "Basic Info",
            total_frames: "Total Frames",
            original_fps: "Original FPS",
            duration: "Duration",
            total_markers: "Total Markers",
            standardized: "Standardized Markers",
            non_standardized: "Non-standard Markers",
            analog_data: "Analog Data",
            detected_types: "Detected Types",
            yes: "Yes",
            no: "No"
        },
        controls: {
            reset: "Reset",
            play: "Play/Pause",
            prev_frame: "Prev Frame",
            next_frame: "Next Frame",
            frame: "Frame",
            speed: "Speed",
            fps: "FPS",
            original_rate: "Original Rate"
        },
        ui: {
            markers: "📋 Markers",
            close: "✕ Close",
            trajectories: "🔄 Trajectories",
            analog: "📊 Analog Data",
            metadata: "📈 Metadata",
            view_avatar: "👤 View Avatar",
            view_lines: "🕸 View Rig"
        },
        plots: {
            title: "Analog Plots",
            view: "View Plots",
            update: "Apply Selection",
            selected_channels: "Selected Channels",
            close: "Close plots"
        },
        theme: {
            dark: "Dark Mode",
            light: "Light Mode",
            dark_icon: "🌙",
            light_icon: "☀️"
        }
    },
    fr: {
        app: {
            title: "CHLOE : Assistant Clinique pour l'Évaluation Objective de la Locomotion",
            select_file: "Sélectionner un fichier .c3d",
            processing: "Traitement du fichier C3D...",
            success: "Fichier traité ! {{frames}} trames @ {{fps}}Hz",
            error: "Erreur : {{message}}",
            select_file_prompt: "Sélectionnez un fichier .c3d pour commencer"
        },
        markers: {
            control: "Contrôle des Marqueurs",
            torso: "Torse et Cou",
            pelvis: "Bassin",
            brazo_derecho: "Bras Droit",
            brazo_izquierdo: "Bras Gauche",
            pierna_derecha: "Jambe Droite",
            pierna_izquierda: "Jambe Gauche",
            mano_derecha: "Main Droite",
            mano_izquierda: "Main Gauche",
            cabeza: "Tête",
            otros: "Autres Marqueurs",
            hide_all: "Tout Masquer",
            show_all: "Tout Afficher",
            non_standard: "Marqueur non standard"
        },
        trajectories: {
            title: "Trajectoires Actives",
            active: "Trajectoires Actives",
            no_active: "Aucune trajectoire active",
            remove: "Supprimer la trajectoire",
            clear_all: "Effacer toutes les trajectoires",
            show: "Afficher la trajectoire",
            hide: "Masquer la trajectoire"
        },
        analog: {
            title: "Données Analogiques",
            no_data: "Aucune donnée analogique trouvée dans le fichier",
            general_info: "Informations Générales",
            sample_rate: "Fréquence",
            samples: "Échantillons",
            active_channels: "Canaux Actifs",
            duration: "Durée",
            filter_by_type: "Filtrer par type",
            all: "Tous",
            classification_help: "Classification auto : Les canaux sont classés automatiquement par nom.",
            type: "Type",
            apply: "Appliquer",
            valid_samples: "Valides",
            min: "Min",
            max: "Max",
            average: "Moy",
            nan_null: "NaN/Null"
        },
        analog_types: {
            fuerza: "Force",
            momento: "Moment",
            emg: "EMG",
            acelerometro: "Accéléromètre",
            giroscopio: "Gyroscope",
            angulo: "Angle",
            desconocido: "Inconnu",
            todos: "Tous"
        },
        metadata: {
            title: "Informations du Fichier",
            basic_info: "Infos de base",
            total_frames: "Total Trames",
            original_fps: "FPS Original",
            duration: "Durée",
            total_markers: "Total Marqueurs",
            standardized: "Marqueurs Standardisés",
            non_standardized: "Marqueurs Non Standard",
            analog_data: "Données Analogiques",
            detected_types: "Types Détectés",
            yes: "Oui",
            no: "Non"
        },
        controls: {
            reset: "Réinitialiser",
            play: "Lecture/Pause",
            prev_frame: "Trame Préc.",
            next_frame: "Trame Suiv.",
            frame: "Trame",
            speed: "Vitesse",
            fps: "FPS",
            original_rate: "Fréquence Orig."
        },
        ui: {
            markers: "📋 Marqueurs",
            close: "✕ Fermer",
            trajectories: "🔄 Trajectoires",
            analog: "📊 Données Analog.",
            metadata: "📈 Métadonnées",
            view_avatar: "👤 Voir Avatar",
            view_lines: "🕸 Voir le squelette"
        },
        plots: {
            title: "Graphiques Analogiques",
            view: "Voir les Graphiques", 
            update: "Appliquer la Sélection",
            selected_channels: "Canaux Sélectionnés",
            close: "Fermer les graphiques"
        },
        theme: {
            dark: "Mode Sombre",
            light: "Mode Clair",
            dark_icon: "🌙",
            light_icon: "☀️"
        }
    }
};

// ===========================================
// Three.js scene and visualization variables
// ===========================================

let scene, camera, renderer, controls, ambientLight;
let markers = {}; 
let lines = [];   
let cabezaMarker; 
let animationData = null; 
let frameIndex = 0;
let isPlaying = false;
let playbackSpeed = 1;
let originalFPS = 0;
let frameAccumulator = 0;
let lastTime = 0;
let currentFileName = '';

let avatar = null;
let skeletonHelper = null;
let avatarBones = {
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

let avatarLoaded = false;
let isAvatarMode = true; // true = the avatar is shown, false = the lines are shown
const viewModeToggle = document.getElementById('view-mode-toggle');


let trajectories = {};
let trajectoryColors = [
    0xff6b6b, 0x4ecdc4, 0x45aaf2, 0x26de81, 0xa55eea, 0xf7b731, 0xfd9644,
    0xff9ff3, 0x54a0ff, 0x5f27cd, 0x00d2d3, 0xff9f43, 0x10ac84, 0xee5a24
];
let nextTrajectoryColorIndex = 0;


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
const trajectoriesList = document.getElementById('trajectories-list');
const clearTrajectoriesBtn = document.getElementById('clear-trajectories');
const analogPanel = document.getElementById('analog-panel');
const analogToggle = document.getElementById('analog-toggle');
const analogContent = document.getElementById('analog-content');

// =======================
// Biomechanical mapping
// =======================

const MARKER_CATEGORIES = {
    'torso': { translationKey: 'torso', markers: ['C7', 'T10', 'CLAV', 'STRN', 'SACR'], color: 0xff6b6b, visible: true },
    'pelvis': { translationKey: 'pelvis', markers: ['RPSI', 'RASI', 'LPSI', 'LASI'], color: 0x4ecdc4, visible: true },
    'brazo_derecho': { translationKey: 'brazo_derecho', markers: ['RSHO', 'RUPA', 'RELB', 'RFRM', 'RWRB', 'RWRA', 'RWRT'], color: 0x45aaf2, visible: true },
    'brazo_izquierdo': { translationKey: 'brazo_izquierdo', markers: ['LSHO', 'LUPA', 'LELB', 'LFRM', 'LWRB', 'LWRA', 'LWRT'], color: 0x26de81, visible: true },
    'mano_derecha': { translationKey: 'mano_derecha', markers: ['RTMC','RTPX','RTDI','RTTP','RIMC','RFIN','RIIM','RITP','RMMC','RMPX','RMIM','RMTP','RRMC','RRPX','RRIM','RRTP','RLMC','RLPX','RLIM','RLTP','RPLM', 'RIDI', 'RLDI', 'RMDI', 'RRDI'], color: 0x32a6a8, visible: true },
    'mano_izquierda': { translationKey: 'mano_izquierda', markers: ['LTMC','LTPX','LTTP','LIMC','LFIN','LIIM','LITP','LMMC','LMPX','LMIM','LMTP','LRMC','LRPX','LRIM','LRTP','LLMC','LLPX','LLIM','LLTP', 'LPLM','LIDI', 'LLDI', 'LMDI', 'LRDI'], color: 0x32a869, visible: true },
    'pierna_derecha': { translationKey: 'pierna_derecha', markers: ['RTHI', 'RKNE', 'RSHN', 'RANK', 'RHEE', 'RTOE', 'RMT5'], color: 0xa55eea, visible: true },
    'pierna_izquierda': { translationKey: 'pierna_izquierda', markers: ['LTHI', 'LKNE', 'LSHN', 'LANK', 'LHEE', 'LTOE', 'LMT5'], color: 0xf7b731, visible: true },
    'cabeza': { translationKey: 'cabeza', markers: ['RBHD', 'LBHD', 'LFHD', 'RFHD', 'HEAD'], color: 0xfd9644, visible: true },
    'otros': { translationKey: 'otros', markers: [], color: 0x888888, visible: true }
};

const ANALOG_COLOURS = {
    'emg': 0xff6b6b, 'fuerza': 0xfd9644, 'momento': 0x45aaf2,
    'acelerometro': 0x26de81, 'giroscopio': 0xa55eea, 'angulo': 0xf7b731, 'desconocido': 0x888888
};

const CONECTIONS = [
    ['C7', 'CLAV'], ['CLAV', 'STRN'], ['STRN', 'T10'], ['C7', 'T10'], ['T10', 'SACR'], 
    ['CLAV', 'RASI'], ['CLAV', 'LASI'], ['C7', 'RPSI'], ['C7', 'LPSI'],
    ['STRN', 'RASI'], ['STRN', 'LASI'], ['T10', 'RPSI'], ['T10', 'LPSI'],
    ['SACR', 'RPSI'], ['SACR', 'LPSI'], ['RPSI', 'RASI'], ['LPSI', 'LASI'],
    ['RASI', 'LASI'], ['RPSI', 'LASI'], ['LPSI', 'RASI'],['RPSI', 'LPSI'],
    ['CLAV', 'RSHO'], ['C7', 'RSHO'], ['RSHO', 'RUPA'], ['RSHO', 'RELB'], 
    ['RUPA', 'RELB'], ['RELB', 'RFRM'], ['RELB', 'RWRB'],['RELB', 'RWRA'],['RELB', 'RWRT'],
    ['RFRM', 'RWRB'], ['RFRM', 'RWRA'], ['RWRB', 'RWRA'],
    ['CLAV', 'LSHO'], ['C7', 'LSHO'], ['LSHO', 'LUPA'], ['LSHO', 'LELB'],
    ['LUPA', 'LELB'], ['LELB', 'LFRM'], ['LELB', 'LWRB'],['LELB', 'LWRA'], ['LELB', 'LWRT'],
    ['LFRM', 'LWRB'], ['LFRM', 'LWRA'], ['LWRB', 'LWRA'],
    ['RASI', 'RTHI'], ['RPSI', 'RTHI'], ['RASI', 'RKNE'], ['RPSI', 'RKNE'],
    ['RTHI', 'RKNE'], ['RKNE', 'RSHN'], ['RKNE', 'RANK'], ['RSHN', 'RANK'], 
    ['RANK', 'RHEE'], ['RANK', 'RTOE'], ['RHEE', 'RTOE'], ['RTOE', 'RMT5'], ['RANK', 'RMT5'],
    ['LASI', 'LTHI'], ['LPSI', 'LTHI'], ['LASI', 'LKNE'], ['LPSI', 'LKNE'],
    ['LTHI', 'LKNE'], ['LKNE', 'LSHN'], ['LKNE', 'LANK'], ['LSHN', 'LANK'], 
    ['LANK', 'LHEE'], ['LANK', 'LTOE'], ['LHEE', 'LTOE'], ['LTOE', 'LMT5'], ['LANK', 'LMT5'],
    ['RBHD', 'LBHD'], ['LBHD', 'LFHD'], ['LFHD', 'RFHD'], ['RFHD', 'RBHD'],
    ['RBHD', 'LFHD'], ['LBHD', 'RFHD'],

    ['RWRA', 'RPLM'], ['RWRB', 'RPLM'],
    ['RPLM', 'RTMC'], ['RPLM', 'RIMC'], ['RPLM', 'RMMC'], ['RPLM', 'RRMC'], ['RPLM', 'RLMC'],
    ['RTMC', 'RTPX'], ['RTPX', 'RTDI'], ['RTDI', 'RTTP'],
    ['RIMC', 'RFIN'], ['RFIN', 'RIIM'], ['RIIM', 'RIDI'], ['RIDI', 'RITP'],
    ['RMMC', 'RMPX'], ['RMPX', 'RMIM'], ['RMIM', 'RMDI'], ['RMDI', 'RMTP'],
    ['RRMC', 'RRPX'], ['RRPX', 'RRIM'], ['RRIM', 'RRDI'], ['RRDI', 'RRTP'],
    ['RLMC', 'RLPX'], ['RLPX', 'RLIM'], ['RLIM', 'RLDI'], ['RLDI', 'RLTP'],

    ['LWRA', 'LPLM'], ['LWRB', 'LPLM'],
    ['LPLM', 'LTMC'], ['LPLM', 'LIMC'], ['LPLM', 'LMMC'], ['LPLM', 'LRMC'], ['LPLM', 'LLMC'],
    ['LTMC', 'LTPX'], ['LTPX', 'LTDI'], ['LTDI', 'LTTP'],
    ['LIMC', 'LFIN'], ['LFIN', 'LIIM'], ['LIIM', 'LIDI'], ['LIDI', 'LITP'],
    ['LMMC', 'LMPX'], ['LMPX', 'LMIM'], ['LMIM', 'LMDI'], ['LMDI', 'LMTP'],
    ['LRMC', 'LRPX'], ['LRPX', 'LRIM'], ['LRIM', 'LRDI'], ['LRDI', 'LRTP'],
    ['LLMC', 'LLPX'], ['LLPX', 'LLIM'], ['LLIM', 'LLDI'], ['LLDI', 'LLTP']

];

const MARKERS_COLOURS = {
    'C7': 0xff0000, 'T10': 0xff5500, 'CLAV': 0xffff00, 'STRN': 0xff00ff, 'SACR': 0x00ffff,
    'RPSI': 0x0000ff, 'RASI': 0x0000ff, 'LPSI': 0x00ff00, 'LASI': 0x00ff00,
    'RSHO': 0x45aaf2, 'RUPA': 0x45aaf2, 'RELB': 0x45aaf2, 'RFRM': 0x45aaf2, 'RWRB': 0x45aaf2, 'RWRA': 0x45aaf2, 'RWRT': 0x45aaf2,
    'LSHO': 0x26de81, 'LUPA': 0x26de81, 'LELB': 0x26de81, 'LFRM': 0x26de81, 'LWRB': 0x26de81, 'LWRA': 0x26de81, 'LWRT': 0x26de81,
    'RTHI': 0xa55eea, 'RKNE': 0xa55eea, 'RSHN': 0xa55eea, 'RANK': 0xa55eea, 'RHEE': 0xa55eea, 'RTOE': 0xa55eea, 'RMT5': 0xa55eea,
    'LTHI': 0xf7b731, 'LKNE': 0xf7b731, 'LSHN': 0xf7b731, 'LANK': 0xf7b731, 'LHEE': 0xf7b731, 'LTOE': 0xf7b731, 'LMT5': 0xf7b731,
    'RBHD': 0xfd9644, 'LBHD': 0xfd9644, 'LFHD': 0xfd9644, 'RFHD': 0xfd9644, 'HEAD': 0xfd9644,
    "RTMC":0x32a6a8, "RTPX":0x32a6a8, "RTDI":0x32a6a8, "RTTP":0x32a6a8, "RIMC":0x32a6a8, "RFIN":0x32a6a8, "RIIM":0x32a6a8, 
    "RITP":0x32a6a8, "RMMC":0x32a6a8, "RMPX":0x32a6a8, "RMIM":0x32a6a8, "RMTP":0x32a6a8, "RRMC":0x32a6a8, "RRPX":0x32a6a8,
    "RRIM":0x32a6a8, "RRTP":0x32a6a8, "RLMC":0x32a6a8, "RLPX":0x32a6a8, "RLIM":0x32a6a8, "RLTP":0x32a6a8, "RPLM":0x32a6a8, 
    "RIDI":0x32a6a8, "RLDI":0x32a6a8, "RMDI":0x32a6a8 , "RRDI": 0x32a6a8,
    "LTMC":0x32a869, "LTPX":0x32a869, "LTDI":0x32a869, "LTTP":0x32a869, "LIMC":0x32a869, "LFIN":0x32a869, "LIIM":0x32a869,
    "LITP":0x32a869, "LMMC":0x32a869, "LMPX":0x32a869, "LMIM":0x32a869, "LMTP":0x32a869, "LRMC":0x32a869, "LRPX":0x32a869,
    "LRIM":0x32a869, "LRTP":0x32a869, "LLMC":0x32a869, "LLPX":0x32a869, "LLIM":0x32a869, "LLTP":0x32a869, "LPLM":0x32a869, 
    'LIDI':0x32a869, 'LLDI':0x32a869, 'LMDI':0x32a869 , 'LRDI': 0x32a869
};

const HEAD_MARKERS = ['RBHD', 'LBHD', 'LFHD', 'RFHD'];


const FINGER_MARKERS = {
    Right: {
        Thumb:  ['RTMC', 'RTPX', 'RTDI', 'RTTP'],
        Index:  ['RIMC', 'RFIN', 'RIIM', 'RITP'], 
        Middle: ['RMMC', 'RMPX', 'RMIM', 'RMTP'],
        Ring:   ['RRMC', 'RRPX', 'RRIM', 'RRTP'],
        Pinky:  ['RLMC', 'RLPX', 'RLIM', 'RLTP']
    },
    Left: {
        Thumb:  ['LTMC', 'LTPX', 'LTDI', 'LTTP'],
        Index:  ['LIMC', 'LFIN', 'LIIM', 'LITP'],
        Middle: ['LMMC', 'LMPX', 'LMIM', 'LMTP'],
        Ring:   ['LRMC', 'LRPX', 'LRIM', 'LRTP'],
        Pinky:  ['LLMC', 'LLPX', 'LLIM', 'LLTP']
    }
};

const HAND_MARKERS_SET = new Set([
    // --- Mano Derecha ---
    'RTMC', 'RTPX', 'RTDI', 'RTTP', // Pulgar
    'RIMC', 'RFIN', 'RIIM', 'RITP', 'RIDI', // Índice
    'RMMC', 'RMPX', 'RMIM', 'RMTP', 'RMDI',// Medio
    'RRMC', 'RRPX', 'RRIM', 'RRTP', 'RRDI',// Anular
    'RLMC', 'RLPX', 'RLIM', 'RLTP', 'RLDI',// Meñique
    'RPLM', // Palma
    
    // --- Mano Izquierda ---
    'LTMC', 'LTPX', 'LTDI', 'LTTP', 
    'LIMC', 'LFIN', 'LIIM', 'LITP', 'LIDI',
    'LMMC', 'LMPX', 'LMIM', 'LMTP', 'LMDI',
    'LRMC', 'LRPX', 'LRIM', 'LRTP', 'LRDI',
    'LLMC', 'LLPX', 'LLIM', 'LLTP', 'LLDI',
    'LPLM'
]);


// ============================================================================================================================================
// INTERNATIONALIZATION (i18n) ENGINE
// ============================================================================================================================================

/**
 * Retrieves a translated string based on the current language.
 * @param {string} path - The dot-notation path to the key (e.g., 'app.success').
 * @param {Object} params - Dynamic values to inject into placeholders {{param}}.
 * @returns {string} The translated text or the path if not found.
 */
function t(path, params = {}) {
    const keys = path.split('.');
    let value = TRANSLATIONS[currentLang];
    
    for (const key of keys) {
        if (value && value[key]) {
            value = value[key];
        } else {
            console.warn(`Translation missing: ${path} in ${currentLang}`);
            return path;
        }
    }

    if (typeof value === 'string') {
        Object.keys(params).forEach(key => {
            value = value.replace(`{{${key}}}`, params[key]);
        });
    }
    
    return value;
}

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
    if (isPlotsOpen) {
        updatePlotsTranslations();
        if (lastLoadedData?.analog_data) {
            createPlots(lastLoadedData.analog_data); // Re-render plots 
        }
    }

    console.log(`Idioma cambiado a: ${lang}`);
}

/**
 * Updates the text content of a DOM element by its ID.
 * @param {string} id - The unique identifier of the HTML element.
 * @param {string} text - The new localized text string.
 */
function updateTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

/**
 * Updates the 'title' attribute (tooltip) of a DOM element.
 * Useful for providing localized information on hover.
 * @param {string} id - The unique identifier of the HTML element.
 * @param {string} text - The localized tooltip string.
 */
function updateTitle(id, text) {
    const el = document.getElementById(id);
    if (el) el.title = text;
}

/**
 * Updates the text of a toggle button based on the visibility of its target panel.
 * @param {HTMLElement} btn - The button element to update.
 * @param {string} key - The translation key for the button's "open" state.
 * @param {HTMLElement} panel - The panel whose visibility determines the text.
 */
function updateToggleText(btn, key, panel) {
    if (!btn || !panel) return;
    const isVisible = panel.style.display === 'block';
    btn.textContent = isVisible ? t('ui.close') : t(key);
}

/**
 * Refreshes the inner HTML of the theme selection buttons.
 * Injects both the localized theme name and its corresponding emoji icon.
 */
function updateThemeButtons() {
    const themeDarkBtn = document.getElementById('theme-dark');
    const themeLightBtn = document.getElementById('theme-light');
    
    if (themeDarkBtn) {
        themeDarkBtn.innerHTML = `<i>${t('theme.dark_icon')}</i> ${t('theme.dark')}`;
    }
    
    if (themeLightBtn) {
        themeLightBtn.innerHTML = `<i>${t('theme.light_icon')}</i> ${t('theme.light')}`;
    }
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
        setStatus(t('app.error', {message: "Inicialización 3D fallida"}), "error");
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
    
    [controlsContainer, markersPanel, metadataPanel, trajectoriesPanel, analogPanel].forEach(el => {
        if(el) el.style.display = 'none';
    });
    
    if (btnPlayPause) btnPlayPause.textContent = '▶️';
    if (frameSlider) { frameSlider.value = 0; frameSlider.disabled = true; }
    if (frameCounter) frameCounter.textContent = '0 / 0';
    
    updateToggleText(panelToggle, 'ui.markers', markersPanel);
    updateToggleText(metadataToggle, 'ui.metadata', metadataPanel);
    updateToggleText(trajectoriesToggle, 'ui.trajectories', trajectoriesPanel);
    updateToggleText(analogToggle, 'ui.analog', analogPanel);

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
 * Updates the Trajectories sidebar list based on currently active 3D trajectories.
 */
function updateTrajectoriesPanel() {
    if (!trajectoriesList) return;
    trajectoriesList.innerHTML = '';
    
    const activeTrajectories = Object.keys(trajectories);
    
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
    plotsButton.innerHTML = '📈 ' + t('plots.view'); // Usar traducción
    plotsButton.addEventListener('click', () => {
        openPlotsPanel(analogData);
    });
    analogContent.appendChild(plotsButton);
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
 * Orchestrates the creation or removal of a 3D movement trajectory for a marker.
 * @param {string} markerName - Target marker name.
 */
function toggleTrajectory(markerName) {
    if (trajectories[markerName]) removeTrajectory(markerName);
    else addTrajectory(markerName);
    updateTrajectoriesPanel();
    
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
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(animationData.length * 3); // Pre-allocate memory for all frames
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
    
    const points = [];
    animationData.forEach(frame => {
        const c = frame[markerName];
        if (c && c.length === 3) points.push(c[0], c[1], c[2]);
        else points.push(0,0,0); // Fill with zeros if data is missing to maintain index alignment
    });
    
    const pos = t.line.geometry.attributes.position.array;
    for(let i=0; i<points.length; i++) pos[i] = points[i];
    t.line.geometry.attributes.position.needsUpdate = true;
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
function clearAllTrajectories() {
    Object.keys(trajectories).forEach(m => removeTrajectory(m));
    trajectories = {};
    updateTrajectoriesPanel();
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
                const fingerRegex = /mixamorig(Right|Left)Hand(Thumb|Index|Middle|Ring|Pinky)([1-4])/;
                const match = n.match(fingerRegex);

                if (match) {
                    const side = match[1];      // Lado
                    const finger = match[2];    // Dedo
                    const index = parseInt(match[3]) - 1; // Índice (1-4 -->0-3) 
                    
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
// ANIMATION AND KINEMATICS LOGIC
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

    const currentTime = index / originalFPS;
    if (isPlotsOpen) {
        updatePlotlyTimeLine(currentTime);
    }
    
    frameIndex = index;
    if (frameSlider && frameSlider.value != index) frameSlider.value = index;
    if (frameCounter) frameCounter.textContent = `${index} / ${animationData.length - 1}`;
    updateFrameButtons();

}

/**
 * Updates the 3D avatar's skeletal pose based on the current frame's marker cloud.
 * Implements a hierarchical positioning strategy and localized bone alignment.
 * @param {Object} frameData - Dictionary of marker coordinates for the current frame.
 */
function updateAvatarPose(frameData) {
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

        // Grounding Logic: Find the lowest foot marker to prevent floating
        const footMarkers = ['LHEE', 'LTOE', 'LMT5', 'RHEE', 'RTOE', 'RMT5', 'LANK', 'RANK'];
        let lowestY = Infinity;
        
        footMarkers.forEach(name => {
            const vec = getVectorFromMarker(frameData, name);
            if (vec && vec.y < lowestY) {
                lowestY = vec.y;
            }
        });

        if (lowestY !== Infinity) avatar.position.y = lowestY;
        else {
            // estimate a leg large of 0.85m
            avatar.position.y = finalRootPos.y - 0.85; 
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
        targetPoint.y = avatar.position.y; // Keep character upright
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
    } else if (c7 || clav) {
        // si falta uno, el que esté
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
    if (rWRA && rWRB) {
        wristRTarget = new THREE.Vector3().addVectors(rWRA, rWRB).multiplyScalar(0.5);
    } else {
        wristRTarget = rWRA || rWRB || rWRT;
    }

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
    if (lWRA && lWRB) {
        wristLTarget = new THREE.Vector3().addVectors(lWRA, lWRB).multiplyScalar(0.5);
    } else {
        wristLTarget = lWRT || lWRA || lWRB;
    }
    
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
        alignBone(avatarBones.RightFoot, rAnkle, rToe);
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
        alignBone(avatarBones.LeftFoot, lAnkle, lToe);
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
    const fingersMap = side === 'Right' ? avatarBones.RightFingers : avatarBones.LeftFingers;
    const markersMap = FINGER_MARKERS[side];

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
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), localTargetDir);
    bone.quaternion.copy(quaternion);
}

// ============================================================================================================================================
// EVENT LISTENERS (Click, Drag&Drop...)
// ============================================================================================================================================

window.addEventListener('resize', () => {
    if (camera && renderer) {
        const leftPanel = document.getElementById('left-panel');
        if (!leftPanel) return;

        // Medir el tamaño real del div contenedor
        const width = leftPanel.clientWidth;
        const height = leftPanel.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        // Ajustar el renderizador al tamaño del div, no de la ventana
        renderer.setSize(width, height);
    }
});

if (btnPlayPause) btnPlayPause.addEventListener('click', () => {
    if (!animationData) return;
    isPlaying = !isPlaying;
    btnPlayPause.textContent = isPlaying ? '⏸' : '▶️';
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

const togglePanel = (btn, panel, key) => {
    const isVisible = panel.style.display !== 'none';
    // Cerrar otros
    [markersPanel, trajectoriesPanel, analogPanel, metadataPanel].forEach(p => { if(p !== panel) p.style.display = 'none'; });
    // Toggle actual
    panel.style.display = isVisible ? 'none' : 'block';
    
    // Actualizar textos de TODOS los botones toggle
    updateToggleText(panelToggle, 'ui.markers', markersPanel);
    updateToggleText(trajectoriesToggle, 'ui.trajectories', trajectoriesPanel);
    updateToggleText(analogToggle, 'ui.analog', analogPanel);
    updateToggleText(metadataToggle, 'ui.metadata', metadataPanel);
};

if (panelToggle) panelToggle.addEventListener('click', () => togglePanel(panelToggle, markersPanel, 'ui.markers'));
if (trajectoriesToggle) trajectoriesToggle.addEventListener('click', () => togglePanel(trajectoriesToggle, trajectoriesPanel, 'ui.trajectories'));
if (analogToggle) analogToggle.addEventListener('click', () => togglePanel(analogToggle, analogPanel, 'ui.analog'));
if (metadataToggle) metadataToggle.addEventListener('click', () => togglePanel(metadataToggle, metadataPanel, 'ui.metadata'));

if (clearTrajectoriesBtn) clearTrajectoriesBtn.addEventListener('click', clearAllTrajectories);

document.addEventListener('click', (e) => {
    // Cerrar paneles si click fuera
    const isPanel = e.target.closest('#markers-panel, #trajectories-panel, #analog-panel, #metadata-panel');
    const isBtn = e.target.closest('.panel-toggle, .trajectories-toggle, .analog-toggle, .metadata-toggle');
    const isLang = e.target.closest('.language-selector');
    
    if (!isPanel && !isBtn && !isLang) {
        [markersPanel, trajectoriesPanel, analogPanel, metadataPanel].forEach(p => { if(p) p.style.display = 'none'; });
        updateToggleText(panelToggle, 'ui.markers', markersPanel);
        updateToggleText(trajectoriesToggle, 'ui.trajectories', trajectoriesPanel);
        updateToggleText(analogToggle, 'ui.analog', analogPanel);
        updateToggleText(metadataToggle, 'ui.metadata', metadataPanel);
    }
});

document.addEventListener('dragover', (e) => { e.preventDefault(); document.body.style.backgroundColor = 'rgba(0, 123, 255, 0.1)'; });
document.addEventListener('dragleave', (e) => { e.preventDefault(); document.body.style.backgroundColor = ''; });
document.addEventListener('drop', (e) => {
    e.preventDefault(); document.body.style.backgroundColor = '';
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.c3d')) handleFileUpload(files[0]);
});

if (uploadInput) uploadInput.addEventListener('change', (e) => handleFileUpload(e.target.files[0]));

// ============================================================================================================================================
// ANALOG PLOTTING MODULE (Plotly.js)
// ============================================================================================================================================

let plotsPanel = null;
let isPlotsOpen = false;
let selectedChannels = [];
let plotlyGraphs = {};


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
 * Opens the right-side plotting panel and prepares the dual-pane layout.
 * @param {Object} analogData - The full analog data object from the C3D file.
 */
function openPlotsPanel(analogData) {
    if (!analogData || !analogData.channels) return;
    
    const mainWrapper = document.getElementById('main-wrapper');
    const rightPanel = document.getElementById('right-panel'); 

    // Update CSS class to trigger the split-screen layout
    mainWrapper.classList.add('with-plots');
    if (rightPanel) rightPanel.style.display = 'flex'; 
    
    isPlotsOpen = true;
    
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
 * Sets up initial event listeners for the plotting panel controls.
 */
function initializePlotsPanel() {
    plotsPanel = document.getElementById('right-panel');
    document.getElementById('close-plots').addEventListener('click', closePlotsPanel);
    
    document.getElementById('apply-channels').addEventListener('click', function() {
        const analogData = lastLoadedData?.analog_data;
        if (analogData) {
            updateSelectedChannels();
            createPlots(analogData);
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
function createPlots(analogData) {
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
 * Synchronizes the vertical "time line" on all active Plotly charts.
 * This is called on every frame of the 3D animation loop.
 * @param {number} currentTime - The current playback time in seconds.
 */
function updatePlotlyTimeLine(currentTime) {
    if (!isPlotsOpen || !plotlyGraphs || selectedChannels.length === 0) return;
    
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
 * Closes the plotting panel and clears memory resources associated with Plotly.
 */
function closePlotsPanel() {
    const mainWrapper = document.getElementById('main-wrapper');
    const rightPanel = document.getElementById('right-panel');
    
    mainWrapper.classList.remove('with-plots');
    if (rightPanel) rightPanel.style.display = 'none';
    
    isPlotsOpen = false;
    clearPlots();
    
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
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

/**
 * Refreshes localized strings within the plotting panel when the application language changes.
 * Ensures the 'Apply' button and 'Title' labels match the current language context.
 */
function updatePlotsTranslations() {
    const title = document.getElementById('plots-title');
    const applyBtn = document.getElementById('apply-channels');
    if (title) title.textContent = t('plots.title');
    if (applyBtn) applyBtn.textContent = t('analog.apply');
}


window.openPlotsPanel = openPlotsPanel;
window.closePlotsPanel = closePlotsPanel;


console.log("Iniciando aplicación...");
init();