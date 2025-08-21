import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaWarehouse, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import ApiService from '../services/ApiService';
import StockModalForm from '../inputforms/StockModalForm';
import Table from '../resuables/Table';
import SearchBar from '../resuables/SearchBar';
import StatusMessages from '../resuables/StatusMessages';

const Inventory = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStocksAndMedicines();
  }, []);

  const fetchStocksAndMedicines = async () => {
    try {
      setLoading(true);
      const [stocksData, medicinesData] = await Promise.all([
        ApiService.getStocks(),
        ApiService.getMedicines()
      ]);
      
      // Create a medicine lookup map
      const medicineMap = {};
      medicinesData.forEach(med => {
        medicineMap[med.id] = med;
      });

      // Enhance stock data with medicine info
      const enhancedStocks = stocksData.map(stock => ({
        ...stock,
        medicine: medicineMap[stock.medicine_id] || { name: 'Unknown Medicine' }
      }));

      setStocks(enhancedStocks);
      setFilteredStocks(enhancedStocks);
      setMedicines(medicinesData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch inventory data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = stocks.filter(stock =>
      stock.medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.batch_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.quantity.toString().includes(searchTerm)
    );
    setFilteredStocks(filtered);
  };

  const handleCreate = () => {
    setSelectedStock(null);
    setShowModal(true);
  };

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setShowModal(true);
  };

  const handleDelete = async (stock) => {
    if (window.confirm(`Are you sure you want to delete stock for ${stock.medicine.name}?`)) {
      try {
        await ApiService.deleteStock(stock.id);
        setMessage({ type: 'success', text: 'Stock deleted successfully' });
        fetchStocksAndMedicines();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete stock' });
      }
    }
  };

  const handleSubmit = async (stockData) => {
    try {
      if (selectedStock) {
        await ApiService.updateStock(selectedStock.id, stockData);
        setMessage({ type: 'success', text: 'Stock updated successfully' });
      } else {
        await ApiService.createStock(stockData);
        setMessage({ type: 'success', text: 'Stock created successfully' });
      }
      setShowModal(false);
      fetchStocksAndMedicines();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const getQuantityColor = (quantity) => {
    if (quantity === 0) return 'text-red-600 bg-red-50';
    if (quantity < 10) return 'text-orange-600 bg-orange-50';
    if (quantity < 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { color: 'text-gray-500', text: 'No expiry date' };
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { color: 'text-red-600', text: 'Expired' };
    if (diffDays <= 30) return { color: 'text-red-600', text: `Expires in ${diffDays} days` };
    if (diffDays <= 90) return { color: 'text-orange-600', text: `Expires in ${diffDays} days` };
    return { color: 'text-green-600', text: expiry.toLocaleDateString() };
  };

  const columns = [
    {
      key: 'id',
      header: 'Stock ID',
      render: (value) => <span className="font-mono text-sm">#{value}</span>
    },
    {
      key: 'medicine.name',
      header: 'Medicine Name',
      render: (value, stock) => (
        <div className="flex items-center">
          <FaWarehouse className="text-blue-500 mr-2" />
          <span className="font-medium">{stock.medicine.name}</span>
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getQuantityColor(value)}`}>
          {value} units
          {value < 10 && <FaExclamationTriangle className="inline ml-1" />}
        </span>
      )
    },
    {
      key: 'batch_number',
      header: 'Batch Number',
      render: (value) => (
        <span className="font-mono text-sm">{value || 'N/A'}</span>
      )
    },
    {
      key: 'expiry_date',
      header: 'Expiry Date',
      render: (value) => {
        const status = getExpiryStatus(value);
        return <span className={`text-sm ${status.color}`}>{status.text}</span>;
      }
    },
    {
      key: 'last_updated',
      header: 'Last Updated',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, stock) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(stock)}
            className="text-indigo-600 hover:text-indigo-800 p-1"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(stock)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  // Calculate inventory stats
  const totalItems = stocks.length;
  const lowStockItems = stocks.filter(stock => stock.quantity < 10).length;
  const expiredItems = stocks.filter(stock => {
    if (!stock.expiry_date) return false;
    return new Date(stock.expiry_date) < new Date();
  }).length;
  const expiringItems = stocks.filter(stock => {
    if (!stock.expiry_date) return false;
    const expiry = new Date(stock.expiry_date);
    const now = new Date();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaWarehouse className="mr-3 text-blue-500" />
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-1">Track and manage medicine stock levels</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Stock
        </button>
      </div>

      {/* Status Messages */}
      <StatusMessages message={message} onClose={() => setMessage({ type: '', text: '' })} />

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <FaWarehouse className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Low Stock</h3>
              <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <FaExclamationTriangle className="text-orange-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Expiring Soon</h3>
              <p className="text-2xl font-bold text-orange-600">{expiringItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Expired</h3>
              <p className="text-2xl font-bold text-red-600">{expiredItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search by medicine name, batch number, or quantity..."
          icon={FaSearch}
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Stock Inventory ({filteredStocks.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Table 
            data={filteredStocks}
            columns={columns}
            emptyMessage="No stock items found. Add your first stock entry to get started."
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <StockModalForm
          stock={selectedStock}
          medicines={medicines}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Inventory;
