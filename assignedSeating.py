from flask import Flask, jsonify, render_template
import numpy as np
from sklearn import cluster

app = Flask(__name__)

@app.route('/aseat/api/v1.0/assign/<string:name>')
def assignSeats(name):
    params = name.split(':')
    numTables = int(params[0])
    numPerTable = int(params[1])
    numGuests = int(params[2])
    constraints = params[3]

    affinityMatrix = np.zeros((numGuests,numGuests))
    

    if numGuests > numTables * numPerTable:
       return ""; # return HTML error code too?

    for i in range(numGuests):
        for j in range(numGuests):
            affinityMatrix[i][j] = int(constraints[i*numGuests + j])

    print affinityMatrix

    clusterIdx = cluster.spectral_clustering(affinityMatrix, numTables)

    response = "%d:%d:%d:"%(numTables,numPerTable,numGuests)
    idx = 0
    tables = []
    for i in range(numGuests):
        response += str(clusterIdx[i])
        if i < numGuests:
            response += ','
    print response
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

