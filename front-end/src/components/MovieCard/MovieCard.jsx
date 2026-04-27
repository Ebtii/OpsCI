import "./MovieCard.css";

// movie est une propriété dite props

function MovieCard({movie, onClickFavoris, estFavoris, onSelectMovie}) {
    // s'il n'y a pas d'image associé au film : attribution par défaut
    const imgSrc = movie.poster_path
  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  : "/images/tbc.png";

    return (
        <div className="carte-film" onClick={() => onSelectMovie(movie)}>
            <img className="image-film" src={imgSrc} alt={movie.title}/>
            <div className="infos-film">
                <h2>{movie.title}</h2>
            </div>
            {/* Ajout du bouton coeur pour les favoris */}
            <button 
  className={`bouton-favoris ${estFavoris ? 'actif' : ''}`} 
  onClick={(e) => {
    e.stopPropagation();
    onClickFavoris(movie);
  }}
>
  {estFavoris ? '❤️' : '🤍'}
</button>
        </div>
    );
}

export default MovieCard ; 
