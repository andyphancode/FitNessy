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
        

        sql_insert = f"""INSERT INTO fitnessy_exercises (exercise_link, instructions, exercise_name, equipment, bodypart, image_src) 
                         VALUES ('{exercise_link}', '{instructions}', '{exercise_name}', '{equipment}', '{bodypart}', '{image_src}');\n"""

        # f.write("""INSERT INTO fitnessy_users (username, password, email) VALUES ('testuser', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q','test@test.com');""")

        f.write(sql_insert)

        # f.write("""INSERT INTO user_exercises (username, exercise_id, exercise_date, rep1, rep2, rep3, rir1, rir2, rir3) VALUES ('testuser', '1', '2000-01-01', '5', '5', '5', '1', '1', '1'); INSERT INTO user_exercises (username, exercise_id, exercise_date, rep1, rep2, rep3, rir1, rir2, rir3) VALUES ('testuser', '2', '2000-01-01', '2', '2', '2', '2', '2', '2');""")

print("SQL file 'seed_data.sql' created successfully!")
