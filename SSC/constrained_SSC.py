import numpy as np
from sklearn import cluster


def solve_constraints(XXc, tables):
    num_clusters = np.shape(XXc)[0]
    cluster_sizes = np.sum(XXc, axis = 0)
    table_sizes = np.sort(np.array(tables))
    
    violated_constraints = cluster_sizes - table_sizes
    for i in range(len(tables)):
        if violated_constraints[i] != 0:
            too_much = violated_constraints[i]
            #print i, too_much
            while too_much > 0:
                swaped = False
                for j in xrange(i+1, len(tables)):
                    if violated_constraints[j] < 0:
                        #print "VC", j, violated_constraints[j]
                        for r in range(num_clusters):
                            #print "swapping test", i,j,r
                            if XXc[r,i] == 1 and XXc[r,j] == 0:
                                XXc[r,i] = 0
                                XXc[r,j] = 1
                                swaped = True
                                # print "swapped", r,i,j
                                break
                        if swaped:
                            #print "swapped", i, j
                            break
                too_much = too_much - 1
                cluster_sizes = np.sum(XXc, axis = 0)
                violated_constraints = cluster_sizes - table_sizes
    return XXc


def constrained_SSC(affinity_matrix, tables):
    """constrained_SSC
    :param affinity_matrix: this is an NxN symmetric matrix who's 
                            diagonal is all zeros
    :param tables: This is a tuple of cluster (or table sizes) e.g. (5,10,4,7)
    :returns a tuple (cluster_idx, volated_constraints)
    """
    cluster_idx = cluster.spectral_clustering(affinity_matrix, len(tables))

    XXc = np.zeros((len(cluster_idx), np.max(cluster_idx)+1))
    for i in range(len(cluster_idx)):
        XXc[i,cluster_idx[i]] = 1

    cluster_sizes = np.sum(XXc, axis = 0)
    for i in range(len(tables)):
        for j in xrange(i+1, len(tables)):
            if cluster_sizes[i] < cluster_sizes[j]:
                XXc[:,[i,j]] = XXc[:,[j,i]]

    XXc = solve_constraints(XXc, tables)
    cluster_idx = sum(np.transpose(XXc * np.array(range(len(tables)))))
    cluster_idx = cluster_idx.astype(int).tolist()
    return (cluster_idx, [])
    
