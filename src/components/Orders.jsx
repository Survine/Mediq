import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaShoppingCart, FaSearch, FaEye } from 'react-icons/fa';
import ApiService from '../services/ApiService';
import OrderModalForm from '../inputforms/OrderModalForm';
import Table from '../resuables/Table';
import SearchBar from '../resuables/SearchBar';
import StatusMessages from '../resuables/StatusMessages';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch orders' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = orders.filter(order => 
      order.id.toString().includes(searchTerm) ||
      order.customer_id.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleCreate = () => {
    setSelectedOrder(null);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleView = async (order) => {
    try {
      const orderDetails = await ApiService.getOrderById(order.id);
      alert(`Order Details:\nID: ${orderDetails.id}\nCustomer: ${orderDetails.customer?.name || orderDetails.customer_id}\nTotal: $${orderDetails.total_amount}\nStatus: ${orderDetails.status}\nItems: ${orderDetails.order_medicines?.length || 0}`);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch order details' });
    }
  };

  const handleDelete = async (order) => {
    if (window.confirm(`Are you sure you want to delete order #${order.id}?`)) {
      try {
        await ApiService.deleteOrder(order.id);
        setMessage({ type: 'success', text: 'Order deleted successfully' });
        fetchOrders();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete order' });
      }
    }
  };

  const handleSubmit = async (orderData) => {
    try {
      if (selectedOrder) {
        await ApiService.updateOrder(selectedOrder.id, orderData);
        setMessage({ type: 'success', text: 'Order updated successfully' });
      } else {
        await ApiService.createOrder(orderData);
        setMessage({ type: 'success', text: 'Order created successfully' });
      }
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (value) => <span className="font-mono text-sm">#{value}</span>
    },
    {
      key: 'customer_id',
      header: 'Customer ID',
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'total_amount',
      header: 'Total Amount',
      render: (value) => (
        <span className="text-green-600 font-semibold">${parseFloat(value).toFixed(2)}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, order) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(order)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleEdit(order)}
            className="text-indigo-600 hover:text-indigo-800 p-1"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(order)}
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
            <FaShoppingCart className="mr-3 text-purple-500" />
            Orders
          </h1>
          <p className="text-gray-600 mt-1">Manage customer orders and transactions</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          New Order
        </button>
      </div>

      {/* Status Messages */}
      <StatusMessages message={message} onClose={() => setMessage({ type: '', text: '' })} />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search orders by ID, customer ID, or status..."
          icon={FaSearch}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Orders ({filteredOrders.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <Table 
            data={filteredOrders}
            columns={columns}
            emptyMessage="No orders found. Create your first order to get started."
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <OrderModalForm
          order={selectedOrder}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Orders;
