# Must run recombine.py in the movie_data folder before running this file
import pandas as pd
import numpy as np
file_path = '../database/movie_data/ratings_trimmed.csv'
ratings = pd.read_csv(file_path)

user_item_matrix = ratings.pivot_table(index='userId', columns='movieId', values='rating')
user_item_matrix = user_item_matrix.to_numpy()

def als(user_matrix, k=10, lambda_reg=10, iterations=10):
    # Replace NaNs with 0s to prevent propagation issues
    user_matrix = np.nan_to_num(user_matrix, nan=0.0)

    num_users, num_movies = user_matrix.shape
    U = np.random.rand(num_users, k) * 0.1
    V = np.random.rand(num_movies, k) * 0.1
    mask = (user_matrix > 0).astype(int)  # Identify known ratings

    for iter in range(iterations):
        for i in range(num_users):
            if np.sum(mask[i, :]) == 0:  # Skip users with no ratings
                continue
            V_i = V[mask[i, :] == 1]
            A = V_i.T @ V_i + lambda_reg * np.eye(k) + 1e-6 * np.eye(k)  # Stability fix
            b = V_i.T @ user_matrix[i, mask[i, :] == 1]
            U[i, :] = np.clip(np.linalg.solve(A, b), -5, 5)  # Prevent exploding values

        for j in range(num_movies):
            if np.sum(mask[:, j]) == 0:  # Skip movies with no ratings
                continue
            U_j = U[mask[:, j] == 1]
            A = U_j.T @ U_j + lambda_reg * np.eye(k) + 1e-6 * np.eye(k)
            b = U_j.T @ user_matrix[mask[:, j] == 1, j]
            V[j, :] = np.clip(np.linalg.solve(A, b), -5, 5)

        predicted_matrix = U @ V.T
        error = np.linalg.norm(mask * (user_matrix - predicted_matrix), ord='fro')

        if np.isnan(error):
            print("NaN detected! Stopping training.")
            break

        print(f"Iteration {iter + 1}: Reconstruction Error = {error:.4f}")

    return U, V

U, V = als(user_item_matrix, k=10, lambda_reg=1, iterations=100)
predicted_ratings = U @ V.T
print(predicted_ratings)

# Save to csv file named als_movie_ratings.csv
np.savetxt("als_movie_ratings.csv", predicted_ratings, delimiter=",")