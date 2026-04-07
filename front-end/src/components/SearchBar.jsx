import {useState} from "react" ;

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