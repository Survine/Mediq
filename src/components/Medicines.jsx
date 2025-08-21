import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPills, FaSearch } from 'react-icons/fa';
import ApiService from '../services/ApiService';
import MedicineModalForm from '../inputforms/MedicineModalForm';
import Table from '../resuables/Table';
import SearchBar from '../resuables/SearchBar';
import StatusMessages from '../resuables/StatusMessages';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getMedicines();
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch medicines' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicines(filtered);
  };

  const handleCreate = () => {
    setSelectedMedicine(null);
    setShowModal(true);
  };

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setShowModal(true);
  };

  const handleDelete = async (medicine) => {
    if (window.confirm(`Are you sure you want to delete ${medicine.name}?`)) {
      try {
        await ApiService.deleteMedicine(medicine.id);
        setMessage({ type: 'success', text: 'Medicine deleted successfully' });
        fetchMedicines();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete medicine' });
      }
    }
  };

  const handleSubmit = async (medicineData) => {
    try {
      if (selectedMedicine) {
        await ApiService.updateMedicine(selectedMedicine.id, medicineData);
        setMessage({ type: 'success', text: 'Medicine updated successfully' });
      } else {
        await ApiService.createMedicine(medicineData);
        setMessage({ type: 'success', text: 'Medicine created successfully' });
      }
      setShowModal(false);
      fetchMedicines();
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
      header: 'Medicine Name',
      render: (value) => (
        <div className="flex items-center">
          <FaPills className="text-blue-500 mr-2" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'price',
      header: 'Price',
      render: (value) => (
        <span className="text-green-600 font-semibold">${parseFloat(value).toFixed(2)}</span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, medicine) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(medicine)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(medicine)}
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
            <FaPills className="mr-3 text-blue-500" />
            Medicines
          </h1>
          <p className="text-gray-600 mt-1">Manage your medicine inventory</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Status Messages */}
      <StatusMessages message={message} onClose={() => setMessage({ type: '', text: '' })} />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search medicines by name..."
          icon={FaSearch}
        />
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Medicines ({filteredMedicines.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Table 
            data={filteredMedicines}
            columns={columns}
            emptyMessage="No medicines found. Add your first medicine to get started."
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <MedicineModalForm
          medicine={selectedMedicine}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Medicines;
