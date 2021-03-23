from flask import Flask, request, jsonify, make_response
from flask_restplus import Api, Resource, fields
from flask_cors import CORS, cross_origin
import time
from model import model

gb_model = model()



flask_app = Flask(__name__)


CORS(flask_app)

app = Api(app = flask_app, 
		  version = "1.0", 
		  title = "Iris Plant identifier", 
		  description = "Predict the type of iris plant")

name_space = app.namespace('prediction', description='Prediction APIs')

@name_space.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	@app.expect(model)		
	def post(self):
		formData = request.json
		print(formData)

		#create minNutrition 
		#if values are wrong
		try:
				minNutrition = {
					'calories' : int(formData['calories']),
					'fat' : int(formData['protein']),
					'Protein' : int(formData['fats']),
					'Carbohydrate' : int(formData['carbs'])
				}

				print(minNutrition)
				gb_model.add_data(minNutrition=minNutrition  , allergen_input = formData['allergens']  , tags_input= formData['tags'])
				gb_model.initalize_model()
				gb_model.printSolution()

							
				#if no solution 
				try:
					result = {'Total cost' :'£' + str(round(gb_model.m.objVal,2))  , 'recipes' : gb_model.reicpe_details  ,'ingreds' : gb_model.ingred_details}
					#if values not entered properly 
					
				except AttributeError:
					result = 'No Solution Found, probably too many tags'
			
		except ValueError:
			result = 'You missed or incorrectly entered some values'

		print(jsonify({'result': [result]}))
	

		return jsonify({'result': [result]})
		# try: 
		# 	formData = request.json
		# 	return jsonify(formData)
		# 	# data = [val for val in formData.values()]
		# 	# prediction = classifier.predict(np.array(data).reshape(1, -1))
		# 	# types = { 0: "Iris Setosa", 1: "Iris Versicolour ", 2: "Iris Virginica"}
		# 	# response = jsonify({
		# 	# 	"statusCode": 200,
		# 	# 	"status": "Prediction made",
		# 	# 	"result": "The type of iris plant is: " + types[prediction[0]]
		# 	# 	})
		# 	# response.headers.add('Access-Control-Allow-Origin', '*')
		# 	# print('asdfasdfsafdasdfas')
		# 	# print(response)
		# 	# return response
		# except Exception as error:
		# 	print('asdfasdfsafdasdfas')
		# 	return jsonify({
		# 		"statusCode": 500,
		# 		"status": "Could not make prediction",
		# 		"error": str(error)
		# 	})