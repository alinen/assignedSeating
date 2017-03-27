from flask import Flask, jsonify, render_template
import numpy as np
from sklearn import cluster

app = Flask(__name__)

@app.route('/aseat/api/v1.0/assign/<string:name>')
def assignSeats(name):
    params = name.split(':')
    numTables = int(params[0]) 
    numPerTable = params[1]  # comma delimited list of table sizes
    numGuests = int(params[2])
    numTogetherConstraints = int(params[3])
    togetherConstraints = params[4] # comma delimited list of pairs
    numSeparatedConstraints = int(params[5])
    separatedConstraints = params[6] # comma delimited list of pairs

    # Parse tables
    capacity = 0;
    tableSizeTokens = numPerTable.split(',')
    tableSizes = [];
    for tableSizeStr in tableSizeTokens:
        if tableSizeStr == "": continue
        val = int(tableSizeStr)
        tableSizes.append(val)
        capacity += val
         
    #print tableSizes, capacity
    if numGuests > capacity:
       print "Not enough seats: ", capacity, "<", numGuests
       return ""; # return HTML error code too?

    affinityMatrix = np.zeros((numGuests,numGuests))
    togetherTokens = togetherConstraints.split(',')
    #print togetherTokens
    for i in range(0,len(togetherTokens),2):
        if togetherTokens[i] == "": continue
        guesti = int(togetherTokens[i]);
        guestj = int(togetherTokens[i+1]);
        affinityMatrix[guesti][guestj] = 1;
        affinityMatrix[guestj][guesti] = 1;

    separateTokens = separatedConstraints.split(',')
    #print separateTokens
    for i in range(0,len(separateTokens),2):
        if separateTokens[i] == "": continue
        guesti = int(separateTokens[i]);
        guestj = int(separateTokens[i+1]);
        affinityMatrix[guesti][guestj] = -1;
        affinityMatrix[guestj][guesti] = -1;

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
    params = '10:12,12,12,12,12,12,12,12,12,12:61:4:0,1,0,2,1,2,6,8,:3:12,4,12,7,4,7,'
    print assignSeats(params)

if __name__ == "__main__":
    #app.run(threaded=True)
    testAssign()

