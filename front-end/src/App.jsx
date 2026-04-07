import "./App.css" ; 
import SearchBar from "./components/SearchBar" ;
import MovieList from "./components/MovieList";
import {useEffect, useState} from "react" ;

// Composant principal : celui qui sera affiché dans le navigateur
function App() {
  const[STmovies, setMovies] = useState([]) ; // Tableau de films
  const [search, setSearch] = useState("") ; // Props de recherche pour la liaison SearchBar - App
  const [favoris, setFavoris] = useState([]) ;
  const [vueFavoris, setVueFavoris] = useState(false) ; // si false : on voit tout | si true : on voit que les favoris

  // Tableau de film et Fetch
  useEffect(() => {
    console.log("Début du fetch :") ;

    fetch("http://127.0.0.1:8000/movies")
      .then(reponse => reponse.json())  // Transforme la réponse en JSON
      .then(data => {
        console.log("Films récupérés :", data); // Affiche les films récupérés dans le terminal
        setMovies(data) ; // Met les films dans le state STmovies
      }) 
      .catch(error => console.error("Erreur fetch :", error)) ;
  }, []) ;

  // Filtrage des films
  // SI vueFavoris = true => tri dans tableau des favoris | sinon STmovies
  const sourceMovies = vueFavoris ? favoris : STmovies ; 
  const moviesFiltre = sourceMovies.filter(movies => 
    movies.title.toLowerCase().includes(search.toLowerCase())) ;

  // Fonctionnalité favoris : props pour les favoris
    // Fonction ajouter/retirer
    const updateFavoris = (movie) => { 
      const estFavoris = favoris.some(fav => fav.title === movie.title) ;
      if (estFavoris) { // Si favoris alors il est retiré de la liste
        setFavoris(favoris.filter(fav => fav.title !== movie.title)) ;
      } else {  // Sinon il est ajouté
        setFavoris([...favoris, movie]) ;
      }
    } 

  return (
    <div className="page-principale">

      {/* 1 - Barre de navigation */}
      <nav className="barnav">
        {/* Zone logo */}
        <div className="conteneur-logo">
          <img className="img-logo" src="public/images/logoCrop.png" alt="logo WatchNext" />
          <span className="nom-site">WatchNext</span>
        </div>

        {/* Zone contenant : barre de recherche, Accueil, Favoris */}
        <div className="groupe-droite">
          <SearchBar search={search} onSearchChange={setSearch} />

          {/* Bouton Accueil et Favoris */}
          <div className="menu-navigation">
            <button className={!vueFavoris ? "onglet-actif" : "onglet"} onClick={() => setVueFavoris(false)}>
              Accueil
            </button>
            <button className={vueFavoris ? "onglet-actif" : "onglet"} onClick={() => setVueFavoris(true)}>
              Favoris ({favoris.length})
            </button>
          </div>
        </div>
      </nav>

        {/* Barre des genres de films */}
      <div className="barre-genres"> 
        {["Action", "Aventure", "Comédie", "Horreur", "SF", "Drame", "Thriller", "Documentaire"].map((genre) => (
          <button key={genre} className="badge-genre">
            {genre}
          </button>
        ))}
      </div>

      {/* 2 - Barre de recherche */}
      <div className="zone-recherche">
        <h1>WatchNext</h1>
        <SearchBar search={search} onSearchChange={setSearch} /> {/* callback pour mettre à jour search */}
      </div>

      {/* Bannière principale */}
      <header className="ban-principale">
        <div className="voile-ban">
          <div className="contenu-ban">
            <h1 className="titre-ban">Inception</h1>
            <p className="description-ban">
              Dom Cobb est un voleur expérimenté très recherché pour ses talents dans l'univers trouble de l'espionnage industriel, Cobb est aussi devenu un fugitif traqué dans le monde entier. Cependant, une ultime mission pourrait lui permettre de retrouver sa vie d'avant.
            </p>
            <div className="bouton-ban">
              <button className="bouton-play">▶ Lecture</button>
              <button className="bouton-info">ⓘ En savoir plus</button>
            </div>
          </div>
        </div>
      </header>


      <section className="section-suggestion">
        <div className="entete-suggestion">
          <h2>Action</h2>
          <button className="voir-tout">Tout voir</button>
        </div>
        <MovieList 
          movies={moviesFiltre.filter(movie => movie.genre === "Action").slice(0,5)} 
          onUpdateFavoris={updateFavoris} favoris={favoris} 
        />
      </section>
    </div>
  );
}

// Le [] vide signifie “ne se relance jamais automatiquement"

export default App; 