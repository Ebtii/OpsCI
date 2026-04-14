import "./App.css";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import GenreFilter from "./components/GenreFilter";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import Catalogue from "./components/Catalogue";
import Banner from "./components/Banner";

// Composant principal : celui qui sera affiché dans le navigateur
function App() {
  const [STmovies, setMovies] = useState([]); // Tableau de films
  const [search, setSearch] = useState(""); // Props de recherche pour la liaison SearchBar - App
  const [favoris, setFavoris] = useState([]);
  const [vueFavoris, setVueFavoris] = useState(false); // si false : on voit tout | si true : on voit que les favoris
  const movieBan = STmovies[0]; // Film sélectionné pour la bannière
  const [genreActuel, setGenreActuel] = useState("Tous") // Genre sélectionné actuellement
  const genres = ["Tous", "Action", "Comédie", "Drame", "Horreur", "Romantique", "Thriller"];

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
        <Catalogue movies={moviesFiltre} genres={genres} onUpdateFavoris={updateFavoris} favoris={favoris} setGenreActuel={setGenreActuel}/>
      ) : (
        <MovieList movies={moviesFiltre} onUpdateFavoris={updateFavoris} favoris={favoris} />
      )}
    </div>
  );
}

// Le [] vide signifie “ne se relance jamais automatiquement"

export default App; 