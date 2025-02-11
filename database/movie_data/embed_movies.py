import pandas as pd
from sentence_transformers import SentenceTransformer

df = pd.read_csv('movies_metadata_trimmed.csv')
sentences = ["\n".join((df["original_title"].values[i], df["overview"].values[i])) for i in range(len(df))]

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
embeddings = model.encode(sentences)

embeddings_df = pd.DataFrame(embeddings)
embeddings_df = pd.concat([df["id"], embeddings_df], axis=1)

embeddings_df.to_csv('movie_embeddings.csv', index=False)
