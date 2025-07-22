import { useState } from "react";
import Layout from "../resuables/Layout";
import Header from "../resuables/Header";
import Toolbar from "../resuables/Toolbar";
import Table from "../resuables/Table";
import CustomerModalForm from "../inputforms/CustomerModalForm";
import StatusMessages from "../resuables/StatusMessages";
import useAdminCRUD from "../hooks/useAdminCRUD";
import useAdminSearch from "../hooks/useAdminSearch";

const Customers = () => {
    const searchOptions = [
        { value: "name", label: "Name" },
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone" },
    ];

    const tableColumns = [
        {
            key: "id",
            title: "ID",
            render: (customer) => <span className="font-medium">{customer.id}</span>
        },
        {
            key: "name",
            title: "Customer Name",
            render: (customer) => <span className="font-medium">{customer.name}</span>
        },
        {
            key: "email",
            title: "Email",
            render: (customer) => <span className="text-gray-600">{customer.email}</span>
        },
        {
            key: "phone",
            title: "Phone No.",
            render: (customer) => <span className="text-gray-600">{customer.phone}</span>
        },
        {
            key: "address",
            title: "Address",
            render: (customer) => <span className="text-gray-600">{customer.address}</span>
        },
    ];

    const {
        data: customers = [],
        isLoading,
        error: apiError,
        success,
        fetchAll,
        createItem,
        updateItem,
        deleteItem,
        setError: setApiError,
        clearMessages,
    } = useAdminCRUD("https://mediq-a6x0.onrender.com/customers");

    const {
        searchTerm,
        setSearchTerm,
        searchType,
        setSearchType,
        filteredData: filteredCustomers = [],
        searchError,
    } = useAdminSearch(customers, searchOptions);

    const [editingCustomer, setEditingCustomer] = useState(null);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false); // Added isCreating state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const handleEditClick = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
        });
        setIsCreating(false); // Set to false when editing
        setIsCustomerModalOpen(true);
        clearMessages();
    };

    const handleDelete = async (customerId) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;
        
        try {
            await deleteItem(customerId);
            await fetchAll();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.phone.trim()) {
            setApiError("Name and Phone are required");
            return;
        }

        try {
            if (isCreating) {
                await createItem(formData);
            } else {
                await updateItem(editingCustomer.id, formData);
            }
            await fetchAll();
            setIsCustomerModalOpen(false);
            setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
            });
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    const handleCreateClick = () => {
        setEditingCustomer(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
        });
        setIsCreating(true); // Set to true when creating
        setIsCustomerModalOpen(true);
        clearMessages();
    };

    const error = apiError || searchError;

    return (
        <Layout>
            <Header title="👥 Customers Dashboard" description="Manage your customers" />

            <Toolbar
                onAddClick={handleCreateClick}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchType={searchType}
                setSearchType={setSearchType}
                searchOptions={searchOptions}
                isLoading={isLoading}
                addButtonText="Add Customer"
            />

            <StatusMessages error={error} success={success} isLoading={isLoading} />

            <Table
                columns={tableColumns}
                data={filteredCustomers}
                emptyMessage={searchTerm ? "No customers found matching your search" : "No customers available"}
                onEdit={handleEditClick}
                onDelete={(customer) => handleDelete(customer.id)}
                isLoading={isLoading}
            />

            <CustomerModalForm
                isOpen={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                onSubmit={handleSave}
                title={editingCustomer ? "Edit Customer" : "Add New Customer"}
                formData={formData}
                setFormData={setFormData}
                isCreating={isCreating} // Now properly passed
                isLoading={isLoading}
                error={error}
            />
        </Layout>
    );
};

export default Customers;