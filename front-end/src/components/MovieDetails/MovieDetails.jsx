import "./MovieDetails.css";

/**
 * Affiche un fiche contenant toutes les informations concernant le film
 * 
 * @param {Object} movie : contient tous les détails du film
 * @param {Function} onRetourAccueil : pour revenir au catalogue
 * @param {Function} onUpdateFavoris : pour modifier la liste des favoris
 * @param {Boolean} estFav : état indiquant si le film est dans les favoris
 */
function MovieDetails({ movie, onRetourAccueil, onUpdateFavoris, estFav }) {
    if (!movie) return null ;

    // Fonction pour ouvrir Youtube pour lancer la bande-annonce
    const regarderTrailer = () => {
        if (movie.trailer_url) {
            window.open(movie.trailer_url, "_blank"); // permet d'ouvrir youtube tout en gardant la page ouverte
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
                    <span><b>Durée :</b> {movie.duree && movie.duree > 0 ? `${movie.duree} min` : "Non renseignée"}</span>
                    <span className="movie-origin"><b>Nationalité :</b> {movie.pays_og}</span>
                    <span className="genre-movie"> <b>Genre :</b> {movie.genre?.join(", ")}</span> 
                    <span className="note-movie"> <b>Note :</b> {movie.note && movie.note > 0 ? `${movie.note}/10 ⭐` : "-"}</span> 
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
                    <p className="description-movie">{movie.description || "Aucun synopsis disponible pour ce film."}</p>
                </div>
            </div>
        </div>
    </div>
    );
}

export default MovieDetails ;