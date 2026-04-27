import "./App.css";
import SearchBar from "./components/SearchBar/SearchBar";
import MovieList from "./components/MovieList/MovieList";
import GenreFilter from "./components/GenreFilter/GenreFilter";
import NavBar from "./components/NavBar/NavBar";
import {useEffect, useState} from "react";
import Catalogue from "./components/Catalogue/Catalogue";
import Banner from "./components/Banner/Banner";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import FiltreAvR from "./components/FiltreAvR/FiltreAvR";

// Composant principal : celui qui sera affiché dans le navigateur
function App() {

  // ---------- STATES ----------
  const [STmovies, setMovies] = useState([]); // Tableau de films
  const [search, setSearch] = useState(""); // Props de recherche pour la liaison SearchBar - App
  const [favoris, setFavoris] = useState([]);
  const [vueFavoris, setVueFavoris] = useState(false); // si false : on voit tout | si true : on voit que les favoris[]
  const [selectMovie, setSelectMovie] = useState(null);
  const [movieBan, setMovieBan] = useState(null) ; // Film sélectionné pour la bannière
  const [genreActuel, setGenreActuel] = useState("Tous") ; // Genre sélectionné actuellement
  const [filtres, setFiltres] = useState({genre: "Tous", anneeMin: 1900, noteMin: 0, tri: "recent"}) ; // Identification des critères de filtrage
  
  // ---------- Variables ----------
  const genres = ["Tous", "Action", "Aventure", "Animation", "Comédie", "Crime", "Documentaire",
    "Drame", "Fantastique", "Horreur", "Mystère", "Romance", "Science-Fiction", "Thriller"] ;
  const estFav = selectMovie && favoris.some(f => f.title === selectMovie.title) ;

  // ----------- Chargement des données ---------- 
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
// Mise a jour du film selectionne avec les donnees completes
  const selectionnerMovie = (movie) => {
    setSelectMovie(movie);

    fetch(`http://127.0.0.1:8000/movies/${movie.id}`)
      .then(reponse => {
        if (!reponse.ok) throw new Error("Erreur serveur 500");
        return reponse.json();  // Transforme la réponse en JSON
      })
      .then(data_total => {
        console.log("Films récupérés :", data_total);
        setSelectMovie(data_total);
      })
      .catch(error => console.error("Erreur lors du chargement des détails :", error));
  } ;
 // Recuperation des films favoris depuis le backend   
  useEffect(() => {
  fetch("http://127.0.0.1:8000/favorites")
    .then(res => res.json())
    .then(async (data) => {
    // pour chaque favori, appel a l'API TMDB afin d'obtenir les details completes du film
      const moviesFromTMDB = await Promise.all(
        data.map(async (fav) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${fav.tmdb_id}?api_key=c1df2212a64a5876a6429d7c4aa3ea06`
          );
          return res.json();
        })
      );
    
      setFavoris(moviesFromTMDB);
    })
    .catch(err => console.error(err));
}, []);
   

  // ---------- Filtrage des films -----------
  const sourceMovies = vueFavoris ? favoris : STmovies;

  const moviesFiltree = vueFavoris
  ? favoris
  : sourceMovies.filter(movie => {
      const movieParSearch = movie.title.toLowerCase().includes(search.toLowerCase());
      const movieParGenre = genreActuel === "Tous" || (Array.isArray(movie.genre) && movie.genre.includes(genreActuel));
      const movieParAnnee = movie.year >= filtres.anneeMin;
      const movieParNote = movie.note >= filtres.noteMin;

      return movieParGenre && movieParAnnee && movieParNote && movieParSearch;
    }).sort((a, b) => {
      if (filtres.tri === "recent") return b.year - a.year;
      if (filtres.tri === "note") return b.note - a.note;
      return 0;
    });

  // ---------- Gestion de la bannière (auto-changement) ---------- 
  useEffect(() => {
    if (STmovies.length > 0) {
      const changerBan = () => {
        const movieRandom = STmovies[Math.floor(Math.random() * STmovies.length)];
        setMovieBan(movieRandom) ;
      } ;
      changerBan() ;  // Bannière dès le lancement
      const timer = setInterval(changerBan, 9000) ;  // Changement de bannière toutes les 10 secondes
      return () => clearInterval(timer) ;
    }
  }, [STmovies]) ;

  // ---------- Fonctionnalités navigation ----------
  // Gestion de la Recherche pour qu'elle fonctionne partout
  const handleSearch = (val) => {
    setSearch(val) ;
  } ;

  // Gestion de l'Accueil pour qu'il fonctionne partout
  const retourAccueil = () => {
    setSelectMovie(null) ;  
    setVueFavoris(false) ;
    setSearch("") ;
    setGenreActuel("Tous") ;
    setFiltres({genre: "Tous", anneeMin: 1900, noteMin: 0, tri: "recent"}); // Réinitialisation des filtres
  } ;

  // Fermeture du film ouvert lors du clic pour voir la liste des Favoris
  const afficherFavoris = () => {
    setSelectMovie(null) ;    // Fermeture du film ouvert pour accéder à toute la liste 
    setVueFavoris(true) ;
    setSearch("") ; // Vidage de la recherche pour voir tous les favoris directement
  }
  const updateFavoris = async (movie) => {
  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN =",token);
    const movieTmdbId = movie.tmdb_id ?? movie.id;

    const resGet = await fetch("http://127.0.0.1:8000/favorites", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const favorisDB = await resGet.json();
    const favoriExiste = favorisDB.find(fav => fav.tmdb_id === movieTmdbId);

    if (favoriExiste) {
      await fetch(`http://127.0.0.1:8000/favorites/${favoriExiste.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFavoris(prev => prev.filter(fav => fav.tmdb_id !== movieTmdbId));
    } else {
      await fetch("http://127.0.0.1:8000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: movie.title,
          tmdb_id: movieTmdbId,
          poster_path: movie.poster_path
        })
      });
    }

    const resFinal = await fetch("http://127.0.0.1:8000/favorites", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await resFinal.json();

    const moviesFromTMDB = await Promise.all(
      data.map(async (fav) => {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${fav.tmdb_id}?api_key=c1df2212a64a5876a6429d7c4aa3ea06`
        );
        const movieData = await res.json();

        return {
          ...movieData,
          favorite_id: fav.id,
          tmdb_id: fav.tmdb_id
        };
      })
    );

    setFavoris(moviesFromTMDB);

  } catch (error) {
    console.error("Erreur favoris :", error);
  }
};

  
    
     
  
 
  console.log("Nombre de films à afficher :", moviesFiltree.length);
  return (
    <div className="page-principale">
      {/* Barre de navigation */}
      <NavBar search={search} setSearch={handleSearch} vueFavoris={vueFavoris} setVueFavoris={afficherFavoris} favoris={favoris} onLogoClick={retourAccueil} STmovies={STmovies} onSelectMovie={selectionnerMovie}/>

      {selectMovie ? (
        /* Vue détaillée du film */
        <MovieDetails movie={selectMovie} onRetourAccueil={() => setSelectMovie(null)} onUpdateFavoris={updateFavoris} estFav={favoris.some(f => f.title === selectMovie.title)}/>
      ) : (
        /* Vue Liste/Catalogue des films */
        <>
          <GenreFilter genreActuel={genreActuel} setGenreActuel={setGenreActuel} genres={genres} />

          {/* Barre de recherche */}
          <div className="zone-recherche">
            <h1>WatchNext</h1>
            <SearchBar search={search} onSearchChange={setSearch} /> {/* callback pour mettre à jour search */}
          </div>

          {/* Bannière principale */}
          {/* Affichage de la bannière seulement si on n'est pas dans les favoris et qu'aucun est sélectionné */}
          {!vueFavoris && !selectMovie && <Banner movie={movieBan} onSelectMovie={selectionnerMovie}/> }

          {/* Filtres avancés */}
          <FiltreAvR filtres={filtres} setFiltres={setFiltres} />

          {/* Affichage : Catalogue || Liste */}
          {genreActuel === "Tous" && !vueFavoris ? (
            <Catalogue movies={moviesFiltree} genres={genres} onUpdateFavoris={updateFavoris} favoris={favoris} setGenreActuel={setGenreActuel} onSelectMovie={selectionnerMovie} />
          ) : (
            <MovieList movies={moviesFiltree} onUpdateFavoris={updateFavoris} favoris={favoris} onSelectMovie={selectionnerMovie}/>
          )}
        </>
      )}
    </div>
  );
}

// Le [] vide signifie “ne se relance jamais automatiquement"

export default App ;