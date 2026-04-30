import "./FormAuthInscr.css";
import { useState } from "react";

function FormAuthInscr({onLoginSucces, onClose}) {
    const [estLogin, setEstLogin] = useState(true); // permet le switch entre la connexion et l'inscription
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [messErreur, setMessErreur] = useState("");
    
    // Soumission du formulaire de connexion/inscription
    const soumission = async (e) => {
        e.preventDefault();
        setMessErreur("");
        try {
            // Attente du formulaire FormData pour le login OAuth2
            // Pour la création de compte on crée un json
            if (estLogin) {
                // Connexion
                const formData = new FormData() ;
                formData.append("username", email) ;
                formData.append("password", password) ;

                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, { 
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();

                if (res.ok) {
                    // Stockage du token JWT pour garder l'utilisateur connecté
                    localStorage.setItem("token", data.access_token) ;
                    localStorage.setItem("email", email) ;
                    onLoginSucces();
                } else {
                    throw new Error(data.detail || "Identifiants incorrects");
                }
            } else {
                // Inscription on récupère un JSON pour schemas.UserRegister (backend)
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, { 
                    method: "POST",
                    headers: {"Content-Type": "application/json"}, 
                    body: JSON.stringify({email, password, username}), 
                });

                const data = await res.json();

                if (res.ok) {
                    alert("Compte créé ! Bienvenue, vous pouvez maintenant vous connecter.") ;
                    setEstLogin(true)   // passe automatiquement sur l'écran de connexion pour faciliter
                } else {
                    throw new Error(data.detail || "Erreur lors de l'inscription");
                }
            } 
        } catch (error) {
            setMessErreur(error.message) ;
        }
    } ;

    return (
        <div className="zone-auth">
            <div className="entree-auth">
                <button className="close-btn" onClick={onClose} type="button">
                    ✕
                </button>
                <h2>{estLogin ? "Connexion" : "Inscription"}</h2>

                {messErreur && <p className="mess-erreur">{messErreur}</p>}
                <form onSubmit={soumission}>
                    <div className="input-zone">
                        <label>Email</label>
                        <input type="email" placeholder="votre@email.com" value={email} onChange = {(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="input-zone">
                        <label>Mot de passe</label>
                        <input type="password" placeholder="••••••••" value={password} onChange = {(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="soumission-auth">
                        {estLogin ? "Se connecter" : "Rejoindre WatchNext"}
                    </button>
                </form>

                {/* Connexion ||| Inscription */}
                <p className="choix-auth">
                    {estLogin ? "Nouveau sur WatchNext ?" : "Déjà membre ?"}
                    <span onClick={() => setEstLogin(!estLogin)}>
                        {estLogin ? "Créez un compte" : "Connectez-vous"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default FormAuthInscr ;