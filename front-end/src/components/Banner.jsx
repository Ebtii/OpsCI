function Banner({movie}) {
    return ( 
        <header className="ban-principale">
            <div className="voile-ban">
                <div className="contenu-ban">
                    <h1 className="titre-ban">{movie?.title}</h1>
                    <p className="description-ban">
                        {movie?.overview || "Description indisponible"}
                    </p>
                <div className="bouton-ban">
                    <button className="bouton-play">▶ Lecture</button>
                    <button className="bouton-info">ⓘ En savoir plus</button>
                </div>
            </div>
        </div>
      </header>
    ) ;
}

export default Banner ;