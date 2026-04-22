import SearchBar from "../SearchBar/SearchBar" ;
import SearchSuggestions from "../SearchSuggestions/SearchSuggestions";
import "./NavBar.css";

function NavBar({search, setSearch, vueFavoris, setVueFavoris, favoris, onLogoClick, STmovies, onSelectMovie}) {
    
    const liste = Array.isArray(STmovies) ? STmovies : [] ; // si STmovies pas encore chargé => tableau vide

    const suggestions = search.length > 0 ? 
        liste.filter(m => m.title?.toLowerCase().includes(search.toLowerCase())).slice(0, 5) : [] ;

    return (
        <nav className="barnav">
            <div className="contenu-nav"> 
                {/* Zone logo */}
                <div className="conteneur-logo" onClick={onLogoClick}>
                    <img className="img-logo" src="public/images/logoCrop.png" alt="logo WatchNext" />
                    <span className="nom-site">WatchNext</span>
                </div>

                {/* Zone contenant : barre de recherche, Accueil, Favoris */}
                <div className="groupe-droite-nav">
                    <div className="bloc-search" style={{position: 'relative'}}>
                        <SearchBar search={search} onSearchChange={setSearch} />

                        {/* Menu déroulant pour les suggestions */}
                        <SearchSuggestions resultat={suggestions} onSelect={(movie) => {
                            onSelectMovie(movie) ;
                            setSearch("") ;
                        }} />
                    </div>

                    {/* Bouton Accueil et Favoris */}
                    <div className="menu-navigation">
                        <button className={!vueFavoris ? "onglet-actif" : "onglet"} onClick={onLogoClick}>
                            Accueil
                        </button>
                        <button className={vueFavoris ? "onglet-actif" : "onglet"} onClick={() => setVueFavoris(true)}>
                            Favoris ({favoris.length})
                        </button>
                    </div>
                    
                </div>
            </div>
        </nav>
    );
}

export default NavBar ;