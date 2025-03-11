# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
import trimesh

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'stl', 'obj'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        # Create a unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        
        return jsonify({
            "message": "File uploaded successfully",
            "filename": unique_filename,
            "format": file_extension
        }), 201
    
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/models/<filename>', methods=['GET'])
def get_model(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/models', methods=['GET'])
def list_models():
    files = []
    for file in os.listdir(app.config['UPLOAD_FOLDER']):
        if allowed_file(file):
            files.append({
                "filename": file,
                "format": file.rsplit('.', 1)[1].lower()
            })
    return jsonify(files)


import trimesh

@app.route('/api/convert/<filename>/<target_format>', methods=['GET'])
def convert_model(filename, target_format):
    if target_format not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Target format not supported"}), 400
    
    source_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    # Check if source file exists
    if not os.path.exists(source_path):
        return jsonify({"error": "Source file not found"}), 404
    
    try:
        # Load the mesh
        mesh = trimesh.load(source_path)
        
        # Create a new filename for the converted file
        new_filename = f"{filename.rsplit('.', 1)[0]}.{target_format}"
        target_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        
        # Export to the target format
        mesh.export(target_path)
        
        return jsonify({
            "message": "File converted successfully",
            "filename": new_filename,
            "original_format": filename.rsplit('.', 1)[1].lower(),
            "new_format": target_format
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add this route to your Flask app.py file
@app.route('/api/models/<filename>', methods=['DELETE'])
def delete_model(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    try:
        os.remove(file_path)
        return jsonify({"message": f"File {filename} deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)