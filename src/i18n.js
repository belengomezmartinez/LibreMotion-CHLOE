
import { currentLang } from './main.js'; 

export const TRANSLATIONS = {
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

/**
 * Retrieves a translated string based on the current language.
 * @param {string} path - The dot-notation path to the key (e.g., 'app.success').
 * @param {Object} params - Dynamic values to inject into placeholders {{param}}.
 * @returns {string} The translated text or the path if not found.
 */
export function t(path, params = {}) {
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



//===============================================================================
// Helper functions to update specific UI elements with translations
//===============================================================================

/**
 * Updates the text content of a DOM element by its ID.
 * @param {string} id - The unique identifier of the HTML element.
 * @param {string} text - The new localized text string.
 */
export function updateTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

/**
 * Updates the 'title' attribute (tooltip) of a DOM element.
 * Useful for providing localized information on hover.
 * @param {string} id - The unique identifier of the HTML element.
 * @param {string} text - The localized tooltip string.
 */
export function updateTitle(id, text) {
    const el = document.getElementById(id);
    if (el) el.title = text;
}

/**
 * Updates the text of a toggle button based on the visibility of its target panel.
 * @param {HTMLElement} btn - The button element to update.
 * @param {string} key - The translation key for the button's "open" state.
 * @param {HTMLElement} panel - The panel whose visibility determines the text.
 */
export function updateToggleText(btn, key, panel) {
    if (!btn || !panel) return;
    const isVisible = panel.style.display === 'block';
    btn.textContent = isVisible ? t('ui.close') : t(key);
}

/**
 * Refreshes the inner HTML of the theme selection buttons.
 * Injects both the localized theme name and its corresponding emoji icon.
 */
export function updateThemeButtons() {
    const themeDarkBtn = document.getElementById('theme-dark');
    const themeLightBtn = document.getElementById('theme-light');
    
    if (themeDarkBtn) {
        themeDarkBtn.innerHTML = `<i>${t('theme.dark_icon')}</i> ${t('theme.dark')}`;
    }
    
    if (themeLightBtn) {
        themeLightBtn.innerHTML = `<i>${t('theme.light_icon')}</i> ${t('theme.light')}`;
    }
}

/**
 * Refreshes localized strings within the plotting panel when the application language changes.
 * Ensures the 'Apply' button and 'Title' labels match the current language context.
 */
export function updatePlotsTranslations() {
    const title = document.getElementById('plots-title');
    const applyBtn = document.getElementById('apply-channels');
    if (title) title.textContent = t('plots.title');
    if (applyBtn) applyBtn.textContent = t('analog.apply');
}