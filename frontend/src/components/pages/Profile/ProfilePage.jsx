import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from '../../../context/AuthContext';
import { FaBrain, FaBook, FaEdit, FaKey, FaSignOutAlt, FaCode, FaEye, FaTrash, FaUserCircle, FaChartLine, FaClock, FaPlus, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import AddCourseModal from '../Dashboard/AddCourseModal';
import EditProfileModal from './EditProfileModal';

const Modal = ({ title, children, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title">{title}</h2>
        <button className="btn-close" onClick={onClose}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('created');
  const [showModal, setShowModal] = useState(null);
  const [stats, setStats] = useState({ hoursLearned: 0 });
  const [createdCourses, setCreatedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [courseCode, setCourseCode] = useState('');

  // Fetch Data
  useEffect(() => {
    if (user) {
      fetchUserCourses();
      fetchEnrolledCourses();
      fetchFriendRequests();
      fetchFriends();
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/users/analytics');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/courses');
      // Calculate real stats from backend response (which now includes lessons/students counts)
      const coursesWithStats = response.data.map(course => ({
        ...course,
        code: course.courseCode, // Map backend prop
        lessons: course.lessons || 0,
        students: course.students || 0,
        progress: 0, // Creator doesn't track progress on own course usually, or could track avg student progress?
        createdDate: new Date(course.createdAt).toLocaleDateString()
      }));
      setCreatedCourses(coursesWithStats);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.get('/enrollments/my-enrollments');
      const enrollments = response.data.map(enrollment => ({
        id: enrollment.course.id,
        enrollmentId: enrollment.id,
        title: enrollment.course.title,
        code: enrollment.course.courseCode,
        description: enrollment.course.description,
        status: enrollment.status,
        instructor: enrollment.course.user?.name || 'Unknown',
        enrolledDate: new Date(enrollment.createdAt).toLocaleDateString(),
        progress: 0, // Placeholder
        lessons: 0 // Placeholder
      }));
      setEnrolledCourses(enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchFriendRequests = async () => {
    try {
      const response = await api.get('/friends/requests');
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await api.get('/friends');
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;
    try {
      await api.delete(`/friends/${friendId}`);
      setFriends(friends.filter(f => f.id !== friendId));
      alert('Friend removed successfully');
    } catch (error) {
      console.error('Failed to remove friend', error);
      alert('Failed to remove friend');
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      await api.patch(`/friends/${id}/accept`);
      alert('Friend request accepted!');
      fetchFriendRequests(); // Refresh list
    } catch (error) {
      console.error(error);
      alert('Failed to accept request');
    }
  };

  const handleRejectRequest = async (id) => {
    if (!window.confirm('Reject this friend request?')) return;
    try {
      await api.patch(`/friends/${id}/reject`);
      fetchFriendRequests(); // Refresh list
    } catch (error) {
      console.error(error);
      alert('Failed to reject request');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowModal('editCourse');
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${courseId}`);
        setCreatedCourses(createdCourses.filter(course => course.id !== courseId));
        alert('Course deleted successfully');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  const handleUpdateCourse = async (formData) => {
    try {
      if (!editingCourse) return;
      const response = await api.patch(`/courses/${editingCourse.id}`, formData);

      // Update local state while preserving stats
      setCreatedCourses(createdCourses.map(course =>
        course.id === editingCourse.id
          ? { ...course, ...response.data, title: response.data.title, description: response.data.description } // Ensure updates are reflected
          : course
      ));

      alert('Course updated successfully!');
      setShowModal(null);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await api.post('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      alert('Password changed successfully!');
      setShowModal(null);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
      alert(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleEnrollCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/enrollments/join', { courseCode });
      alert('Request sent successfully! Waiting for instructor approval.');
      setShowModal(null);
      setCourseCode('');
      fetchEnrolledCourses(); // Refresh list
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error.response?.data?.message || 'Failed to join course');
    }
  };

  // Handlers for inputs
  const handlePasswordInput = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (data) => {
    try {
      await api.patch('/users/profile', data);
      alert('Profile updated successfully!');
      window.location.reload(); // Reload to refresh user context
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    // Implement logout logic
    // Assuming logout function from useAuth clears token/user
    // If useAuth doesn't export a logout function that handles redirect, we might need to navigate manually
    // checking useAuth usage... it destructures { user, login }
    // I need to update the destructuring to include logout
  };

  return (
    <div className="profile-container">
      <button className="btn-back" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Back to Dashboard
      </button>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <FaUserCircle />
            )}
          </div>
          <div className="profile-details">
            <h1>
              {user?.name || 'User'}
              <MdVerified style={{ color: '#F0D459', fontSize: '2rem' }} />
            </h1>
            {user?.bio && <p style={{ color: '#a0aec0', marginBottom: '0.5rem', fontStyle: 'italic' }}>{user.bio}</p>}
            <p>User ID: {user?.friendId || 'Loading...'}</p>
            <p>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Just now'}</p>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{createdCourses.length}</span>
                <span className="stat-label">Courses Created</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{enrolledCourses.length}</span>
                <span className="stat-label">Courses Enrolled</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.hoursLearned}</span>
                <span className="stat-label">Hours Learned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="settings-section">
        <h2 className="section-title">
          <FaEdit />
          Account Settings
        </h2>
        <div className="settings-grid">
          <div className="setting-card" onClick={() => setShowModal('password')}>
            <div className="setting-icon">
              <FaKey />
            </div>
            <h3>Change Password</h3>
            <p>Update your password to keep your account secure</p>
          </div>

          <div className="setting-card" onClick={() => setShowModal('editProfile')}>
            <div className="setting-icon">
              <FaUserCircle />
            </div>
            <h3>Edit Profile</h3>
            <p>Update your name, bio, and avatar</p>
          </div>

          <div className="setting-card" onClick={() => setShowModal('enroll')}>
            <div className="setting-icon">
              <FaCode />
            </div>
            <h3>Join Course</h3>
            <p>Enter a course code to enroll in view-only mode</p>
          </div>

          <div className="setting-card" onClick={logout}>
            <div className="setting-icon">
              <FaSignOutAlt />
            </div>
            <h3>Logout</h3>
            <p>Sign out from your account</p>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="courses-section">
        <div className="courses-header">
          <h2 className="section-title">
            <FaBook />
            My Courses
          </h2>
          <div className="courses-tabs">
            <button
              className={`tab-button ${activeTab === 'created' ? 'active' : ''}`}
              onClick={() => setActiveTab('created')}
            >
              Created ({createdCourses.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'enrolled' ? 'active' : ''}`}
              onClick={() => setActiveTab('enrolled')}
            >
              Enrolled ({enrolledCourses.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Friends ({friends.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Requests ({friendRequests.length})
            </button>
          </div>
          <button className="btn-add-course" onClick={() => navigate('/dashboard')}>
            <FaPlus />
            Create New Course
          </button>
        </div>

        {/* Created Courses */}
        {activeTab === 'created' && (
          <div className="courses-grid">
            {createdCourses.length > 0 ? (
              createdCourses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <div className="course-icon-wrapper">
                      <FaBook />
                    </div>
                    <span className="course-badge badge-created">
                      Created
                    </span>
                  </div>

                  <h3 className="course-title">{course.title}</h3>
                  <span className="course-code">Code: {course.code}</span>

                  <div className="course-meta">
                    <div className="meta-item">
                      <FaBook />
                      {course.lessons} Lessons
                    </div>
                    <div className="meta-item">
                      <FaUsers />
                      {course.students} Students
                    </div>
                    <div className="meta-item">
                      <FaClock />
                      {course.createdDate}
                    </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-header">
                      <span>Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="course-actions">
                    <div className="course-actions">
                      <button className="btn-action btn-primary" onClick={() => handleEditCourse(course)}>
                        <FaEdit />
                        Edit
                      </button>
                      <button className="btn-action btn-secondary" onClick={() => alert('View analytics')}>
                        <FaChartLine />
                        Analytics
                      </button>
                      <button className="btn-action btn-danger" onClick={() => handleDeleteCourse(course.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaBook />
                </div>
                <h3>No courses created yet</h3>
                <p>Create your first course to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Enrolled Courses */}
        {activeTab === 'enrolled' && (
          <div className="courses-grid">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map(course => (
                <div key={course.enrollmentId} className="course-card enrolled">
                  <div className="course-header">
                    <div className="course-icon-wrapper">
                      <FaBook />
                    </div>
                    <span className={`course-badge ${course.status === 'APPROVED' ? 'badge-enrolled' : 'badge-pending'}`}
                      style={course.status === 'PENDING' ? { background: '#F0D459', color: '#1D2A50' } : {}}>
                      {course.status === 'APPROVED' ? <><FaEye /> Enrolled</> : 'Pending Approval'}
                    </span>
                  </div>

                  <h3 className="course-title">{course.title}</h3>
                  <span className="course-code">Code: {course.code}</span>

                  <div className="course-meta">
                    <div className="meta-item">
                      <FaUserCircle />
                      {course.instructor}
                    </div>
                    <div className="meta-item">
                      <FaClock />
                      {course.enrolledDate}
                    </div>
                  </div>

                  {course.status === 'APPROVED' && (
                    <div className="course-actions">
                      <button className="btn-action btn-primary" onClick={() => navigate(`/course/${course.id}`)}>
                        <FaEye />
                        View Course
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaBook />
                </div>
                <h3>No enrolled courses yet</h3>
                <p>Use a course code to join a course!</p>
              </div>
            )}
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="courses-grid">
            {friends.length > 0 ? (
              friends.map(friend => (
                <div key={friend.id} className="course-card">
                  <div className="course-header">
                    <div className="course-icon-wrapper">
                      <FaUserCircle />
                    </div>
                    <span className="course-badge badge-enrolled">
                      Friend
                    </span>
                  </div>

                  <h3 className="course-title">{friend.name}</h3>
                  <p className="text-muted mb-2">{friend.email}</p>

                  <div className="course-meta">
                    <div className="meta-item">
                      <FaCode />
                      ID: {friend.friendId}
                    </div>
                  </div>

                  <div className="course-actions">
                    <button className="btn-action btn-primary" onClick={() => navigate('/chat')}>
                      Chat
                    </button>
                    <button className="btn-action btn-danger" onClick={() => handleRemoveFriend(friend.id)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaUsers />
                </div>
                <h3>No friends connected</h3>
                <p>Add friends using their ID to start collaborating!</p>
              </div>
            )}
          </div>
        )}

        {/* Friend Requests Tab */}
        {activeTab === 'requests' && (
          <div className="courses-grid">
            {friendRequests.length > 0 ? (
              friendRequests.map(req => (
                <div key={req.id} className="course-card">
                  <div className="course-header">
                    <div className="course-icon-wrapper">
                      <FaUserCircle />
                    </div>
                    <span
                      className="course-badge"
                      style={{ background: req.status === 'PENDING' ? '#F0D459' : '#4299e1', color: '#1D2A50' }}
                    >
                      {req.status}
                    </span>
                  </div>

                  <h3 className="course-title">{req.sender.name}</h3>
                  <p className="text-muted mb-2">{req.sender.email}</p>

                  <div className="course-meta">
                    <div className="meta-item">
                      <FaClock />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="course-actions">
                      <button className="btn-action btn-primary" onClick={() => handleAcceptRequest(req.id)}>
                        Accept
                      </button>
                      <button className="btn-action btn-danger" onClick={() => handleRejectRequest(req.id)}>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaUsers />
                </div>
                <h3>No friend requests</h3>
                <p>Share your User ID to connect with others!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {
        showModal === 'password' && (
          <Modal title="Change Password" onClose={() => setShowModal(null)}>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-input"
                  value={passwords.currentPassword}
                  onChange={handlePasswordInput}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-input"
                  value={passwords.newPassword}
                  onChange={handlePasswordInput}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordInput}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button type="submit" className="btn-submit">
                Update Password
              </button>
            </form>
          </Modal>
        )
      }

      {
        showModal === 'enroll' && (
          <Modal title="Join Course with Code" onClose={() => setShowModal(null)}>
            <form onSubmit={handleEnrollCourse}>
              <div className="form-group">
                <label className="form-label">Course Code</label>
                <input
                  type="text"
                  name="courseCode"
                  className="form-input"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g., C-7K9J"
                  required
                />
              </div>
              <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Enter the course code provided by your instructor. You'll have view-only access to the course materials once approved.
              </p>
              <button type="submit" className="btn-submit">
                Join Course
              </button>
            </form>
          </Modal>
        )
      }

      <EditProfileModal
        isOpen={showModal === 'editProfile'}
        onClose={() => setShowModal(null)}
        user={user}
        onUpdate={handleUpdateProfile}
      />

      <style>{`
        :root {
          --primary: #1D2A50;
          --secondary: #F0D459;
          --background: #D9D9D9;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: var(--background);
        }

        .profile-container {
          min-height: 100vh;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .btn-back {
            background: none;
            border: none;
            color: var(--primary);
            font-size: 1.1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            padding: 0.5rem 0;
            font-weight: 600;
        }
        
        .btn-back:hover {
            color: #2a3f6e;
            text-decoration: underline;
        }

        .profile-header {
          background: linear-gradient(135deg, var(--primary) 0%, #2a3f6e 100%);
          border-radius: 1.5rem;
          padding: 3rem;
          margin-bottom: 2rem;
          color: white;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          animation: fadeInDown 0.6s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          color: var(--primary);
          box-shadow: 0 8px 25px rgba(240, 212, 89, 0.4);
          transition: transform 0.3s ease;
        }

        .profile-avatar:hover {
          transform: scale(1.05) rotate(5deg);
        }

        .profile-details h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white !important;
        }

        .profile-details p {
          font-size: 1.1rem;
          color: #cbd5e0;
          margin-bottom: 0.25rem;
        }

        .profile-stats {
          display: flex;
          gap: 2rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: var(--secondary);
          display: block;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #a0aec0;
        }

        .settings-section {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: bold;
          color: var(--primary);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .setting-card {
          background: var(--background);
          padding: 1.5rem;
          border-radius: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .setting-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .setting-icon {
          width: 50px;
          height: 50px;
          background: var(--secondary);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          font-size: 1.5rem;
          margin-bottom: 1rem;
          transition: transform 0.3s ease;
        }

        .setting-card:hover .setting-icon {
          transform: rotate(360deg);
        }

        .setting-card h3 {
          color: var(--primary);
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .setting-card p {
          color: #4a5568;
          font-size: 0.95rem;
        }

        .courses-section {
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }

        .courses-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .courses-tabs {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .tab-button {
          padding: 0.75rem 1.5rem;
          background: white;
          border: 2px solid var(--primary);
          color: var(--primary);
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(29, 42, 80, 0.2);
        }

        .tab-button.active {
          background: var(--primary);
          color: white;
        }

        .btn-add-course {
          padding: 0.75rem 1.5rem;
          background: var(--secondary);
          border: none;
          color: var(--primary);
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-add-course:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(240, 212, 89, 0.4);
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .course-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .course-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--secondary);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .course-card:hover::before {
          transform: scaleX(1);
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .course-card.enrolled {
          border-left: 4px solid #4299e1;
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .course-icon-wrapper {
          width: 60px;
          height: 60px;
          background: var(--background);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          font-size: 1.8rem;
        }

        .course-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .badge-created {
          background: rgba(240, 212, 89, 0.2);
          color: var(--primary);
        }

        .badge-enrolled {
          background: rgba(66, 153, 225, 0.2);
          color: #2c5282;
        }

        .course-title {
          font-size: 1.3rem;
          font-weight: bold;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .course-code {
          font-size: 0.85rem;
          color: #718096;
          font-family: monospace;
          background: var(--background);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          display: inline-block;
          margin-bottom: 0.75rem;
        }

        .course-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .progress-section {
          margin-bottom: 1rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          color: #4a5568;
        }

        .progress-bar {
          height: 8px;
          background: var(--background);
          border-radius: 1rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--secondary);
          border-radius: 1rem;
          transition: width 0.5s ease;
        }

        .course-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .btn-action {
          flex: 1;
          padding: 0.65rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
        }

        .btn-primary:hover {
          background: #2a3f6e;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: var(--background);
          color: var(--primary);
        }

        .btn-secondary:hover {
          background: #c0c0c0;
          transform: translateY(-2px);
        }

        .btn-danger {
          background: #fc8181;
          color: white;
        }

        .btn-danger:hover {
          background: #f56565;
          transform: translateY(-2px);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: fadeInUp 0.3s ease;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-title {
          font-size: 1.75rem;
          font-weight: bold;
          color: var(--primary);
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #718096;
          transition: color 0.3s ease;
        }

        .btn-close:hover {
          color: var(--primary);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--primary);
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--background);
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--secondary);
          box-shadow: 0 0 0 3px rgba(240, 212, 89, 0.2);
        }

        .btn-submit {
          width: 100%;
          padding: 1rem;
          background: var(--secondary);
          color: var(--primary);
          border: none;
          border-radius: 0.5rem;
          font-weight: bold;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-submit:hover {
          background: #e8c850;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(240, 212, 89, 0.4);
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #718096;
        }

        .empty-state-icon {
          font-size: 4rem;
          color: var(--background);
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 1rem;
          }

          .profile-header {
            padding: 2rem;
          }

          .profile-info {
            flex-direction: column;
            text-align: center;
          }

          .profile-details h1 {
            font-size: 2rem;
            justify-content: center;
          }

          .profile-stats {
            justify-content: center;
          }

          .settings-grid {
            grid-template-columns: 1fr;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }

          .courses-header {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div >
  );
};

export default ProfilePage;