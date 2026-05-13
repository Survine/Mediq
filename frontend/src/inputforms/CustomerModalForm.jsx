import { useRef, useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const CustomerModalForm = ({
  // Old pattern props
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  isLoading,
  error,
  // New pattern props
  customer
}) => {
  const modalOverlayRef = useRef(null);
  const [localFormData, setLocalFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Handle new pattern
  useEffect(() => {
    if (customer) {
      setLocalFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || ''
      });
    } else if (!formData) {
      setLocalFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    }
  }, [customer, formData]);

  const handleOverlayClick = (e) => {
    if (e.target === modalOverlayRef.current) {
      onClose();
    }
  };

  const handleSubmit = () => {
    // Use local form data for new pattern, fallback to old pattern
    const dataToSubmit = formData || localFormData;
    
    if (!dataToSubmit.name.trim() || !dataToSubmit.email.trim() || !dataToSubmit.phone.trim()) {
      return;
    }

    onSubmit(dataToSubmit);
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
        <div className="p-4 flex justify-end sticky top-0 bg-white z-10">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {title || (customer ? 'Edit Customer' : 'Add Customer')}
          </h2>

          {error && (
            <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaUser className="inline mr-2" />
                Customer Name *
              </label>
              <input
                type="text"
                value={currentFormData.name}
                onChange={(e) => currentSetFormData({ ...currentFormData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                value={currentFormData.email}
                onChange={(e) => currentSetFormData({ ...currentFormData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaPhone className="inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={currentFormData.phone}
                onChange={(e) => currentSetFormData({ ...currentFormData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaMapMarkerAlt className="inline mr-2" />
                Address *
              </label>
              <textarea
                value={currentFormData.address}
                onChange={(e) => currentSetFormData({ ...currentFormData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
                rows={3}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50"
              disabled={isLoading || !currentFormData.name.trim() || !currentFormData.email.trim() || !currentFormData.phone.trim()}
            >
              {isLoading ? "Saving..." : customer ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModalForm;