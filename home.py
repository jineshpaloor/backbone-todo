import json
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/getdata', methods=['GET', 'POST', 'PUT', 'DELETE'])
def todo_json_resp():
    print 'get data............',request.method
    if request.method == 'PUT':
        print 'updating data  :',request.__dict__

    if request.method == 'POST':
        print 'saving new data  :',request.__dict__

    resp = {'description':'complete kodecrm agent', 'status':'incomplete', 'id':2}
    return json.dumps(resp)

@app.route('/getdata/<id>', methods=['GET', 'POST', 'PUT', 'DELETE'] )
def get_todo_by_id(id):
    print 'get data by id............',request.method

    resp = {'description':'respond id 1 description', 'status':'incomplete', 'id':1}
    return json.dumps(resp)


if __name__ == '__main__':
    app.run(debug=True)
