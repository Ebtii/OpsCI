import "./FiltreAvR.css";

/**
 * Permet à l'utilisateur de faire des recherches avancées sur la liste des films affichés
 * 
 * @param {Object} filtres : état actuel des filtres (venant de App.jsx)
 * @param {Function} setFiltres : pour mettre à jour les filtres.
 */
function FiltreAvR({filtres, setFiltres}) {

    return (
        <div className="barre-filtres">
            <div className="filtre-categorie">
            {/* Sélecteur de Tri : tri par année/note/récent/défaut */}
                <select value={filtres.tri} onChange={(e) => setFiltres({...filtres, tri: e.target.value})}>
                    <option value="decouverte">Par défaut</option>
                    <option value="recent">Plus récents</option>
                    <option value="note">Mieux notés</option>
                </select>
            </div>

            {/* Curseur Note : filtrage des films avec une note supérieure ou égale */}
            <div className="filtre-note">
                <label>Note minimale</label>
                <select value={filtres.noteMin} onChange={(e) => setFiltres({...filtres, noteMin: parseFloat(e.target.value)})}>
                    <option value="0">Toutes les notes</option>
                    <option value="3">⭐ 3+ </option>
                    <option value="5">⭐ 5+ </option>
                    <option value="7">⭐ 7+ </option>
                    <option value="8.5">⭐ 8.5+ </option>
                </select>
            </div>

            {/* Input année : année de sortie minimum */}
            <div className="filtre-annee">
                <label>Sorti après</label>
                <input type="number" placeholder="Ex : 2020" value={filtres.anneeMin === 1900 ? "" : filtres.anneeMin} onChange={(e) => setFiltres({...filtres, anneeMin: parseInt(e.target.value) || 1900})} />
            </div>
        </div>
    )
}

export default FiltreAvR ;