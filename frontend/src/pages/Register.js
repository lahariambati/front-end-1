import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', formData);
            alert("Registration successful! Please login.");
            navigate('/');
        } catch (err) {
            alert("Error: Registration failed. Try a different email.");
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '90vh',
            animation: 'fadeIn 0.8s ease-out'
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '800' }}>Create Account</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Join our educational community today</p>
                
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Full Name</label>
                        <input 
                            className="input-field"
                            type="text" 
                            placeholder="John Doe" 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            required 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email Address</label>
                        <input 
                            className="input-field"
                            type="email" 
                            placeholder="john@example.com" 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            required 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Password</label>
                        <input 
                            className="input-field"
                            type="password" 
                            placeholder="Min. 8 characters" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>I am a...</label>
                        <select 
                            className="input-field"
                            value={formData.role} 
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="STUDENT">Student (Learning)</option>
                            <option value="ADMIN">Educator (Teaching)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                        Create Account
                    </button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
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

export default Register;
