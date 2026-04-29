import "./MovieCard.css";

function MovieCard({movie, onClickFavoris, estFavoris, onSelectMovie}) {
  
  const titre = movie.title || movie.movie_title || "Titre inconnu";

  // s'il n'y a pas d'image associé au film : attribution par défaut
  const imgSrc = movie.poster_path || "/images/tbc.png";

    return (
      <div className="carte-film" onClick={() => onSelectMovie(movie)}>
        <img className="image-film" src={imgSrc} alt={titre}/>
          <div className="infos-film">
            <h2>{titre}</h2>
          </div>
            {/* Ajout du bouton coeur pour les favoris */}
            <button className={`bouton-favoris ${estFavoris ? 'actif' : ''}`} onClick={(e) => { 
              e.stopPropagation(); onClickFavoris(movie);}}>
              {estFavoris ? '❤️' : '🤍'}
            </button>
      </div>
    );
}

export default MovieCard ; 
