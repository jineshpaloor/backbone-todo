import json
from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/getdata')
def todo_json_resp():
    resp = {'description':'complete kodecrm agent', 'status':'incomplete', 'id':2}
    return json.dumps(resp)

if __name__ == '__main__':
    app.run(debug=True)
