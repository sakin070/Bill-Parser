from flask import Flask
from flask_restful import Resource, Api
import billToText as bt

app = Flask(__name__)
api = Api(app)


class ParseBill(Resource):
    @staticmethod
    def get(bill):
        print (bill)
        return bt.extractInfo(bill)

    @staticmethod
    def put(bill):
        return bt.extractInfo(bill)


api.add_resource(ParseBill, '/parsebill/<bill>')

if __name__ == '__main__':
    app.run(debug=True, port='9999')
