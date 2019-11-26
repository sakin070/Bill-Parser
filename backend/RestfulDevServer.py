import sys

from flask import Flask, jsonify, request, send_from_directory, render_template, make_response, send_file
from flask_cors import CORS, cross_origin
import billToText as bt
import imageProcessing as iProcess
import os
import io

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
UPLOAD_FOLDER = "./imageOutputFolder"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}


@app.route('/get-file/<pdfname>/<filename>', methods=['GET'])
@cross_origin()
def getFile(pdfname, filename):
    path = os.path.join(UPLOAD_FOLDER, pdfname)
    app.logger.info(path)
    app.logger.info(os.path.isfile(os.path.join(path, filename)))
    return send_from_directory(path, filename, as_attachment=True, mimetype='image/jpeg')


@app.route('/create-images', methods=['POST'])
@cross_origin()
def createImages():
    if 'file' not in request.files:
        resp = jsonify({'message': 'No file part in the request'})
        resp.status_code = 400
        return resp
    file = request.files['file']
    # Check for a name and configuration
    if file.filename == '':
        resp = jsonify({'message': 'No file selected for uploading '})
        resp.status_code = 400
        return resp
    if file and allowed_file(file.filename):
        paths = iProcess.handlePDF(file)
        resp = jsonify(paths)
        resp.status_code = 201
        return resp
    else:
        resp = jsonify({'message' : 'Allowed file types are  pdf, png, jpg, jpeg,'})
        resp.status_code = 400
        return resp

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
        location = iProcess.handleImage(file)
        resp = jsonify(bt.extractInfo(location, config=configuration))
        resp.status_code = 201
        return resp
    else:
        resp = jsonify({'message' : 'Allowed file types are  pdf, png, jpg, jpeg,'})
        resp.status_code = 400
        return resp


@app.route('/parse-multiple-bills', methods=['POST'])
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
            location = iProcess.handleImage(file)
            success = True
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

@app.route('/direct-parse', methods=['POST'])
@cross_origin()
def directExtract():
    if 'imagePath' not in request.files:
        resp = jsonify({'message': 'No image path in the request'})
        resp.status_code = 400
        return resp
    if 'imageSize' not in request.form:
        resp = jsonify({'message': 'No imageSize in the request'})
        resp.status_code = 400
        return resp
    if 'section' not in request.form:
        resp = jsonify({'message': 'No section in the request'})
        resp.status_code = 400
        return resp
    imagePath = request.files['imagePath']
    imageSize = request.form.get('imageSize')
    section = request.form.get('section')
    if imagePath.filename == '':
        resp = jsonify({'message': 'Missing imagePath'})
        resp.status_code = 400
        return resp

    if imageSize == '':
        resp = jsonify({'message': 'Missing imageSize'})
        resp.status_code = 400
        return resp

    if section == '':
        resp = jsonify({'message': 'Missing section'})
        resp.status_code = 400
        return resp
    # Check if file is a valid format
    if imagePath and allowed_file(imagePath.filename):
        location = iProcess.handleImage(imagePath)
        try:
            resp = jsonify(bt.directExtract(location,imageSize,section))
            resp.status_code = 201
        except:
            resp = jsonify({'message': 'internal error'})
            resp.status_code = 500
        finally:
            os.remove(location)
        return resp
    else:
        resp = jsonify({'message': 'Allowed file types are  pdf, png, jpg, jpeg,'})
        resp.status_code = 400
        return resp


if __name__ == '__main__':
    app.run(debug=True, port='9999')
