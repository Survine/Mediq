import { useRef, useState, useEffect } from "react";
import { FaPills, FaTimes, FaMoneyBill } from "react-icons/fa";

const MedicineModalForm = ({
  // Old pattern props
  isOpen,
  title,
  formData,
  setFormData,
  isLoading,
  error,
  // New pattern props
  medicine,
  onSubmit,
  onClose
}) => {
  const modalOverlayRef = useRef(null);
  const [localFormData, setLocalFormData] = useState({
    name: '',
    price: ''
  });

  // Handle new pattern
  useEffect(() => {
    if (medicine) {
      setLocalFormData({
        name: medicine.name || '',
        price: medicine.price || ''
      });
    } else {
      setLocalFormData({
        name: '',
        price: ''
      });
    }
  }, [medicine]);

  const handleOverlayClick = (e) => {
    if (e.target === modalOverlayRef.current) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Use local form data for new pattern, fallback to old pattern
    const dataToSubmit = formData || localFormData;
    
    if (!dataToSubmit.name.trim() || !dataToSubmit.price.trim()) {
      return;
    }

    // Convert price to number
    const submitData = {
      ...dataToSubmit,
      price: parseFloat(dataToSubmit.price)
    };

    onSubmit(submitData);
  };

  // Support both isOpen (old pattern) and always show (new pattern)
  const shouldShow = isOpen !== undefined ? isOpen : true;
  
  if (!shouldShow) return null;

  const currentFormData = formData || localFormData;
  const currentSetFormData = setFormData || setLocalFormData;

  return (
    <div
      ref={modalOverlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4 overflow-auto"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200 my-8">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaPills className="mr-2 text-blue-500" />
            {title || (medicine ? 'Edit Medicine' : 'Add Medicine')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name *
              </label>
              <input
                type="text"
                value={currentFormData.name}
                onChange={(e) => currentSetFormData({ ...currentFormData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter medicine name"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMoneyBill className="inline mr-2" />
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={currentFormData.price}
                onChange={(e) => currentSetFormData({ ...currentFormData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
              disabled={isLoading || !currentFormData.name.trim() || !currentFormData.price.trim()}
            >
              {isLoading ? "Saving..." : medicine ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineModalForm;