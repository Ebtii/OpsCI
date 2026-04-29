import "./GenreFilter.css";

/**
 * Affiche une liste de boutons pour pouvoir filtrer les films par genre
 * 
 * @param {string} genreActuel : genre actuellement sélectionné
 * @param {Function} setGenreActuel : pour modifier le genre sélectionné
 * @param {Array} genres : tableau contenant tous les genres disponibles chez TMDB
 */
function GenreFilter({genreActuel, setGenreActuel, genres}) {

    return (
        <div className="barre-genres">
            {genres.map((genre) => (
                <button 
                    key={genre} 
                    className={genreActuel === genre ? "badge-genre actif" : "badge-genre"}
                    onClick={() => setGenreActuel(genre)}
                >
                {genre}
                </button>
            ))}
        </div>
    ) ;   
}

export default GenreFilter ;