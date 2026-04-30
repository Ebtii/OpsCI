import { useEffect, useState } from "react";
import "./Profil.css";

function Profil({ onClose, favoris, onLogout }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) throw new Error("404");
                return res.json();
            })
            .then(data => setUser(data))
            .catch(() => {
                // decodage instantané du token
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    username: payload.sub.split('@')[0],
                    email: payload.sub,
                    created_at: new Date().toISOString()
                });
            });
        }
    }, []);

    if (!user) return (
        <div className="page-profil">
            <p style={{color: "white"}}>Chargement...</p>
        </div>
    );

    const pseudo = user.username.charAt(0).toUpperCase();
    const dateInscription = new Date(user.created_at).toLocaleDateString("fr-FR", {
        year: "numeric", month: "long", day: "numeric"
    });

    return (
        <div className="page-profil" >
            {/* Barre retour */}
            <div className="barre-retour-profil">
                <button className="bouton-retour" onClick={onClose}>← Retour</button>
            </div>

            {/* 2 colonnes */}
            <div className="layout-profil">
                {/* Colonne gauche : avatar */}
                <div className="colonne-avatar">
                    <div className="avatar-large">{pseudo}</div>
                    <h2 className="profil-username">{user.username}</h2>
                    <p className="profil-email">{user.email}</p>
                    <p className="profil-date">Membre depuis<br/><strong>{dateInscription}</strong></p>
                </div>

                {/* Colonne droite : stats */}
                <div className="colonne-stats">
                    <h3 className="titre-stats">MES STATISTIQUES</h3>

                    {/* Stats en grille 2 colonnes */}
                    <div className="grille-stats">
                        <div className="stat-bloc">
                            <span className="stat-chiffre">{favoris.length}</span>
                            <span className="stat-label">Films favoris</span>
                        </div>
                        <div className="stat-bloc separateur">
                             <span className="stat-label">Statut : actif</span>
                            <span className="stat-chiffre statut-actif">●</span>
                        </div>
                    </div>
                </div>

                {/* Boutons */}
                <div className="profil-boutons">
                    <button className="bouton-mdp" onClick={() => alert(" Fonctionnalité à venir !")}>
                        Modifier le mot de passe
                    </button>
                    <button className="bouton-deconnexion" onClick={() => { onLogout(); onClose(); }}>
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profil;