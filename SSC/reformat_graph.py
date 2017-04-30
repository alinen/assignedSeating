import sys

next_idnum = 1
name2id = {}
names = []
for line in open(sys.argv[1]).readlines():
    (person1, person2, affinity) = line.split(',')
    if person1[0] ==' ':
        person1 = person1[1:]
    if person2[0] == ' ':
        person2 = person2[1:]

    affinity = int(affinity)

    if not name2id.has_key(person1):
        name2id[person1] = next_idnum 
        next_idnum += 1
        names.append(person1)

    if not name2id.has_key(person2):
        name2id[person2] = next_idnum 
        next_idnum += 1
        names.append(person2)


    if affinity != 0:
        print name2id[person1], name2id[person2], affinity

for name in names:
    print >> sys.stderr, name +  "," +  str(name2id[name])
