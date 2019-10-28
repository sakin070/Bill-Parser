from PIL import Image
import tesserocr
import json
import configparser
from pdf2image import convert_from_path

tempProcessingLocation = "./imageOutputFolder"



# testImage has no alpha, so when processing documents, remember that we don't want alpha
# create an array for a list of supported bill templates

def parseTuple(tpl):
    tpl = tpl[1:-1]
    # you want to put a try catch to prevent user error
    lst = tpl.split(', ')
    lst = [float(i) for i in lst]
    return lst

def pdfToImages(filePath,name='image'):
    pages = convert_from_path(filePath, 200, thread_count=3, output_folder=tempProcessingLocation)
    for i in range(pages.__len__()):
        pages[i].save(tempProcessingLocation+'/ '+name+str(i)+'.jpeg', 'JPEG')


def extractInfo(imagePath):
    # check if its an object or a path to an object
    # current implementation is of a path
    config = configparser.RawConfigParser()
    config.read('config.cfg')
    items = config.items('Hydro Ottawa')
    imageInfo = {}
    image = Image.open(imagePath)
    for item in items:
        imageSection = image.crop(parseTuple(item[1]))
        imageInfo[item[0]] = str(tesserocr.image_to_text(imageSection)).rstrip()
    return dictionaryToJson(imageInfo)

def dictionaryToJson(dic):
    json_data = json.dumps(dic)
    return json_data

print(extractInfo("./resources/testImg.png"))
