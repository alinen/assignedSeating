# Buffy demo
Buffy dataset to use for testing and documentation

- Buffy.csv, list of buffy characters
- buffy-socialgraph-sparse-mat.txt, affinity matrix for input to CSS
- buffy-socialgraph.csv, pairwise affinities for use in visualizations
- buffyAssign.py, script for assigning characters to tables based on affinities using the CSS algorithm
- buffyResults.svg, plot show locations of characters based on their relationship to Buffy
- guestsWithConstraints.csv, user-supplied constraints created with the assignedSeating UI
- makeSeatingCharts.py, script for generating table statistics and (perhaps later) seating charts
- makeSocialGraph.py, script for visualizing the social graph in buffy-socialgraph.csv
- nameIds.txt, affinities based on character ids
- names.txt,  list of names to IDs for use with the algorithm output (human readable)
- seating.txt, result of algorithm run on 10 tables with size 10
- socialGraph.pdf, plot generated from socialGraph.pdf
- socialGraph.svg, output of visualizeGraph.py
- socialGraph.txt, different format of guestsWithConstraints.csv
- visualizeGraph.py, visualize the social graph of affinities
