import { Genre, Movie } from "./index.types"

// Time complexity: Max(O(N * M), O(N * LOG N))

type GenreList = {
  [x in Genre]?: boolean;
};

export const getFilteredMovies = ({ genres }: { genres: Genre[] }): Movie[] => {
  let movies: Movie[] = require('./db.json').movies;
  if (genres.length === 0) {
    return [movies[Math.floor(Math.random() * movies.length)]];
  }

  const counts: { [x: number]: number } = movies.reduce((counts, movie) => {
    const genreList: GenreList = movie.genres.reduce((list, genre) => ({
      ...list,
      [genre]: true
    }), {})

    const count = genres.reduce((count, genre) => (count + (genreList[genre] ? 1 : 0)), 0)

    return {
      ...counts,
      [movie.id]: (count === movie.genres.length ? count : 0)
    }
  }, {})

  movies = movies.filter(movie => counts[movie.id]);
  return movies.sort((movieA: Movie, movieB: Movie) => counts[movieB.id] - counts[movieA.id]);
}
