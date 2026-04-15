import "./App.css";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import GenreFilter from "./components/GenreFilter";
import NavBar from "./components/NavBar";
import {useEffect, useState} from "react";
import Catalogue from "./components/Catalogue";
import Banner from "./components/Banner";

// Composant principal : celui qui sera affiché dans le navigateur
function App() {
  const [STmovies, setMovies] = useState([]); // Tableau de films
  const [search, setSearch] = useState(""); // Props de recherche pour la liaison SearchBar - App
  const [favoris, setFavoris] = useState([]);
  const [vueFavoris, setVueFavoris] = useState(false); // si false : on voit tout | si true : on voit que les favoris[]
  const [selectMovie, setSelectMovie] = useState(null);
  const [movieBan, setMovieBan] = useState(null) ; // Film sélectionné pour la bannière
  const [genreActuel, setGenreActuel] = useState("Tous") ; // Genre sélectionné actuellement
  const genres = ["Tous", "Action", "Aventure", "Animation", "Comédie", "Crime", "Documentaire",
    "Drame", "Fantastique", "Horreur", "Mystère", "Romance", "Science-Fiction", "Thriller"] ;

  // Tableau de film et Fetch
  useEffect(() => {
    console.log("Début du fetch :");

    fetch("http://127.0.0.1:8000/movies")
      .then(reponse => reponse.json())  // Transforme la réponse en JSON
      .then(data => {
        console.log("Films récupérés :", data); // Affiche les films récupérés dans le terminal
        setMovies(data); // Met les films dans le state STmovies
      })
      .catch(error => console.error("Erreur fetch :", error));
  }, []);

  // Filtrage des films
  // SI vueFavoris = true => tri dans tableau des favoris | sinon STmovies
  const sourceMovies = vueFavoris ? favoris : STmovies;
  const moviesFiltre = sourceMovies.filter(movie => {
    const mTitre = movie.title.toLowerCase().includes(search.toLowerCase());

    if (genreActuel === "Tous") {
      return mTitre;
    }
    // Sinon on filtre par genre
    return mTitre && movie.genre === genreActuel;
  });

  useEffect(() => {
    if (STmovies.length > 0) {
      const changerBan = () => {
        const movieRandom = STmovies[Math.floor(Math.random() * STmovies.length)];
        setMovieBan(movieRandom) ;
      } ;
      changerBan() ;  // Bannière dès le lancement
      const timer = setInterval(changerBan, 10000) ;  // Changement de bannière toutes les 10 secondes
      return () => clearInterval(timer) ;
    }
  }, [STmovies]) ;

  // Fonctionnalité favoris : props pour les favoris
  // Fonction ajouter/retirer
  const updateFavoris = (movie) => {
    const estFavoris = favoris.some(fav => fav.title === movie.title);
    if (estFavoris) { // Si favoris alors il est retiré de la liste
      setFavoris(favoris.filter(fav => fav.title !== movie.title));
    } else {  // Sinon il est ajouté
      setFavoris([...favoris, movie]);
    }
  }

  return (
    <div className="page-principale">
      {/* 1 - Barre de navigation */}
      <NavBar search={search} setSearch={setSearch} vueFavoris={vueFavoris} setVueFavoris={setVueFavoris} favoris={favoris} />

      {/* page de détails du film (Lorsqu'on appuie sur la carte) */}
      {selectMovie ? (
        <div className="page-details">
          <button className="bouton-retour" onClick={() => setSelectMovie(null)}>← Retour au catalogue</button>
          <div className="header-page">
            <img className="affiche-gauche" src={selectMovie.poster_path} alt={selectMovie.title} />
            <div className="infos-page">
              <h1>{selectMovie.title}</h1>
              <p className="informations-film">
                <span> Sortie : {selectMovie.date}</span> | <span>Note : {selectMovie.note}/10 </span>
              </p>
              <h3>Synopsis</h3>
              <p className="descr-page">{selectMovie.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Barre des genres de films */}
          <GenreFilter genreActuel={genreActuel} setGenreActuel={setGenreActuel} genres={genres} />

          {/* 2 - Barre de recherche */}
          <div className="zone-recherche">
            <h1>WatchNext</h1>
            <SearchBar search={search} onSearchChange={setSearch} /> {/* callback pour mettre à jour search */}
          </div>

          {/* Bannière principale */}
          <Banner movie={movieBan} />

          {/* Catalogue */}
          {genreActuel === "Tous" ? (
            <Catalogue movies={moviesFiltre} genres={genres} onUpdateFavoris={updateFavoris} favoris={favoris} setGenreActuel={setGenreActuel} onSelectMovie={setSelectMovie} />
          ) : (
            <MovieList movies={moviesFiltre} onUpdateFavoris={updateFavoris} favoris={favoris} onSelectMovie={setSelectMovie}/>
          )}
        </>
      )}
    </div>
  );
}

// Le [] vide signifie “ne se relance jamais automatiquement"

export default App ; 