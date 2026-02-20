"""
PROJECT: CHLOE - Clinical Helper for Locomotion Objective Evaluation
AUTHOR: Belén Gómez Martínez
THESIS: Bachelor's Thesis (TFG) - [Grado en Ingeniería Biomédica, ETSIT, UPM]
DESCRIPTION: Backend engine for C3D parsing and biomechanical data standardization
REFERENCES: Chapter 3 (Requirements), Chapter 4 (Design & Implementation)
"""

import ezc3d
import math
import numpy as np


# ======================================================================
# 1. STANDARDIZATION MAPS
# ======================================================================

# [Traceability: FR3 - Multi-Manufacturer C3D Support]
STANDARD_MAP = {
    "C7": "C7", "C7_SPINE": "C7",
    "T10": "T10", "T10_SPINE": "T10",
    "CLAV": "CLAV", "CLAVICLE": "CLAV",
    "STRN": "STRN", "STERNUM": "STRN",

    "LASI":"LASI", "LFWT": "LASI", "LAntInfIliacSpine": "LASI", "L_ASIS": "LASI",
    "RASI":"RASI", "RFWT": "RASI", "RAntInfIliacSpine": "RASI", "R_ASIS": "RASI",
    "LPSI":"LPSI", "LBWT": "LPSI", "LPostInfIliacSpine": "LPSI",
    "RPSI":"RPSI", "RBWT": "RPSI", "RPostInfIliacSpine": "RPSI",
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

    "LTHI": "LTHI", "L_THIGH": "LTHI",
    "LKNE": "LKNE", "L_KNEE": "LKNE",
    "LSHN": "LSHN", "L_SHIN": "LSHN", "LTIB": "LSHN",
    "LANK": "LANK", "L_ANKLE": "LANK",
    "LHEE": "LHEE", "L_HEEL": "LHEE",
    "LTOE": "LTOE", "L_TOE": "LTOE",
    "LMT5": "LMT5", "L_FOOT": "LMT5",

    "RTHI": "RTHI", "R_THIGH": "RTHI",
    "RKNE": "RKNE", "R_KNEE": "RKNE",
    "RSHN": "RSHN", "R_SHIN": "RSHN", "RTIB": "RSHN",
    "RANK": "RANK", "R_ANKLE": "RANK",
    "RHEE": "RHEE", "R_HEEL": "RHEE",
    "RTOE": "RTOE", "R_TOE": "RTOE",
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
    'desconocido': {'keywords': [], 'color': 0x888888}
}

# ======================================================================
# 2. BIOMECHANICAL PROCESSING UTILITIES
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
    Automatic unit detection (Meters vs. Millimeters).
    If values exceed 50 units, it assumes mm and applies a 10^{-3} scaling factor.
    Input: c3d_data (dict) - parsed C3D data structure
    Output: float - scale factor to convert coordinates to meters
    """
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
        rate = safe_float(raw_rate, 1000.0)
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
        output['duration_seconds'] = safe_float(n_samples / rate)
        return output
    except Exception as e:
        print(f"Error analog: {e}")
        return None

# ======================================================================
# 3. PROCESSING PIPELINE
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
        if "MIPS processor tipo not supported" in str(e):
            return {"error_tipo": "ARCH_UNSUPPORTED", "message": "Formato SGI/MIPS (Big Endian) no soportado actualmente."}
        raise e 

    # Standard Compliance: Fixes software-specific violations (e.g., Float 'FRAMES').
    except ValueError as e:
        if "is not an INT" in str(e) or "FRAMES" in str(e):
            return {"error_tipo": "STANDARD_VIOLATION", "message": "El archivo viola el estándar C3D (Parámetro FRAMES es Float, se espera Int)."}
        raise e

    except Exception as e:
        return {"error_tipo": "READ_ERROR", "message": f"No se pudo leer el archivo C3D: {str(e)}"}

    try:
        point_params = c3d['parameters'].get('POINT', {})
        
        # Extracts Point Sample Rate and ensures a valid numeric FPS for time calculations.
        raw_fps = point_params.get('RATE', {}).get('value', [100])
        if isinstance(raw_fps, list): raw_fps = raw_fps[0]
        fps = safe_float(raw_fps, 100.0)
        if fps <= 0: fps = 100.0

        scale_factor = scalar(c3d)
        labels = point_params.get('LABELS', {}).get('value', [])
        data = c3d['data']['points']
        
        n_markers = data.shape[1]
        n_frames = data.shape[2]
        dims = data.shape[0] 

        frames = []
        
        for f in range(n_frames):
            frame_data = {}
            has_data = False
            for i, label in enumerate(labels):
                if i >= n_markers: break
                
                # Standardizes label names by removing manufacturer prefixes (e.g., 'Vicon:' or 'Subject1:')
                try: name_clean = label.split(':')[-1] 
                except: name_clean = f"M{i}" # Fallback to generic naming if label is malformed (M0, M1, etc.)
                name_standarized = STANDARD_MAP.get(name_clean, name_clean)
                
                # handles cases where points data has 4 or more dimensions (e.g., residuals/confidence) by only processing the first 3 as coordinates
                if dims >= 3:
                    coords = [data[0, i, f], data[1, i, f], data[2, i, f]]
                    clean = clean_marker_data(coords, scale_factor)
                    if clean:
                        frame_data[name_standarized] = clean
                        has_data = True
            if has_data: frames.append(frame_data)

        duration = safe_float(n_frames / fps)
        analog = extract_analog_data(c3d)
        
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
