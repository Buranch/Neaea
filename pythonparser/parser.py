file = open('all.xlsx', 'r');
# university = [x for x in range(1,44)]
arr = file.readlines()
header = ['Region', 'School Code', 'School Name', 'Reg No', 'Name', 'F Name', 'GF Name', 'Sex', 'Age', 'Sig', 'Nation',
          'Eng', 'NMa', 'Apt', 'Phy', 'Che',
          'Bio', 'Geo', 'His', 'Eco', 'SMa', 'Civ', 'Total']

dicAll = {}

# print(header[2])
f = open('toJson.json', 'w');

# print(arr[1])

for i in range(1, len(arr)):
    count = 0
    newDic = {}
    for ele in header:
        print(i, " done")
        newDic[ele] = arr[i].split('\t')[count]
        count+=1
    newDic["Total"] = newDic["Total"][:-1]
    f.write(str(newDic))
    # newDic.append(newDic)



print(f)

# for ele in arr:
#     ele = ele.split('\t');
#     ele[-1] = ele[-1][:-1];
#     print(ele)
#
