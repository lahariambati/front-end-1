import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="nav-logo">CourseMgmt.io</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '12px', 
                        background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: '800',
                        fontSize: '1.2rem',
                        boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
                    }}>
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>{user.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{user.role}</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn" style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    padding: '0.6rem 1.2rem'
                }}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
