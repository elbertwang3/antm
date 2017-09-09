import csv
import numpy as np
from collections import defaultdict

def main():

	#mostFCOplace()
	#whogoeshome()
	chanceofsurviving()

def mostFCOplace():
	file1 = open('data/callouts.csv', 'rU')
	reader = csv.reader(file1)
	file2 = open('data/mostFCOplace.csv', 'a')
	writer = csv.writer(file2)
	#writer.writerow(['cycle', 'contestant', 'FCO', 'place'])
	next(reader)

	rows = [[int(row[0]), row[1], int(row[2]), int(row[3]), int(row[4]), int(row[5]), int(row[6]), int(row[7]), 
	int(row[8]), int(row[9]), int(row[10]), int(row[11]), int(row[12]), int(row[13])] for row in reader]

	cycle = []
	for row in rows:
		if row[0] == 23:
			cycle.append([row[0], row[1], row[2:14].count(1)])
			print cycle
		elif row[0] == 23:
			print cycle
	maxFCO = max(cycle, key=lambda x: x[2])[2]
	print maxFCO
	print cycle
	maxcontestants = [x for x in cycle if maxFCO == x[2]]
	print maxcontestants
	for contestant in maxcontestants:
		writer.writerow(contestant)


def whogoeshome():
	file1 = open('data/callouts.csv', 'rU')
	reader = csv.reader(file1)
	next(reader)
	rows = [[int(row[0]), row[1], int(row[2]), int(row[3]), int(row[4]), int(row[5]), int(row[6]), int(row[7]), 
	int(row[8]), int(row[9]), int(row[10]), int(row[11]), int(row[12]), int(row[13]), int(row[14])] for row in reader]

	file2 = open('data/whogoeshome.csv', 'a')
	writer = csv.writer(file2)
	#writer.writerow(['eliminated', 'eliminatedavg', 'bottomtwo', 'bottomtwoavg'])
	counter = 23
	cycle = []
	for row in rows:
		if row[0] == counter:
			cycle.append(row)
			#print cycle
		#elif row[0] == counter + 1:
	print cycle
	A = np.array(cycle)
	for i in range(3,15):
		print A[:,i]
		column = A[:,i].astype(np.float)
		indexeliminated = np.argmax(column)
		print cycle[indexeliminated][1]
		eliminatedavg = float(sum(cycle[indexeliminated][2:i])) / float(len(cycle[indexeliminated][2:i]))
		print eliminatedavg
		secondlargest = np.partition(column, -2)[-2]	
		#print rows[indexbottomtwo][1]
		indexbottomtwo = np.where(column==secondlargest)
		print cycle[indexbottomtwo[0][0]][1]
		bottomtwoavg = float(sum(cycle[indexbottomtwo[0][0]][2:i])) / float(len(cycle[indexbottomtwo[0][0]][2:i]))
		print bottomtwoavg

		writer.writerow([cycle[indexeliminated][1], eliminatedavg, cycle[indexbottomtwo[0][0]][1], bottomtwoavg])
	counter += 1
	#break



def chanceofsurviving():
	numcontestants = [10,12,14,14,13,13,13,13,13,14,14,13,15,13,14,14,14,14,13,16,14,14,14]
	matrix = np.zeros([23,16])
	for i in range(len(numcontestants)):
		a = np.ones(16)
		for j in range(numcontestants[i]):
			a[16-numcontestants[i]+j] = 1 - ((float(1)/float(numcontestants[i]))*j)
		#print a
		matrix[i] = a
	newmatrix = np.zeros([16,])
	for i in range(len(newmatrix)):
		avg = np.average(matrix[:,i])
		newmatrix[i] = avg
	print newmatrix


	file1 = open('data/callouts.csv', 'rU')
	reader = csv.reader(file1)
	file2 = open('allFCO.csv', 'a')
	writer = csv.writer(file2)
	writer.writerow(['cycle', 'contestant', 'place'])
	next(reader)
	rows = [[int(row[0]), row[1], int(row[2]), int(row[3]), int(row[4]), int(row[5]), int(row[6]), int(row[7]), 
	int(row[8]), int(row[9]), int(row[10]), int(row[11]), int(row[12]), int(row[13])] for row in reader]

	allFCO = []
	for row in rows:
		if 1 in row[2:]:
			allFCO.append(row[0:2])
			writer.writerow(row[0:2])
	print allFCO



def arg_second_largest(numbers):
    m1 = m2 = float('-inf')
    for x in range(len(numbers)):
        if numbers[x] > m2:
            if numbers[x] >= m1:
                m1 = numbers[x]
                m2 = m1         	
                #print 'm1: ' + str(m1)
                #print 'm2: ' + str(m2) 
            else:
                m2 = numbers[x]
                #print m2
    return m2 

if __name__ == "__main__":
	main()