import pandas as pd
import os

df = pd.concat([pd.read_csv(file) for file in os.listdir() if "ratings_trimmed" in file and file != "ratings_trimmed.csv"], ignore_index=True)
df.to_csv("ratings_trimmed_full.csv", index=False)
