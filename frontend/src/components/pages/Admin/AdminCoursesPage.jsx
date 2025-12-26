import React from "react";
import AdminCourseTable from "./AdminCourseTable";

export default function AdminCoursesPage() {
    return (
        <div className="container-fluid">
            <h2>Courses Management</h2>
            <p className="text-muted">Manage all courses in the platform.</p>
            <AdminCourseTable />
        </div>
    );
}
