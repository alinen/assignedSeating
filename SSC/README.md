# SSC (Signed Spectral Clustering)

The main function for usage is SignedSpectralClustering with parameters n_clusters (the number of clusters) and affinity_matrix (the similarity between vertices. Note that the signiture is not like sklearn signed clustering.
Maybe in a later version I will merge these.

Parameters:      
n_clusters : integer
           The dimension of the projection subspace.

affinity_matrix : array-like, shape (n_samples, n_samples)
                Affinity matrix (a.k.a similarity matrix or weight matrix) used for clustering.
                An example is affinity_matrix[i][j] = np.exp(-beta * distance[i][j] / distance.std()) .

Please send questions to Joao Sedoc (joao at cis dot upenn dot edu).
 

For the theory behind SSC see :

Jean Gallier ,"Spectral Theory of Unsigned and Signed Graphs. Applications to Graph Clustering: a Survey" https://arxiv.org/abs/1601.04692

Sedoc et al., "Semantic Word Clusters Using Signed Normalized Graph Cuts" https://arxiv.org/abs/1601.05403
    
________________________________

An example affinity matrix is example_affinity.csv
in python

```python
import numpy as np
from sklearn import cluster

n_clusters = 4
graph_affinity = np.loadtxt(open('SSC/example_affinity.csv'), delimiter=',')
cluster_idx = cluster.spectral_clustering(graph_affinity, n_clusters)
```
A second example is in example_affinity_2.csv which has more negative edges.
```python
import numpy as np
from sklearn import cluster

n_clusters = 3
graph_affinity = np.loadtxt(open('SSC/example_affinity_2.csv'), delimiter=',')
cluster_idx = cluster.spectral_clustering(graph_affinity, n_clusters)
```

________________________________

constrained_clustering takes, an affinity matrix and an array of table sizes, and a boolean to return violated constraints and returns an array of tuples (table #, person id) and possibly a dictionary of violated constrains key: type, value: (person id 1, person id 2).

```python
import SSC

(tables, violated_constraints) = SSC.constrained_clustering(graph_affinity, table_array, show_violated_constraints)
```


(tables, invalidate_constraints) constrained_clusters
