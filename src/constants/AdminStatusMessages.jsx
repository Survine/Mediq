import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const AdminStatusMessages = ({ 
  error: initialError, 
  success: initialSuccess, 
  isLoading,
  onDismiss
}) => {
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState(initialSuccess);

  // Sync with parent component's state
  useEffect(() => {
    setError(initialError);
    setSuccess(initialSuccess);
  }, [initialError, initialSuccess]);

  // Auto-dismiss after 2 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
        onDismiss(); // Notify parent to clear messages
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, success, onDismiss]);

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mx-4 my-2 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex justify-between items-center">
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              onDismiss();
            }} 
            className="text-red-700 hover:text-red-900"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {success && (
        <div className="mx-4 my-2 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded flex justify-between items-center">
          <p>{success}</p>
          <button 
            onClick={() => {
              setSuccess(null);
              onDismiss();
            }} 
            className="text-green-700 hover:text-green-900"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </>
  );
};
export default AdminStatusMessages;