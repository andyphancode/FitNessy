# cleans csv file by removing extra columns, removing extra content in instructions column, and renaming link column

import pandas as pd


df = pd.read_csv('allExercises.csv')


columns_to_remove = ['web-scraper-order', 'web-scraper-start-url', 'exercise-selector']


df.drop(columns=columns_to_remove, inplace=True)


df.rename(columns={'exercise-selector-href': 'exercise-link'}, inplace=True)


def clean_instructions(text):

    cleaned_text = text.replace("Share:", "").strip().replace("\n\n", "\n")
    return cleaned_text


df['instructions'] = df['instructions'].apply(clean_instructions)


df.to_csv('allExercisesClean.csv', index=False)
