import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogIn, AlertCircle, Loader2, ShieldCheck, Leaf } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background Image Layer (Factory) */}
      <div className="login-bg-overlay"></div>
      
      <div className="login-container animate-fade-in">
        <div className="login-glass-card">
          <div className="login-sidebar">
            <div className="sidebar-overlay"></div>
            <div className="sidebar-content">
              <div className="logo-section">
                <Leaf className="logo-icon" size={40} />
                <h1>MYC <span className="gold">Beauty</span></h1>
                <p className="innovation">Innovation</p>
              </div>
              <div className="sidebar-info">
                <div className="info-item">
                  <ShieldCheck size={20} />
                  <span>Portail Sécurisé RH</span>
                </div>
                <p className="footer-note">© 2024 MYC Beauty Innovation. Tous droits réservés.</p>
              </div>
            </div>
          </div>

          <div className="login-main">
            <div className="login-form-header">
              <h2>Bienvenue</h2>
              <p>Veuillez vous connecter pour accéder à l'espace collaborateur.</p>
            </div>

            <form onSubmit={handleLogin} className="modern-form">
              {error && (
                <div className="error-banner">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-group">
                <label>Email Professionnel</label>
                <input
                  type="email"
                  placeholder="votre.nom@myc-beauty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mot de Passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-login-modern" disabled={loading}>
                {loading ? (
                  <Loader2 className="spinner" size={20} />
                ) : (
                  <>
                    <span>Accéder au portail</span>
                    <LogIn size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .login-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #000;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .login-bg-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('/BACK VIEW (1).png');
          background-size: cover;
          background-position: center;
          opacity: 0.8;
          filter: brightness(0.6) blur(2px);
          z-index: 1;
        }

        .login-container {
          position: relative;
          z-index: 2;
          width: 90%;
          max-width: 1000px;
        }

        .login-glass-card {
          display: flex;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-height: 600px;
        }

        .login-sidebar {
          flex: 1;
          position: relative;
          background-image: url('/BACK VIEW (1).png');
          background-size: cover;
          background-position: center;
          color: white;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        .sidebar-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(196,30,58,0.9) 0%, rgba(26,26,26,0.95) 100%);
          z-index: 1;
        }

        .sidebar-content { position: relative; z-index: 2; }

        .logo-section h1 { font-size: 2.5rem; margin: 1rem 0 0; font-weight: 800; letter-spacing: -1px; }
        .logo-section .gold { color: #d4af37; }
        .logo-section .innovation { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 5px; color: #ccc; margin-bottom: 3rem; }
        
        .sidebar-info { margin-top: 5rem; }
        .info-item { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; font-weight: 600; font-size: 0.9rem; }
        .footer-note { font-size: 0.75rem; color: #aaa; margin-top: 2rem; }

        .login-main {
          flex: 1.2;
          padding: 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: white;
        }

        .login-form-header h2 { font-size: 2.2rem; color: #1a1a1a; margin-bottom: 0.5rem; font-weight: 800; letter-spacing: -1px; }
        .login-form-header p { color: #666; margin-bottom: 2.5rem; font-size: 1.05rem; }

        .modern-form .form-group { margin-bottom: 1.5rem; }
        .modern-form label { display: block; font-size: 0.85rem; font-weight: 700; color: #444; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .modern-form input {
          width: 100%;
          padding: 1.1rem;
          border-radius: 12px;
          border: 1px solid #ddd;
          background: #f8f9fa;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .modern-form input:focus { border-color: #c41e3a; outline: none; background: white; box-shadow: 0 0 0 4px rgba(196,30,58,0.1); }

        .btn-login-modern {
          width: 100%;
          background: #c41e3a;
          color: white;
          border: none;
          padding: 1.2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 1rem;
        }
        .btn-login-modern:hover { background: #a01830; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(196,30,58,0.3); }

        .error-banner { background: #fff5f5; color: #c41e3a; padding: 1rem; border-radius: 12px; display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; border: 1px solid #fee2e2; font-size: 0.9rem; }
      `}</style>
    </div>
  );
};

export default Login;
