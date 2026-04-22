import MovieCard from "../MovieCard/MovieCard" ;
import "./MovieList.css";

// Composant liste de films utilisant MovieCard

// Affiche pour chaque film du tableau sa MovieCard
function MovieList({movies, onUpdateFavoris, favoris, onSelectMovie}) {
    return (
        /* activation de l'affichage en grille */
        <div className="grille-films">
            {movies.map((movie, indice) => (
                <MovieCard key={indice} movie={movie} 
                    onClickFavoris={onUpdateFavoris}
                    /* Vérification si favoris */
                    estFavoris={favoris.some(f => f.title === movie.title)} onSelectMovie={onSelectMovie}/>
            ))}
        </div>
    ) ;    
}

export default MovieList ; 