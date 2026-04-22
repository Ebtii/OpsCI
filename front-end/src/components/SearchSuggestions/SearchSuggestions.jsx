import "./SearchSuggestions.css";

function SearchSuggestions ({resultat, onSelect}) {
    if (resultat.length === 0) return null ;

    return (
        <div className="sugg-search">
            {resultat.slice(0, 5).map((movie) => (
                <div className="sugg-item" key={movie.id} onClick={() => onSelect(movie)}>
                    <img src={movie.poster_path} alt={movie.title} />
                    <div className="sugg-info">
                        <p className="sugg-titre">{movie.title}</p>
                        <p className="sugg-year">{movie.year}</p>
                    </div>
                </div>
            ))}
        </div>
    ) ;
}

export default SearchSuggestions ;