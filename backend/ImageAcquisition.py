import requests
import os
import asyncio

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

async def handle_movie_search(imdb_id):
    try:
        image_url = await asyncio.to_thread(fetch_movie_image, imdb_id)
        if not image_url:
            print("Image not found")
            return
        return image_url
    except Exception as error:
        print("Problem:", error)

def fetch_book_details(isbn):
    api_key = os.getenv('NEXT_PUBLIC_BOOKS_KEY')
    if not api_key:
        print("API key not found. Please set the NEXT_PUBLIC_BOOKS_KEY environment variable.")
        return None
    url = f'https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&key={api_key}'
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch data: {response.status_code}")
        return None
    data = response.json()
    print("API response:", data)  # Print the entire response for debugging
    if 'items' in data and data['items']:
        return data['items'][0]
    print("No items found in the response.")
    return None

async def handle_book_search(isbn):
    try:
        fetched_book = await asyncio.to_thread(fetch_book_details, isbn)
        if not fetched_book:
            print("Book not found")
            return

        book_details = {
            'fetchedTitle': fetched_book['volumeInfo']['title'],
            'identifier': fetched_book['volumeInfo']['industryIdentifiers'][0]['identifier'],
            'author': ", ".join(fetched_book['volumeInfo'].get('authors', ["Unknown"])),
            'genre': ", ".join(fetched_book['volumeInfo'].get('categories', ["Unknown"])),
            'thumbnail': fetched_book['volumeInfo'].get('imageLinks', {}).get('thumbnail')
        }
        return book_details
    except Exception as error:
        print("Problem:", error)
