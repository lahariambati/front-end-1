import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ currentTab, setTab }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const adminMenu = [
        { id: 'courses', label: 'My Courses', icon: '📚' },
        { id: 'add', label: 'New Course', icon: '➕' },
        { id: 'submissions', label: 'Review Submissions', icon: '📥' },
        { id: 'progress', label: 'Student Progress', icon: '👥' },
    ];

    const studentMenu = [
        { id: 'my-learning', label: 'My Learning', icon: '📖' },
        { id: 'discover', label: 'Discover Courses', icon: '🔍' },
        { id: 'assignments', label: 'Assignments', icon: '📝' },
    ];

    const menu = user?.role === 'ADMIN' ? adminMenu : studentMenu;

    return (
        <div className="sidebar">
            <div className="sidebar-logo">CourseMgmt</div>
            
            <div className="sidebar-menu">
                {menu.map(item => (
                    <div 
                        key={item.id}
                        className={`sidebar-item ${currentTab === item.id ? 'active' : ''}`}
                        onClick={() => setTab(item.id)}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <div style={{ width: '35px', height: '35px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800' }}>
                        {user?.name.charAt(0)}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role}</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="sidebar-item" style={{ width: '100%', border: 'none', background: 'none' }}>
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
