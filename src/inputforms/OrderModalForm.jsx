import { useState, useEffect } from 'react';
import { FaShoppingCart, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import ApiService from '../services/ApiService';

const OrderModalForm = ({ order, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    order_medicines: []
  });
  const [customers, setCustomers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomersAndMedicines();
    if (order) {
      setFormData({
        customer_id: order.customer_id,
        order_medicines: order.order_medicines || []
      });
    }
  }, [order]);

  const fetchCustomersAndMedicines = async () => {
    try {
      const [customersData, medicinesData] = await Promise.all([
        ApiService.getCustomers(),
        ApiService.getMedicines()
      ]);
      setCustomers(customersData);
      setMedicines(medicinesData);
    } catch (error) {
      setError('Failed to load customers and medicines');
    }
  };

  const addMedicineItem = () => {
    setFormData({
      ...formData,
      order_medicines: [
        ...formData.order_medicines,
        { medicine_id: '', quantity: 1, unit_price: '' }
      ]
    });
  };

  const removeMedicineItem = (index) => {
    setFormData({
      ...formData,
      order_medicines: formData.order_medicines.filter((_, i) => i !== index)
    });
  };

  const updateMedicineItem = (index, field, value) => {
    const updatedMedicines = [...formData.order_medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
    
    // Auto-populate unit price when medicine is selected
    if (field === 'medicine_id' && value) {
      const selectedMedicine = medicines.find(m => m.id.toString() === value);
      if (selectedMedicine) {
        updatedMedicines[index].unit_price = selectedMedicine.price;
      }
    }

    setFormData({ ...formData, order_medicines: updatedMedicines });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_id) {
      setError('Please select a customer');
      return;
    }

    if (formData.order_medicines.length === 0) {
      setError('Please add at least one medicine');
      return;
    }

    // Validate all medicine items
    for (let i = 0; i < formData.order_medicines.length; i++) {
      const item = formData.order_medicines[i];
      if (!item.medicine_id || !item.quantity || !item.unit_price) {
        setError(`Please fill all fields for medicine item ${i + 1}`);
        return;
      }
    }

    const submitData = {
      customer_id: parseInt(formData.customer_id),
      order_medicines: formData.order_medicines.map(item => ({
        medicine_id: parseInt(item.medicine_id),
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unit_price)
      }))
    };

    setLoading(true);
    onSubmit(submitData);
  };

  const getTotalAmount = () => {
    return formData.order_medicines.reduce((total, item) => {
      const quantity = parseInt(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      return total + (quantity * price);
    }, 0);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 my-8 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaShoppingCart className="mr-2 text-purple-500" />
            {order ? 'Edit Order' : 'Create New Order'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Customer Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer *
            </label>
            <select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </option>
              ))}
            </select>
          </div>

          {/* Medicines Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Order Items *
              </label>
              <button
                type="button"
                onClick={addMedicineItem}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg flex items-center text-sm"
              >
                <FaPlus className="mr-1" />
                Add Medicine
              </button>
            </div>

            {formData.order_medicines.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No medicines added yet. Click "Add Medicine" to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.order_medicines.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <select
                        value={item.medicine_id}
                        onChange={(e) => updateMedicineItem(index, 'medicine_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select medicine</option>
                        {medicines.map((medicine) => (
                          <option key={medicine.id} value={medicine.id}>
                            {medicine.name} - ${medicine.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="w-24">
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateMedicineItem(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div className="w-24">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => updateMedicineItem(index, 'unit_price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div className="w-20 text-right font-semibold text-green-600">
                      ${((parseInt(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeMedicineItem(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total */}
          {formData.order_medicines.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">${getTotalAmount().toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50"
              disabled={loading || formData.order_medicines.length === 0}
            >
              {loading ? 'Saving...' : order ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModalForm;
