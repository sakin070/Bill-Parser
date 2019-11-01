import unittest
import billToText as bt

class TestBillToTextMethods(unittest.TestCase):

    def testBillToText(self):
        expected = '{"date": "2019-09-06", "usage": "207.00", "cost": "$94.09"}'
        actual = bt.extractInfo("./resources/testImg.png")
        self.assertEqual(actual,expected)

    def testParseTuple(self):
        expected = [260.0, 674.0, 406.0, 720.0]
        tpl = ('(260, 674, 406, 720)')
        actual = bt.parseConfigItems(tpl)
        self.assertEqual(actual, expected)

    def testDictionaryToJson(self):
        expected = '{"date": "2019-09-06", "usage": "207.00", "cost": "$94.09"}'
        actual = bt.dictionaryToJson({'date': '2019-09-06', 'usage': '207.00', 'cost': '$94.09'})
        self.assertEqual(actual, expected)

    def testReadConfig(self):
        expected = [('date', '(260, 674, 406, 720)'), ('usage', '(301, 386, 400, 432)'), ('cost', '(1104, 675, 1224, 720)')]
        actual = bt.readConfig()
        self.assertEqual(actual, expected)
if __name__ == '__main__':
    unittest.main()