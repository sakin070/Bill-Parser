from flask import Flask
from flask_restful import Resource, Api
import billToText as bt

app = Flask(__name__)
api = Api(app)


class ParseBill(Resource):
    def get(self,bill):
        return {"state":"its working"}
    def put(self, bill):
        return bt.extractInfo(bill)


api.add_resource(ParseBill, '/parsebill/<bill>')

if __name__ == '__main__':
    app.run(debug=True, port='9999')
