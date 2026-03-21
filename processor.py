"""
PROJECT: CHLOE - Clinical Helper for Locomotion Objective Evaluation
AUTHOR: Belén Gómez Martínez
THESIS: Bachelor's Thesis (TFG) - [Grado en Ingeniería Biomédica, ETSIT, UPM]
DESCRIPTION: Core biomechanical engine for C3D binary parsing, automatic unit scaling, and marker-to-analog data standardization.
REFERENCES: Chapter 3 (Requirements), Chapter 4 (Design & Implementation)
"""

import ezc3d
import math
import numpy as np

# ======================================================================
# STANDARDIZATION MAPS
# ======================================================================

# [Traceability: FR3 - Multi-Manufacturer C3D Support]
STANDARD_MAP = {
    "C7": "C7", "C7_SPINE": "C7",
    "T10": "T10", "T10_SPINE": "T10",
    "CLAV": "CLAV", "CLAVICLE": "CLAV",
    "STRN": "STRN", "STERNUM": "STRN", 

    "LASI":"LASI", "LFWT": "LASI", "LAntInfIliacSpine": "LASI", "L_ASIS": "LASI", "L.ASIS": "LASI",
    "RASI":"RASI", "RFWT": "RASI", "RAntInfIliacSpine": "RASI", "R_ASIS": "RASI", "R.ASIS": "RASI",
    "LPSI":"LPSI", "LBWT": "LPSI", "LPostInfIliacSpine": "LPSI", "L_PSI": "LPSI", "L.PSIS": "LPSI",
    "RPSI":"RPSI", "RBWT": "RPSI", "RPostInfIliacSpine": "RPSI", "R_PSI": "RPSI", "R.PSIS": "RPSI",
    "SACR": "SACR", "SACRAL": "SACR", "VSAC": "SACR",

    "LSHO": "LSHO", "L_SHOULDER": "LSHO",
    "LUPA": "LUPA", "L_UPPER_ARM": "LUPA",
    "LELB": "LELB", "L_ELBOW": "LELB",
    "LFRM": "LFRM", "L_FOREARM": "LFRM",
    "LWRB": "LWRB", "LWRA": "LWRA", 
    "L_WRIST": "LWRT","LWRIST": "LWRT","LWRT":"LWRT", "LWRI": "LWRT",

    "RSHO": "RSHO", "R_SHOULDER": "RSHO",
    "RUPA": "RUPA", "R_UPPER_ARM": "RUPA",
    "RELB": "RELB", "R_ELBOW": "RELB",
    "RFRM": "RFRM", "R_FOREARM": "RFRM",
    "RWRB": "RWRB", "RWRA": "RWRA", 
    "R_WRIST": "RWRT","RWRIST": "RWRT","RWRT":"RWRT", "RWRI": "RWRT",

    "LTHI": "LTHI", "L_THIGH": "LTHI", "L.Ant.Fem.": "LTHI", 
    "LKNE": "LKNE", "L_KNEE": "LKNE", "LLFC": "LKNE", "L.Knee": "LKNE",
    "LSHN": "LSHN", "L_SHIN": "LSHN", "LTIB": "LSHN", "LSHA": "LSHN", "LTTB": "LSHN", "L.Ant.Tib.": "LSHN",
    "LANK": "LANK", "L_ANKLE": "LANK", "LLMA":"LANK", "L.Ankle": "LANK",
    "LHEE": "LHEE", "L_HEEL": "LHEE", "LCAL":"LHEE", "L.Heel": "LHEE",
    "LTOE": "LTOE", "L_TOE": "LTOE", "L.TO": "LTOE", "L.Toe": "LTOE",
    "LMT5": "LMT5", "L_FOOT": "LMT5", 

    "RTHI": "RTHI", "R_THIGH": "RTHI", "R.Ant.Fem.": "RTHI",
    "RKNE": "RKNE", "R_KNEE": "RKNE", "RLFC": "RKNE", "R.Knee": "RKNE",
    "RSHN": "RSHN", "R_SHIN": "RSHN", "RTIB": "RSHN", "RSHA": "RSHN", "RTTB": "RSHN", "R.Ant.Tib.": "RSHN",
    "RANK": "RANK", "R_ANKLE": "RANK", "RLMA":"RANK", "R.Ankle": "RANK",
    "RHEE": "RHEE", "R_HEEL": "RHEE", "RCAL":"RHEE", "R.Heel": "RHEE",
    "RTOE": "RTOE", "R_TOE": "RTOE", "R.TO": "RTOE", "R.Toe": "RTOE",
    "RMT5": "RMT5", "R_FOOT": "RMT5",
    
    "RBHD": "RBHD", "R_BACK_HEAD": "RBHD",
    "LBHD": "LBHD", "L_BACK_HEAD": "LBHD",
    "LFHD": "LFHD", "L_FRONT_HEAD": "LFHD",
    "RFHD": "RFHD", "R_FRONT_HEAD": "RFHD",
    "HEAD": "HEAD",

    "RTHUMB_METACARPAL": "RTMC", "RTMC": "RTMC",
    "RTHUMB_PROXIMAL": "RTPX", "RTPX": "RTPX",
    "RTHUMB_DISTAL": "RTDI", "RTDI": "RTDI",
    "RTHUMB_TIP": "RTTP", "RTTP": "RTTP",
    "RINDEX_METACARPAL": "RIMC", "RIMC": "RIMC",
    "RINDEX_PROXIMAL": "RFIN", "RFIN": "RFIN",
    "RINDEX_INTERMEDIATE": "RIIM", "RIIM": "RIIM",
    "RINDEX_DISTAL": "RIDI", "RIDI": "RIDI",
    "RINDEX_TIP": "RITP", "RITP": "RITP",
    "RMIDDLE_METACARPAL": "RMMC", "RMMC": "RMMC",
    "RMIDDLE_PROXIMAL": "RMPX", "RMPX": "RMPX",
    "RMIDDLE_INTERMEDIATE": "RMIM", "RMIM": "RMIM",
    "RMIDDLE_DISTAL": "RMDI", "RMDI": "RMDI",
    "RMIDDLE_TIP": "RMTP", "RMTP": "RMTP",
    "RRING_METACARPAL": "RRMC", "RRMC": "RRMC",
    "RRING_PROXIMAL": "RRPX", "RRPX": "RRPX",
    "RRING_INTERMEDIATE": "RRIM", "RRIM": "RRIM",
    "RRING_DISTAL": "RRDI", "RRDI": "RRDI",
    "RRING_TIP": "RRTP", "RRTP": "RRTP",
    "RLITTLE_METACARPAL": "RLMC", "RLMC": "RLMC",
    "RLITTLE_PROXIMAL": "RLPX","RLPX": "RLPX",
    "RLITTLE_INTERMEDIATE": "RLIM", "RLIM": "RLIM",
    "RLITTLE_DISTAL": "RLDI", "RLDI": "RLDI",
    "RLITTLE_TIP": "RLTP", "RLTP": "RLTP",
    "RPALM": "RPLM", "RPLM": "RPLM",

    "LTHUMB_METACARPAL": "LTMC", "LTMC": "LTMC",
    "LTHUMB_PROXIMAL": "LTPX", "LTPX": "LTPX",
    "LTHUMB_DISTAL": "LTDI", "LTDI": "LTDI",
    "LTHUMB_TIP": "LTTP", "LTTP": "LTTP",
    "LINDEX_METACARPAL": "LIMC", "LIMC": "LIMC",
    "LINDEX_PLOXIMAL": "LFIN", "LFIN": "LFIN",
    "LINDEX_INTERMEDIATE": "LIIM", "LIIM": "LIIM",
    "LINDEX_DISTAL": "LIDI", "LIDI": "LIDI",
    "LINDEX_TIP": "LITP", "LITP": "LITP",
    "LMIDDLE_METACARPAL": "LMMC", "LMMC": "LMMC",
    "LMIDDLE_PROXIMAL": "LMPX", "LMPX": "LMPX",
    "LMIDDLE_INTERMEDIATE": "LMIM", "LMIM": "LMIM",
    "LMIDDLE_DISTAL": "LMDI", "LMDI": "LMDI",
    "LMIDDLE_TIP": "LMTP", "LMTP": "LMTP",
    "LRING_METACARPAL": "LRMC", "LRMC": "LRMC",
    "LRING_PROXIMAL": "LRPX", "LRPX": "LRPX",
    "LRING_INTERMEDIATE": "LRIM", "LRIM": "LRIM",
    "LRING_DISTAL": "LRDI", "LRDI": "LRDI",
    "LRING_TIP": "LRTP", "LRTP": "LRTP",
    "LLITTLE_METACARPAL": "LLMC", "LLMC": "LLMC",
    "LLITTLE_PROXIMAL": "LLPX","LLPX": "LLPX",
    "LLITTLE_INTERMEDIATE": "LLIM", "LLIM": "LLIM",
    "LLITTLE_DISTAL": "LLDI", "LLDI": "LLDI",
    "LLITTLE_TIP": "LLTP", "LLTP": "LLTP",
    "LPALM": "LPLM", "LPLM": "LPLM"
}

STANDARD_ANALOG_MAP = {
    'emg': {'keywords': ['EMG', 'MUSCLE'], 'color': 0xff6b6b},
    'fuerza': {'keywords': ['FZ', 'FX', 'FY', 'FORCE', 'GRF'], 'color': 0xfd9644},
    'momento': {'keywords': ['MZ', 'MX', 'MY', 'MOMENT'], 'color': 0x45aaf2},
    'acelerometro': {'keywords': ['ACC', 'ACCEL'], 'color': 0x26de81},
    'giroscopio': {'keywords': ['GYRO'], 'color': 0xa55eea},
    'angulo': {'keywords': ['ANGLE', 'ANG'], 'color': 0xf7b731}, 
    'potencia': {'keywords': ['POWER'], 'color': 0x32a6a8},
    'desconocido': {'keywords': [], 'color': 0x888888}
}

ANALOG_MARKERS = {
    'fuerza' : ['LAnkleForce', 'RAnkleForce', 'LKneeForce', 'RKneeForce', 'LHipForce', 'RHipForce', 'Force', 'ForceX', 'ForceY', 'ForceZ'],
    'momento' : ['LAnkleMoment', 'RAnkleMoment', 'LKneeMoment', 'RKneeMoment', 'LHipMoment', 'RHipMoment', 'Moment', 'MomentX', 'MomentY', 'MomentZ'],
    'potencia' : ['LAnklePower', 'RAnklePower', 'LKneePower', 'RKneePower', 'LHipPower', 'RHipPower', 'Power'],
    'angulo': ['LAnkleAngles', 'LAbsAnkleAngle','RAnkleAngles','RAbsAnkleAngle', 'LKneeAngles', 'RKneeAngles', 'LHipAngles', 'RHipAngles', 'LFootProgressAngles', 'RFootProgressAngles', 'LPelvisAngles', 'RPelvisAngles', 'LHeadAngles', 'RHeadAngles', 'LThoraxAngles', 'RThoraxAngles', 'LNeckAngles', 'RNeckAngles', 'LSpineAngles', 'RSpineAngles', 'LShoulderAngles', 'RShoulderAngles', 'LElbowAngles', 'RElbowAngles', 'LWristAngles', 'RWristAngles', 'Angles']
}


# ======================================================================
# BIOMECHANICAL PROCESSING UTILITIES
# ======================================================================

def safe_float(val, default=0.0):
    """
    Ensures data integrity during JSON serialization by handling NaN/Inf values.
    [Traceability: NFR3 - Robustness against missing data]
    Input: val (any), default (float) - value to return if val is invalid
    Output: float (valid numeric value or default)
    """
    try:
        if val is None: return default
        if hasattr(val, 'item'): val = val.item()
        f_val = float(val)
        if math.isnan(f_val) or math.isinf(f_val): return default
        return f_val
    except:
        return default

def scalar(c3d_data):
    """
    Tries to determine the correct scale factor for marker coordinates by checking the 'UNITS' parameter.
    As fallback, it performs automatic unit detection (Meters vs. Millimeters).
    If values exceed 50 units, it assumes mm and applies a 10^{-3} scaling factor.
    Input: c3d_data (dict) - parsed C3D data structure
    Output: float - scale factor to convert coordinates to meters
    """
    params = c3d_data['parameters'].get('POINT', {})
    try:
        units_list = params.get('UNITS', {}).get('value', [])
        if units_list and len(units_list) > 0:
            u = str(units_list[0]).lower().strip() 
            if 'mm'==u or 'millimeter'==u or 'millimeters'==u or 'mm' in u: return 0.001
            if 'cm'==u or 'centimeter'==u or 'centimeters'==u or 'cm' in u: return 0.01
            if 'm'==u or 'meter'==u or 'meters'==u or 'm' in u: return 1.0
    except:
        print("There is no UNITS parameter available, proceeding with auto-detection based on coordinate values.")
    try:
        points = c3d_data['data']['points']
        n_frames = points.shape[2]
        frames_to_check = min(n_frames, 10)
        max_coord_val = 0
        for f in range(frames_to_check):
            try:
                frame_coords = points[0:3, :, f]
                if np.all(np.isnan(frame_coords)): continue
                local_max = np.nanmax(np.abs(frame_coords))
                if local_max > max_coord_val: max_coord_val = local_max
            except: continue
        if max_coord_val > 50.0: return 0.001 
        return 1.0 
    except: return 0.001
    

def classify_analog(canal):
    """
    Heuristic classification of analog channels based on clinical naming conventions.
    This function implements a keyword-matching scoring system to categorize raw 
    signals into clinical groups (EMG, Force, etc.) for automated UI styling.
    Input: canal (str) - The raw channel label from metadata.
    Output: dict - A dictionary with the identified 'tipo' and its UI 'color'.
    """
    upper_name = canal.upper().strip()
    best_tipo, best_score = 'desconocido', 0
    for tipo, info in STANDARD_ANALOG_MAP.items():
        puntaje = 0
        for k in info['keywords']:
            if k in upper_name: puntaje += 1
        if puntaje > best_score:
            best_score = puntaje
            best_tipo = tipo
   
    return {'tipo': best_tipo, 'color': STANDARD_ANALOG_MAP[best_tipo]['color']}

def clean_marker_data(marker_coords, scale_factor):
    """
    Converts Laboratory (Z-up) to Three.js (Y-up): [X, Y, Z] --> [X, Z, -Y]
    Input: 
        marker_coords (list): Raw $[X, Y, Z]$ coordinates.
        scale_factor (float): The unit multiplier from the scalar() function.
    Output: list - Transformed and scaled coordinates, or an empty list if data is missing.
    """
    x, y, z = marker_coords
    sf = safe_float(scale_factor, 1.0)
    if np.isnan(x) or np.isnan(y) or np.isnan(z): return []
    coords = [x * sf, z * sf, -y * sf]
    return [None if (math.isnan(c) or math.isinf(c)) else float(c) for c in coords]

def extract_analog_data(c3d):
    """
    Extracts, classifies, and sanitizes analog channels with active signals.
    [Traceability: FR1 - C3D Data Ingestion]

    Parses analog data blocks, handles sampling rate inconsistencies, and 
    prepares the temporal buffers for the Plotly analytics dashboard.

    Input: c3d (ezc3d) - The loaded C3D binary object.
    Output: dict - Structured analog data grouped by classified clinical tipo.
    """
    try:
        # Check for dynamic ezc3d structure compatibility (some versions use 'analogs' while others use 'analog')
        if 'analogs' in c3d['data']: analog_data = c3d['data']['analogs']
        elif 'analog' in c3d['data']: analog_data = c3d['data']['analog']
        else: return None
        
        labels = c3d['parameters'].get('ANALOG', {}).get('LABELS', {}).get('value', [])
        raw_rate = c3d['parameters'].get('ANALOG', {}).get('RATE', {}).get('value', [1000])
        if isinstance(raw_rate, list): raw_rate = raw_rate[0]
        rate = round(safe_float(raw_rate, 1000.0),2)
        if rate <= 0: rate = 1000.0

        if len(analog_data.shape) == 3: 
            print(f"LOG extract_analog_data - Tamaño primera dimensión: {analog_data.shape[0]}")
            analog_data = analog_data[0, :, :]
        n_channels = analog_data.shape[0]
        n_samples = analog_data.shape[1]

        if len(labels) < n_channels: labels += [f"CH{i}" for i in range(len(labels), n_channels)]
            
        output = {'channels': {}, 'classification': {}, 'sample_rate_hz': rate, 'tipos_disponibles': list(STANDARD_ANALOG_MAP.keys())}
        active_count = 0
        
        for i, label in enumerate(labels[:n_channels]):
            data = analog_data[i, :]
            # Skip empty or flatlined channels to optimize JSON payload size
            if np.all(data == 0.0) or np.all(np.isnan(data)): continue
            label_clean = label.strip()
            active_count += 1
            clas = classify_analog(label_clean)
            # Sanitize values for JSON standards (NaN/Inf --> null) to prevent serialization errors in the frontend.
            clean_values = [None if (np.isnan(v) or np.isinf(v)) else float(v) for v in data]
            output['channels'][label_clean] = clean_values
            output['classification'][label_clean] = {'tipo': clas['tipo'], 'color': clas['color'], 'index': i}
        
        if active_count == 0: return None
        output['active_channels'] = active_count
        output['total_channels'] = n_channels
        output['total_samples'] = n_samples
        output['duration_seconds'] = round(safe_float(n_samples / rate), 2)
        return output
    except Exception as e:
        print(f"Error analog: {e}")
        return None

# ======================================================================
# PROCESSING PIPELINE
# ======================================================================

def process_c3d_file(c3d_file_path):
    """
    Main C3D Parsing Orchestrator. 
    Includes critical robustness checks for non-standard clinical files.
    [Traceability: FR1 - C3D Data Ingestion, FR3 - Multi-Manufacturer C3D Support, FR8 - Metadata Extraction]
    Input: c3d_file_path (str)
    Output: dict - A structured dictionary containing a 'success' flag, the processed frame buffer, metadata (FPS, duration), and classified analog datasets.
    """
    try:
        c3d = ezc3d.c3d(c3d_file_path, extract_forceplat_data=False)

    # Architecture Robustness: Prevents crashes from Big-Endian (SGI/MIPS) files.
    except RuntimeError as e:
        if "MIPS processor type not supported" in str(e):
            return {"error_tipo": "ARCH_UNSUPPORTED", "message": "Formato SGI/MIPS (Big Endian) no soportado actualmente."}
        raise e 

    # Standard Compliance: Fixes software-specific violations (e.g., Float 'FRAMES').
    except ValueError as e:
        if "is not an INT" in str(e) or "FRAMES" in str(e):
            return {"error_tipo": "STANDARD_VIOLATION", "message": "El archivo viola el estándar C3D (Parámetro FRAMES es Float, se espera Int)."}
        raise e 
    except TypeError as e:
        if not c3d['parameters']:
            return {"error_tipo": "READ_ERROR", "message": "Archivo C3D leído pero sin parámetros disponibles, posiblemente corrupto o no estándar."}       
        raise e      
    except Exception as e:
        return {"error_tipo": "READ_ERROR", "message": f"No se pudo leer el archivo C3D: {str(e)}"}

    try:
        point_params = c3d['parameters'].get('POINT', {})
        
        # Extracts Point Sample Rate and ensures a valid numeric FPS for time calculations.
        raw_fps = point_params.get('RATE', {}).get('value', [100])
        if isinstance(raw_fps, list): raw_fps = raw_fps[0]
        fps = round(safe_float(raw_fps, 100.0), 2)
        if fps <= 0: fps = 100.0

        scale_factor = scalar(c3d)
        
        labels = point_params.get('LABELS', {}).get('value', [])
        # Some c3d files (e.g. Sample12 from c3d.org) have more than one set of labels (LABELS2) that may contain additional markers.
        if 'LABELS2' in point_params:
            labels2 = point_params.get('LABELS2', {}).get('value', [])
            labels.extend(labels2)

        data = c3d['data']['points']

        n_markers = data.shape[1]
        n_frames = data.shape[2]
        dims = data.shape[0] 

        frames = []

        extra_analog_from_points = {}
        nombres_analogicos_objetivo = []
        for lista in ANALOG_MARKERS.values():
            nombres_analogicos_objetivo.extend([n.upper() for n in lista])

        indices_analogicos = []
        for i, label in enumerate(labels):
            name_clean = label.split(':')[-1].strip().upper()
            if any(patron in name_clean for patron in nombres_analogicos_objetivo):
                indices_analogicos.append(i)
                extra_analog_from_points[label.split(':')[-1].strip()] = []
        
        for f in range(n_frames):
            frame_data = {}
            has_data = False
            for i, label in enumerate(labels):
                if i >= n_markers: break
                
                # Standardizes label names by removing manufacturer prefixes (e.g., 'Vicon:' or 'Subject1:')
                name_clean = label.split(':')[-1].strip() 
                
                if i in indices_analogicos:
                    val = data[0, i, f] 
                    extra_analog_from_points[name_clean].append(safe_float(val))
                    continue

                name_standarized = STANDARD_MAP.get(name_clean, name_clean)

                # handles cases where points data has 4 or more dimensions (e.g., residuals/confidence) by only processing the first 3 as coordinates
                if dims >= 3:
                    coords = [data[0, i, f], data[1, i, f], data[2, i, f]]
                    clean = clean_marker_data(coords, scale_factor)
                    if clean:
                        frame_data[name_standarized] = clean
                        has_data = True
            if has_data: frames.append(frame_data)

        duration = round(safe_float(n_frames / fps), 2)
        analog = extract_analog_data(c3d)

        count = 0
        if extra_analog_from_points:
            if analog is None:
                analog = {
                    'channels': {},  
                    'classification': {}, 
                    'sample_rate_hz': fps, 
                    'tipos_disponibles': list(STANDARD_ANALOG_MAP.keys())
                }
            for l_extra, values in extra_analog_from_points.items():
                if np.all(values == 0.0) or np.all(np.isnan(data)): continue
                count += 1
                analog['channels'][l_extra] = values
                clas = classify_analog(l_extra)
                analog['classification'][l_extra] = {'tipo': clas['tipo'], 'color': clas['color'], 'index': count}
                analog['total_channels'] = analog.get('total_channels', 0) + 1
                analog['total_samples'] = len(values)
            analog['has_analog_data'] = True
            analog['active_channels'] = analog.get('active_channels', 0) + count
        
        return {
            "success": True, 
            "frames": frames,
            "original_fps": fps,
            "duration_seconds": duration,
            "total_frames": n_frames,
            "has_analog_data": analog is not None,
            "analog_data": analog
        }

    except Exception as e:
        print(f"ERROR PROCESANDO DATOS: {e}")
        import traceback
        traceback.print_exc()
        return {"error_tipo": "PROCESSING_ERROR", "message": "Error interno procesando los datos del C3D."}
