import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [courseData, setCourseData] = useState({ title: '', description: '', materials: '' });
    const [editingId, setEditingId] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [assignmentData, setAssignmentData] = useState({ title: '', description: '', deadline: '' });
    const [submissions, setSubmissions] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [activeTab, setActiveTab] = useState('courses');
    
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchEducatorCourses();
    }, []);

    const fetchEducatorCourses = async () => {
        try {
            const res = await API.get(`/courses/educator/${user.id}`);
            setCourses(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchSubmissions = async (courseId) => {
        try {
            const asgRes = await API.get(`/assignments/course/${courseId}`);
            const allSubs = [];
            for (let asg of asgRes.data) {
                const subRes = await API.get(`/submissions/assignment/${asg.id}`);
                allSubs.push(...subRes.data.map(s => ({ ...s, asgTitle: asg.title })));
            }
            setSubmissions(allSubs);
            setActiveTab('submissions');
        } catch (err) { console.error(err); }
    };

    const fetchProgress = async (courseId) => {
        try {
            const res = await API.get(`/enrollments/course/${courseId}`);
            setEnrollments(res.data);
            setActiveTab('progress');
        } catch (err) { console.error(err); }
    };

    const handleGrade = async (subId, marks) => {
        try {
            await API.put(`/submissions/${subId}/marks`, marks, { headers: { 'Content-Type': 'application/json' } });
            alert("Grade saved!");
            setSubmissions(submissions.map(s => s.id === subId ? { ...s, marks } : s));
        } catch (err) { console.error(err); }
    };

    return (
        <div className="app-layout">
            <Sidebar currentTab={activeTab} setTab={setActiveTab} />
            
            <main className="main-content">
                <header className="header-container">
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-1.5px' }}>Instructor</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '5px' }}>Managing {courses.length} Active Courses</p>
                    </div>
                    <div className="stat-group">
                        <div className="stat-widget">
                            <span style={{ fontSize: '2rem', fontWeight: '800' }}>{courses.length}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Courses</span>
                        </div>
                    </div>
                </header>

                {activeTab === 'courses' && (
                    <div className="dashboard-grid">
                        {courses.map(c => (
                            <div key={c.id} className="glass-card">
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{c.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{c.description}</p>
                                <div className="card-actions">
                                    <button className="btn btn-primary" onClick={() => setSelectedCourse(c)}>+ Task</button>
                                    <button className="btn" style={{ background: '#e0e7ff', color: '#4338ca' }} onClick={() => fetchSubmissions(c.id)}>Review</button>
                                    <button className="btn" style={{ background: '#f8fafc', color: 'black' }} onClick={() => fetchProgress(c.id)}>Users</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'add' && (
                    <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <h2 style={{ marginBottom: '2.5rem' }}>Course Details</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            await API.post('/courses', { ...courseData, createdBy: user.id });
                            setCourseData({ title: '', description: '', materials: '' });
                            fetchEducatorCourses();
                            setActiveTab('courses');
                            alert("Success!");
                        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <input className="input-field" placeholder="Course Title" value={courseData.title} onChange={e => setCourseData({...courseData, title: e.target.value})} required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '15px', padding: '1rem', color: 'white' }} />
                            <textarea className="input-field" placeholder="Description" style={{ minHeight: '120px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '15px', padding: '1rem', color: 'white' }} value={courseData.description} onChange={e => setCourseData({...courseData, description: e.target.value})} required />
                            <textarea className="input-field" placeholder="Materials (Links/Notes)" style={{ minHeight: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '15px', padding: '1rem', color: 'white' }} value={courseData.materials} onChange={e => setCourseData({...courseData, materials: e.target.value})} />
                            <button type="submit" className="btn btn-primary">Publish Now</button>
                        </form>
                    </div>
                )}

                {activeTab === 'submissions' && (
                    <div className="dashboard-grid">
                        {submissions.map(sub => (
                            <div key={sub.id} className="glass-card">
                                <span className="status-badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>{sub.asgTitle}</span>
                                <p style={{ margin: '1.5rem 0' }}><strong>ID #{sub.studentId}:</strong> {sub.fileUrl}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                                    <input type="number" className="input-field" placeholder="Marks" defaultValue={sub.marks} onBlur={(e) => handleGrade(sub.id, e.target.value)} style={{ width: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.8rem', color: 'white' }} />
                                    <span style={{ fontWeight: '700' }}>/ 100</span>
                                </div>
                            </div>
                        ))}
                        {submissions.length === 0 && <p>Select a course to review.</p>}
                    </div>
                )}

                {activeTab === 'progress' && (
                    <div className="glass-card">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1.5rem' }}>Name</th>
                                    <th style={{ padding: '1.5rem' }}>User ID</th>
                                    <th style={{ padding: '1.5rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map(en => (
                                    <tr key={en.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1.5rem' }}>{en.studentName}</td>
                                        <td style={{ padding: '1.5rem' }}>#{en.studentId}</td>
                                        <td style={{ padding: '1.5rem' }}><span className="status-badge status-student">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedCourse && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                        <div className="glass-card" style={{ width: '450px' }}>
                            <h2>Create Task</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{selectedCourse.title}</p>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                await API.post('/assignments', { ...assignmentData, courseId: selectedCourse.id });
                                alert("Success!");
                                setSelectedCourse(null);
                            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <input className="input-field" placeholder="Title" onChange={e => setAssignmentData({...assignmentData, title: e.target.value})} required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '15px', padding: '1rem', color: 'white' }} />
                                <textarea className="input-field" placeholder="Details" onChange={e => setAssignmentData({...assignmentData, description: e.target.value})} required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '15px', padding: '1rem', color: 'white' }} />
                                <input className="input-field" type="date" onChange={e => setAssignmentData({...assignmentData, deadline: e.target.value})} required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '15px', padding: '1rem', color: 'white' }} />
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create</button>
                                    <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => setSelectedCourse(null)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
