from PIL import Image
import tesserocr
import json
import configparser
from pdf2image import convert_from_path

tempProcessingLocation = "./imageOutputFolder"


def parseConfigItems(tpl):
    tpl = tpl[1:-1]
    lst = tpl.split(', ')
    lst = [float(i) for i in lst]
    return lst


def pdfToImages(filePath, name='image'):
    pages = convert_from_path(filePath, 200, thread_count=3, output_folder=tempProcessingLocation)
    for i in range(pages.__len__()):
        pages[i].save(tempProcessingLocation+'/ '+name+str(i)+'.jpeg', 'JPEG')


def extractInfo(imagePath, config='Hydro Ottawa'):
    imageInfo = {}
    image = Image.open(imagePath)
    items = readConfig(config)
    for item in items:
        imageSection = image.crop(parseConfigItems(item[1]))
        imageInfo[item[0]] = str(tesserocr.image_to_text(imageSection)).rstrip()
    return dictionaryToJson(imageInfo)


def dictionaryToJson(dic):
    json_data = json.dumps(dic)
    return json_data


def readConfig(selection, configFile = 'backend/config.cfg'):
    config = configparser.ConfigParser()
    config.read(configFile)
    items = config.items(selection)
    return items
