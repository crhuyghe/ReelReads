import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useUser } from "./UserContext";
import QuizQuestion from "./QuizQuestion";
import ScrollingWrapper from "./ScrollingWrapper";
import axios from "axios";

interface Tile {
  type: "book" | "movie";
  image?: string;
  movie_id?: string;
  title?: string;
  genre?: string;
  release_date?: string;
  movie_rating?: number;
  movie_rating_count?: number;
  runtime?: number;
  book_name?: string;
  description: string;
  author?: string;
  book_rating?: number;
  publisher?: string;
  publication_date?: string;
  book_rating_count?: number;
  isbn?: string;
}

const Welcome = () => {
  const [tilesData, setTilesData] = useState<Tile[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchTilesData = async () => {
      if (!user?.user_id) return; // Ensure user_id exists before making the request

      try {
        const response = await axios.post("http://localhost:5000/recommend", {
          userId: user.user_id,
        });

        if (response.data && Array.isArray(response.data.fetched_data)) {
          setTilesData(response.data.fetched_data);
          console.log("Response formatted: ", response.data.fetched_data);
        } else {
          console.error("Fetched data is not in the expected format");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching recommendations",
          error
        );
      }
    };

    fetchTilesData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center gap-8 my-12 mx-8">
        HOME PAGE
        {tilesData.length > 0 && (
          <ScrollingWrapper
            tiles={tilesData}
            onTileClick={(tile) => console.log(tile)}
          />
        )}
        <div className="w-[70%]">
          {/* QUIZ */}
          <QuizQuestion />
        </div>
      </div>
    </>
  );
};

export default Welcome;
