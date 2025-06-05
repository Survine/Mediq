import { useRef } from "react";
import { FaUser, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

const ModalForm = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  isCreating,
  isLoading,
  error
}) => {
  const modalOverlayRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === modalOverlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalOverlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4 overflow-auto"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200 my-8">
        {/* Add my-8 for vertical margin */}
        <div className="p-4 flex justify-end sticky top-0 bg-white z-10">
          {/* Make close button sticky */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Add scrollable area with max height */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>

          {error && (
            <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaUser className="inline mr-2" />
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaLock className="inline mr-2" />
                {isCreating ? "Password" : "Change Password (leave blank to keep)"}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={isLoading}
                placeholder={isCreating ? "" : "•••••••• (leave blank to preserve existing)"}
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <FaUserShield />
                <span className="text-sm font-medium text-gray-700">Administrator</span>
                <input
                  type="checkbox"
                  checked={formData.is_admin}
                  onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 focus:ring-indigo-400"
                  disabled={isLoading}
                />
              </label>
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
              onClick={onSubmit}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalForm;