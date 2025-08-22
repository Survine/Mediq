import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaFileInvoice, FaSearch, FaEye, FaPrint, FaMoneyCheckAlt, FaExclamationTriangle, FaDownload } from 'react-icons/fa';
import ApiService from '../services/ApiService';
import Table from '../resuables/Table';
import SearchBar from '../resuables/SearchBar';
import StatusMessages from '../resuables/StatusMessages';
import InvoiceModalForm from '../inputforms/InvoiceModalForm';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
    fetchOrders();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getInvoices();
      setInvoices(data);
      applyFilters(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch invoices' });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await ApiService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const applyFilters = (invoiceList = invoices) => {
    let filtered = [...invoiceList];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [statusFilter]);

  const handleSearch = (searchTerm) => {
    let filtered = invoices;
    
    // Apply status filter first
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Then apply search
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toString().includes(searchTerm) ||
        invoice.order_id.toString().includes(searchTerm)
      );
    }

    setFilteredInvoices(filtered);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowModal(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowModal(true);
  };

  const handleSubmitInvoice = async (invoiceData) => {
    try {
      if (editingInvoice) {
        await ApiService.updateInvoice(editingInvoice.id, invoiceData);
        setMessage({ type: 'success', text: 'Invoice updated successfully' });
      } else {
        await ApiService.createInvoice(invoiceData);
        setMessage({ type: 'success', text: 'Invoice created successfully' });
      }
      await fetchInvoices();
      setShowModal(false);
      setEditingInvoice(null);
    } catch (error) {
      throw new Error(error.message || 'Failed to save invoice');
    }
  };

  const handleViewInvoice = async (invoice) => {
    try {
      const htmlContent = await ApiService.getInvoiceHTML(invoice.id);
      const invoiceWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      invoiceWindow.document.write(htmlContent);
      invoiceWindow.document.close();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to open invoice' });
    }
  };

  const handlePrintInvoice = async (invoice) => {
    try {
      const htmlContent = await ApiService.getInvoiceHTML(invoice.id);
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Trigger print after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to print invoice' });
    }
  };

  const handleMarkAsPaid = async (invoice) => {
    if (window.confirm(`Mark invoice #${invoice.invoice_number} as paid?`)) {
      try {
        await ApiService.markInvoiceAsPaid(invoice.id);
        setMessage({ type: 'success', text: 'Invoice marked as paid' });
        await fetchInvoices();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to mark invoice as paid' });
      }
    }
  };

  const handleDelete = async (invoice) => {
    if (invoice.status === 'paid') {
      setMessage({ type: 'error', text: 'Cannot delete a paid invoice' });
      return;
    }

    if (window.confirm(`Are you sure you want to delete invoice #${invoice.invoice_number}?`)) {
      try {
        await ApiService.deleteInvoice(invoice.id);
        setMessage({ type: 'success', text: 'Invoice deleted successfully' });
        await fetchInvoices();
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to delete invoice' });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (invoice) => {
    if (!invoice.due_date || invoice.status === 'paid') return false;
    return new Date(invoice.due_date) < new Date();
  };

  const columns = [
    {
      key: 'invoice_number',
      header: 'Invoice #',
      render: (value, invoice) => (
        <div className="flex items-center">
          <span className="font-mono text-sm font-medium">{value}</span>
          {isOverdue(invoice) && (
            <FaExclamationTriangle className="text-red-500 ml-2" title="Overdue" />
          )}
        </div>
      )
    },
    {
      key: 'order_id',
      header: 'Order ID',
      render: (value) => <span className="font-mono text-sm">#{value}</span>
    },
    {
      key: 'issued_date',
      header: 'Issue Date',
      render: (value) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      )
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (value) => (
        <span className={`text-sm ${isOverdue({due_date: value, status: 'sent'}) ? 'text-red-600 font-medium' : ''}`}>
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
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
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, invoice) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewInvoice(invoice)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View Invoice"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handlePrintInvoice(invoice)}
            className="text-green-600 hover:text-green-800 p-1"
            title="Print Invoice"
          >
            <FaPrint />
          </button>
          {invoice.status !== 'paid' && (
            <>
              <button
                onClick={() => handleEditInvoice(invoice)}
                className="text-yellow-600 hover:text-yellow-800 p-1"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleMarkAsPaid(invoice)}
                className="text-green-600 hover:text-green-800 p-1"
                title="Mark as Paid"
              >
                <FaMoneyCheckAlt />
              </button>
            </>
          )}
          {invoice.status !== 'paid' && (
            <button
              onClick={() => handleDelete(invoice)}
              className="text-red-600 hover:text-red-800 p-1"
              title="Delete"
            >
              <FaTrash />
            </button>
          )}
        </div>
      )
    }
  ];

  // Calculate stats
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
  const overdueInvoices = invoices.filter(inv => isOverdue(inv)).length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;

  const statusOptions = [
    { value: 'all', label: 'All Invoices', count: totalInvoices },
    { value: 'sent', label: 'Sent', count: invoices.filter(inv => inv.status === 'sent').length },
    { value: 'paid', label: 'Paid', count: paidInvoices },
    { value: 'overdue', label: 'Overdue', count: overdueInvoices },
    { value: 'draft', label: 'Draft', count: invoices.filter(inv => inv.status === 'draft').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaFileInvoice className="mr-3 text-blue-500" />
            Invoices
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all invoices</p>
        </div>
        <button
          onClick={handleCreateInvoice}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Create Invoice
        </button>
      </div>

      {/* Status Messages */}
      <StatusMessages message={message} onClose={() => setMessage({ type: '', text: '' })} />

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <FaFileInvoice className="text-blue-600 text-xl" />
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
              <FaMoneyCheckAlt className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <FaFileInvoice className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Amount</h3>
              <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
              <p className="text-2xl font-bold text-red-600">{overdueInvoices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusFilterChange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>

        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search invoices by invoice number, ID, or order ID..."
          icon={FaSearch}
        />
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {statusFilter === 'all' ? 'All Invoices' : `${statusOptions.find(opt => opt.value === statusFilter)?.label} Invoices`} 
            ({filteredInvoices.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Table 
            data={filteredInvoices}
            columns={columns}
            emptyMessage={
              statusFilter === 'all' 
                ? "No invoices found. Create an invoice from completed orders."
                : `No ${statusOptions.find(opt => opt.value === statusFilter)?.label.toLowerCase()} invoices found.`
            }
          />
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceModalForm
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingInvoice(null);
        }}
        onSubmit={handleSubmitInvoice}
        invoice={editingInvoice}
        orders={orders}
      />
    </div>
  );
};

export default Invoices;
