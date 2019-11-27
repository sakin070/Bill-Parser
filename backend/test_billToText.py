import unittest
import billToText as bt

class TestBillToTextMethods(unittest.TestCase):

    def testBillToText(self):
        expected = '{"date": "2019-09-25", "usage": "207.00", "cost": "$94.09"}'
        actual = bt.extractInfo("backend/resources/testImg.png",configFile="backend/config.cfg")
        self.assertEqual(actual, expected)

    def testParseTuple(self):
        expected = [260.0, 674.0, 666.0, 1394.0]
        tpl = ('(260, 674, 406, 720)')
        actual = bt.parseConfigItems(tpl)
        self.assertEqual(actual, expected)

    def testDictionaryToJson(self):
        expected = '{"date": "2019-09-06", "usage": "207.00", "cost": "$94.09"}'
        actual = bt.dictionaryToJson({'date': '2019-09-06', 'usage': '207.00', 'cost': '$94.09'})
        self.assertEqual(actual, expected)

    def testReadConfig(self):
        expected = [('date', '[675, 704, 103, 20]'), ('usage', '[174, 211, 103, 25]'), ('cost', '[732, 364, 95, 31]')]
        actual = bt.readConfig('Hydro Ottawa',"backend/config.cfg")
        self.assertEqual(actual, expected)


if __name__ == '__main__':
    unittest.main()