import pandas as pd
import os

df = pd.concat([pd.read_csv(file) for file in os.listdir() if "book_data" in file], ignore_index=True)
df.to_csv("book_data_cleaned.csv", index=False)
