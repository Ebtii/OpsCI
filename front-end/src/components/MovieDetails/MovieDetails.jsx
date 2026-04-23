import "./MovieDetails.css";

function MovieDetails({ movie, onRetourAccueil, onUpdateFavoris, estFav }) {
    if (!movie) return null ;

    // Fonction pour ouvrir Youtube
    const regarderTrailer = () => {
        if (movie.trailer_url) {
            window.open(movie.trailer_url, "_blank");
        } else {
            alert("Bande-annonce non disponible pour ce film.");
        }
    } ;
    
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
                <button className="bouton-lecture" onClick={regarderTrailer}>▶ Regarder la bande-annonce</button>
            </div>
            
            {/* à DROITE = infos */}
            <div className="colonne-infos">
                <h1 className="titre-movie-infos">{movie.title}</h1>

                <div className="infos-movie">
                    <span className="date-movie"> <b>Sortie :</b> {movie.date}</span>
                    {movie.duree && <span> <b>Durée :</b> {movie.duree} min</span>}
                    <span className="movie-origin"><b>Nationalité :</b> {movie.pays_og}</span>
                    <span className="genre-movie"> <b>Genre :</b> {movie.genre?.join(", ")}</span> 
                    <span className="note-movie"> <b>Note :</b> {movie.note}/10 ⭐ </span> 
                    {/* Acteurs */}
                    {movie.acteurs && movie.acteurs.length > 0 && (
                        <div className="acteurs">
                            <h3>Stars</h3>
                            <p>{movie.acteurs.join(" • ")}</p>
                        </div>
                    )}
                    {/* Distributeur(s) */}
                    {movie.distributeur && (
                        <div className="distributeur">
                            <h4>Distributeur(s)</h4>
                            <p>{movie.distributeur.join(", ")}</p>
                        </div>
                    )}
                </div>

                <div className="synopsis">  
                    <h3>Synopsis</h3>
                    <p className="description-movie">{movie.description}</p>
                </div>
            </div>
        </div>
    </div>
    );
}

export default MovieDetails ;