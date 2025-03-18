import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Literal

class RecommendationManager:
    """This class manages book/movie database querying and recommendation algorithms"""
    def __init__(self):
        self._book_embeddings, self._movie_embeddings = self._get_embeddings()
        self._embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

    def get_recommendations(self, user_vector, user_history):
        """Combines the recommendation technique to get the top book and movie recommendations for a particular user."""
        pass

    def search_by_query(self, query, top_n=5):
        """Returns the top N most similar books and movies to the provided query."""
        embedding = self._embedding_model.encode(query)
        mdf, bdf = self._sentiment_analysis_search(embedding)

        return mdf.head(top_n), bdf.head(top_n)

    def search_by_movie(self, movie_id, top_n=5):
        """Returns the top N most similar books and movies to the provided movie."""
        movie_embedding = self._movie_embeddings.loc[self._movie_embeddings["id"] == movie_id].iloc[:, 1:].to_numpy()[0]
        mdf, bdf = self._sentiment_analysis_search(movie_embedding)

        return mdf.head(top_n+1).iloc[1:], bdf.head(top_n)

    def search_by_book(self, book_id, top_n=5):
        """Returns the top N most similar books and movies to the provided book."""
        book_embedding = self._book_embeddings.loc[self._book_embeddings["ISBN"] == book_id].iloc[:, 1:].to_numpy()[0]
        mdf, bdf = self._sentiment_analysis_search(book_embedding)

        return mdf.head(top_n), bdf.head(top_n+1).iloc[1:]

    def _get_embeddings(self):
        """Fetches book and movie embeddings."""
        return pd.read_csv("database/book_data/book_embeddings.csv"), pd.read_csv("database/movie_data/movie_embeddings.csv")

    def _sentiment_analysis_search(self, vec):
        """Runs a sentiment analysis search on the book and movie datasets using the provided embedding vector.
        Returns two pandas dataframes of similarity scores and movie/book identifiers."""
        movie_sim = pd.concat([self._movie_embeddings["id"], pd.DataFrame(cosine_similarity(np.reshape(vec, (1, -1)), self._movie_embeddings.iloc[:, 1:])[0], columns=["sim"])], axis=1)
        book_sim = pd.concat([self._book_embeddings["ISBN"], pd.DataFrame(cosine_similarity(np.reshape(vec, (1, -1)), self._book_embeddings.iloc[:, 1:])[0], columns=["sim"])], axis=1)

        movie_sim.sort_values(by="sim", ascending=False, inplace=True)
        book_sim.sort_values(by="sim", ascending=False, inplace=True)
        return movie_sim, book_sim


    def _collab_filtering_search(self, vec, dataset: Literal["movie", "book"] = "movie"):
        """Runs a collaborative filtering search on the movie or book datasets using the provided user vector.
        Returns a pandas dataframe of relevance scores for the specified movie/book dataset."""
        pass

    def _content_filtering_search(self, vec, dataset: Literal["movie", "book"] = "movie"):
        """Runs a content-based filtering search on the movie or book datasets using the provided item vector.
        Returns a pandas dataframe of relevance scores for the specified movie/book dataset."""
        pass
