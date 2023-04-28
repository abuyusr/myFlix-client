// Calling functions and Importing other components into Mainview.
import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView} from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

// Creating state variable and Exposing the MainView components.
export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser? storedUser : null);
  const [token, setToken] = useState(storedToken? storedToken : null);


// Loading Data from an API
useEffect(() => {
  if (!token) {
    return;
  }
  setLoading(true);
  fetch("https://zaflix.herokuapp.com/movies", {
    headers: {Authorization: `Bearer ${token}`}
  })
    .then((response) => response.json())
    .then((data) => {
      // stops loading after response received
      setLoading(false);
      console.log('data', data);
      const moviesFromApi = data.map((movie) => {
        return {
        // value names match to API database
        id: movie._id,
        title: movie.Title,
        image: movie.ImagePath,
        description: movie.Description,
        genre: movie.Genre.Name,
        director: movie.Director.Name,
        release: movie.Release
        }
      });
      setMovies(moviesFromApi);
    })
}, [token]);

if (!user) {
  return (
    <>
      <LoginView onLoggedIn={(user, token) => {
        setUser(user);
        setToken(token);
      }} />
      or
      <SignupView />
    </>
  );
}






if (selectedMovie) {
  return (
    <>
    <button onClick={() => { setUser(null); setToken(null); localStorage.clear();
    }}
    > Logout 
    </button>
    <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    </>
  );
}

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
  
};