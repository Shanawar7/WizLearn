import React from "react";
import AdminUserTable from "./AdminUserTable";

export default function AdminUsersPage() {
    return (
        <div className="container-fluid">
            <h2>User Management</h2>
            <p className="text-muted">Manage all registered users.</p>
            <AdminUserTable />
        </div>
    );
}
