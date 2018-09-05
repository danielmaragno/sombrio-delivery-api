
from os import listdir
from pymongo import MongoClient
import argparse

UTILIDADES_HOME = '/imagens/utilidades/'
COMPLETE_PATH = 'public'+UTILIDADES_HOME

# Parsing arguments
parser = argparse.ArgumentParser()
parser.add_argument('--db', action = 'store', dest = 'db_name',
					required = True, help = 'Nome do banco de dados')
arguments = parser.parse_args()

# Functions

def generateProductName(image_name):
	# Cleaning '.jpg' and '.png' from name
	raw_image_name = image_name.split('.')[0]
	# Capitalize first letter of each word
	capitalize_words_list = [word.title() for word in raw_image_name.split('-')]
	# join space between the words
	product_name = " ".join(capitalize_words_list)
	
	return product_name

def generateData(image_name):
	data = {
		'url': UTILIDADES_HOME+image_name,
		'product': generateProductName(image_name)
	}
	return data

def upsertMongoDb(db, data):
	print("Inserting "+data['product']+ " ...")

	db['images'].update(
		{'url': data['url']},
		{'$set' : data},
		True #upsert
	)

# DB Connect

mongodb_client = MongoClient('localhost', 27015)
db = mongodb_client[arguments.db_name]

# Main

ls = listdir(COMPLETE_PATH)

for image_name in ls:
	
	data = generateData(image_name)
	upsertMongoDb(db, data)
	print()

print("Closing MongoDB connection...")
mongodb_client.close()

print("Bye!")
