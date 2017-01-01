from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/aseat/api/v1.0/assign/<string:name>')
def assignSeats(name):
    params = name.split(':')
    numTables = int(params[0])
    numPerTable = int(params[1])
    numGuests = int(params[2])
    constraints = params[3]

    if numGuests > numTables * numPerTable:
       return ""; # return HTML error code too?

    response = "%d:%d:%d:"%(numTables,numPerTable,numGuests)
    idx = 0
    tables = []
    for i in range(numTables):
        if idx > numGuests-1: 
           break

        tables.append([])
        for j in range(numPerTable):
            tables[i].append(idx) # append guest ID
            idx = idx + 1
            response += str(i)
            if idx < numGuests:
               response += ','
            else:
               break

    return response

@app.route("/")
def index():
    return render_template('assignedSeating.html')

def testAssign():
    params = '10:10:60:'
    for i in range(60):
       for j in range(60):
           params += '1'
    print assignSeats(params)

if __name__ == "__main__":
    app.run(threaded=True)
    #testAssign()

