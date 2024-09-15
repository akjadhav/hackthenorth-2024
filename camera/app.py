import json
from flask import Flask, Response, render_template
from camera import Camera

app = Flask(__name__)

with open('cameras.json', 'r') as f:
    cameras_config = json.load(f)

cameras = {camera['username']: Camera(camera['ip'], camera['username']) for camera in cameras_config}

@app.route('/')
def index():
    return render_template('index.html', cameras=cameras_config)

@app.route('/camera/<username>')
def camera_view(username):
    camera = cameras.get(username)
    if camera is None:
        return "Camera not found", 404
    return render_template('camera.html', camera=next(c for c in cameras_config if c['username'] == username))

@app.route('/camera/<username>/<stream_type>')
def video_feed(username, stream_type):
    camera = cameras.get(username)
    if camera is None:
        return "Camera not found", 404
    if stream_type not in ['original', 'processed', 'depth']:
        return "Invalid stream type", 400
    return Response(camera.generate_frames(stream_type), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000, debug=True)