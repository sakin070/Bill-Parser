import os
from flask import Flask, jsonify, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import billToText as bt
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
UPLOAD_FOLDER = "./imageOutputFolder"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = set(['pdf', 'png', 'jpg', 'jpeg'])
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day","50 per hour"]

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/selectionList', methods=['GET'])
@cross_origin()
def selectionList():
    """
                    API for viewing list of available selection
                    :return: List of available selections
            """
    resp = jsonify(bt.getSelectionList())
    resp.status_code = 200
    return resp


@app.route('/add-selection', methods=['POST'])
@cross_origin()
def addSelection():
    """
                API for adding a new configuration selection to exiting selections
                :param selectionDictionary: a dictionary of new selections
                :return: True if addition successful false otherwise
        """
    if 'selectionDictionary' not in request.form:
        resp = jsonify({'message': 'No selection dictionary the request'})
        resp.status_code = 400
        return resp
    selectionDictionary = request.form.get('selectionDictionary')
    if selectionDictionary == '':
        resp = jsonify({'message': 'Missing selection dictionary'})
        resp.status_code = 400
        return resp
    val = bt.addConfiguration(selectionDictionary)
    resp = jsonify({'message': val})
    if val:
        resp.status_code = 201
    else:
        resp.status_code = 400
    return resp

@app.route('/parse-bill', methods=['POST'])
@limiter.limit("100 per day")
def parseBill():
    #Check if the post request has the file part
    if 'file' not in request.files:
        resp = jsonify({'message' : 'No file part in the request'})
        resp.status_code = 400
        return resp
    if 'configuration' not in request.form:
        resp = jsonify({'message': 'No configuration part in the request'})
        resp.status_code = 400
        return resp
    file = request.files['file']
    configuration = request.form.get('configuration')
    #Check for a name and configuration
    if file.filename == '':
        resp = jsonify({'message' : 'No file selected for uploading '})
        resp.status_code = 400
        return resp
    if configuration == '':
        resp = jsonify({'message': 'Missing configuration'})
        resp.status_code = 400
        return resp
    #Check if file is a valid format
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
@limiter.limit("100 per day")
def parseBillMultipleBills():
    #Check if the post request has the file parts for one config
    if 'files[]' not in request.files:
        resp = jsonify({'message': 'No file part in the request'})
        resp.status_code = 400
        return resp
    if 'configuration' not in request.form:
        resp = jsonify({'message': 'No configuration part in the request'})
        resp.status_code = 400
        return resp
    files = request.files.getlist('files[]')
    configuration = request.form.get('configuration')
    if len(files) < 1:
        resp = jsonify({'message': 'No file selected for uploading '})
        resp.status_code = 400
        return resp
    if configuration == '':
        resp = jsonify({'message': 'Missing configuration'})
        resp.status_code = 400
        return resp
    errors = {}
    results = []
    success = False

    #Check if files are a valid format
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
