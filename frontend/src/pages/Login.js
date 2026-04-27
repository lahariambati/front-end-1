import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(res.data));
            if (res.data.role === 'ADMIN') navigate('/admin');
            else navigate('/student');
        } catch (err) {
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh',
            animation: 'fadeIn 0.8s ease-out'
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '800' }}>Welcome Back</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Login to access your courses</p>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email Address</label>
                        <input 
                            className="input-field"
                            type="email" 
                            placeholder="name@university.edu" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Password</label>
                        <input 
                            className="input-field"
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                        Sign In
                    </button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Create one</Link>
                </p>
            </div>
            
            <style>{`
                .input-field {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border-radius: 14px;
                    border: 1px solid #e2e8f0;
                    background: rgba(255, 255, 255, 0.5);
                    transition: all 0.3s ease;
                }
                .input-field:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: white;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }
            `}</style>
        </div>
    );
};

export default Login;
