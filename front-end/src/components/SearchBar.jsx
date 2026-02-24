import {useState} from "react" ;

// Composant barre de recherche
function SearchBar() {
    const[search, setSearch] = useState("") ;
    
    return (
        <div>
            <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un film..."
            />
            <button onClick={() => console.log(search)}>Rechercher</button>

            {/*<p>Tu tapes {search}</p>*/}
        </div>
    );
}

export default SearchBar ; 