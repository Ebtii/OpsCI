import SearchBar from "./SearchBar" ;

function NavBar({search, setSearch, vueFavoris, setVueFavoris, favoris}) {
    
    return (
        <nav className="barnav">
            {/* Zone logo */}
            <div className="conteneur-logo">
                <img className="img-logo" src="public/images/logoCrop.png" alt="logo WatchNext" />
                <span className="nom-site">WatchNext</span>
            </div>

            {/* Zone contenant : barre de recherche, Accueil, Favoris */}
            <div className="groupe-droite">
                <SearchBar search={search} onSearchChange={setSearch} />

            {/* Bouton Accueil et Favoris */}
                <div className="menu-navigation">
                    <button className={!vueFavoris ? "onglet-actif" : "onglet"} onClick={() => setVueFavoris(false)}>
                        Accueil
                    </button>
                    <button className={vueFavoris ? "onglet-actif" : "onglet"} onClick={() => setVueFavoris(true)}>
                        Favoris ({favoris.length})
                    </button>
                </div>
            </div>
        </nav>
    ) ;
}

export default NavBar ;