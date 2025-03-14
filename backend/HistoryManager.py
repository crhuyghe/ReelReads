import numpy as np
import pandas as pd
from typing import Literal

class HistoryManager:
    """This class manages user like histories"""
    def __init__(self, user_id):
        # These are placeholders
        self._book_embeddings, self._movie_embeddings = self._get_embeddings()

        self.user_id = user_id
        self.history = self.get_history()
        self.sentiment_vector = self.get_sentiment_vector()

    def get_history(self):
        """Gets the user's rating history.
        Returns None if the user is new, and a dict object otherwise.
        dict structure: {"movie": {id1: (rating, group), ...}, "book": {id1: (rating, group), ...}}"""
        pass

    def get_sentiment_vector(self):
        """Gets the user's sentiment vector.
        Returns None if the user is new, and a numpy array otherwise."""
        pass

    def add_new_rating(self, identifier, rating, mode: Literal["movie", "book"]):
        """Adds a new rating to the history."""
        if mode == "movie":
            embedding = self._get_movie_embedding_by_id(identifier)
        else:
            embedding = self._get_book_embedding_by_id(identifier)

        self.sentiment_vector = (self.sentiment_vector * 6) + (embedding * (rating - 2))
        self.sentiment_vector /= np.linalg.norm(self.sentiment_vector)

        curr_group = 1
        for key in self.history["movie"].keys():
            if self.history["movie"][key][1] > curr_group:
                curr_group = self.history["movie"][key][1]
        for key in self.history["book"].keys():
            if self.history["book"][key][1] > curr_group:
                curr_group = self.history["book"][key][1]

        self.history[mode][identifier] = (rating, curr_group)

    def initialize_history(self, rated: dict):
        """Takes in a dictionary of rated books and movies and initializes the user history."""
        if len(rated["movie"].keys()) + len(rated["book"].keys()) == 0:  # Some entries are required for initialization
            return
        self.history = rated
        sv = np.zeros(384, dtype=np.float64)

        for key in rated["movie"].keys():
            sv += self._get_movie_embedding_by_id(key) * (rated["movie"][key][0] - 2)

        for key in rated["book"].keys():
            sv += self._get_book_embedding_by_id(key) * (rated["book"][key][0] - 2)

        sv /= np.linalg.norm(sv)


        self.sentiment_vector = sv

        self.save_history()

    def save_history(self):
        """Saves the user's history to the database."""
        pass

    def _get_embeddings(self):
        """Placeholder function. Decide on final database usage before deleting.
        Fetches book and movie embeddings"""
        # Insert logic for querying the database here. Testing versions will use the CSV files.
        return pd.read_csv("database/book_data/book_embeddings.csv"), pd.read_csv("database/movie_data/movie_embeddings.csv")

    def _get_movie_embedding_by_id(self, movie_id):
        """Placeholder for database access."""
        return self._movie_embeddings.loc[self._movie_embeddings["id"] == movie_id].iloc[0, 1:].to_numpy()

    def _get_book_embedding_by_id(self, book_id):
        """Placeholder for database access."""
        return self._book_embeddings.loc[self._book_embeddings["id"] == book_id].iloc[0, 1:].to_numpy()

