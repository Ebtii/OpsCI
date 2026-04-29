import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar" ;
import SearchSuggestions from "../SearchSuggestions/SearchSuggestions";
import "./NavBar.css";


/**
 * Barre de navigation persistante assure : la recherche globale, les onglets et l'authentification
 * 
 * @param {string} search - état de la recherche partagé avec App.jsx
 * @param {Function} setSearch : pour modifier 'search'
 * @param {boolean} vueFavoris : booléen disant si l'utilisateur consulte sa page de fav
 * @param {Function} setVueFavoris : pour passer de l'affichage vers la vue des favoris
 * @param {Array} favoris : sert pour calculer et afficher le compteur des favoris
 * @param {Function} onLogoClick : pour revenir à l'accueil lorqu'on appuie sur le logo
 * @param {Array} STmovies : liste de tous les films (pour les suggestions)
 * @param {Function} onSelectMovie : pour ouvrir la fiche d'un film depuis les suggestions
 * @param {boolean} estLogin : état de connexion (pour savoir si on affiche "Profil" ou "Connexion")
 * @param {Function} onOpenAuth : pour ouvrir les services d'authentification
 * @param {Function} onLogout : pour supprimer le token et réinitialiser la session
 */
function NavBar({search, setSearch, vueFavoris, setVueFavoris, favoris, onLogoClick, STmovies, onSelectMovie, estLogin, onOpenAuth, onLogout}) {
    
    const liste = Array.isArray(STmovies) ? STmovies : [] ; // si STmovies pas encore chargé sous forme de tableau => tableau vide
    const [showMenuProfil, setShowMenuProfil] = useState(false) ; 

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

                    {/*Bouton d'authentification */}
                    <div className="zone-auth-nav">
                        {estLogin ? (
                            <div className="bloc-profil" onMouseEnter={() => setShowMenuProfil(true)} onMouseLeave={() => setShowMenuProfil(false)}>
                                <button className="onglet-actif">Mon profil</button>

                                {showMenuProfil && (
                                    <div className="menu-deroulant">
                                        <button className="bouton-logout" onClick={onLogout}>Déconnexion</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="onglet" onClick={onOpenAuth}>Connexion</button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar ;