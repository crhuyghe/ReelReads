import pandas as pd
import numpy as np
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Literal

class RecommendationManager:
    """This class manages book/movie database querying and recommendation algorithms"""
    def __init__(self):
        self._book_embeddings, self._movie_embeddings = self._get_embeddings()
        self._book_ratings, self._movie_ratings = self._get_ratings()
        self._embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

    def get_recommendations(self, user_vector, user_history, top_n=10):
        """Combines the recommendation techniques to get the top book and movie recommendations for a particular user."""
        alpha, beta = 1, .5  # weight factor for recommendation techniques

        if len(user_history["movie"].keys()) == 0 and len(user_history["book"].keys()) == 0:
            with open("./database/default_recommendations.json") as rec_file:
                default_recommendations = json.load(rec_file)

            return (pd.DataFrame(default_recommendations["movies"], columns=["id"]).head(top_n),
                    pd.DataFrame(default_recommendations["books"], columns=["ISBN"]).head(top_n))

        else:
            movie_sim, book_sim = self._sentiment_analysis_search(user_vector)

            if len(user_history["movie"].keys()) > 0:
                movie_collab = self._collab_filtering_search(user_history, "movie")

                # Join recommendation sets on id
                joined_movies = pd.merge(movie_sim, movie_collab.rename(columns={"item_id": "id"}).astype(dtype={"id": "int64"}), on="id", how="inner")

                # Calculate new rating score by combining similarity and collaborative filtering score
                joined_movies["score"] = (((joined_movies["sim"] * 4) + 1) * alpha) + (joined_movies["avg_rating"] * beta)

                # Sort data by combined score and get the top recommendations
                joined_movies = joined_movies.sort_values(by=["score"], ascending=False)
                joined_movies = joined_movies.loc[~joined_movies["id"].isin(user_history["movie"].keys())].reset_index(drop=True)
            else:
                joined_movies = movie_sim.sort_values(by=["sim"], ascending=False).reset_index(drop=True)

            if len(user_history["book"].keys()) > 0:
                book_collab = self._collab_filtering_search(user_history, "book")

                # Join recommendation sets on ISBN
                joined_books = pd.merge(book_sim, book_collab.rename(columns={"item_id": "ISBN"}), on="ISBN", how="inner")

                # Calculate new rating score by combining similarity and collaborative filtering score
                joined_books["score"] = (((joined_books["sim"] * 4) + 1) * alpha) + (joined_books["avg_rating"] * beta)

                # Sort data by combined score and get the top recommendations
                joined_books = joined_books.sort_values(by=["score"], ascending=False)
                joined_books = joined_books.loc[~joined_books["ISBN"].isin(user_history["book"].keys())].reset_index(drop=True)
            else:
                joined_books = book_sim.sort_values(by=["sim"], ascending=False).reset_index(drop=True)

            return joined_movies.head(top_n), joined_books.head(top_n)

    def search_by_query(self, query, top_n=5):
        """Returns the top N most similar books and movies to the provided query."""
        embedding = self._embedding_model.encode(query)
        mdf, bdf = self._sentiment_analysis_search(embedding)

        mdf.sort_values(by="sim", ascending=False, inplace=True)
        bdf.sort_values(by="sim", ascending=False, inplace=True)

        return mdf.head(top_n), bdf.head(top_n)

    def search_by_movie(self, movie_id, top_n=5):
        """Returns the top N most similar books and movies to the provided movie."""
        movie_embedding = self._movie_embeddings.loc[self._movie_embeddings["id"] == movie_id].iloc[:, 1:].to_numpy()[0]
        mdf, bdf = self._sentiment_analysis_search(movie_embedding)

        mdf.sort_values(by="sim", ascending=False, inplace=True)
        bdf.sort_values(by="sim", ascending=False, inplace=True)

        return mdf.head(top_n+1).iloc[1:], bdf.head(top_n)

    def search_by_book(self, book_id, top_n=5):
        """Returns the top N most similar books and movies to the provided book."""
        book_embedding = self._book_embeddings.loc[self._book_embeddings["ISBN"] == book_id].iloc[:, 1:].to_numpy()[0]
        mdf, bdf = self._sentiment_analysis_search(book_embedding)

        mdf.sort_values(by="sim", ascending=False, inplace=True)
        bdf.sort_values(by="sim", ascending=False, inplace=True)

        return mdf.head(top_n), bdf.head(top_n+1).iloc[1:]

    def update_user_vector(self, user_vector, identifier, content_type, rating):
        """Takes in previous user data and returns an updated user vector"""
        if content_type == "movie":
            embedding = self._movie_embeddings.loc[self._movie_embeddings["id"] == identifier].iloc[0, 1:].to_numpy()
        else:
            embedding = self._book_embeddings.loc[self._book_embeddings["ISBN"] == identifier].iloc[0, 1:].to_numpy()

        new_vector = (np.array(user_vector) * 6) + (embedding * (rating - 2))
        new_vector /= np.linalg.norm(new_vector)
        return new_vector

    def _get_embeddings(self):
        """Fetches book and movie embeddings."""
        return pd.read_csv("database/book_data/book_embeddings.csv"), pd.read_csv("database/movie_data/movie_embeddings.csv")

    def _get_ratings(self):
        """Fetches book and movie ratings."""
        return (pd.concat((pd.read_csv("database/book_data/als_book_ratings1.csv"),
                           pd.read_csv("database/book_data/als_book_ratings2.csv"))),
                pd.concat((pd.read_csv("database/movie_data/als_movie_ratings1.csv"),
                           pd.read_csv("database/movie_data/als_movie_ratings2.csv"))))

    def _sentiment_analysis_search(self, vec):
        """Runs a sentiment analysis search on the book and movie datasets using the provided embedding vector.
        Returns two pandas dataframes of similarity scores and movie/book identifiers."""
        movie_sim = pd.concat([self._movie_embeddings["id"],
                               pd.DataFrame(cosine_similarity(np.reshape(vec, (1, -1)),
                                                              self._movie_embeddings.iloc[:, 1:])[0],
                                            columns=["sim"])], axis=1)
        book_sim = pd.concat([self._book_embeddings["ISBN"],
                              pd.DataFrame(cosine_similarity(np.reshape(vec, (1, -1)),
                                                             self._book_embeddings.iloc[:, 1:])[0],
                                           columns=["sim"])], axis=1)

        return movie_sim, book_sim

    def _collab_filtering_search(self, vec: dict, dataset: Literal["movie", "book"] = "movie"):
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

        return recommendations

    def _content_filtering_search(self, vec, dataset: Literal["movie", "book"] = "movie", top_n=10):
        """Runs a content-based filtering search on the movie or book datasets using the provided item vector.
        Returns a pandas dataframe of relevance scores for the specified movie/book dataset."""
        pass

# vec = np.array([-0.061658751088031774, 0.04405042067268526, -0.023276485751232888, 0.021316980294993234, -0.053274264569950644, -0.05776648390244475, -0.0042151859454797455, 0.01081213360061882, 0.037657176881077954, -0.08448645414866449, -0.062202766715782454, 0.015217267791588093, -0.035055621721221744, -0.03433681086413372, -0.022197638309410704, -0.040867469901733, -0.02141649158109159, 0.06026556400475264, -0.0425704484716127, -0.05565938096065997, 0.039608720350657586, 0.05670304616785245, 0.008728282707109446, 0.011394430623057396, 0.009962086908599248, -0.020059447428302287, 0.056387874410676865, -0.01980521285762736, -0.1024619091370807, -0.0494930733006378, 0.00624830029486879, -0.0412452917331817, -0.10359863145125713, 0.010071850134623424, -0.12761731696569026, 0.06726884226395552, 0.009429214181078371, 0.06634659717605929, 0.05632232465064283, -0.06318953005092194, -0.038937869213732344, 0.03574647594571059, -0.0011331518795530899, 0.00855765281058829, -0.044244565224671975, -0.04108236891650533, -0.03193291802726612, -0.042874186382262286, -0.024008804219625368, 0.014138942408064766, 0.05981264352014482, 0.02135883549572412, -0.057602275664066886, 0.02225201586827997, 0.08798089932024153, 0.07130885447948565, -0.0441455023181521, -0.13882250089741185, 0.060398535439166165, 0.008287443937511997, -0.049589280787833055, -0.0019681589620267935, -0.021409627091310883, 0.05844200446814763, -0.01848400744088302, -0.05554796320757899, 0.044056064768767125, -0.019553658755161726, -0.02532849360153414, -0.04714425487470401, 0.021307163970199595, 0.01471525614138981, 0.06637221097448155, -0.04854640963319014, 0.018660364844967785, 0.03594248749138145, -0.09857575338494258, 0.0011625996955573782, -0.0010148768504087504, -0.06106957208362827, 0.028774360220547465, -0.01750276916921655, 0.02724955939554937, 0.052687953979320655, 0.024834288099565404, 0.018765906046024253, 5.322549684653673e-05, -0.015581698170173198, -0.02935384173064271, -0.001862494791832427, 0.07232543711407202, 0.019314419938813117, 0.02082215306119711, 0.11470503501079389, 0.0005805406231958384, 0.05757755203139425, 0.07897152472880381, -0.012366288910755389, -0.09524033821543626, 0.028325524902401426, 0.02641254033691562, -0.02893215871909766, 0.08006321427991477, 0.013622145034928045, 0.05796429903078494, -0.02373341982845423, 0.044522930979005684, -0.0362655173076723, 0.007101059284667054, -0.024828181809810588, -0.012140850486284953, -0.11519157132061587, -0.01133322942091441, -0.09985641905123703, 0.06710585164530596, 0.06283873784966688, 0.0019467412860996783, 0.11391361062407844, -0.0709798365529484, 0.0746110526482546, -0.04300138769311869, 0.153794811409068, -0.0032311938347804135, 0.0060665367637369825, -0.043286270870307, -0.0333567639807496, -0.07885097049256037, 5.100443021824408e-35, 0.006316455882395495, -0.015363806074652216, -0.03913777375522303, 0.05925366346441944, -0.027686423057011345, 0.041107575763692915, -0.038567984651500145, 0.04495343563502765, 0.004802784943662947, -0.033782933701445535, -0.03159156617743291, -0.056009783635118375, -0.08572614035254303, -0.03649169901684969, -0.00371519615737067, 0.03987997264090071, -0.019280128909656222, -0.013556417768659085, 0.03595670924798941, -0.03623927523977353, -0.027396428135171326, 0.04240103776998905, 0.023701217139102435, 0.07146292568165173, -0.0173398112666918, 0.010337751700562607, -0.01407829535518449, -0.002765291865062363, -0.06164606644564752, 0.03828341002626017, -0.013160870954127431, -0.002032227678284703, -0.03339848433026981, -0.05967598087884321, -0.07506565789480406, -0.03453216400302008, -0.0044960770584634695, -0.043483491184091665, -0.0004996900877752655, 0.009722220213081535, -0.033757627911329156, -0.03395265465564266, -0.07676557986042815, -0.05160353609225787, -0.06054052209659314, 0.01345068449453752, 0.02046033874591654, 0.06511942192776693, -0.01984187097577892, 0.07140638467667976, 0.002137026054639378, -0.03997321139416606, 0.005971164910770151, -0.017021279241494425, -0.08359906850297226, -0.009547155518295223, -6.237311770977955e-05, -0.03414616792720997, 0.06095904478902747, 0.02114410077806873, 0.041505225247887495, 0.04125367949521255, -0.015704467860981935, 0.10378998969621017, -0.012352177374172532, -0.005873950876518894, -0.028780520066054954, -0.046684245250521075, -0.045630187704251056, -0.02137532960814214, -0.04142779816150096, -0.008376043887191948, -0.07896197234521532, -0.02885008501600772, 0.011183074292887814, -0.04331436154283502, -0.036687618561487854, -0.04190798451125719, -0.10525348845721796, 0.03310962702907829, 0.037485171774029255, 0.024539603006896706, -0.007034370613182143, -0.038302025501278224, 0.0012603119154007318, -0.03032549382646258, 0.048353245421904646, -0.11530347844949308, 0.045934605586169644, 0.051056217000153274, 0.05720608106468811, -0.04193960242252973, 0.020425364413938087, -0.013793162227917787, 0.07416542144728669, -3.93726791556566e-33, 0.05791612791734019, -0.0961219934234714, 0.07410133167394391, 0.022281470221933396, 0.03230075942777607, 0.03523233151992878, -0.12436498327942253, 0.03418501009411975, -0.0043493791396680545, -0.013489623123136143, -0.09525818555152898, 0.10326419710331484, 0.08227546163345359, -0.04651704183488618, 0.08064300513651272, -0.04943894573366558, 0.042516009815693985, -0.011718102395511723, 0.04489130785340508, 0.04463159989456448, 0.06149784075212718, 0.013553684627070666, -0.1540247343959986, -0.0977052514621023, -0.004909758851710548, 0.011068376555231659, -0.03908384235954374, -0.03751033149577876, -0.024220250503944073, 0.06916715909364547, 0.020330743986375657, -0.041528846164545836, 0.047227459967463414, -0.01290923481740763, -0.03453576403130893, 0.05280704973434425, 0.06006568194775676, -0.0728306463493751, -0.0009767026179661837, -0.0459404497147999, 0.05829430461628743, 0.008314241384978199, 0.04629422478468897, 0.0054191948179735504, 0.01942246841892272, -0.015067421681090805, 0.09665759290826662, 0.15517997491501032, 0.028295137090936666, -0.028721864258435367, -0.03478565383509293, 0.016621108343542596, 0.04822550027342855, -0.06619625101207016, 0.055398391120763675, -0.00014572700123026232, 0.01618783907042738, -0.015078409052180879, 0.0048486011373405575, -0.03066619900661273, -0.09106890082406136, -0.0389278782779484, 0.03112554662760714, 0.08338354423524208, -0.08324828097146657, 0.051130118068899895, -0.011378374642696766, 0.028902618902060667, 0.010784173037066419, -0.06942757024704606, -0.011206047647731865, -0.008248479576503322, -0.05517385777736179, -0.04746379435302815, 0.048346694627766376, 0.08230013338311959, 0.028719296891556244, 0.029938183822570383, -0.03258116754927764, -0.011202810744731177, 0.092613330663212, 0.008776453012060283, 0.008607566154559173, -0.05360007949726174, 0.027380832273442172, -0.08103040510626326, 0.06588286747617937, -0.007644830273308057, 0.0035955867438540157, -0.08077553757266517, 0.0897119216532742, 0.009886295482088041, 0.05219471777374735, -0.02150280253113828, 0.09957327466568774, -6.308826975549411e-08, -0.05432161387764841, 0.050088186357711256, 0.044657110860923346, -0.04506292476767211, 0.05573217460321823, -0.02338123312851571, 0.056971758198066186, 0.05538968681942211, 0.009570798849750628, 0.06282298993532184, 0.02798976621353289, 0.02656118783844345, -0.007455054920062269, -0.046642947227559635, 0.06716353202730979, 0.04484466024918283, 0.008789901388471941, -0.0381909787214523, -0.004516671210843555, 0.00616831660014815, -0.011072382553410838, -0.07254977472388287, 0.094948026233648, -0.052957296969344134, 0.0020289980238502306, -0.0021090535588318255, 0.016301309213212958, -0.1029289125403744, 0.05867867960602214, 0.08504530689447598, 0.08326629756158037, -0.03768156086266529, 0.01990139798578376, -0.04146255001964882, -0.020306962458217493, -0.0020366450200508808, -0.05156924226125132, 0.011069461618199296, 0.08488758687559463, -0.027118542092343562, 0.04240202187436888, -0.056495470872985315, -0.0028596212626913415, 0.03091069961293365, -0.0824917131972264, -0.029784464371019347, 0.06437974359159437, -0.04669709888207495, -0.038034493049759734, -0.04099452188376167, -0.05440970642769343, 0.031454966431382736, 0.10881016237458115, -0.06182316489295954, 0.03722361702409489, 0.011437725205872516, 0.002450719229763416, 0.10866885687328498, -0.08974306175857737, -0.02620153446014652, 0.0660126356297878, 0.029001601488891072, 0.001967215810652103, 0.03754562232524926])
# history = {"book": {"0747532699": 4.6, "0545128285": 4.7, "0618343997": 4.5, "0345272609": 4.5}, "movie": {671: 4.3, 674: 4.5, 767: 4.0, 672: 4.5, 123: 5.0, 120: 4.9, 122: 4.0}}
#
# rm = RecommendationManager()
# print(rm.get_recommendations(vec, history))
