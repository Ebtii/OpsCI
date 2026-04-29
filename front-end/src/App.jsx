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
import FormAuthInscr from "./components/FormAuthInscr/FormAuthInscr";

// Composant principal : celui qui sera affiché dans le navigateur
function App() {

  // ---------- STATES ----------
  const [STmovies, setMovies] = useState([]); // Tableau de films
  const [populaires, setPopulaires] = useState([]);
  const [search, setSearch] = useState(""); // Props de recherche pour la liaison SearchBar - App
  const [favoris, setFavoris] = useState([]);
  const [vueFavoris, setVueFavoris] = useState(false); // si false : on voit tout | si true : on voit que les favoris[]
  const [selectMovie, setSelectMovie] = useState(null);
  const [movieBan, setMovieBan] = useState(null) ; // Film sélectionné pour la bannière
  const [genreActuel, setGenreActuel] = useState("Tous") ; // Genre sélectionné actuellement
  const [filtres, setFiltres] = useState({genre: "Tous", anneeMin: 1900, noteMin: 0, tri: "recent"}) ; // Identification des critères de filtrage
  // Relatifs à l''état de l'authentification
  const [showAuth, setShowAuth] = useState(false); 
  const [estLogin, setEstLogin] = useState(!!localStorage.getItem("token")) ;


  // ---------- Variables ----------
  const genres = ["Tous", "Action", "Aventure", "Animation", "Comédie", "Crime", "Documentaire",
    "Drame", "Fantastique", "Horreur", "Mystère", "Romance", "Science-Fiction", "Thriller"] ;
  const estFav = selectMovie && favoris.some(f => Number(f.movie_id) === Number(selectMovie.id));

  // ----------- Chargement des données ---------- 
  useEffect(() => {
    console.log("Début du fetch :");
    fetch(`${import.meta.env.VITE_API_URL}/movies`) 
      .then(reponse => reponse.json())  // Transforme la réponse en JSON
      .then(data => {
        console.log("Films récupérés :", data); // Affiche les films récupérés dans le terminal
        setMovies(data); // Met les films dans le state STmovies
        setPopulaires(data); 
      })
      .catch(error => console.error("Erreur fetch :", error));
  }, []);
  

// Mise à jour du film selectionné avec les données complètes
  const selectionnerMovie = (movie) => {
    // Réinitialisation de l'état pour obliger le composant à se réactualiser
    setSelectMovie(null);

    // Harmonisation des IDs (TMDB et BDD)
    const idFetch = movie.movie_id || movie.id;

    if (!idFetch) {
      console.error("Impossible de trouver l'ID du film");
      return;
    }

    // Récupération des données complètes du film
    fetch(`${import.meta.env.VITE_API_URL}/movies/${idFetch}`)
      .then(reponse => {
        if (!reponse.ok) throw new Error("Film non trouvé sur TMDB");
        return reponse.json();  // Transforme la réponse en JSON
      })
      .then(data => {
        console.log("Films récupérés :", data);
        setSelectMovie(data); 
      })
      .catch(error => { 
        console.error("Erreur lors du chargement des détails :", error);
        setSelectMovie(movie);
      });
  };

 //  ---------- Chargement des favoris -----------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      chargerFavoris(token) ;
    }
  }, [estLogin]);

  const chargerFavoris = (token) => {
    fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}`}
    })
      .then(res => {
        if (res.status === 401) {
          // Si le token a expiré alors on se déconnecte
          handleLogout();
          throw new Error("La session a expirée");
        }
        return res.json() ;
      })
      .then(data => { 
        console.log("Favoris reçus du back:", data);
        setFavoris(Array.isArray(data) ? data : []);
    })
      .catch(error => {
      console.error("Erreur favoris :", error);
      setFavoris([]);
    });
  };
  
  // ---------- Filtrage des films -----------
  const sourceMovies = vueFavoris ? favoris : STmovies;

  const moviesFiltree = sourceMovies.filter(movie => {
    const titre = movie.movie_title || movie.title || ""; // Si film favori alors le titre est dans movie_title sinon movie.title
    const movieParSearch = titre.toLowerCase().includes(search.toLowerCase());

    if (vueFavoris) return movieParSearch ;

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
    if (populaires.length > 0) {
      const changerBan = () => {
        const movieRandom = populaires[Math.floor(Math.random() * populaires.length)];
        setMovieBan(movieRandom) ;
      } ;
      changerBan() ;  // Bannière dès le lancement
      const timer = setInterval(changerBan, 8000) ;  // Changement de bannière toutes les 8 secondes
      return () => clearInterval(timer) ;
    }
  }, [populaires]) ;

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
    if (!estLogin) {
      setShowAuth(true); // redirection vers l'écran login si non connecté
      return;
    }
    setSelectMovie(null) ;    // Fermeture du film ouvert pour accéder à toute la liste 
    setVueFavoris(true) ;
    setSearch("") ; // Vidage de la recherche pour voir tous les favoris directement
  }

  // ---------- Gestion des favoris (ajout/suppression) ----------
  const updateFavoris = async (movie) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowAuth(true) ;
      return ; 
    }

    try {
      // Association des ID qu'il vient de TMDB ou notre BDD
      const movieTmdbId = movie.id;

      //const favorisDB = await resGet.json();
      const favoriExiste = favoris.find(fav => fav.movie_id === movieTmdbId);

      if (favoriExiste) {
        // Suppression 
        const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites/${favoriExiste.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          setFavoris(prev => prev.filter(fav => fav.movie_id !== movieTmdbId));
        }

      } else {
        // Ajout 
        const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
          body: JSON.stringify({movie_title: movie.title || movie.movie_title, movie_id: movieTmdbId, poster_path: movie.poster_path})
        });

        if (res.ok) { // Rafraichissement de la liste après modification de la BDD
          chargerFavoris(token);
        }
      }
    } catch (error) {
      console.error("Erreur favoris :", error);
    }
  };

//  ---------- Gestion de l'authentification/inscription ----------

  // Fonction appelée par le formulaire quand le login est un succès
  const handleLoginSucces = () => {
    setEstLogin(true);
    setShowAuth(false); // fermeture de la page d'authentification
    const token = localStorage.getItem("token")
    chargerFavoris(token); // récupération direct des favoris après le login
    console.log("Utilisateur connecté avec succès !");
  }

  // Fonction pour la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token") ;
    setEstLogin(false); 
    setFavoris([]); // pour éviter de se retrouver avec les favoris de l'utilisateur précedent
    setVueFavoris(false);
    alert("Vous avez été déconnecté.");
  }

//  ---------- Gestion de la recherche ----------  
  useEffect(() => {  // Si la barre de recherche est vide = films populaires par défaut
    if (search.trim() === "") {
      fetch(`${import.meta.env.VITE_API_URL}/movies`)      
        .then(res => res.json())      
        .then(data => setMovies(data));    
      return;  
    }  
    
    // Si l'utilisateur entre quelque chose on interroge la totalité de la base TMDB 
    const timer = setTimeout(() => {    
      fetch(`${import.meta.env.VITE_API_URL}/movies/search?query=${search}`)      
        .then(res => res.json())      
        .then(data => {        
          setMovies(data); // remplacement de STmovies par les résultats de la recherche globale      
        })      
        .catch(error => console.error("Erreur recherche globale:", error));  
    }, 500); // attente 300ms après la saisie  
    return () => clearTimeout(timer);
  }, [search]);

  console.log("Nombre de films à afficher :", moviesFiltree.length);

  return (
    <div className="page-principale">
      {/* Barre de navigation */}
      <NavBar search={search} setSearch={handleSearch} vueFavoris={vueFavoris} setVueFavoris={afficherFavoris} 
        favoris={favoris} onLogoClick={retourAccueil} STmovies={STmovies} onSelectMovie={selectionnerMovie} 
        estLogin={estLogin} onOpenAuth={() => setShowAuth(true)} onLogout={handleLogout}/>

      {selectMovie ? (
        /* Vue détaillée du film */
        <MovieDetails movie={selectMovie} onRetourAccueil={() => setSelectMovie(null)} onUpdateFavoris={updateFavoris} estFav={estFav}/>
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

      {/* Authentification/Inscription */}
      {showAuth && (
        <FormAuthInscr onLoginSucces={handleLoginSucces} onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}

// Le [] vide signifie “ne se relance jamais automatiquement"

export default App ;