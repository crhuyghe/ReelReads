import pandas as pd
from sentence_transformers import SentenceTransformer

df = pd.read_csv('cleaned_books_5000.csv')
sentences = ["\n".join((df["Name"].values[i], df["Description"].values[i])) for i in range(len(df))]

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
embeddings = model.encode(sentences)

embeddings_df = pd.DataFrame(embeddings)
embeddings_df = pd.concat([df["ISBN"], embeddings_df], axis=1)

embeddings_df.to_csv('book_embeddings.csv', index=False)
