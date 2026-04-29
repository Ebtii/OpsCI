import {useState} from "react" ;
import "./SearchBar.css";

/**
 * Sert d'interface de saisie pour l'utilisateur
 * 
 * @param {string} search : valeur de la recherche (stockée dans le state de App.jsx)
 * @param {Function} onSearchChange : pour notifier le parent des changement de texte lors de la saisie (callback)
 */
// Composant barre de recherche
function SearchBar({search, onSearchChange}) {
    return (
        <div className="conteneur-recherche">
            <input
                type="text"
                className="entree-recherche"
                placeholder="Rechercher un film..."
                value={search}  // valeur contrôlée par App
                onChange={(event) => onSearchChange(event.target.value)} // update de App
            />
            <button className="bouton-recherche" onClick={() => console.log(search)}>Rechercher</button>

            {/*<p>Tu tapes {search}</p>*/}
        </div>
    );
}

export default SearchBar ; 