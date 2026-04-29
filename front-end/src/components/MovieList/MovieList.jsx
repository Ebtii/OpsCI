import MovieCard from "../MovieCard/MovieCard" ;
import "./MovieList.css";

/**
 * Transforme l'ensemble des cartes de film en une grille de composants MovieCard
 * 
 * @param {Array} movies : liste des films à afficher
 * @param {Function} onUpdateFavoris : fonctio transmise pour gérer onClickFavoris
 * @param {Array} favoris : liste des favoris actuels pour adapter les favoris
 * @param {Function} onSelectMovie : pour gérer le clic sur une carte
 */
function MovieList({movies, onUpdateFavoris, favoris, onSelectMovie}) {
    return (
        /* activation de l'affichage en grille */
        <div className="grille-films">
            {movies.map((movie) => {
                const movieCourant = movie.movie_id || movie.id;
                const estFavoris = favoris.some(f => Number(f.movie_id) === Number(movieCourant));

                return (
                    <MovieCard key={movie.id} movie={movie} onClickFavoris={onUpdateFavoris} estFavoris={estFavoris} onSelectMovie={onSelectMovie}/>
                );
            })}
        </div>
    ) ;    
}

export default MovieList ; 