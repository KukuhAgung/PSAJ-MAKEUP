/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
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

// Dummy Data User
const usersData = [
  { id: 1, username: "john_doe", email: "john@example.com", password: "********", phone: "123-456-7890", role: "Admin" },
  { id: 2, username: "jane_smith", email: "jane@example.com", password: "********", phone: "987-654-3210", role: "User" },
  { id: 3, username: "mike_jones", email: "mike@example.com", password: "********", phone: "456-789-1234", role: "User" },
];

export default function UserManagementTable() {
  const [users, setUsers] = useState(usersData);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (user: any) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...selectedUser } : user
      )
    );
    closeModal();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Pengguna
      </h3>
      <Table className="w-full border-collapse">
        <TableHeader className="bg-gray-100 dark:bg-gray-800 text-left">
          <TableRow>
            {["Username", "Email", "Password", "No Telpon", "Role", "Edit"].map((header) => (
              <TableCell key={header} isHeader className="py-3 px-4 font-semibold text-gray-700 dark:text-white">
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <TableCell className="py-3 px-4">{user.username}</TableCell>
              <TableCell className="py-3 px-4">{user.email}</TableCell>
              <TableCell className="py-3 px-4">{user.password}</TableCell>
              <TableCell className="py-3 px-4">{user.phone}</TableCell>
              <TableCell className="py-3 px-4">
                <Badge color={user.role === "Admin" ? "success" : "warning"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="py-3 px-4">
                <button onClick={() => openModal(user)} className="text-blue-500 hover:text-blue-700">
                  <EditTabel className="w-5 h-5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal Edit */}
      <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[500px] shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
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
                      setSelectedUser({ ...selectedUser, username: e.target.value })
                    }
                    className="border w-full p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
                  />
                </label>

                <label className="text-sm text-gray-700 dark:text-white">
                  Email
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, email: e.target.value })
                    }
                    className="border w-full p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
                  />
                </label>

                <label className="text-sm text-gray-700 dark:text-white">
                  No Telpon
                  <input
                    type="text"
                    value={selectedUser.phone}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, phone: e.target.value })
                    }
                    className="border w-full p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
                  />
                </label>

                <label className="text-sm text-gray-700 dark:text-white">
                  Role
                  <select
                    value={selectedUser.role}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, role: e.target.value })
                    }
                    className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="text-gray-700 dark:text-white px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition"
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
