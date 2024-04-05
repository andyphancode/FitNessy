# merges all scraped data from csv files in csv directory

import os
import pandas as pd


directory = './csv/'


dfs = []


for filename in os.listdir(directory):
    if filename.endswith(".csv"):

        df = pd.read_csv(os.path.join(directory, filename), encoding='utf-8')

        dfs.append(df)


merged_df = pd.concat(dfs, ignore_index=True)


merged_df.drop_duplicates(subset=['name'], inplace=True)


merged_df.to_csv('allExercises.csv', index=False)

