import pandas as pd

# load the datasets and merge them
df1=pd.read_csv('tmdb_5000_credits.csv')
df2=pd.read_csv('tmdb_5000_movies.csv')
df1.columns = ['id', 'title', 'cast', 'crew']
df2 = df2.merge(df1, on='id')

# print the dataset attributes - will be using df2 for the movie portion of the project
# print(df2.keys())