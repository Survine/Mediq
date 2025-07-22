import { useState, useEffect } from "react";
import Layout from "../resuables/Layout";
import Header from "../resuables/Header";
import Toolbar from "../resuables/Toolbar";
import Table from "../resuables/Table";
import MedicineModalForm from "../inputforms/MedicineModalForm";
import StatusMessages from "../resuables/StatusMessages";
import useAdminCRUD from "../hooks/useAdminCRUD";
import useAdminSearch from "../hooks/useAdminSearch";

const Medicines = () => {
  const [editingUser, setEditingUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  const searchOptions = [
    { value: "name", label: "Medicine Name" },
    { value: "id", label: "ID" },
  ];

  const tableColumns = [
    {
      key: "id",
      title: "ID",
      render: (med) => <span className="font-medium">{med.id}</span>,
    },
    {
      key: "name",
      title: "Medicine Name",
      render: (med) => <span className="font-medium">{med.name}</span>,
    },
  ];

  const {
    data: users = [],
    isLoading,
    error: apiError,
    success,
    fetchAll,
    createItem,
    updateItem,
    deleteItem,
    setError: setApiError,
    clearMessages,
  } = useAdminCRUD("https://mediq-a6x0.onrender.com/medicines");

  const {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    filteredData: filteredMedicines = [],
    searchError,
  } = useAdminSearch(users, searchOptions);

  useEffect(() => {
    fetchAll();
  }, []);

  const handleEditClick = (med) => {
    setEditingUser(med);
    setFormData({
      name: med.name,
      price: med.price,
    });
    setIsCreating(false);
    setIsMedicineModalOpen(true);
    clearMessages();
  };

  const handleDelete = async (medId) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await deleteItem(medId);
      await fetchAll();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price.trim()) {
      setApiError("Medicine Name and Price are required");
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
      setFormData({ name: "", price: "" });
      setIsMedicineModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleCreateClick = () => {
    setEditingUser(null);
    setFormData({ name: "", price: "" });
    setIsCreating(true);
    setIsMedicineModalOpen(true);
    clearMessages();
  };

  const error = apiError || searchError;

  return (
    <Layout>
      <Header title="💊 Medicines Dashboard" description="Manage your medicines" />

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
        data={filteredMedicines}
        emptyMessage={
          searchTerm
            ? "No medicines found matching your search"
            : "No medicines available"
        }
        onEdit={handleEditClick}
        onDelete={(med) => handleDelete(med.id)}
        isLoading={isLoading}
        addButtonText="Add Medicine"
      />

      <MedicineModalForm
        isOpen={isMedicineModalOpen}
        onClose={() => setIsMedicineModalOpen(false)}
        onSubmit={handleSave}
        title={editingUser ? "Edit Medicine" : "Add New Medicine"}
        formData={formData}
        setFormData={setFormData}
        isCreating={isCreating}
        isLoading={isLoading}
        error={error}
      />
    </Layout>
  );
};

export default Medicines;
