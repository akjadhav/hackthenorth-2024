import json
from flask import Flask, Response, render_template
from camera import Camera

app = Flask(__name__)

with open('cameras.json', 'r') as f:
    cameras_config = json.load(f)

cameras = [Camera(camera['ip'], camera['username']) for camera in cameras_config]

for camera, camera_config in zip(cameras, cameras_config):
    route_path = f"/camera/{camera.username}"

    @app.route(route_path)
    def video_feed(camera=camera):
        return Response(camera.generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return render_template('index.html', cameras=cameras_config)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000, debug=True)
