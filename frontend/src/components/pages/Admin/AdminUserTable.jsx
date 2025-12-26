import React from "react";
import { useAdmin } from "./AdminContext";

export default function AdminUserTable() {
    const { users, deleteUser, blockUser, unblockUser } = useAdmin();

    const handleBlock = (id) => {
        const input = window.prompt("Enter block duration (e.g., 20s, 5m, 2h, 7d, 1y or just seconds):", "20s");
        if (input) {
            let seconds = 0;
            const match = input.match(/^(\d+)([smhdy]?)$/);

            if (match) {
                const val = parseInt(match[1]);
                const unit = match[2];

                switch (unit) {
                    case 'y': seconds = val * 31536000; break;
                    case 'd': seconds = val * 86400; break;
                    case 'h': seconds = val * 3600; break;
                    case 'm': seconds = val * 60; break;
                    case 's':
                    default: seconds = val; break;
                }

                blockUser(id, seconds);
            } else {
                alert("Invalid format. Please use numbers followed by s, m, h, d, or y.");
            }
        }
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        const isBlocked = user.isBlocked && new Date(user.blockedUntil) > new Date();
                        return (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.role === 'admin' ? (
                                        <span className="badge bg-secondary">System Admin</span>
                                    ) : isBlocked ? (
                                        <span className="badge bg-danger">Blocked until {new Date(user.blockedUntil).toLocaleString()}</span>
                                    ) : (
                                        <span className="badge bg-success">Active</span>
                                    )}
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        {user.role !== 'admin' && (
                                            <>
                                                {isBlocked ? (
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => unblockUser(user.id)}
                                                    >
                                                        Unblock
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleBlock(user.id)}
                                                    >
                                                        Block
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteUser(user.id)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
