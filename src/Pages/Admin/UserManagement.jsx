import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';

function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user-details/`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            User Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage all registered users on the platform
          </p>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 px-6 py-4 bg-gray-100 text-sm font-medium text-gray-600">
            <span>Name</span>
            <span>Surname</span>
            <span>Email</span>
          </div>

          {/* Table Rows */}
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-3 px-6 py-4 text-sm text-gray-700 border-t hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-800">
                  {user.first_name || '—'}
                </span>
                <span>{user.last_name || '—'}</span>
                <span className="text-gray-600">{user.email}</span>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center text-gray-500">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
