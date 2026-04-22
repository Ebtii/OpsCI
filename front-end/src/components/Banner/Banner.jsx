import "./Banner.css";

function Banner({movie, onSelectMovie}) {
    if (!movie) return null ;

    return ( 
        <header className="ban-principale" style={{backgroundImage: `url(${movie.backdrop_path})`}}>
            <div className="voile-ban">
                <div className="contenu-ban">
                    <div className="align-titre-bouton">
                        <h1 className="titre-ban">{movie?.title}</h1>
                        <button className="bouton-info" onClick={() => onSelectMovie(movie)}>ⓘ En savoir plus</button>
                    </div>
                    <p className="description-ban">
                        {movie.description ? movie.description.substring(0,300) + "..." : "Description indisponible"}
                    </p>  
                </div>
            </div>
        </header>
    ) ;
}

export default Banner ;