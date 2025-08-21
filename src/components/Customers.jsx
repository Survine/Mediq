import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaSearch, FaEye } from 'react-icons/fa';
import ApiService from '../services/ApiService';
import CustomerModalForm from '../inputforms/CustomerModalForm';
import Table from '../resuables/Table';
import SearchBar from '../resuables/SearchBar';
import StatusMessages from '../resuables/StatusMessages';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch customers' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  };

  const handleCreate = () => {
    setSelectedCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleView = async (customer) => {
    try {
      const customerDetails = await ApiService.getCustomerById(customer.id);
      alert(`Customer Details:\nID: ${customerDetails.id}\nName: ${customerDetails.name}\nEmail: ${customerDetails.email}\nPhone: ${customerDetails.phone}\nAddress: ${customerDetails.address}`);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch customer details' });
    }
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        await ApiService.deleteCustomer(customer.id);
        setMessage({ type: 'success', text: 'Customer deleted successfully' });
        fetchCustomers();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete customer' });
      }
    }
  };

  const handleSubmit = async (customerData) => {
    try {
      if (selectedCustomer) {
        await ApiService.updateCustomer(selectedCustomer.id, customerData);
        setMessage({ type: 'success', text: 'Customer updated successfully' });
      } else {
        await ApiService.createCustomer(customerData);
        setMessage({ type: 'success', text: 'Customer created successfully' });
      }
      setShowModal(false);
      fetchCustomers();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'name',
      header: 'Customer Name',
      render: (value) => (
        <div className="flex items-center">
          <FaUsers className="text-green-500 mr-2" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      render: (value) => (
        <span className="text-blue-600">{value}</span>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (value) => (
        <span className="text-gray-700">{value}</span>
      )
    },
    {
      key: 'address',
      header: 'Address',
      render: (value) => (
        <span className="text-gray-600 text-sm max-w-xs truncate block" title={value}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, customer) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(customer)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleEdit(customer)}
            className="text-indigo-600 hover:text-indigo-800 p-1"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(customer)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaUsers className="mr-3 text-green-500" />
            Customers
          </h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Customer
        </button>
      </div>

      {/* Status Messages */}
      <StatusMessages message={message} onClose={() => setMessage({ type: '', text: '' })} />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search customers by name, email, or phone..."
          icon={FaSearch}
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Customers ({filteredCustomers.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <Table 
            data={filteredCustomers}
            columns={columns}
            emptyMessage="No customers found. Add your first customer to get started."
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CustomerModalForm
          customer={selectedCustomer}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Customers;