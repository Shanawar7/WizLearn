import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

import { FaBook, FaUsers, FaClock, FaEdit, FaChartBar, FaTrash } from "react-icons/fa";
import { useAdmin } from "./AdminContext";
import { api } from "../../../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AdminDashboard() {
    const { courses, users, deleteCourse, loading } = useAdmin();
    const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0 });
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Generate monthly data based on actual users/courses creation dates
    const generateMonthlyData = (items) => {
        const monthCounts = new Array(12).fill(0);
        items.forEach(item => {
            const date = new Date(item.createdAt);
            const month = date.getMonth();
            monthCounts[month]++;
        });
        return monthCounts;
    };

    const usersPerMonth = users.length > 0 ? generateMonthlyData(users) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const coursesPerMonth = courses.length > 0 ? generateMonthlyData(courses) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Get recent courses (last 3)
    const recentCourses = courses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        .map(course => ({
            id: course.id,
            title: course.title,
            code: course.courseCode,
            lessons: course.materials?.length || 0,
            students: course.enrollments?.filter(e => e.status === 'APPROVED').length || 0,
            date: new Date(course.createdAt).toLocaleDateString(),
            createdBy: course.user?.name || 'Unknown',
        }));

    // Get recent users (last 3)
    const recentUsers = users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    const userData = {
        labels: months,
        datasets: [
            {
                label: "Users",
                data: usersPerMonth,
                borderColor: "var(--yellow)",
                backgroundColor: "rgba(243, 210, 74, 0.2)",
                tension: 0.4,
                fill: true,
                pointBackgroundColor: "var(--yellow)",
            },
        ],
    };

    const courseData = {
        labels: months,
        datasets: [
            {
                label: "Courses",
                data: coursesPerMonth,
                borderColor: "var(--navy)",
                backgroundColor: "rgba(23, 41, 79, 0.2)",
                tension: 0.4,
                fill: true,
                pointBackgroundColor: "var(--navy)",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top", labels: { color: "var(--text)" } },
            tooltip: { mode: "index", intersect: false },
        },
        scales: {
            x: { ticks: { color: "var(--text)" }, grid: { color: "var(--muted)" } },
            y: { ticks: { color: "var(--text)" }, grid: { color: "var(--muted)" } },
        },
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: "var(--navy)" }}>Admin Dashboard</h2>
                <div className="text-muted">Welcome back, Administrator</div>
            </div>

            {/* Top Stat Cards */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="card shadow-sm border-0 border-start border-primary border-4" style={{ borderRadius: "10px" }}>
                        <div className="card-body d-flex align-items-center p-4">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                <FaUsers size={30} className="text-primary" />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.8rem' }}>Total Users</h6>
                                <h3 className="mb-0 fw-bold">{stats.totalUsers}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card shadow-sm border-0 border-start border-warning border-4" style={{ borderRadius: "10px" }}>
                        <div className="card-body d-flex align-items-center p-4">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                <FaBook size={30} className="text-warning" />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.8rem' }}>Total Courses</h6>
                                <h3 className="mb-0 fw-bold">{stats.totalCourses}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================== ADVANCED ANALYTICS ===================== */}
            <div className="row mb-5">
                {/* Popular Courses */}
                <div className="col-md-6 mb-3">
                    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "15px", background: "linear-gradient(135deg, #17294f 0%, #2a3f6d 100%)", color: "white" }}>
                        <div className="card-body p-4">
                            <h5 className="mb-4 d-flex align-items-center">
                                <FaBook className="me-2 text-warning" /> Most Popular Courses
                            </h5>
                            {stats.popularCourses?.length > 0 ? (
                                <ul className="list-unstyled mb-0">
                                    {stats.popularCourses.map((course, idx) => (
                                        <li key={course.id} className="mb-3 d-flex justify-content-between align-items-center bg-white bg-opacity-10 p-2 rounded">
                                            <span>{idx + 1}. {course.title}</span>
                                            <span className="badge bg-warning text-dark">{course.studentCount} Students</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-white-50">No popular courses to show yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Active Students */}
                <div className="col-md-6 mb-3">
                    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "15px", background: "linear-gradient(135deg, #f3d24a 0%, #f7e18c 100%)", color: "#17294f" }}>
                        <div className="card-body p-4">
                            <h5 className="mb-4 d-flex align-items-center">
                                <FaUsers className="me-2" /> Most Active Students
                            </h5>
                            {stats.activeStudents?.length > 0 ? (
                                <ul className="list-unstyled mb-0">
                                    {stats.activeStudents.map((student, idx) => (
                                        <li key={student.id} className="mb-3 d-flex justify-content-between align-items-center bg-white bg-opacity-50 p-2 rounded">
                                            <span>{idx + 1}. {student.name}</span>
                                            <span className="badge bg-navy text-white px-3" style={{ backgroundColor: "#17294f" }}>{student.totalHours} hrs</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">No active student data available yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Small Graphs */}
            <div className="row my-4">
                <div className="col-md-6 mb-3">
                    <div className="card p-3 shadow-sm border-0" style={{ borderRadius: "12px" }}>
                        <h6 style={{ color: "var(--navy)" }} className="fw-bold mb-3">Users per Month</h6>
                        <Line data={userData} options={options} height={200} />
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card p-3 shadow-sm border-0" style={{ borderRadius: "12px" }}>
                        <h6 style={{ color: "var(--navy)" }} className="fw-bold mb-3">Courses per Month</h6>
                        <Line data={courseData} options={options} height={200} />
                    </div>
                </div>
            </div>

            {/* ===================== RECENT COURSES ===================== */}
            <h4 style={{ color: "var(--navy)" }}>Recent Courses</h4>

            {loading ? (
                <div className="text-center my-4">Loading...</div>
            ) : (
                <div className="row mt-3">
                    {recentCourses.length > 0 ? recentCourses.map((course) => (
                        <div className="col-md-4 mb-3" key={course.id}>
                            <div className="card p-3 shadow-sm h-100" style={{ borderRadius: "12px" }}>
                                <div className="d-flex align-items-center mb-3">
                                    <FaBook size={45} className="me-3 text-secondary" />
                                    <div>
                                        <h5 className="mb-0">{course.title}</h5>
                                        <small className="text-muted">Code: {course.code}</small>
                                    </div>
                                </div>

                                <div className="d-flex gap-3 mb-2 flex-wrap">
                                    <small><FaClock /> {course.lessons} Lessons</small>
                                    <small><FaUsers /> {course.students} Students</small>
                                    <small>📅 {course.date}</small>
                                </div>

                                <div className="mb-2">
                                    <small className="text-muted">Created by: {course.createdBy}</small>
                                </div>

                                {/* Buttons */}
                                <div className="d-flex gap-2 mt-auto">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteCourse(course.id)}
                                    >
                                        <FaTrash className="me-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-12 text-center text-muted">
                            <p>No courses available yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ===================== RECENT USERS ===================== */}
            <h4 className="mt-5" style={{ color: "var(--navy)" }}>Recent Users</h4>

            <div className="row mt-3">
                {recentUsers.length > 0 ? recentUsers.map((user) => (
                    <div className="col-md-4 mb-3" key={user.id}>
                        <div className="card p-3 shadow-sm" style={{ borderRadius: "12px" }}>
                            <div className="d-flex align-items-center mb-3">
                                <FaUsers size={45} className="me-3 text-secondary" />
                                <div>
                                    <h5 className="mb-0">{user.name}</h5>
                                    <small className="text-muted">{user.email}</small>
                                </div>
                            </div>

                            <div className="mb-2">
                                <small className="text-muted">
                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                </small>
                            </div>

                            <div className="mb-2">
                                <small className="text-muted">
                                    Role: <span className="badge bg-primary">{user.role || 'student'}</span>
                                </small>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 text-center text-muted">
                        <p>No users available yet.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
