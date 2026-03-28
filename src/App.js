import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = '798437bd6f271472d1f9f0ace4d7a280'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  

  useEffect(() => {
    const getMovies = async () => {
      const endpoint = searchTerm
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${page}`
        : `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}&page=${page}`;

      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getMovies();
  }, [searchTerm, sortBy, page]);

  return (
    <div className="container">
      <header className="navbar">
        <h1>Movie Explorer</h1>
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
  <option value="" disabled>Sort By</option>
  <option value="primary_release_date.asc">Release Date (Asc)</option>
  <option value="primary_release_date.desc">Release Date (Desc)</option>
  <option value="vote_average.asc">Rating (Asc)</option>
  <option value="vote_average.desc">Rating (Desc)</option>
</select>
        </div>
      </header>

      <main className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img 
              src={movie.poster_path ? IMG_PATH + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'} 
              alt={movie.title} 
            />
            <div className="movie-details">
              <h3>{movie.title}</h3>
              <p>Release Date: {movie.release_date}</p>
              <p>Rating: {movie.vote_average}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="pagination-bar">
  <button 
    disabled={page === 1} 
    onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }}
  >
    Previous
  </button>
  
  <span className="page-info">
    Page {page} of {totalPages}
  </span>
  
  <button 
    disabled={page >= totalPages} 
    onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}
  >
    Next
  </button>
</footer>
    </div>
  );
}

export default App;