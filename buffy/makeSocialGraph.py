#! python
import string

def checkConstraint(name1, name2, constraints):
    for constraint in constraints:
        if name1 in constraint and name2 in constraint: 
           return constraint[0]
    return "0"
    

file = open('guestsWithConstraints.csv')
lines = file.readlines()
names = []
constraints = []
for line in lines:
   tokens = string.split(string.strip(line),',')
   if len(tokens) == 1:
      names.append(string.strip(tokens[0]))
   else:
      constraints.append(tokens)
       

for name1 in names:
    for name2 in names:
        if name1 == name2: continue
        v = checkConstraint(name1, name2, constraints)
        if v!="0":
           print "%s, %s, %s"%(name1, name2, v)
        
