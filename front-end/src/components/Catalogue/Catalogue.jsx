import MovieList from "../MovieList/MovieList";
import "./Catalogue.css";

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