import { useEffect, useState } from "react";
import { FaPencil, FaTrash, FaPlus, FaUser, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa6";
import { FaSearch, FaTimes } from "react-icons/fa";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        is_admin: false
    });
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("username");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("http://127.0.0.1:8000/users/");
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to fetch users");
            }
            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserById = async (userId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${userId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "User not found");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching user:", error);
            setError(error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserByEmail = async (email) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/email/${encodeURIComponent(email)}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "User not found");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching user by email:", error);
            setError(error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserByUsername = async (username) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/username/${encodeURIComponent(username)}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "User not found");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching user by username:", error);
            setError(error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredUsers(users);
            return;
        }

        const searchUsers = async () => {
            setIsLoading(true);
            try {
                let result;
                if (searchType === "id") {
                    result = await fetchUserById(searchTerm);
                    setFilteredUsers(result ? [result] : []);
                } else if (searchType === "email") {
                    result = await fetchUserByEmail(searchTerm);
                    setFilteredUsers(result ? [result] : []);
                } else if (searchType === "username") {
                    result = await fetchUserByUsername(searchTerm);
                    setFilteredUsers(result ? [result] : []);
                }
            } catch (error) {
                console.error("Search error:", error);
                setFilteredUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchUsers();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, searchType, users]);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: "",
            is_admin: user.is_admin,
        });
        setIsCreating(false);
        setError(null);
        setSuccess(null);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Delete failed");
            }
            setSuccess("User deleted successfully");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.username || !formData.email) {
            setError("Username and email are required");
            return;
        }

        if (isCreating && !formData.password) {
            setError("Password is required for new users");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const url = editingUser
                ? `http://127.0.0.1:8000/users/${editingUser.id}`
                : "http://127.0.0.1:8000/users/";
            const method = editingUser ? "PUT" : "POST";

            const requestData = isCreating
                ? formData
                : {
                    username: formData.username,
                    email: formData.email,
                    is_admin: formData.is_admin
                };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Save failed");
            }

            const result = await response.json();
            setEditingUser(null);
            setIsCreating(false);
            setFormData({ username: "", email: "", password: "", is_admin: false });
            setSuccess(editingUser ? "User updated successfully" : "User created successfully");
            fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateClick = () => {
        setEditingUser(null);
        setFormData({ username: "", email: "", password: "", is_admin: false });
        setIsCreating(true);
        setError(null);
        setSuccess(null);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setFilteredUsers(users);
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 to-purple-100">
            <div className="max-w-6xl mx-auto">
                <div className="backdrop-blur-lg bg-white/30 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-white/30">
                        <h1 className="text-3xl font-bold text-gray-800">👥 Users Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage your application users</p>
                    </div>

                    {/* Toolbar */}
                    <div className="p-4 flex flex-wrap items-center justify-between gap-4 bg-white/20">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCreateClick}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                                disabled={isLoading}
                            >
                                <FaPlus /> Add User
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="bg-white/70 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                disabled={isLoading}
                            >
                                <option value="username">Username</option>
                                <option value="email">Email</option>
                                <option value="id">ID</option>
                            </select>

                            <div className="relative">
                                <input
                                    type={searchType === "id" ? "number" : "text"}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={`Search by ${searchType}...`}
                                    className="bg-white/70 border border-gray-300 rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
                                    disabled={isLoading}
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mx-4 mt-2 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Success message */}
                    {success && (
                        <div className="mx-4 mt-2 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
                            <p>{success}</p>
                        </div>
                    )}

                    {/* Loading state */}
                    {isLoading && (
                        <div className="p-8 flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    )}

                    {/* Users table */}
                    {!isLoading && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200/50">
                                <thead className="bg-gradient-to-r from-indigo-400/10 to-purple-400/10">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Admin
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/30 divide-y divide-gray-200/30">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-white/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {user.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                    {user.username}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_admin
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {user.is_admin ? "Yes" : "No"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleEditClick(user)}
                                                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                                            disabled={isLoading}
                                                        >
                                                            <FaPencil className="h-4 w-4" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                            disabled={isLoading}
                                                        >
                                                            <FaTrash className="h-4 w-4" /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                {searchTerm ? "No users found matching your search" : "No users available"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {(editingUser || isCreating) && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md border border-white/30">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                {editingUser ? "Edit User" : "Add New User"}
                            </h2>

                            {error && (
                                <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaUser className="inline mr-2" />
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({ ...formData, username: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaEnvelope className="inline mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                        disabled={isLoading}
                                    />
                                </div>

                                {isCreating && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <FaLock className="inline mr-2" />
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({ ...formData, password: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                            disabled={isLoading}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FaUserShield className="inline mr-2" />
                                        Admin Status
                                    </label>
                                    <select
                                        value={formData.is_admin}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                is_admin: e.target.value === "true",
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                        disabled={isLoading}
                                    >
                                        <option value="false">Regular User</option>
                                        <option value="true">Administrator</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setEditingUser(null);
                                        setIsCreating(false);
                                        setError(null);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;