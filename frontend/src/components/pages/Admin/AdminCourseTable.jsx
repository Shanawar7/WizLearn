import React from "react";
import { useAdmin } from "./AdminContext";
import { Link } from "react-router-dom";

export default function AdminCourseTable() {
    const { courses, deleteCourse } = useAdmin();

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Created By</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.title}</td>
                            <td>{course.createdBy || course.user?.name || "Admin"}</td>

                            <td>
                                <div className="d-flex gap-2">
                                    <Link
                                        to={`/admin/courses/${course.id}/materials`}
                                        className="btn btn-info btn-sm text-white"
                                    >
                                        Materials
                                    </Link>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteCourse(course.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {courses.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center">No courses found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
