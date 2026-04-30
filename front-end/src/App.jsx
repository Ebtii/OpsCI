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
import Profil from "./components/Profil/Profil";

// Composant principal : celui qui sera affiché dans le navigateur
function App() {

  // ---------- STATES ----------

  // Film 
  const [STmovies, setMovies] = useState([]); // Liste dynamique des films (populaires ou recherche)
  const [populaires, setPopulaires] = useState([]); // Cache pour les films populaires (utilisé pour la bannière)
  const [favoris, setFavoris] = useState([]); // Liste des favoris de l'utilisateur connecté

  // Filtrage 
  const [genreActuel, setGenreActuel] = useState("Tous") ; // Genre sélectionné actuellement
  const [filtres, setFiltres] = useState({genre: "Tous", anneeMin: 1900, noteMin: 0, tri: "recent"}) ; // Identification des critères de filtrage
  
  // Navigation
  const [search, setSearch] = useState(""); // mot de recherche entré par l'utilisateur
  const [vueFavoris, setVueFavoris] = useState(false); // si false : on voit tout | si true : on voit que les favoris[]
  const [selectMovie, setSelectMovie] = useState(null); // Stocke le film associé
  const [movieBan, setMovieBan] = useState(null) ; // Film sélectionné alétoirement pour la bannière

  // Authentification
  const [showAuth, setShowAuth] = useState(false);  // Gestion de la connexion et l'inscription
  const [estLogin, setEstLogin] = useState(!!localStorage.getItem("token")) ; // token
  const [showProfil, setShowProfil] = useState(false);


  // ---------- Variables ----------
  const genres = ["Tous", "Action", "Aventure", "Animation", "Comédie", "Crime", "Documentaire",
    "Drame", "Fantastique", "Horreur", "Mystère", "Romance", "Science-Fiction", "Thriller"] ;

  // Vérification de si le film sélectionné actuellement est déjà dans les favoris
  const estFav = selectMovie && favoris.some(f => Number(f.movie_id) === Number(selectMovie.id));

  // ----------- Chargement des données ----------

  // Récupération des films populaires
  useEffect(() => {
    console.log("Début du fetch :");
    fetch(`${import.meta.env.VITE_API_URL}/movies`) 
      .then(reponse => reponse.json())  // Transforme la réponse en JSON
      .then(data => {
        const unique = data.filter((movie, index, self) => 
          index === self.findIndex(f => f.id === movie.id))
        console.log("Films récupérés :", data); // Affiche les films récupérés dans le terminal
        setMovies(unique); // Met les films dans le state STmovies
        setPopulaires(unique); 
      })
      .catch(error => console.error("Erreur fetch :", error));
  }, []);
  

// Récupération des données complètes complètes du film sélectionné
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

 // Rechargement des favoris dès une connexion/déconnexion
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      chargerFavoris(token) ;
    }
  }, [estLogin]);

  // Chargement des données grâce au référence dans la base de données
  const chargerFavoris = (token) => {
    fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}`}
    })
      .then(res => {
        if (res.status === 401) {
          // Si le token a expiré alors on se déconnecte automatiquement
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

    if (vueFavoris) return movieParSearch ; // filtrage textuel (recherche seulement) s'applique (à améliorer !)

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
    setShowProfil(false);
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
    setShowProfil(false);
  } ;

  // ---------- Gestion des favoris (ajout/suppression) ----------
  const updateFavoris = async (movie) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowAuth(true) ;
      return ; 
    }

    try {
      // Association des ID qu'il vient de TMDB ou notre BDD
      const movieTmdbId = movie.movie_id || movie.id;
      console.log("movie reçu :", movie)
      console.log("movieTmdbId :", movieTmdbId)

      const favoriExiste = favoris.find(fav => Number(fav.movie_id) === Number(movieTmdbId));
      console.log("favoriExiste :", favoriExiste) 

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

  // Recherche dans la base de donnée globale de l'API TMDB
  useEffect(() => {  // Si la barre de recherche est vide = films populaires par défaut
    if (search.trim() === "") {
      if (populaires.length > 0) {
        setMovies(populaires) ;
      }
      return;
    }  
    
    const timer = setTimeout(() => {    
      fetch(`${import.meta.env.VITE_API_URL}/movies/search?query=${search}`)      
        .then(res => res.json())      
        .then(data => {        
          setMovies(data); // remplacement de STmovies par les résultats de la recherche globale      
        })      
        .catch(error => console.error("Erreur recherche globale:", error));  
    }, 500); // attente 300ms après la saisie  
    return () => clearTimeout(timer); // si l'utilisateur entre une autre lettre on réinitialise le timer
  }, [search]);

  console.log("Nombre de films à afficher :", moviesFiltree.length);

  // Interface utilisateur

  return (
    <div className="page-principale">
      {/* Barre de navigation */}
      <NavBar search={search} setSearch={handleSearch} vueFavoris={vueFavoris} setVueFavoris={afficherFavoris} 
        favoris={favoris} onLogoClick={retourAccueil} STmovies={STmovies} onSelectMovie={selectionnerMovie} 
        estLogin={estLogin} onOpenAuth={() => setShowAuth(true)} onLogout={handleLogout} onOpenProfil={() => setShowProfil(true)}/>

      {selectMovie ? (
        /* Vue détaillée du film */
        <MovieDetails movie={selectMovie} onRetourAccueil={() => setSelectMovie(null)} onUpdateFavoris={updateFavoris} estFav={estFav}/>
      ) : showProfil ? (
        /* Vue Profil */
        <Profil onClose={() => setShowProfil(false)} favoris={favoris} onLogout={handleLogout} />
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
          {/* Affichage de la bannière seulement si on n'est pas dans les favoris et qu'aucun film est sélectionné */}
          {!vueFavoris && !selectMovie && <Banner movie={movieBan} onSelectMovie={selectionnerMovie}/> }

          {/* Filtres avancés */}
          <FiltreAvR filtres={filtres} setFiltres={setFiltres} />

          {/* Affichage conditionnel: Catalogue (par genre) || Liste */}
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