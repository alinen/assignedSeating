from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.jinja_env.add_extension('jinja2.ext.loopcontrols')

basedir = os.path.abspath(os.path.dirname(__file__))
url = 'sqlite:///'+ os.path.join(basedir, 'data-dev.sqlite')
try:
  f = open('database_uri.txt', 'r') # allow override
  url = f.readline()
except:
  pass

app.config["SQLALCHEMY_DATABASE_URI"] = url
db = SQLAlchemy(app)

def assignSeats():
    return "TODO"    

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(threaded=True)

