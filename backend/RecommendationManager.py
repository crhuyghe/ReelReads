import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Literal

class RecommendationManager:
    """This class manages book/movie database querying and recommendation algorithms"""
    def __init__(self):
        self._book_embeddings, self._movie_embeddings = self._get_embeddings()
        self._book_ratings, self._movie_ratings = self._get_ratings()
        self._embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

    def get_recommendations(self, user_vector, user_history):
        """Combines the recommendation techniques to get the top book and movie recommendations for a particular user."""
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

    def _get_ratings(self):
        """Fetches book and movie ratings."""
        return pd.read_csv("database/book_data/als_book_ratings.csv"), pd.concat((pd.read_csv("database/movie_data/als_movie_ratings1.csv"), pd.read_csv("database/movie_data/als_movie_ratings2.csv")))

    def _sentiment_analysis_search(self, vec):
        """Runs a sentiment analysis search on the book and movie datasets using the provided embedding vector.
        Returns two pandas dataframes of similarity scores and movie/book identifiers."""
        movie_sim = pd.concat([self._movie_embeddings["id"], pd.DataFrame(cosine_similarity(np.reshape(vec, (1, -1)), self._movie_embeddings.iloc[:, 1:])[0], columns=["sim"])], axis=1)
        book_sim = pd.concat([self._book_embeddings["ISBN"], pd.DataFrame(cosine_similarity(np.reshape(vec, (1, -1)), self._book_embeddings.iloc[:, 1:])[0], columns=["sim"])], axis=1)

        movie_sim.sort_values(by="sim", ascending=False, inplace=True)
        book_sim.sort_values(by="sim", ascending=False, inplace=True)
        return movie_sim, book_sim

    def collab_filtering_search(self, vec: dict, dataset: Literal["movie", "book"] = "movie", top_n=10):
        """Runs a collaborative filtering search on the movie or book datasets using the provided user vector.
        The vector should be a dictionary where keys are book ISBNs or movie IDs, and values are user ratings.
        Returns a pandas DataFrame of relevance scores for the specified dataset."""

        # Load the correct user-item matrix based on the dataset type
        if dataset == "movie":
            user_item_matrix = self._movie_ratings
        elif dataset == "book":
            user_item_matrix = self._book_ratings
        else:
            raise ValueError("Invalid dataset type. Choose either 'movie' or 'book'.")

        test_user_id = 0

        # Create a new user vector initialized with zeros for all items
        new_user_vector = pd.DataFrame(0, index=[0], columns=user_item_matrix.columns, dtype=float)

        # Assign ratings from the provided dictionary
        for item_id, rating in vec.items():
            if item_id in new_user_vector.columns:
                new_user_vector.loc[0, item_id] = rating  # Use provided rating instead of random assignment

        # Append the new user vector to the user-item matrix
        updated_user_item_matrix = pd.concat([new_user_vector, user_item_matrix], ignore_index=True)

        # Compute cosine similarity
        new_user_vector_values = new_user_vector.values
        cosine_sim = cosine_similarity(new_user_vector_values, updated_user_item_matrix.values)

        # Convert similarity scores to DataFrame
        similarity_df = pd.DataFrame({
            'userId': updated_user_item_matrix.index,
            'cosine_similarity': cosine_sim.flatten()
        }).sort_values(by='cosine_similarity', ascending=False)

        # Exclude the newly added user from the recommendations
        similarity_df = similarity_df[similarity_df['userId'] != 0]

        # Top 10 users to work with
        top_similar_users = similarity_df.head(10)['userId'].tolist()

        # Find items rated by similar users but not by the test user
        test_user_rated_items = set(
            updated_user_item_matrix.loc[test_user_id][updated_user_item_matrix.loc[test_user_id] > 0].index)
        similar_users_ratings = updated_user_item_matrix.loc[top_similar_users]

        # Find items that similar users rated but the test user hasn't rated
        recommendation_candidates = similar_users_ratings.drop(columns=test_user_rated_items, errors='ignore')

        # Calculate average ratings of these items from similar users
        recommendations = recommendation_candidates.mean().reset_index()
        recommendations.columns = ['item_id', 'avg_rating']

        # Sort recommendations by highest average rating
        recommendations = recommendations.sort_values(by='avg_rating', ascending=False)

        return recommendations.head(top_n)

    def _content_filtering_search(self, vec, dataset: Literal["movie", "book"] = "movie", top_n = 10):
        """Runs a content-based filtering search on the movie or book datasets using the provided item vector.
        Returns a pandas dataframe of relevance scores for the specified movie/book dataset."""
        pass
