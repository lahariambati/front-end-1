import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [myEnrollments, setMyEnrollments] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [activeTab, setActiveTab] = useState('my-learning');
    
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchCourses();
        fetchMyEnrollments();
        fetchMySubmissions();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await API.get('/courses');
            setCourses(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchMyEnrollments = async () => {
        try {
            const res = await API.get(`/enrollments/student/${user.id}`);
            setMyEnrollments(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchMySubmissions = async () => {
        try {
            const res = await API.get(`/submissions/student/${user.id}`);
            setSubmissions(res.data);
        } catch (err) { console.error(err); }
    };

    const handleEnroll = async (course) => {
        try {
            await API.post('/enrollments', { studentId: user.id, courseId: course.id, studentName: user.name });
            alert(`Enrolled in ${course.title}!`);
            fetchMyEnrollments();
            setActiveTab('my-learning');
        } catch (err) { console.error(err); }
    };

    const fetchAssignments = async (courseId) => {
        try {
            const res = await API.get(`/assignments/course/${courseId}`);
            setAssignments(res.data);
            setActiveTab('assignments');
        } catch (err) { console.error(err); }
    };

    const isDeadlinePassed = (deadlineDate) => {
        const now = new Date();
        const deadline = new Date(deadlineDate);
        now.setHours(0,0,0,0);
        deadline.setHours(0,0,0,0);
        return now > deadline;
    };

    const handleSubmission = async (e) => {
        e.preventDefault();
        try {
            const existing = submissions.find(s => s.assignmentId === selectedAssignment.id);
            if (existing) {
                await API.post('/submissions', { ...existing, fileUrl: submissionUrl });
                alert("Updated!");
            } else {
                await API.post('/submissions', { assignmentId: selectedAssignment.id, studentId: user.id, fileUrl: submissionUrl });
                alert("Submitted!");
            }
            setSubmissionUrl('');
            setSelectedAssignment(null);
            fetchMySubmissions();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="app-layout">
            <Sidebar currentTab={activeTab} setTab={setActiveTab} />

            <main className="main-content">
                <header className="header-container">
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-1.5px' }}>Workspace</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '5px' }}>Hello, {user.name} • Ready to learn?</p>
                    </div>
                    <div className="stat-group">
                        <div className="stat-widget">
                            <span style={{ fontSize: '2rem', fontWeight: '800' }}>{myEnrollments.length}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Courses</span>
                        </div>
                        <div className="stat-widget" style={{ borderColor: 'var(--accent)' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '800' }}>{submissions.length}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Completed</span>
                        </div>
                    </div>
                </header>

                {activeTab === 'my-learning' && (
                    <div className="dashboard-grid">
                        {myEnrollments.map(en => {
                            const course = courses.find(c => c.id === en.courseId);
                            if (!course) return null;
                            return (
                                <div key={en.id} className="glass-card">
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{course.title}</h3>
                                    <div className="card-actions">
                                        <button className="btn btn-primary" onClick={() => fetchAssignments(course.id)}>🚀 View Tasks</button>
                                        <button className="btn" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => alert(`Materials:\n${course.materials || 'No materials.'}`)}>📚 Notes</button>
                                    </div>
                                </div>
                            );
                        })}
                        {myEnrollments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>You haven't enrolled in any courses yet.</p>}
                    </div>
                )}

                {activeTab === 'discover' && (
                    <div className="dashboard-grid">
                        {courses.filter(c => !myEnrollments.find(en => en.courseId === c.id)).map(course => (
                            <div key={course.id} className="glass-card">
                                <h3 style={{ fontSize: '1.4rem' }}>{course.title}</h3>
                                <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem', lineHeight: '1.6' }}>{course.description}</p>
                                <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={() => handleEnroll(course)}>Join Course</button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="dashboard-grid">
                        {assignments.map(asg => {
                            const passed = isDeadlinePassed(asg.deadline);
                            const mySub = submissions.find(s => s.assignmentId === asg.id);
                            return (
                                <div key={asg.id} className="glass-card" style={{ borderLeft: mySub ? '4px solid #22c55e' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <span className="status-badge" style={{ background: passed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: passed ? '#f87171' : '#4ade80' }}>
                                            {passed ? 'Locked' : 'Open'}
                                        </span>
                                        {mySub && <span className="status-badge" style={{ background: 'var(--primary)', color: 'white' }}>Submitted</span>}
                                    </div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{asg.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>{asg.description}</p>
                                    
                                    <div style={{ padding: '1.2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', marginBottom: '2rem', marginTop: 'auto' }}>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: '700' }}>DEADLINE</span>
                                        <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{new Date(asg.deadline).toDateString()}</div>
                                    </div>

                                    {!passed ? (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setSelectedAssignment(asg); setSubmissionUrl(mySub ? mySub.fileUrl : ''); }}>
                                                {mySub ? '✏️ Edit' : '📤 Submit'}
                                            </button>
                                            {mySub && <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }} onClick={() => alert("Use Edit to update link!")}>🗑️</button>}
                                        </div>
                                    ) : (
                                        <button className="btn" style={{ width: '100%', background: '#1e293b', color: '#475569' }} disabled>Submission Closed</button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {selectedAssignment && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                        <div className="glass-card" style={{ width: '500px' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Submit Work</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>{selectedAssignment.title}</p>
                            <form onSubmit={handleSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <input className="input-field" placeholder="Enter link or notes..." value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '15px', padding: '1rem', color: 'white' }} />
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                                    <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => setSelectedAssignment(null)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
