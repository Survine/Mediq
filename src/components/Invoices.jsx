import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaFileInvoice, FaSearch, FaEye, FaPrint } from 'react-icons/fa';
import ApiService from '../services/ApiService';
import Table from '../resuables/Table';
import SearchBar from '../resuables/SearchBar';
import StatusMessages from '../resuables/StatusMessages';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getInvoices();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch invoices' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = invoices.filter(invoice => 
      invoice.id.toString().includes(searchTerm) ||
      invoice.order_id.toString().includes(searchTerm) ||
      invoice.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
  };

  const handleView = async (invoice) => {
    try {
      const invoiceDetails = await ApiService.getInvoiceById(invoice.id);
      // Create a simple invoice view
      const invoiceWindow = window.open('', '_blank', 'width=800,height=600');
      invoiceWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${invoiceDetails.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .details { margin: 20px 0; }
              .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .table th { background-color: #f2f2f2; }
              .total { text-align: right; font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>INVOICE</h1>
              <h2>#${invoiceDetails.id}</h2>
            </div>
            <div class="details">
              <p><strong>Date:</strong> ${new Date(invoiceDetails.date).toLocaleDateString()}</p>
              <p><strong>Order ID:</strong> ${invoiceDetails.order_id}</p>
              <p><strong>Customer:</strong> ${invoiceDetails.customer_name || 'N/A'}</p>
            </div>
            <div class="total">
              <p>Total Amount: $${invoiceDetails.total_amount.toFixed(2)}</p>
            </div>
          </body>
        </html>
      `);
      invoiceWindow.document.close();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch invoice details' });
    }
  };

  const handlePrint = (invoice) => {
    handleView(invoice);
  };

  const handleDelete = async (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice #${invoice.id}?`)) {
      try {
        await ApiService.deleteInvoice(invoice.id);
        setMessage({ type: 'success', text: 'Invoice deleted successfully' });
        fetchInvoices();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete invoice' });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Invoice ID',
      render: (value) => <span className="font-mono text-sm">#{value}</span>
    },
    {
      key: 'order_id',
      header: 'Order ID',
      render: (value) => <span className="font-mono text-sm">#{value}</span>
    },
    {
      key: 'customer_name',
      header: 'Customer',
      render: (value) => (
        <span className="font-medium">{value || 'N/A'}</span>
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: (value) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      )
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
          {value || 'pending'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, invoice) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(invoice)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View Invoice"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handlePrint(invoice)}
            className="text-green-600 hover:text-green-800 p-1"
            title="Print Invoice"
          >
            <FaPrint />
          </button>
          <button
            onClick={() => handleDelete(invoice)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  // Calculate stats
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending' || !inv.status).length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaFileInvoice className="mr-3 text-yellow-500" />
            Invoices
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all invoices</p>
        </div>
      </div>

      {/* Status Messages */}
      <StatusMessages message={message} onClose={() => setMessage({ type: '', text: '' })} />

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <FaFileInvoice className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Invoices</h3>
              <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <FaFileInvoice className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <FaFileInvoice className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Paid Invoices</h3>
              <p className="text-2xl font-bold text-green-600">{paidInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <FaFileInvoice className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Invoices</h3>
              <p className="text-2xl font-bold text-yellow-600">{pendingInvoices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search invoices by ID, order ID, or customer name..."
          icon={FaSearch}
        />
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Invoices ({filteredInvoices.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          </div>
        ) : (
          <Table 
            data={filteredInvoices}
            columns={columns}
            emptyMessage="No invoices found. Invoices will be generated automatically when orders are completed."
          />
        )}
      </div>
    </div>
  );
};

export default Invoices;
