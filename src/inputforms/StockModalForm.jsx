import { useState, useEffect } from 'react';
import { FaWarehouse, FaTimes } from 'react-icons/fa';

const StockModalForm = ({ stock, medicines, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    medicine_id: '',
    quantity: '',
    batch_number: '',
    expiry_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (stock) {
      setFormData({
        medicine_id: stock.medicine_id,
        quantity: stock.quantity,
        batch_number: stock.batch_number || '',
        expiry_date: stock.expiry_date ? stock.expiry_date.split('T')[0] : ''
      });
    }
  }, [stock]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.medicine_id || !formData.quantity) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseInt(formData.quantity) < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    const submitData = {
      medicine_id: parseInt(formData.medicine_id),
      quantity: parseInt(formData.quantity),
      batch_number: formData.batch_number || null,
      expiry_date: formData.expiry_date || null
    };

    setLoading(true);
    onSubmit(submitData);
  };

  const selectedMedicine = medicines.find(m => m.id.toString() === formData.medicine_id);

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200 my-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaWarehouse className="mr-2 text-blue-500" />
            {stock ? 'Edit Stock' : 'Add New Stock'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine *
              </label>
              <select
                value={formData.medicine_id}
                onChange={(e) => setFormData({ ...formData, medicine_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                <option value="">Select a medicine</option>
                {medicines.map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name} - ${medicine.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number
              </label>
              <input
                type="text"
                value={formData.batch_number}
                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter batch number (optional)"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {selectedMedicine && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Medicine Details:</h4>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Name:</span> {selectedMedicine.name}
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Price:</span> ${selectedMedicine.price}
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Total Value:</span> ${(selectedMedicine.price * (parseInt(formData.quantity) || 0)).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
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
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
              disabled={loading || !formData.medicine_id || !formData.quantity}
            >
              {loading ? 'Saving...' : stock ? 'Update Stock' : 'Add Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockModalForm;
