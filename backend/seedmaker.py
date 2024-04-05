# reads cleaned CSV file and generates a seeder .sql file

import pandas as pd

df = pd.read_csv('allExercisesClean.csv')

def escape_apostrophes(text):
    return text.replace("'", "''")

with open('seed_data.sql', 'w') as f:

    for index, row in df.iterrows():

        exercise_link = row['exercise-link']
        instructions = str(row['instructions']).replace("'", "''") if pd.notnull(row['instructions']) else ''
        instructions = instructions.replace("o'clock", "o''clock")
        exercise_name = escape_apostrophes(row['name'])
        equipment = escape_apostrophes(row['equipment'])
        bodypart = escape_apostrophes(row['bodypart'])
        image_src = row['image-src']
        

        sql_insert = f"""INSERT INTO exercises (exercise_link, instructions, exercise_name, equipment, bodypart, image_src) 
                         VALUES ('{exercise_link}', '{instructions}', '{exercise_name}', '{equipment}', '{bodypart}', '{image_src}');\n"""

        f.write(sql_insert)

print("SQL file 'seed_data.sql' created successfully!")
