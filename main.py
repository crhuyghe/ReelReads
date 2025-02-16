# from backend import RecommendationManager
from backend import HistoryManager

# rm = RecommendationManager()

# print(rm.search_by_book(862267))
# print(rm.search_by_movie(671))

hm = HistoryManager(0)

hm.initialize_history({"movie": {671: (5.0, 0), 123: (1.0, 0)}, "book": {862267: (5.0, 0), 659469: (1.0, 0)}})

print(hm.sentiment_vector)
