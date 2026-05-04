import { currentLang } from './main.js'; 

export const TRANSLATIONS = {
    es: {
        app: {
            title: "CHLOE: Ayudante Clínico para Evaluación Objetiva de la Locomoción",
            select_file: "Seleccionar Archivo .c3d",
            processing: "Procesando archivo C3D...",
            success: "Archivo procesado! {{frames}} frames - {{fps}}Hz",
            success_analog_only: "Archivo procesado! No se encontraron frames, pero sí datos analógicos.",
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
            title: "Trayectorias", 
            active: "Trayectorias Activas",
            no_active: "No hay trayectorias activas. Puede activar trayectorias desde el panel de marcadores.",
            clear_all: "Limpiar Todas las Trayectorias",
            range_title: "Rango de visualización",
            range_frame: "Frame",
            remove: "Eliminar trayectoria", 
            hide: "Ocultar trayectoria",
            show: "Mostrar trayectoria"
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
            potencia: "Potencia",
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
            trajectories: "📐 Trayectorias",
            analog: "📊 Datos Analógicos",
            metadata: "📈 Metadatos", 
            view_avatar: "👤 Ver Avatar",
            view_lines: "🕸 Ver Esqueleto", 
            vectors: "📏 Vectores", 
            reset_view: "🔄 Reiniciar Vista"
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
        }, 
        vectors: {
            title: "Vectores",
            add: "Crear Vector",
            remove: "Eliminar Vector",
            select_start: "Seleccionar marcador de inicio",
            select_end: "Seleccionar marcador de fin",
            axis_seconds: "Segundos",
            axis_degrees: "Grados (°)"
        },
        anatomical_names: {
            'C7': 'Vértebra C7',
            'T10': 'Vértebra T10',
            'CLAV': 'Clavícula',
            'STRN': 'Esternón',
            'SACR': 'Sacro',
            'LASI': 'Espina ilíaca anterosuperior izquierda',
            'RASI': 'Espina ilíaca anterosuperior derecha',
            'LPSI': 'Espina ilíaca posterosuperior izquierda',
            'RPSI': 'Espina ilíaca posterosuperior derecha',
            'RSHO': 'Hombro derecho',
            'RUPA': 'Brazo derecho superior',
            'RELB': 'Codo derecho',
            'RFRM': 'Antebrazo derecho',
            'RWRA': 'Muñeca derecha (estiloides radial)',
            'RWRB': 'Muñeca derecha (estiloides cubital)',
            'RWRT': 'Muñeca derecha (punto medio)',
            'LSHO': 'Hombro izquierdo',
            'LUPA': 'Brazo izquierdo superior',
            'LELB': 'Codo izquierdo',
            'LFRM': 'Antebrazo izquierdo',
            'LWRA': 'Muñeca izquierda (estiloides radial)',
            'LWRB': 'Muñeca izquierda (estiloides cubital)',
            'LWRT': 'Muñeca izquierda (punto medio)',
            'RTHI': 'Muslo derecho',
            'RKNE': 'Rodilla derecha',
            'RSHN': 'Tibia derecha',
            'RANK': 'Tobillo derecho',
            'RHEE': 'Talón derecho',
            'RTOE': 'Dedo del pie derecho (1º metatarsiano)',
            'RMT5': 'Dedo del pie derecho (5º metatarsiano)',
            'LTHI': 'Muslo izquierdo',
            'LKNE': 'Rodilla izquierda',
            'LSHN': 'Tibia izquierda',
            'LANK': 'Tobillo izquierdo',
            'LHEE': 'Talón izquierdo',
            'LTOE': 'Dedo del pie izquierdo (1º metatarsiano)',
            'LMT5': 'Dedo del pie izquierdo (5º metatarsiano)',
            'RBHD': 'Cabeza parte posterior derecha',
            'LBHD': 'Cabeza parte posterior izquierda',
            'LFHD': 'Frente lado izquierdo',
            'RFHD': 'Frente lado derecho',
            'HEAD': 'Cabeza',
            'RPLM': 'Palma derecha',
            'LPLM': 'Palma izquierda',
            'RTMC': 'Pulgar derecho - Metacarpiano',
            'RTPX': 'Pulgar derecho - Falange proximal',
            'RTDI': 'Pulgar derecho - Falange distal',
            'RTTP': 'Pulgar derecho - Punta',
            'RIMC': 'Índice derecho - Metacarpiano',
            'RFIN': 'Índice derecho - Falange proximal',
            'RIIM': 'Índice derecho - Falange intermedia',
            'RIDI': 'Índice derecho - Falange distal',
            'RITP': 'Índice derecho - Punta',
            'RMMC': 'Dedo medio derecho - Metacarpiano',
            'RMPX': 'Dedo medio derecho - Falange proximal',
            'RMIM': 'Dedo medio derecho - Falange intermedia',
            'RMDI': 'Dedo medio derecho - Falange distal',
            'RMTP': 'Dedo medio derecho - Punta',
            'RRMC': 'Dedo anular derecho - Metacarpiano',
            'RRPX': 'Dedo anular derecho - Falange proximal',
            'RRIM': 'Dedo anular derecho - Falange intermedia',
            'RRDI': 'Dedo anular derecho - Falange distal',
            'RRTP': 'Dedo anular derecho - Punta',
            'RLMC': 'Meñique derecho - Metacarpiano',
            'RLPX': 'Meñique derecho - Falange proximal',
            'RLIM': 'Meñique derecho - Falange intermedia',
            'RLDI': 'Meñique derecho - Falange distal',
            'RLTP': 'Meñique derecho - Punta',
            'LTMC': 'Pulgar izquierdo - Metacarpiano',
            'LTPX': 'Pulgar izquierdo - Falange proximal',
            'LTDI': 'Pulgar izquierdo - Falange distal',
            'LTTP': 'Pulgar izquierdo - Punta',
            'LIMC': 'Índice izquierdo - Metacarpiano',
            'LFIN': 'Índice izquierdo - Falange proximal',
            'LIIM': 'Índice izquierdo - Falange intermedia',
            'LIDI': 'Índice izquierdo - Falange distal',
            'LITP': 'Índice izquierdo - Punta',
            'LMMC': 'Dedo medio izquierdo - Metacarpiano',
            'LMPX': 'Dedo medio izquierdo - Falange proximal',
            'LMIM': 'Dedo medio izquierdo - Falange intermedia',
            'LMDI': 'Dedo medio izquierdo - Falange distal',
            'LMTP': 'Dedo medio izquierdo - Punta',
            'LRMC': 'Dedo anular izquierdo - Metacarpiano',
            'LRPX': 'Dedo anular izquierdo - Falange proximal',
            'LRIM': 'Dedo anular izquierdo - Falange intermedia',
            'LRDI': 'Dedo anular izquierdo - Falange distal',
            'LRTP': 'Dedo anular izquierdo - Punta',
            'LLMC': 'Meñique izquierdo - Metacarpiano',
            'LLPX': 'Meñique izquierdo - Falange proximal',
            'LLIM': 'Meñique izquierdo - Falange intermedia',
            'LLDI': 'Meñique izquierdo - Falange distal',
            'LLTP': 'Meñique izquierdo - Punta'
        }
    },
    en: {
        app: {
            title: "CHLOE: Clinical Helper for Locomotion Objective Evaluation",
            select_file: "Select .c3d File",
            processing: "Processing C3D file...",
            success: "File processed! {{frames}} frames @ {{fps}}Hz",
            success_analog_only: "File processed! No frames found, but analog data is available.",
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
            title: "Trajectories",
            active: "Active Trajectories",
            no_active: "No active trajectories. You can activate trajectories from the markers panel.",
            clear_all: "Clear All Trajectories",
            range_title: "Visualization Range",
            range_frame: "Frame", 
            remove: "Remove trajectory", 
            hide: "Hide trajectory",
            show: "Show trajectory"
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
            potencia: "Power",
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
            trajectories: "📐 Trajectories",
            analog: "📊 Analog Data",
            metadata: "📈 Metadata",
            view_avatar: "👤 View Avatar",
            view_lines: "🕸 View Rig",
            vectors: "📏 Vectors",
            reset_view: "🔄 Reset View"
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
        },
        vectors: {
            title: "Vectors",
            add: "Create Vector",
            remove: "Remove Vector",
            select_start: "Select start marker",
            select_end: "Select end marker",
            axis_seconds: "Seconds",
            axis_degrees: "Degrees (°)"
        },  
    
        anatomical_names: {
                'C7': 'C7 vertebra',
                'T10': 'T10 vertebra',
                'CLAV': 'Clavicle',
                'STRN': 'Sternum',
                'SACR': 'Sacrum',
                'LASI': 'Left ant. superior iliac spine',
                'RASI': 'Right ant. superior iliac spine',
                'LPSI': 'Left post. superior iliac spine',
                'RPSI': 'Right post. superior iliac spine',
                'RSHO': 'Right shoulder',
                'RUPA': 'Right upper arm',
                'RELB': 'Right elbow',
                'RFRM': 'Right forearm',
                'RWRA': 'Right wrist radial styloid',
                'RWRB': 'Right wrist ulnar styloid',
                'RWRT': 'Right wrist (midpoint)',
                'LSHO': 'Left shoulder',
                'LUPA': 'Left upper arm',
                'LELB': 'Left elbow',
                'LFRM': 'Left forearm',
                'LWRA': 'Left wrist radial styloid',
                'LWRB': 'Left wrist ulnar styloid',
                'LWRT': 'Left wrist (midpoint)',
                'RTHI': 'Right thigh',
                'RKNE': 'Right knee',
                'RSHN': 'Right shin',
                'RANK': 'Right ankle',
                'RHEE': 'Right heel',
                'RTOE': 'Right 1st metatarsal head',
                'RMT5': 'Right 5th metatarsal head',
                'LTHI': 'Left thigh',
                'LKNE': 'Left knee',
                'LSHN': 'Left shin',
                'LANK': 'Left ankle',
                'LHEE': 'Left heel',
                'LTOE': 'Left 1st metatarsal head',
                'LMT5': 'Left 5th metatarsal head',
                'RBHD': 'Right back head',
                'LBHD': 'Left back head',
                'LFHD': 'Left side forehead',
                'RFHD': 'Right side forehead',
                'HEAD': 'Head',
                'RPLM': 'Right palm',
                'LPLM': 'Left palm',
                'RTMC': 'Right thumb - Metacarpal',
                'RTPX': 'Right thumb - Proximal phalanx',
                'RTDI': 'Right thumb - Distal phalanx',
                'RTTP': 'Right thumb - Tip',
                'RIMC': 'Right index - Metacarpal',
                'RFIN': 'Right index - Proximal phalanx',
                'RIIM': 'Right index - Intermediate phalanx',
                'RIDI': 'Right index - Distal phalanx',
                'RITP': 'Right index - Tip',
                'RMMC': 'Right middle - Metacarpal',
                'RMPX': 'Right middle - Proximal phalanx',
                'RMIM': 'Right middle - Intermediate phalanx',
                'RMDI': 'Right middle - Distal phalanx',
                'RMTP': 'Right middle - Tip',
                'RRMC': 'Right ring - Metacarpal',
                'RRPX': 'Right ring - Proximal phalanx',
                'RRIM': 'Right ring - Intermediate phalanx',
                'RRDI': 'Right ring - Distal phalanx',
                'RRTP': 'Right ring - Tip',
                'RLMC': 'Right pinky - Metacarpal',
                'RLPX': 'Right pinky - Proximal phalanx',
                'RLIM': 'Right pinky - Intermediate phalanx',
                'RLDI': 'Right pinky - Distal phalanx',
                'RLTP': 'Right pinky - Tip',
                'LTMC': 'Left thumb - Metacarpal',
                'LTPX': 'Left thumb - Proximal phalanx',
                'LTDI': 'Left thumb - Distal phalanx',
                'LTTP': 'Left thumb - Tip',
                'LIMC': 'Left index - Metacarpal',
                'LFIN': 'Left index - Proximal phalanx',
                'LIIM': 'Left index - Intermediate phalanx',
                'LIDI': 'Left index - Distal phalanx',
                'LITP': 'Left index - Tip',
                'LMMC': 'Left middle - Metacarpal',
                'LMPX': 'Left middle - Proximal phalanx',
                'LMIM': 'Left middle - Intermediate phalanx',
                'LMDI': 'Left middle - Distal phalanx',
                'LMTP': 'Left middle - Tip',
                'LRMC': 'Left ring - Metacarpal',
                'LRPX': 'Left ring - Proximal phalanx',
                'LRIM': 'Left ring - Intermediate phalanx',
                'LRDI': 'Left ring - Distal phalanx',
                'LRTP': 'Left ring - Tip',
                'LLMC': 'Left pinky - Metacarpal',
                'LLPX': 'Left pinky - Proximal phalanx',
                'LLIM': 'Left pinky - Intermediate phalanx',
                'LLDI': 'Left pinky - Distal phalanx',
                'LLTP': 'Left pinky - Tip'
        }
    },
    fr: {
        app: {
            title: "CHLOE : Assistant Clinique pour l'Évaluation Objective de la Locomotion",
            select_file: "Sélectionner un fichier .c3d",
            processing: "Traitement du fichier C3D...",
            success: "Fichier traité ! {{frames}} trames @ {{fps}}Hz",
            success_analog_only: "Fichier traité ! Aucune trame trouvée, mais des données analogiques sont disponibles.",
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
            title: "Trajectoires",
            active: "Trajectoires Actives",
            no_active: "Aucune trajectoire active. Vous pouvez activer des trajectoires depuis le panneau des marqueurs.",
            clear_all: "Effacer toutes les trajectoires",
            range_title: "Plage d'affichage",
            range_frame: "Frame", 
            remove: "Supprimer la trajectoire",
            hide: "Masquer la trajectoire",
            show: "Afficher la trajectoire"
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
            potencia: "Puissance",
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
            trajectories: "📐 Trajectoires",
            analog: "📊 Données Analog",
            metadata: "📈 Métadonnées",
            view_avatar: "👤 Voir Avatar",
            view_lines: "🕸 Voir le squelette",
            vectors: "📏 Vecteurs",
            reset_view: "🔄 Réinitialiser la vue"
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
        }, 
        vectors: {
            title: "Vecteurs",
            add: "Créer un Vecteur",
            remove: "Supprimer le Vecteur",
            select_start: "Sélectionner le marqueur de départ",
            select_end: "Sélectionner le marqueur de fin",
            axis_seconds: "Secondes",
            axis_degrees: "Degrés (°)"  
        },
        anatomical_names: {
            'C7': 'C7 vertèbre',
            'T10': 'T10 vertèbre',
            'CLAV': 'Clavicule',
            'STRN': 'Sternum',
            'SACR': 'Sacrum',
            'LASI': 'Épine iliaque antéro-supérieure gauche',
            'RASI': 'Épine iliaque antéro-supérieure droite',
            'LPSI': 'Épine iliaque postéro-supérieure gauche',
            'RPSI': 'Épine iliaque postéro-supérieure droite',
            'RSHO': 'Épaule droite',
            'RUPA': 'Bras supérieur droit',
            'RELB': 'Coude droit',
            'RFRM': 'Avant-bras droit',
            'RWRA': 'Poignet droit (styloïde radiale)',
            'RWRB': 'Poignet droit (styloïde ulnaire)',
            'RWRT': 'Poignet droit (point médian)',
            'LSHO': 'Épaule gauche',
            'LUPA': 'Bras supérieur gauche',
            'LELB': 'Coude gauche',
            'LFRM': 'Avant-bras gauche',
            'LWRA': 'Poignet gauche (styloïde radiale)',
            'LWRB': 'Poignet gauche (styloïde ulnaire)',
            'LWRT': 'Poignet gauche (point médian)',
            'RTHI': 'Cuisse droite',
            'RKNE': 'Genou droit',
            'RSHN': 'Tibia droit',
            'RANK': 'Cheville droite',
            'RHEE': 'Talon droit',
            'RTOE': 'Orteil droit (tête du 1er métatarsien)',
            'RMT5': 'Orteil droit (tête du 5ème métatarsien)',
            'LTHI': 'Cuisse gauche',
            'LKNE': 'Genou gauche',
            'LSHN': 'Tibia gauche',
            'LANK': 'Cheville gauche',
            'LHEE': 'Talon gauche',
            'LTOE': 'Orteil gauche (tête du 1er métatarsien)',
            'LMT5': 'Orteil gauche (tête du 5ème métatarsien)',
            'RBHD': 'Arrière du crâne droit',
            'LBHD': 'Arrière du crâne gauche',
            'LFHD': 'Avant du crâne gauche',
            'RFHD': 'Avant du crâne droit',
            'HEAD': 'Tête',
            'RPLM': 'Paume droite',
            'LPLM': 'Paume gauche',
            'RTMC': 'Pouce droit - Métacarpien',
            'RTPX': 'Pouce droit - Phalange proximale',
            'RTDI': 'Pouce droit - Phalange distale',
            'RTTP': 'Pouce droit - Bout',
            'RIMC': 'Index droit - Métacarpien',
            'RFIN': 'Index droit - Phalange proximale',
            'RIIM': 'Index droit - Phalange intermédiaire',
            'RIDI': 'Index droit - Phalange distale',
            'RITP': 'Index droit - Bout',
            'RMMC': 'Majeur droit - Métacarpien',
            'RMPX': 'Majeur droit - Phalange proximale',
            'RMIM': 'Majeur droit - Phalange intermédiaire',
            'RMDI': 'Majeur droit - Phalange distale',
            'RMTP': 'Majeur droit - Bout',
            'RRMC': 'Annulaire droit - Métacarpien',
            'RRPX': 'Annulaire droit - Phalange proximale',
            'RRIM': 'Annulaire droit - Phalange intermédiaire',
            'RRDI': 'Annulaire droit - Phalange distale',
            'RRTP': 'Annulaire droit - Bout',
            'RLMC': 'Auriculaire droit - Métacarpien',
            'RLPX': 'Auriculaire droit - Phalange proximale',
            'RLIM': 'Auriculaire droit - Phalange intermédiaire',
            'RLDI': 'Auriculaire droit - Phalange distale',
            'RLTP': 'Auriculaire droit - Bout',
            'LTMC': 'Pouce gauche - Métacarpien',
            'LTPX': 'Pouce gauche - Phalange proximale',
            'LTDI': 'Pouce gauche - Phalange distale',
            'LTTP': 'Pouce gauche - Bout',
            'LIMC': 'Index gauche - Métacarpien',
            'LFIN': 'Index gauche - Phalange proximale',
            'LIIM': 'Index gauche - Phalange intermédiaire',
            'LIDI': 'Index gauche - Phalange distale',
            'LITP': 'Index gauche - Bout',
            'LMMC': 'Majeur gauche - Métacarpien',
            'LMPX': 'Majeur gauche - Phalange proximale',
            'LMIM': 'Majeur gauche - Phalange intermédiaire',
            'LMDI': 'Majeur gauche - Phalange distale',
            'LMTP': 'Majeur gauche - Bout',
            'LRMC': 'Annulaire gauche - Métacarpien',
            'LRPX': 'Annulaire gauche - Phalange proximale',
            'LRIM': 'Annulaire gauche - Phalange intermédiaire',
            'LRDI': 'Annulaire gauche - Phalange distale',
            'LRTP': 'Annulaire gauche - Bout',
            'LLMC': 'Auriculaire gauche - Métacarpien',
            'LLPX': 'Auriculaire gauche - Phalange proximale',
            'LLIM': 'Auriculaire gauche - Phalange intermédiaire',
            'LLDI': 'Auriculaire gauche - Phalange distale',
            'LLTP': 'Auriculaire gauche - Bout'
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

/**
 * Retrieves the anatomical name of a marker in the current language.
 * If the marker is not found, returns the marker label (PiG abbreviation).
 * @param {string} markerLabel - The PiG marker label (e.g., 'LASI', 'C7').
 * @returns {string} The anatomical name or the marker label if not found.
 */
export function getMarkerAnatomicalName(markerLabel) {
    const anatomicalNames = TRANSLATIONS[currentLang]?.anatomical_names;
    if (!anatomicalNames) {
        console.warn(`No anatomical names found for language: ${currentLang}`);
        return markerLabel;
    }
    return anatomicalNames[markerLabel] || markerLabel;
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