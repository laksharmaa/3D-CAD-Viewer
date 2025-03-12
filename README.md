# 3D Model Viewer & Manager 

>An interactive web application for uploading, viewing, and managing 3D models (STL and OBJ formats) with advanced visualization features.
## ✨ Features
- Interactive 3D Model Viewing with intuitive camera controls
- Model Upload & Management for STL and OBJ file formats
- Format Conversion between supported 3D model types
- Advanced Visualization Options including:
  - Customizable materials and colors
  - Adjustable lighting and environment settings
  - Configurable grid display with infinite mode
  - Texture application
- Camera Controls for fitting, zooming, and panning
- Responsive UI with collapsible panels

![image](https://github.com/user-attachments/assets/16ebcbfd-9138-41d7-bbf0-9a5bad1146ca)


## 🛠️ Tech Stack
### Frontend
- React with Vite
- Three.js / React Three Fiber
- TailwindCSS
- Heroicons
### Backend
- Flask (Python)
- Trimesh for 3D model processing
## 📋 Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
## 🚀 Installation & Setup
### Backend Setup
Clone this repository:
```
git clone https://github.com/yourusername/3D-CAD-Viewer.git
cd 3D-CAD-Viewer
```
- Set up a Python virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```
- Install Python dependencies:

```
pip install -r requirements.txt
```
- Create uploads directory (if not present):
```
mkdir uploads
# for creating folder or do it manually.
```
- Start the Flask server:
```
python app.py
The API server will be running at http://127.0.0.1:5000/
```
### Frontend Setup
- Navigate to the frontend directory:
```
cd frontend
```
- Install Node.js dependencies:
```
npm install
# or with yarn
yarn install
```
- Start the development server:

```
npm run dev
# or with yarn
yarn dev
```
> The application will be accessible at http://localhost:5173/

## 🔍 Usage Guide
- Uploading Models
- Click the "Upload Model" button in the sidebar
- Select an STL or OBJ file from your computer
> The model will be uploaded and appear in the model list
### Viewing Models
- Click on a model in the list to select it
- The model will appear in the 3D viewer
- Use these controls to navigate:
- Left-click drag: Rotate the model
- Right-click drag: Pan the camera
- Scroll: Zoom in/out
- Use the buttons in the top-left corner for fit view, reset view, and pan mode
### Customizing Appearance
- Use the sidebar controls to adjust:
  - Model color, metalness, roughness, and wireframe mode
  - Apply textures (Metal, Plastic, or Carbon Fiber)
  - Adjust lighting intensity and color
  - Toggle grid visibility and customize grid appearance
  - Switch between standard and infinite grids
### Converting Models
- Select a model from the list
> In the "Convert Model" section, choose the target format (STL or OBJ)
> Click "Convert" to generate a new model in the selected format
> The converted model will be automatically selected and displayed
## 🔧 API Endpoints
### The backend provides the following API endpoints:
```
POST /api/upload - Upload a new 3D model
GET /api/models - List all available models
GET /api/models/<filename> - Retrieve a specific model
DELETE /api/models/<filename> - Delete a model
GET /api/convert/<filename>/<target_format> - Convert a model to another format
```
## 👨‍💻 Development
### Project Structure
javascript

```
/
├── app.py                # Flask backend application
├── requirements.txt      # Python dependencies
├── uploads/              # Directory for uploaded models
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ModelViewer.jsx      # 3D viewer component
│   │   │   ├── FileUpload.jsx       # File upload component
│   │   │   ├── ModelList.jsx        # Model listing component
│   │   │   ├── model/               # Model-related components
│   │   │   ├── controls/            # Control UI components
│   │   │   └── scene/               # Scene setup components
│   │   ├── services/
│   │   │   └── api.js               # API service functions
│   │   └── App.jsx                  # Main application component
│   ├── postcss.config.js
│   └── tailwind.config.js
└── README.md
```
> Extending the Application
> To add support for additional 3D file formats:
> Update the ALLOWED_EXTENSIONS list in app.py
> Add the appropriate loader in the frontend's Model component
> Ensure Trimesh supports the new format for conversion
## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
## 🙏 Acknowledgements
Three.js and React Three Fiber for 3D rendering
Trimesh for 3D model processing
TailwindCSS for styling
Made with ❤️ by Lakshya Sharma
