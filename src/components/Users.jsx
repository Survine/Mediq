import { useState } from "react";

import Layout from "../resuables/Layout";
import Header from "../resuables/Header";
import Toolbar from "../resuables/Toolbar";
import Table from "../resuables/Table";
import UserModalForm from "../inputforms/UserModalForm";
import StatusMessages from "../resuables/StatusMessages";

import useAdminCRUD from "../hooks/useAdminCRUD";
import useAdminSearch from "../hooks/useAdminSearch";


const Users = () => {
  const searchOptions = [
    { value: "username", label: "Username" },
    { value: "email", label: "Email" },
    { value: "id", label: "ID" },
  ];

  const tableColumns = [
    { 
      key: "id", 
      title: "ID",
      render: (user) => <span className="font-medium">{user.id}</span>
    },
    { 
      key: "username", 
      title: "Username",
      render: (user) => <span className="font-medium">{user.username}</span>
    },
    { 
      key: "email", 
      title: "Email",
      render: (user) => <span className="text-gray-600">{user.email}</span>
    },
    { 
      key: "is_admin", 
      title: "Admin",
      render: (user) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.is_admin
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {user.is_admin ? "Yes" : "No"}
        </span>
      )
    },
  ];


  const {
    data: users = [], // Default to empty array
    isLoading,
    error: apiError,
    success,
    fetchAll,
    createItem,
    updateItem,
    deleteItem,
    setError: setApiError,
    clearMessages,
  } = useAdminCRUD("http://127.0.0.1:8000/users");

  const {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    filteredData: filteredUsers = [], // Default to empty array
    searchError,
  } = useAdminSearch(users, searchOptions);

  const [editingUser, setEditingUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    is_admin: false,
  });

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      is_admin: user.is_admin,
    });
    setIsCreating(false);
    clearMessages();
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await deleteItem(userId);
      await fetchAll();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSave = async () => {
    if (!formData.username.trim() || !formData.email.trim()) {
      setApiError("Username and email are required");
      return;
    }
    if (isCreating && !formData.password) {
      setApiError("Password is required for new users");
      return;
    }

    try {
      if (isCreating) {
        await createItem(formData);
      } else {
        await updateItem(editingUser.id, formData);
      }
      await fetchAll();
      setEditingUser(null);
      setIsCreating(false);
      setFormData({ username: "", email: "", password: "", is_admin: false });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleCreateClick = () => {
    setEditingUser(null);
    setFormData({ username: "", email: "", password: "", is_admin: false });
    setIsCreating(true);
    clearMessages();
  };

  const error = apiError || searchError;

  return (
    <Layout>
      <Header title="👥 Users Dashboard" description="Manage your application users" />
      
      <Toolbar
        onAddClick={handleCreateClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchType={searchType}
        setSearchType={setSearchType}
        searchOptions={searchOptions}
        isLoading={isLoading}
      />

      <StatusMessages error={error} success={success} isLoading={isLoading} />

      <Table
        columns={tableColumns}
        data={filteredUsers}
        emptyMessage={searchTerm ? "No users found matching your search" : "No users available"}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <UserModalForm
        isOpen={!!editingUser || isCreating}
        onClose={() => {
          setEditingUser(null);
          setIsCreating(false);
          clearMessages();
        }}
        onSubmit={handleSave}
        title={editingUser ? "Edit User" : "Add New User"}
        formData={formData}
        setFormData={setFormData}
        isCreating={isCreating}
        isLoading={isLoading}
        error={error}
      />
    </Layout>
  );
};

export default Users;