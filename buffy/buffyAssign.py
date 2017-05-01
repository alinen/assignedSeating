import string
import numpy as np
from scipy.sparse import csr_matrix
from SSC.constrained_SSC import *

X = np.loadtxt('buffy-socialgraph-sparse-mat.txt')
rows = X[:,0].astype(int)
cols = X[:,1].astype(int)
data = X[:,2]
m = max(max(rows),max(cols)) + 1
graph_affinity = csr_matrix((data, (rows, cols)), shape=(m, m))
tables = [6,6,6,6,6,6,6,6,6,6]
(table_assignment, _) = constrained_SSC(graph_affinity.toarray(), tables)

nameFile = open('names.txt')
lines = nameFile.readlines()
count = 0
tables = {}
for i in range(10):
    tables[i] = []

for line in lines:
    tokens = string.split(line, ',')
    print tokens[0], table_assignment[count]
    tables[table_assignment[count]].append(tokens[0])
    count = count+1

for id in tables.keys():
    print id
    for name in tables[id]:
        print "\t", name
