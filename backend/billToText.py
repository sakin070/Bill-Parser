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
    pages = convert_from_path(filePath, 350, thread_count=3, output_folder=tempProcessingLocation)
    for i in range(pages.__len__()):
        pages[i].save(tempProcessingLocation+'/ '+name+str(i)+'.jpeg', 'JPEG')

#Extracts the info from an image defined at a path using the config provided
def extractInfo(imagePath, config='Hydro Ottawa',configFile = 'config.cfg'):
    imageInfo = {}
    image = Image.open(imagePath)
    items = readConfig(config,configFile)
    # For each item in the config file, create the corresponding section in the picture using the parseConfigItems method
    # Then use the Image-to-Text Tesserac function at the previously created section to find the value of the item from the config
    for item in items:
        imageSection = image.crop(parseConfigItems(item[1]))
        imageInfo[item[0]] = str(tesserocr.image_to_text(imageSection)).rstrip()
    return dictionaryToJson(imageInfo)



def dictionaryToJson(dic):
    # Converts the input into a .json dump
    json_data = json.dumps(dic)
    return json_data


def readConfig(selection, configFile = 'config.cfg'):
    # Reads the config file and returns the list of values corresponding the selection
    config = configparser.ConfigParser()
    config.read(configFile)
    items = config.items(selection)
    return items


def addConfiguration(selectionDictionary, configFile = 'config.cfg'):
    """
            Add a new configuration selection to exiting selections

            :param selectionDictionary: a dictionary of new selections
            :param configFile: location of configuration file to be updated
            :return: True if addition successful false otherwise
    """
    # need to make this method thread safe
    try:
        parsed_json = (json.loads(selectionDictionary))
        selection = parsed_json.popitem()
        existingConfig = configparser.ConfigParser(allow_no_value=True)
        existingConfig.read(configFile)
        if existingConfig.has_section(selection[0]):
            raise configparser.DuplicateSectionError(selection[0])
        config = configparser.ConfigParser(allow_no_value=True)
        config.add_section(selection[0])
        for option, value in selection[1].items():
            config.set(selection[0], option, str(value))
        with open(configFile, 'a') as configfile:
            config.write(configfile)
        return True
    except Exception as e:
        print(e)
        return False


def getSelectionList(configFile='config.cfg'):
    """
                get the list of available selections
                :param configFile: location of configuration file
                :return: a dictionary of sections
        """
    selectionMap = {}
    config = configparser.ConfigParser()
    config.read(configFile)
    for selection in config.sections():
        data = {}
        for tp in config.items(selection):
            data[tp[0]] = tp[1]
        selectionMap[selection] = data
    return selectionMap


def processImage(imagePath):
    """
                pre process an image by removing its alpha and making sure its size is less than
                (900,900)
                :param imagePath: location of configuration file
        """
    maxsize = (900, 900)
    image = Image.open(imagePath)
    image.convert("RGB")
    image.thumbnail(maxsize,Image.ANTIALIAS)
    image.save(tempProcessingLocation+'/ '+imagePath+'.jpeg', 'JPEG')

# vsl = {'section2': {'key1': 'value1', 'key2': 'value2','key3': 'value3'}}
# # x = vsl.popitem()
# # print(x)
# # print(x[0])
# # for x, y in x[1].items():
# #   print(x, y)
# print (addConfiguration(vsl))
