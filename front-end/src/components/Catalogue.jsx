import MovieList from "./MovieList";

function Catalogue({movies, genres, onUpdateFavoris, favoris}) {

    return (
        <div>
            {genres.slice(1).map((genre) => {
                // Liste des films du genre = genre
                const filmsParGenre = movies.filter(m => m.genre === genre) ;

                if (filmsParGenre.length === 0) {
                    return null ;
                }

                return (
                    <section className="section-suggestion" key={genre}>
                        <div className="entete-suggestion">
                            <h2>{genre}</h2>
                            <button className="voir-tout">Tout voir</button>
                        </div>

                        <MovieList movies={filmsParGenre.slice(0,5)} onUpdateFavoris={onUpdateFavoris} favoris={favoris} />
                    </section>
                ) ;
            })}
        </div>
    )
}

export default Catalogue ;