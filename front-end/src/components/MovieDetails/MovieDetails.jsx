import "./MovieDetails.css";

function MovieDetails({ movie, onRetourAccueil, onUpdateFavoris, estFav }) {
    if (!movie) return null ;
    
    return (
    <div className="page-details">
        <div className="barre-retour"> 
            <button className="bouton-retour" onClick={onRetourAccueil}>←  Retour au catalogue</button>
            <button className={estFav ? 'bouton-favori-movie actif' : 'bouton-favori-movie'} onClick={() => onUpdateFavoris(movie)}>
                {estFav ? '❤️ Dans mes favoris' : '🤍 Ajouter aux favoris'}
            </button>
        </div>
          
        <div className="layout-page">
            {/* à GAUCHE = poster */}
            <div className="colonne-affiche">
                <img className="affiche-gauche" src={movie.poster_path} alt={movie.title} />
            </div>
            
            {/* à DROITE = infos */}
            <div className="colonne-infos">
                <h1 className="titre-movie-infos">{movie.title}</h1>

                <div className="infos-movie">
                    <span className="annee-movie">Année : {movie.year}</span>
                    <span className="date-movie"> Sortie : {movie.year}</span>
                    <span className="genre-movie"> Genre : {movie.genre}</span> 
                    <span className="note-movie"> Note : {movie.note}/10 ⭐ </span> 
                </div>

                <div className="synopsis">  
                    <h3>Synopsis</h3>
                    <p className="description-movie">{movie.description}</p>
                </div>

                <div className="actions-movie"> 
                </div>
            </div>
        </div>
    </div>
    );
}

export default MovieDetails ;