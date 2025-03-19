import requests
import os
import pandas as pd
import random

def fetch_movie_image(imdb_id):
    api_key = os.getenv('TMDB_API_KEY')
    if not api_key:
        print("API key not found. Please set the TMDB_API_KEY environment variable.")
        return None
    url = f'https://api.themoviedb.org/3/find/{imdb_id}?api_key={api_key}&external_source=imdb_id'
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch data: {response.status_code}")
        return None
    data = response.json()
    if 'movie_results' in data and data['movie_results']:
        poster_path = data['movie_results'][0].get('poster_path')
        if poster_path:
            image_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
            return image_url
    print("No image found for the given IMDb ID.")
    return None

def handle_movie_search(imdb_id):
    try:
        image_url = fetch_movie_image(imdb_id)
        if not image_url:
            print("Image not found")
            return
        print(f"Image URL: {image_url}")
    except Exception as error:
        print("Problem:", error)

# Read the CSV file and select 5 random IMDb IDs
def get_random_imdb_ids(csv_file_path, num_movies=5):
    df = pd.read_csv(csv_file_path)
    random_imdb_ids = random.sample(df['imdb_id'].tolist(), num_movies)
    return random_imdb_ids

# Example usage
csv_file_path = 'movies_metadata_trimmed.csv'
random_imdb_ids = get_random_imdb_ids(csv_file_path)
for imdb_id in random_imdb_ids:
    handle_movie_search(imdb_id)