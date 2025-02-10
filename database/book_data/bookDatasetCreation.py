# Must run "recombine.py" before running this file
import pandas as pd

allBooks = pd.read_csv("book_data_cleaned.csv")
print(allBooks.keys())
print("Books in the dataset: ", len(allBooks))

# Remove any books that have CountsOfReview equal to 0
allBooks = allBooks[allBooks['CountsOfReview'] != 0]
print("Books in the dataset after removing books with 0 reviews: ", len(allBooks))

# Remove any books that have Ratings equal to 0
allBooks = allBooks[allBooks['Rating'] != 0]
print("Books in the dataset after removing books with Rating = 0: ", len(allBooks))

# Remove any books that are missing certain attributes
allBooks = allBooks.dropna(subset=['Name', 'Description', 'Id', 'Language', 'ISBN'])
print("Books in the dataset after removing books with missing attributes: ", len(allBooks))

# Remove any title that has a '#' in it
allBooks = allBooks[~allBooks['Name'].str.contains('#')]
print("Books in the dataset after removing books with '#' in the title: ", len(allBooks))

# Remove any entries that language != 'eng'
allBooks = allBooks[allBooks['Language'] == 'eng']
print("Books in the dataset after removing books that are not in English: ", len(allBooks))

# Remove duplicate entries
allBooks = allBooks.drop_duplicates(subset='Name', keep='first')
print("Books in the dataset after removing duplicate entries: ", len(allBooks))

# Sort the dataset by CountsOfReview in descending order
allBooks = allBooks.sort_values(by='CountsOfReview', ascending=False)

# Save the first 5000 books to a new csv file
allBooks = allBooks.head(5000)
allBooks.to_csv("cleaned_books_5000.csv", index=False)