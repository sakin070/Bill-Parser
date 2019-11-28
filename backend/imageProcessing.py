from wand.image import Image
import imghdr
import os
from os import listdir
from os.path import isfile, join
from werkzeug.utils import secure_filename
from pdf2image import convert_from_path

UPLOAD_FOLDER = "./imageOutputFolder"


def handleImage(file):
    filename = secure_filename(file.filename)
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)
    if imghdr.what(path) is not 'jpeg':
        with Image(path, resolution=300) as img:
            img.format = 'jpeg'
            img.compression_quality = 99
            img.save(os.path.join(UPLOAD_FOLDER, filename))
    location = UPLOAD_FOLDER + '/' + filename
    return location

def handlePDF(file):

    filename = secure_filename(file.filename)
    pathFolder = os.path.join(UPLOAD_FOLDER, filename[:-4])
    os.makedirs(pathFolder, exist_ok=True)
    path = os.path.join(pathFolder, filename)
    file.save(path)
    convert_from_path(path, 300, thread_count=3, output_folder=pathFolder, fmt='JPEG')
    os.remove(path)
    files = [f for f in listdir(pathFolder) if isfile(join(pathFolder, f))]
    print(files)
    return files


# handlePDF("resources/testPDF.pdf")