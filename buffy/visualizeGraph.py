import networkx as nx
import string, math, random
import matplotlib.pyplot as plt

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

    v = 2-int(tokens[2]) + 1
    G.add_edge(name1, name2, weight=v)

colors = []
for edge in G.edges():
    v = G[edge[0]][edge[1]]['weight']
    if v == 1: node_color='#00FF00'
    elif v == 2: node_color='#7777FF'
    elif v == 4: node_color='#FFFF00'
    elif v == 5: node_color='#FF0000'
    print edge, v, node_color
    colors.append(node_color)

sizes = []
labels = {}
startpos = {}
count = 0
buffy = None
for node in G.nodes():
    neighbors = nx.all_neighbors(G,node)
    numNeighbors = 0
    radius = 0.1
    for neighbor in neighbors:
        numNeighbors = numNeighbors+1
        weight = G[node][neighbor]['weight']
        if weight == 2: radius = 0.2
        elif weight == 4: radius = 0.3
        elif weight == 5: radius = 0.5
    size = 50+math.pow(numNeighbors,3)
    sizes.append(size)

    if 'Buffy' in node:
        labels[node] = 'Buffy'
        buffy = node
        startpos[node] = [0.5,0.5]
    elif 'Xander' in node:
        labels[node] = 'Xander'
        startpos[node] = [0.6,0.6]
    elif 'Willow' in node:
        labels[node] = 'Willow'
        startpos[node] = [0.4,0.4]
    elif 'Anya' in node:
        labels[node] = 'Anya'
        startpos[node] = [0.6,0.8]
    elif 'Kennedy' in node:
        labels[node] = 'Kennedy'
        startpos[node] = [0.2,0.4]
    elif 'Angel' in node:
        labels[node] = 'Angel'
        startpos[node] = [0.8,0.3]
    elif numNeighbors > 6:
        name = string.split(node, ' ')
        labels[node] = name[0]
        angle = random.random() * math.pi * 2
        startpos[node] = [0.5+radius*math.cos(angle), 0.5+radius*math.sin(angle)]
    else:
        labels[node] = ''
        angle = random.random() * math.pi * 2
        startpos[node] = [0.5+radius*math.cos(angle), 0.5+radius*math.sin(angle)]
    count = count + 1


print len(colors)
print G.number_of_nodes()
print G.number_of_edges()
#print(list(G.nodes()))
#print(list(G.edges()))

#pos = startpos
pos = nx.spring_layout(G, pos=startpos, weight='weight')
#p=nx.single_source_shortest_path_length(G,buffy)

plt.figure(figsize=(8,8))
nx.draw_networkx_edges(G,pos,edge_color=colors,alpha=1.0)
nx.draw_networkx_nodes(G,pos,
                       #nodelist=p.keys(),
                       node_size=sizes, 
                       #node_color=p.values(),
                       #cmap=plt.cm.hot,
                       node_color='#a0a0a0',
                       alpha=0.4)
nx.draw_networkx_labels(G,pos,labels,font_size=12)

plt.xlim(-0.05,1.05)
plt.ylim(-0.05,1.05)
plt.axis('off')
plt.savefig('buffy_graph.png')
plt.show()



