import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // const fetchMoviesHandler = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);

  //     const data = await axios.get('https://swapi.dev/api/film/');
  //     const transformedMovies = data.data.results.map((movie) => ({
  //       id: movie.episode_id,
  //       title: movie.title,
  //       openingText: movie.opening_crawl,
  //       releaseDate: movie.release_date,
  //     }));

  //     setMovies(transformedMovies);
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.log(err);
  //     setError(err.message);
  //   }
  // };

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://react-http-67642-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json'
      );
      if (!response.ok) throw new Error('Something went wrong');

      const data = await response.json();

      const loadedMovies = [];

      for (const [key, { title, openingText, releaseDate }] of Object.entries(
        data
      )) {
        loadedMovies.push({ id: key, title, openingText, releaseDate });
      }

      setMovies(loadedMovies);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      'https://react-http-67642-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json',
      {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log(data);
  }

  let content = <p>No movies were found</p>;
  if (movies.length > 0) content = <MoviesList movies={movies} />;
  if (error) content = <p>{error}</p>;
  if (isLoading) content = <p>Loading...</p>;

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
