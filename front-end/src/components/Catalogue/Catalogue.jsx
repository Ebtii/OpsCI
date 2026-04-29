import MovieList from "../MovieList/MovieList";
import "./Catalogue.css";


/**
 * Range les films en lignes par genre
 * 
 * @param {Array} movies : liste des films
 * @param {Array} genres : liste des genres 
 * @param {Function} onUpdateFavoris : gère l'ajout/suppression des favoris
 * @param {Array} favoris : liste des favoris de l'utilisateur
 * @param {Function} setGenreActuel : sert à voir tous les films pour "voir tout" un genre
 * @param {Function} onSelectMovie : montre les détails d'un film
 */
function Catalogue({movies = [], genres = [], onUpdateFavoris, favoris, setGenreActuel, onSelectMovie}) {

    if (!genres || genres.length === 0) {
        return <p>Chargement des catégories...</p> ;
    }

    return (
        <div>
            {genres.slice(1).map((genre) => {
                // Liste des films du genre = genre
                const filmsParGenre = movies.filter(m => m && Array.isArray(m.genre) && m.genre.includes(genre)) ;

                if (filmsParGenre.length === 0) {
                    return null ;
                }

                return (
                    <section className="section-suggestion" key={genre}>
                        <div className="entete-suggestion">
                            <h2>{genre}</h2>
                            <button className="voir-tout" onClick={() => setGenreActuel(genre)}>Tout voir</button>
                        </div>

                        <MovieList movies={filmsParGenre.slice(0,5)} onUpdateFavoris={onUpdateFavoris} favoris={favoris} onSelectMovie={onSelectMovie}/>
                    </section>
                ) ;
            })}
        </div>
    )
}

export default Catalogue ;