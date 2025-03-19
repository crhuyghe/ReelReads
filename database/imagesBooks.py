import requests
import os
import pandas as pd
import random

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

def handle_search(isbn):
    try:
        fetched_book = fetch_book_details(isbn)
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
        print(book_details)
    except Exception as error:
        print("Problem:", error)

# Read the CSV file and select 5 random ISBNs
def get_random_isbns(csv_file_path, num_isbns=5):
    df = pd.read_csv(csv_file_path)
    random_isbns = random.sample(df['ISBN'].tolist(), num_isbns)
    return random_isbns

# Example usage
csv_file_path = 'database/book_data/cleaned_books_5000.csv'
random_isbns = get_random_isbns(csv_file_path)
for isbn in random_isbns:
    handle_search(isbn)