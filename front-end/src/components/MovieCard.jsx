// Composant affiche de film
// movie est une propriété dite props
function MovieCard({movie}) {
    return (
        <div className="movieCard">
            <h2>{movie.name}</h2>
            <img className="movieCard-img" src={movie.poster} alt={movie.name}/>
        </div>
    );
}

export default MovieCard ; 