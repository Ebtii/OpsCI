import MovieCard from "../MovieCard/MovieCard" ;
import "./MovieList.css";

// Composant liste de films utilisant MovieCard

// Affiche pour chaque film du tableau sa MovieCard
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