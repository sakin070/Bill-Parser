from PIL import Image
import tesserocr
import json
import configparser
from pdf2image import convert_from_path

tempProcessingLocation = "./imageOutputFolder"

#Splits the coordinates in the config file into an array of floats
def parseConfigItems(tpl):
    tpl = tpl[1:-1]
    lst = tpl.split(', ')
    lst = [float(i) for i in lst]
    return lst

#Converts PDFs to jpeg images
def pdfToImages(filePath, name='image'):
    pages = convert_from_path(filePath, 200, thread_count=3, output_folder=tempProcessingLocation)
    for i in range(pages.__len__()):
        pages[i].save(tempProcessingLocation+'/ '+name+str(i)+'.jpeg', 'JPEG')

#Extracts the info from an image defined at a path using the config provided
def extractInfo(imagePath, config='Hydro Ottawa'):
    imageInfo = {}
    image = Image.open(imagePath)
    items = readConfig(config)
    #For each item in the config file, create the corresponding section in the picture using the parseConfigItems method
    #Then use the Image-to-Text Tesserac function at the previously created section to find the value of the item from the config
    for item in items:
        imageSection = image.crop(parseConfigItems(item[1]))
        imageInfo[item[0]] = str(tesserocr.image_to_text(imageSection)).rstrip()
    return dictionaryToJson(imageInfo)

#Converts the input into a .json dump
def dictionaryToJson(dic):
    json_data = json.dumps(dic)
    return json_data

#Reads the config file and returns the list of values corresponding the selection
def readConfig(selection, configFile = 'backend/config.cfg'):
    config = configparser.ConfigParser()
    config.read(configFile)
    items = config.items(selection)
    return items
