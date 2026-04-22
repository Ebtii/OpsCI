import "./GenreFilter.css";

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