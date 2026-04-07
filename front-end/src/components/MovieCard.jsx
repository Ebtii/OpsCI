// Composant affiche de film

// movie est une propriété dite props

function MovieCard({movie, onClickFavoris, estFavoris}) {
    // s'il n'y a pas d'image associé au film : attribution par défaut
    const imgSrc = movie.image_url ? movie.image_url : "/images/tbc.png" ;

    return (
        <div className="carte-film">
            <img className="image-film" src={imgSrc} alt={movie.title}/>
            <div className="infos-film">
                <h2>{movie.title}</h2>
            </div>
            {/* Ajout du bouton coeur pour les favoris */}
            <button className={`bouton-favoris ${estFavoris ? 'actif' : ''}`} onClick={() => onClickFavoris(movie)} >
                {estFavoris ? '❤️' : '🤍'}
            </button>
        </div>
    );
}

export default MovieCard ; 
