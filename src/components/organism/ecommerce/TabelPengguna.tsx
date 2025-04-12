
"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../molecules/table";
import { EditTabel } from "@/icons";
import Badge from "../../molecules/badge/Badge";
import { Dialog } from "@headlessui/react";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tabeluser');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }
        
        const result = await response.json();
        setUsers(result.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/tabeluser/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: selectedUser.username,
          email: selectedUser.email,
          phoneNumber: selectedUser.phone,
          role: selectedUser.role === "Admin" ? "ADMIN" : "USER",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update the local state with the updated user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...selectedUser } : user
        )
      );
      
      closeModal();
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user. Please try again.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading users...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
        Pengguna
      </h3>
      <Table className="w-full border-collapse">
        <TableHeader className="bg-gray-100 text-left dark:bg-gray-800">
          <TableRow>
            {["Username", "Email", "Password", "No Telpon", "Role", "Edit"].map(
              (header) => (
                <TableCell
                  key={header}
                  isHeader
                  className="px-4 py-3 font-semibold text-gray-700 dark:text-white"
                >
                  {header}
                </TableCell>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell className="py-8 text-center text-gray-500">
                No users found
              </TableCell>
              <TableCell className="py-8 text-center text-gray-500">
                {/* Empty cell with children */}
                &nbsp;
              </TableCell>
              <TableCell className="py-8 text-center text-gray-500">
                &nbsp;
              </TableCell>
              <TableCell className="py-8 text-center text-gray-500">
                &nbsp;
              </TableCell>
              <TableCell className="py-8 text-center text-gray-500">
                &nbsp;
              </TableCell>
              <TableCell className="py-8 text-center text-gray-500">
                &nbsp;
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <TableCell className="px-4 py-3">{user.username}</TableCell>
                <TableCell className="px-4 py-3">{user.email}</TableCell>
                <TableCell className="px-4 py-3">{user.password}</TableCell>
                <TableCell className="px-4 py-3">{user.phone}</TableCell>
                <TableCell className="px-4 py-3">
                  <Badge color={user.role === "Admin" ? "success" : "warning"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <button
                    onClick={() => openModal(user)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <EditTabel className="h-5 w-5" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modal Edit */}
      <Dialog
        open={isOpen}
        onClose={closeModal}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      >
        <div className="w-[500px] rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
          <Dialog.Title className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Edit Pengguna
          </Dialog.Title>
          {selectedUser && (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-4">
                <label className="text-sm text-gray-700 dark:text-white">
                  Username
                  <input
                    type="text"
                    value={selectedUser.username}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        username: e.target.value,
                      })
                    }
                    className="w-full rounded border bg-white p-2 dark:bg-gray-800 dark:text-white"
                  />
                </label>

                <label className="text-sm text-gray-700 dark:text-white">
                  Email
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                    className="w-full rounded border bg-white p-2 dark:bg-gray-800 dark:text-white"
                  />
                </label>

                <label className="text-sm text-gray-700 dark:text-white">
                  No Telpon
                  <input
                    type="text"
                    value={selectedUser.phone}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phone: e.target.value,
                      })
                    }
                    className="w-full rounded border bg-white p-2 dark:bg-gray-800 dark:text-white"
                  />
                </label>

                <label className="text-sm text-gray-700 dark:text-white">
                  Role
                  <select
                    value={selectedUser.role}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, role: e.target.value })
                    }
                    className="rounded border bg-white p-2 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="rounded-lg bg-primary-500 px-4 py-2 text-white transition hover:bg-primary-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}
        </div>
      </Dialog>
    </div>
  );
}