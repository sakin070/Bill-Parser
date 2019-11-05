import os
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from werkzeug.utils import secure_filename
import billToText as bt

app = Flask(__name__)
api = Api(app)
UPLOAD_FOLDER = "./imageOutputFolder"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = set(['pdf', 'png', 'jpg', 'jpeg'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/parse-bill', methods=['POST'])
def parseBill():
    # check if the post request has the file part
    if 'file' not in request.files or 'configuration' not in request.form:
        resp = jsonify({'message' : 'No file part in the request'})
        resp.status_code = 400
        return resp
    file = request.files['file']
    configuration = request.form.get('configuration')
    if file.filename == '' or configuration == '':
        resp = jsonify({'message' : 'No file selected for uploading or missing configuration'})
        resp.status_code = 400
        return resp
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        location = UPLOAD_FOLDER+'/'+filename
        resp = jsonify(bt.extractInfo(location, config=configuration))
        resp.status_code = 201
        return resp
    else:
        resp = jsonify({'message' : 'Allowed file types are  pdf, png, jpg, jpeg,'})
        resp.status_code = 400
        return resp


@app.route('/parse-multiple-bills', methods=['POST'])
def parseBillMultipleBills():
    # check if the post request has the file part
    if 'files[]' not in request.files or 'configuration' not in request.form:
        resp = jsonify({'message': 'No file part in the request'})
        resp.status_code = 400
        return resp

    files = request.files.getlist('files[]')
    configuration = request.form.get('configuration')
    errors = {}
    results = []
    success = False

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            success = True
            location = UPLOAD_FOLDER + '/' + filename
            results.append(bt.extractInfo(location, config=configuration))
        else:
            errors[file.filename] = 'File type is not allowed'

    if success and errors:
        errors['message'] = 'File(s) successfully uploaded'
        resp = jsonify(errors)
        resp.status_code = 500
        return resp
    if success:
        resp = jsonify(results)
        resp.status_code = 201
        return resp
    else:
        resp = jsonify(errors)
        resp.status_code = 500
        return resp


if __name__ == '__main__':
    app.run(debug=True, port='9999')
