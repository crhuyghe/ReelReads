import pandas as pd
import numpy as np
file_path = '../database/book_data/cleaned_books_5000.csv'
ratings = pd.read_csv(file_path)

user_item_matrix = ratings.pivot_table(index='Id', columns='ISBN', values='Rating')
user_item_matrix = user_item_matrix.to_numpy()
book_ids = ratings['ISBN'].unique()

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
            if np.sum(mask[:, j]) == 0:  # Skip books with no ratings
                continue
            U_j = U[mask[:, j] == 1]
            A = U_j.T @ U_j + lambda_reg * np.eye(k) + 1e-6 * np.eye(k)
            b = U_j.T @ user_matrix[mask[:, j] == 1, j]
            V[j, :] = np.clip(np.linalg.solve(A, b), -5, 5)

        predicted_matrix = U @ V.T
        predicted_matrix = np.clip(predicted_matrix, 1, 5)  # Round values to be within 1 to 5
        error = np.linalg.norm(mask * (user_matrix - predicted_matrix), ord='fro')

        if np.isnan(error):
            print("NaN detected! Stopping training.")
            break

        print(f"Iteration {iter + 1}: Reconstruction Error = {error:.4f}")

    return U, V

U, V = als(user_item_matrix, k=10, lambda_reg=1, iterations=100)
predicted_ratings = U @ V.T
predicted_ratings = np.clip(predicted_ratings, 1, 5)  # Round values to be within 1 to 5

# Convert the predicted ratings to a DataFrame and include book IDs
predicted_ratings_df = pd.DataFrame(predicted_ratings, columns=book_ids)

# Split the DataFrame into 5 equal parts
num_splits = 5
split_dfs = np.array_split(predicted_ratings_df, num_splits)

# Save each part as a separate .csv file
for i, split_df in enumerate(split_dfs):
    split_df.to_csv(f"als_book_ratings_part_{i+1}.csv", index=False)

print(predicted_ratings_df)