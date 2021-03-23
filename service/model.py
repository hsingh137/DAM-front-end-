import gurobipy as gp
from gurobipy import GRB,quicksum
import pandas as pd
import os 
import re
import numpy as np
import math


class model():
    def __init__(self): 
        print('Importing data')
        price_ingred_df = pd.read_csv('price_ingred_df.csv')
        recipes = pd.read_csv('recipes.csv')
        self.recipes = pd.read_csv('recipes.csv')
        self.price_ingred_df=price_ingred_df.drop_duplicates(['ingred','recipe'])

        print('formatting data')
        # create allergens list
        self.allergens_dict = {}
        self.allergens_unique = set()
        for a in range(len(self.recipes)):
            x = eval(self.recipes.allergens[a])
            if x == ['No Allergen yay']:
                x = []
            self.allergens_dict[self.recipes['name'][a]] = x
            for i in x:
                self.allergens_unique.add(i)

        

             # create tags dictionary
        tags_dict = {}
        tags_unique = set()
        for a in range(len(recipes)):
            x = eval(recipes.tags[a])
            if x == ['No Tag']:
                x = []
            tags_dict[recipes['name'][a]] = x
            for i in x:
                tags_unique.add(i)

        self.tags_dict = tags_dict
        self.tags_unique = tags_unique
        print(tags_unique)
    
        recipe_tagsValue = {}
        for r in price_ingred_df['recipe'].unique():
            for a in tags_unique:
                if a in tags_dict[r]:
                    recipe_tagsValue[(r,a)] = 0
                else:
                    recipe_tagsValue[(r,a)] = 1

        self.recipe_tagsValue = recipe_tagsValue

        self.tags_unique = tags_unique

        # create allergens dictionary
        self.recipe_allergensValue = {}
        for r in self.price_ingred_df['recipe'].unique():
            for a in self.allergens_unique:
                if a in self.allergens_dict[r]:
                    self.recipe_allergensValue[(r,a)] = 1
                else:
                    self.recipe_allergensValue[(r,a)] = 0


        #create recipe_ingredient variable
        index_tuples = [(name, other) for name in price_ingred_df['recipe'].unique()
                for other in price_ingred_df.loc[price_ingred_df['recipe']== name , 'ingreds'].unique()  ]
        multi_ix = pd.MultiIndex.from_tuples(index_tuples)
        df_temp = pd.DataFrame(price_ingred_df['stand_quant'].values, index = multi_ix , columns = ['stand_quant'])
        self.recipe_ingredamount = df_temp['stand_quant'].to_dict()

        #determing ingred price 
        ingpred_price_temp = price_ingred_df[['ingreds' , 'Price']].drop_duplicates(keep = 'first')
        self.ingred_price= {
        }
        for i,row in ingpred_price_temp.iterrows():
            self.ingred_price[row['ingreds']] = row['Price']


    def add_data(self, fridge_input = {'Diced Chicken Thigh' : 2 ,  'Baby Corn' : 1 , 'Green Beans' :3 } ,
                            minNutrition = {'calories': 9240, #cal
                                                    'Protein': 132, #grams 
                                                    'fat': 30 , #check latererr
                                                    'Carbohydrate': 132 # grams
                                                } ,
                            allergen_input  = ['Milk']  , tags_input = ['Veggie']
                                                ):
        print('adding data')
        list_temp=list(self.price_ingred_df['ingreds'].unique())
        self.fridge = dict((el,0) for el in list_temp)
        for key in fridge_input.keys():
            self.fridge[key] = fridge_input[key]

        self.categories = ['calories', 'Protein', 'fat' , 'Carbohydrate']
        self.minNutrition = minNutrition
        
        #innputs for tags and allergens 
        self.allergens_input = allergen_input
        self.tags_input = tags_input

        recipe_nutritionValues = {
        }
        for i,row in self.recipes.iterrows():
            if row['name'] in self.price_ingred_df['recipe'].unique():
                recipe_nutritionValues[(row['name'] , 'calories')] =    float(row['calories'])
                recipe_nutritionValues[(row['name'] , 'fat')] = float(row['fat'])
                recipe_nutritionValues[(row['name'] , 'Protein')] = float(row['Protein'])
                recipe_nutritionValues[(row['name'] , 'Carbohydrate')] = float(row['Carbohydrate'])

        self.recipe_nutritionValues = recipe_nutritionValues







        

    def initalize_model(self):
        #Insert your code here:
        m2 = gp.Model('diet_price')


        #decision variables
        #recipe binary
        recipes_var_bin = m2.addVars(self.price_ingred_df['recipe'].unique().tolist(), vtype = GRB.BINARY)
        #ingredients needed 
        ingreds = m2.addVars(self.price_ingred_df['ingreds'].unique().tolist() ,lb = 0)
        final_ingreds = m2.addVars(self.price_ingred_df['ingreds'].unique().tolist() ,lb = 0)
        ingreds1 = m2.addVars(self.price_ingred_df['ingreds'].unique().tolist(),lb = 0)
        New_rec_bin=recipes_var_bin = m2.addVars(self.price_ingred_df['recipe'].unique().tolist(), vtype = GRB.BINARY)

        #adding recipe nutrionvalues 
        # Recommended daily values for different categories of nutrients (ignore the unit)

        #constraints 

        m2.addConstrs(quicksum(recipes_var_bin[r]*self.recipe_allergensValue[r,i] for i in self.allergens_input )==0 for r in self.price_ingred_df['recipe'].unique())
        m2.addConstrs(quicksum(recipes_var_bin[r]*self.recipe_tagsValue[r,i] for i in self.tags_input )==0 for r in self.price_ingred_df['recipe'].unique())
        #sum of the recipes needs to be less greater than min nutrition 
        recipe_nutrition_const = m2.addConstrs((quicksum(2 * self.recipe_nutritionValues[f,c] * recipes_var_bin[f] for f in self.price_ingred_df['recipe'].unique())
                    >= self.minNutrition[c] for c in self.categories), "Minimum_requirements")

        #only 14 recipes
        num_of_rec = m2.addConstr(quicksum(recipes_var_bin[f] for f in self.price_ingred_df['recipe'].unique()) == 7 , 'number_of_recipes')

        import math
        #ingredient constraint : the totla number of ingredients used across reciepes is que
        for i in self.price_ingred_df['ingred'].unique():
                m2.addConstr(ingreds[i]+self.fridge[i]  >= (quicksum(self.recipe_ingredamount[r,i]*recipes_var_bin[r] for r in self.price_ingred_df['recipe'][self.price_ingred_df['ingred'] == i].unique())))

        #objective function 
        m2.setObjective(quicksum(ingreds[i]*self.ingred_price[i] for i in self.price_ingred_df['ingred'].unique()) , GRB.MINIMIZE)

        m2.optimize()

        self.ingreds = ingreds
        self.m = m2
        self.recipes_var_bin  =recipes_var_bin 
        self.New_rec_bin = New_rec_bin
        print('Model Set')


    def printSolution(self) :
        '''
            A best practice is to define a function that prints the solution of the model (if it's not too big to display)
        '''
        price_ingred_df = self.price_ingred_df
        ingreds = self.ingreds
        m2 = self.m
        recipe_nutritionValues = self.recipe_nutritionValues
        recipes_var_bin = self.recipes_var_bin
        recipe_ingredamount = self.recipe_ingredamount
        fridge = self.fridge
        New_rec_bin = self.New_rec_bin
        if m2.status == GRB.OPTIMAL:
            print('\nTotal Price for 7 Recipes: %g' % m2.objVal)
            print('\nIngredients:')
            self.ingred_details = []
            for f in price_ingred_df['ingred'].unique():
                ingred_dict = {}
                if ingreds[f].x > 0:
                    ingred_dict['Name'] = f
                    print(f, round(price_ingred_df['Quantity'][price_ingred_df['ingred'] == f].values[0]*ingreds[f].x,3), price_ingred_df['QUnit'][price_ingred_df['ingred'] == f].values[0])
                    ingred_dict['Quantity'] = str(round(price_ingred_df['Quantity'][price_ingred_df['ingred'] == f].values[0]*ingreds[f].x,3)) + ' ' + str( price_ingred_df['QUnit'][price_ingred_df['ingred'] == f].values[0])
                    self.ingred_details.append(ingred_dict)
               
                # %s means that the first argument printed is a string
                # %g means that the second argument printed is a real number            
                # You can print as many variables as you wish
         
         
                # E.g., "%s %s %g % (a,b,c)" will print two strings a and b followed by the number c
            print('\nEstimated Left Over Ingredients')
            list_temp12=list(price_ingred_df['ingreds'].unique())
            used = dict((el,0) for el in list_temp12)
            for r in price_ingred_df['recipe'].unique():
                if recipes_var_bin[r].x > 0:
                    for i in price_ingred_df['ingreds'][price_ingred_df['recipe'] == r].unique():
                        used[i] = used[i]+ recipe_ingredamount[r,i]
            for i in price_ingred_df['ingreds'].unique():
                left = fridge[i] + ingreds[i].x - used[i]
                if left > 0:
                    print(i,math.ceil(left)*price_ingred_df['Quantity'][price_ingred_df['ingred']==i].iloc[0],price_ingred_df['QUnit'][price_ingred_df['ingred']==i].iloc[0])
            
            
            
            print('\nRecipes and Nutrition:')
            self.reicpe_details = []
            for r in price_ingred_df['recipe'].unique():
                if New_rec_bin[r].x > 0:
                    print( )
                    print(r)
                    nut_values = {}
                    nut_values['Name'] = r
                    for c in  self.categories:
                        print(c, recipe_nutritionValues[r,c])

                        nut_values[c] = recipe_nutritionValues[r,c]*2
                    self.reicpe_details.append(nut_values)
        
        else:
            print('No solution')

            
