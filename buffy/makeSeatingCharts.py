import matplotlib.pyplot as plt
import networkx as nx
import string, math, random
import matplotlib.pyplot as plt

tables = {}
for i in range(10):
    tables[i] = []

f = open('seating.txt')
for line in f.readlines():
    tokens = string.split(line, ',')
    name = string.strip(tokens[0], '\'\n');
    tableid = int(tokens[1])
    print name, tableid
    tables[tableid].append(name)

G=nx.Graph()
file = open('socialGraph.txt')
lines = file.readlines()
for line in lines:
    tokens = string.split(line,",")
    name1 = string.strip(tokens[0])
    name2 = string.strip(tokens[1])

    if name1 not in G.nodes():
       G.add_node(name1)

    if name2 not in G.nodes():
       G.add_node(name2)

    v = int(tokens[2])
    G.add_edge(name1, name2, weight=v)

# compute table
# tablenum, #people seated, volume (sum of the edges on the table), disconnected components
for id in tables.keys():
    tableG=nx.Graph()
    for name in tables[id]:
        tableG.add_node(name)

    volume = 0
    numStrongPos = 0
    numPos = 0
    numNeg = 0
    numStrongNeg = 0        
    for name1 in tables[id]:
        for name2 in tables[id]:
            if name1 == name2: continue

            weight = 0.1
            if G.has_edge(name1,name2):
                w = G[name1][name2]['weight']
                tableG.add_edge(name1, name2, weight=w)
                if w == 1: 
                    numPos = numPos + 1
                    weight = 1
                elif w == -1: 
                    numNeg = numNeg + 1
                    weight = -1
                elif w > 1: 
                    numStrongPos = numStrongPos + 1
                    weight = 10
                elif w < 1: 
                    numStrongNeg = numStrongNeg + 1
                    weight = -10
            volume += weight
            #print name1, name2, weight, volume
    print id, len(tables[id]), volume/2, nx.number_connected_components(tableG) 

x = []
y = []
area = []
colors= []
startx = 0
starty = 0
tableR = 1
for i in range(5):
   xx = startx + i * tableR
   for j in range(2):
      yy = starty + j * tableR
      x.append(xx)
      y.append(yy)
      area.append(3000)
      colors.append('#a0a0a0')

plt.scatter(x, y, s=area, c=colors, alpha=0.5)
plt.xlim(-0.8, 4.8)
plt.ylim(-0.5, 1.5)
plt.show()

