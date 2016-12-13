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
    

