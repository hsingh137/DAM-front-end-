
import pandas as pd
import os 
import re
import numpy as np

price_ingred_df = pd.read_csv('C:\\Users\\Samy Mohamad\\price_ingred_df.csv')
recipes = pd.read_csv('C:\\Users\\Samy Mohamad\\recipes.csv')



# create allergens list
allergens_dict = {}
allergens_unique = set()
for a in range(len(recipes)):
    x = ast.literal_eval(recipes.allergens[a])
    if x == ['No Allergen yay']:
        x = []
    allergens_dict[recipes['name'][a]] = x
    for i in x:
        allergens_unique.add(i)

# create allergens dictionary
recipe_allergensValue = {}
for r in price_ingred_df['recipe'].unique():
    for a in allergens_unique:
        if a in allergens_dict[r]:
            recipe_allergensValue[(r,a)] = 1
        else:
            recipe_allergensValue[(r,a)] = 0



list_temp=list(price_ingred_df['ingreds'].unique())
fridge = dict((el,0) for el in list_temp)

x=1
fridge['Diced Chicken Thigh']= x 
fridge['Baby Corn']= x
fridge['Green Beans']= x
fridge['Tomato Puree']= x
fridge['Zanzibar Curry Spice Mix']= x
fridge['Reduced Fat Creme Fraiche']= x
fridge['Chicken Stock Powder']= x
fridge['Vine Tomatoes']= x
fridge['Baby Gem Lettuce']= x
fridge['Ginger']= x
fridge['Brioche Bun']= x
fridge['Natural Yoghurt']= x
fridge['Basmati Rice']= 1
fridge['Wheat Rigatoni Pasta']=35