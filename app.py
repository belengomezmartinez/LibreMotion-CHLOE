"""
PROJECT: CHLOE - Clinical Helper for Locomotion Objective Evaluation
AUTHOR: Belén Gómez Martínez
THESIS: Bachelor's Thesis (TFG) - [Grado en Ingeniería Biomédica, ETSIT, UPM]
DESCRIPTION: Backend engine for C3D parsing and biomechanical data standardization
REFERENCES: Chapter 3 (Requirements), Chapter 4 (Design & Implementation)
"""

from flask import Flask, request, jsonify, send_from_directory
import tempfile
from processor import process_c3d_file
from dotenv import load_dotenv
import os

load_dotenv() # Load environment variables from .env file 

app = Flask(__name__, static_folder='dist', 
            static_url_path='') # Serve static files from the 'dist' directory (built frontend)


# ======================================================================
# FLASK ENDPOINTS
# ======================================================================

@app.route('/upload_c3d', methods=['POST'])
def handle_c3d_upload():
    '''
    REST API endpoint for the secure ingestion and temporal storage of C3D files.
    [Traceability: FR1 - C3D Data Ingestion, NFR3 - Robustness against missing data]
    '''
    if 'c3d_file' not in request.files: return jsonify({"error": "No file"}), 400
    file = request.files['c3d_file']
    if not file.filename.lower().endswith('.c3d'): return jsonify({"error": "Not C3D"}), 400

    with tempfile.NamedTemporaryFile(delete=True, suffix='.c3d') as tmp:
        file.save(tmp.name)
        print(f"Procesando: {file.filename}")
        
        result = process_c3d_file(tmp.name)
    
        if "error_tipo" in result:
            print(f"Error controlado: {result['message']}")
            return jsonify({"error": result['message'], "tipo": result['error_tipo']}), 422
        
        if result.get("success"):
            try:
                return jsonify(result)
            except ValueError:
                return jsonify({"error": "Error numérico (NaN) en el archivo procesado"}), 500
        
    return jsonify({"error": "Error desconocido procesando el archivo"}), 500

@app.route('/')
def serve_index(): return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # NOTE: When running the full project (CHLOE), this block is ignored 
    # as Docker uses the command defined in the Dockerfile:
    # ENV FLASK_PORT=8080
    # ENV FLASK_WORKERS=4
    # CMD gunicorn --bind 0.0.0.0:$FLASK_PORT --workers $FLASK_WORKERS app:app
    #
    # This block is maintained specifically for local development and 
    # rapid testing by running 'python app.py' directly.
    host = os.getenv('FLASK_HOST', '127.0.0.1')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() in ['true', '1']

    app.run(host=host, port=port, debug=debug)