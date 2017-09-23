import csv
import numpy as np
from collections import defaultdict
from collections import OrderedDict

def main():

	#mostFCOplace()
	#whogoeshome()
	#chanceofsurviving()
	#atleastplace()
	#firstbottomtwo()
	#consecbottomtwo()
	#bottomtwomap()
	


def consecbottomtwo():
	file1 = open('data/callouts.csv', 'rU')
	reader = csv.reader(file1)
	next(reader)
	file2 = open('data/consecbottwoelim.csv', 'a')
	file3 = open('data/consecbottwo.csv', 'a')
	writer = csv.writer(file2)
	writer2 = csv.writer(file3)
	rows = [[int(row[0]), row[1], int(row[2]), int(row[3]), int(row[4]), int(row[5]), int(row[6]), int(row[7]), 
	int(row[8]), int(row[9]), int(row[10]), int(row[11]), int(row[12]), int(row[13]), int(row[14])] for row in reader]
	cycle = []
	cycles = []
	counter = 1
	for row in rows:
		if row[0] == counter:
			cycle.append(row)
		else:
			counter += 1
			#A = np.array(cycle)
			cycles.append(cycle)
			cycle = []
			cycle.append(row)
	cycles.append(cycle)
	print cycles[2]
	for i in range(len(cycles)):
		cycle = cycles[i]
		for j in range(2,14):

			curr = np.array(cycle)[:,j].astype(np.float)
			#print curr
			nextcol = np.array(cycle)[:,j+1].astype(np.float)
			if all(v == 0 for v in nextcol):
				break
			#print next#col
			secondlargest = np.partition(curr, -2)[-2]
		
			indexbottomtwo = np.where(curr==secondlargest)
			namebottomtwo = cycle[indexbottomtwo[0][0]][1]
			indexeliminated = np.argmax(nextcol)
			nameelim = cycle[indexeliminated][1]

			secondlargestnext =  np.partition(nextcol, -2)[-2]
			indexbottomtwonext = np.where(nextcol==secondlargestnext)
			namebottomtwonext = cycle[indexbottomtwonext[0][0]][1]

			
			#print namebottomtwo
			#print nameelim
			#print namebottomtwonext
			if namebottomtwo == 'Kahlen':
				print 'getting here'
				print curr
				print nextcol
			if namebottomtwo == nameelim:
				print "consec bot two eliminated: " + namebottomtwo
				#writer.writerow([namebottomtwo])
			if namebottomtwo == namebottomtwonext and not all(v == 0 for v in np.array(cycle)[:,j+2].astype(np.float)):
				print "consec bot two: " + namebottomtwonext
				#writer2.writerow([namebottomtwonext])
			#break
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
	
def bottomtwomap():
	file1 = open('data/callouts.csv', 'rU')
	reader = csv.reader(file1)
	next(reader)
	rows = [[int(row[0]), row[1], int(row[2]), int(row[3]), int(row[4]), int(row[5]), int(row[6]), int(row[7]), 
	int(row[8]), int(row[9]), int(row[10]), int(row[11]), int(row[12]), int(row[13]), int(row[14])] for row in reader]
	file2 = open('data/numbottwoappearances.csv', 'a')
	writer = csv.writer(file2)
	writer.writerow(['cycle', 'contestant', 'number'])
	cycle = []
	cycles = []
	counter = 1
	bottomtwodict = defaultdict(int)
	for row in rows:
		if row[0] == counter:
			cycle.append(row)
		else:
			counter += 1
			#A = np.array(cycle)
			cycles.append(cycle)
			cycle = []
			cycle.append(row)
	cycles.append(cycle)

	for i in range(len(cycles)):
		cycle = cycles[i]
		for j in range(2,14):

			curr = np.array(cycle)[:,j].astype(np.float)
			#print curr
			nextcol = np.array(cycle)[:,j+1].astype(np.float)
			if all(v == 0 for v in nextcol):
				break
			#print nextcol
			secondlargest = np.partition(curr, -2)[-2]
		
			indexbottomtwo = np.where(curr==secondlargest)
			namebottomtwo = cycle[indexbottomtwo[0][0]][1]
			indexeliminated = np.argmax(curr)
			nameelim = cycle[indexeliminated][1]
			cyclenum = cycle[indexbottomtwo[0][0]][0]
			#print namebottomtwo
			#print nameelim
			bottomtwodict[(cyclenum, namebottomtwo)] += 1
			bottomtwodict[(cyclenum, nameelim)] += 1
	for k,v in bottomtwodict.iteritems():
		print k,v
		writer.writerow([k[0], k[1], v])


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

def firstbottomtwo():
	file1 = open('data/callouts.csv', 'rU')
	reader = csv.reader(file1)
	next(reader)
	file2 = open('data/firstbottomtwo.csv', 'a')
	writer = csv.writer(file2)
	writer.writerow(['cycle', 'contestant', 'place'])

	rows = [[int(row[0]), row[1], int(row[2]), int(row[3]), int(row[4]), int(row[5]), int(row[6]), int(row[7]), 
	int(row[8]), int(row[9]), int(row[10]), int(row[11]), int(row[12]), int(row[13]), int(row[14])] for row in reader]
	cycle = []
	cycles = []
	counter = 1
	for row in rows:
		if row[0] == counter:
			cycle.append(row)
		else:
			#print counter
			counter += 1
			#A = np.array(cycle)
			cycles.append(cycle)
			cycle = []
			cycle.append(row)
	cycles.append(cycle)
	#print cycles
	for i in range(len(cycles)):
		cycle = cycles[i]
		#print cycle
		column = np.array(cycle)[:,2].astype(np.float)
		#print column
		secondlargest = np.partition(column, -2)[-2]	
		indexbottomtwo = np.where(column==secondlargest)
		print cycle[indexbottomtwo[0][0]][0]
		print cycle[indexbottomtwo[0][0]][1]
		writer.writerow([cycle[indexbottomtwo[0][0]][0], cycle[indexbottomtwo[0][0]][1]])


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

def atleastplace():

	'''file1 = open('data/allFCO.csv', 'rU')
	reader = csv.reader(file1)


	file1 = open('data/callouts.csv', 'rU')
	reader = csv.reader(file1)
	file2 = open('data/allFCOs.csv', 'a')
	writer = csv.writer(file2)
	#writer.writerow(['cycle', 'contestant', 'num', 'place'])
	next(reader)
	rows = [[int(row[0]), row[1], int(row[2]), int(row[3]), int(row[4]), int(row[5]), int(row[6]), int(row[7]), 
	int(row[8]), int(row[9]), int(row[10]), int(row[11]), int(row[12]), int(row[13])] for row in reader]
	fcodict = OrderedDict()
	for row in rows:
		count = 0
		place = 0
		for i in range(len(row[2:14])):
			if i + 1 < len(row[2:14]):
				if row[2:14][i+1] != 0:
					if row[2:14][i] == 1:
						count += 1
				elif row[2:14][i+1] == 0:
					place = row[2:14][i]
					break
			else:
				place = row[2:14][i]
				break


		fcodict[(row[0], row[1])] = count, place
		writer.writerow([row[0], row[1], count, place])
	print fcodict'''
	file1 = open('data/allFCOs.csv', 'rU')
	reader = csv.reader(file1)
	next(reader)
	atleastzero = defaultdict(int)
	atleastone = defaultdict(int)
	atleasttwo = defaultdict(int)
	atleastthree = defaultdict(int)
	atleastfour = defaultdict(int)
	atleastfive = defaultdict(int)
	atleastsix = defaultdict(int)
	rows = [[int(row[0]), row[1], int(row[2]), int(row[3])] for row in reader]

	for row in rows:
		if row[2] >= 0:
			atleastzero[row[3]] += 1
		if row[2] >= 1:
			atleastone[row[3]] += 1
		if row[2] >= 2:
			atleasttwo[row[3]] += 1
		if row[2] >= 3:
			atleastthree[row[3]] += 1
		if row[2] >= 4:
			atleastfour[row[3]] += 1
		if row[2] >= 5:
			atleastfive[row[3]] += 1
		if row[2] >= 6:
			atleastsix[row[3]] += 1

	for k,v in atleastzero.iteritems():
		print k,v
	print '\n'
	for k,v in atleastone.iteritems():
		print k,v
	print '\n'
	for k,v in atleasttwo.iteritems():
		print k,v
	print '\n'
	for k,v in atleastthree.iteritems():
		print k,v
	print '\n'
	for k,v in atleastfour.iteritems():
		print k,v
	print '\n'
	for k,v in atleastfive.iteritems():
		print k,v
	print '\n'
	for k,v in atleastsix.iteritems():
		print k,v

		


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