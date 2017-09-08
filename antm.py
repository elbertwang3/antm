import csv

def main():

	mostFCOplace()

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


if __name__ == "__main__":
	main()