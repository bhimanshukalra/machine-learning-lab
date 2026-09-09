from flask import Flask, request, jsonify
import util

app = Flask(__name__)


@app.route("/classify_image", methods=["GET", "POST"])
def classify_image():
    image_data = request.form["image_data"]

    response = jsonify(util.classify_image(image_data))

    return response


if __name__ == "__main__":
    util.load_saved_artifacts()
    app.run()
