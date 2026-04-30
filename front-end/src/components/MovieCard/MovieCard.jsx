import "./MovieCard.css";

/**
 * Regroupe les informations relatives à la carte d'un film
 * 
 * @param {Object} movie : donnée du film
 * @param {Function} onClickFavoris : fonction de basculement entre Ajout et Suppression des favoris
 * @param {Boolean} estFavoris : état disnat si le film est déjà dans les favoris
 * @param {Function} onSelectMovie : fonction pour afficher la vue détaillée du film
 */
function MovieCard({movie, onClickFavoris, estFavoris, onSelectMovie}) {
  
  // Harmonisation du titre
  const titre = movie.title || movie.movie_title || "Titre inconnu";

  // s'il n'y a pas d'image associé au film : attribution par défaut
  const imgSrc = movie.poster_path || "images/film_indispo.png";

    return (
      // carte entièrement cliquable 
      <div className="carte-film" onClick={() => onSelectMovie(movie)}> 
        <img className="image-film" src={imgSrc} alt={titre}/>
          <div className="infos-film">
            <h2>{titre}</h2>
          </div>
            {/* Ajout du bouton coeur pour les favoris | e.stopPropagation sert à empêcher le clic de lancer le onClick de la carte*/}
            <button className={`bouton-favoris ${estFavoris ? 'actif' : ''}`} onClick={(e) => { 
              e.stopPropagation(); onClickFavoris(movie);}}>
              {estFavoris ? '❤️' : '🤍'}
            </button>
      </div>
    );
}

export default MovieCard ; 
