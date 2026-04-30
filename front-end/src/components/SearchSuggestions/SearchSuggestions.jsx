import "./SearchSuggestions.css";

/**
 * Affiche un menu déroulant avec des suggestions de films sous la barre de recherche
 * 
 * @param {Array} resultat : tableau des films qui correspondent à la saisie et peuvent être suggérés (filtrés dans NavBar)
 * @param {Function} onSelect : lors du clic sur une suggestion
 */
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