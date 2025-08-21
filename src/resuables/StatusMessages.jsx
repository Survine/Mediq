import { useEffect, useState } from "react";
import { FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const StatusMessages = ({ 
  error: initialError, 
  success: initialSuccess, 
  isLoading,
  onDismiss,
  // New pattern props
  message,
  onClose
}) => {
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState(initialSuccess);

  // Handle new pattern
  if (message && message.text) {
    const isError = message.type === 'error';
    const isSuccess = message.type === 'success';

    const handleClose = () => {
      if (onClose) onClose();
    };

    return (
      <div className={`p-4 rounded-lg border-l-4 flex items-center justify-between ${
        isError 
          ? 'bg-red-50 border-red-400 text-red-700' 
          : isSuccess 
          ? 'bg-green-50 border-green-400 text-green-700'
          : 'bg-blue-50 border-blue-400 text-blue-700'
      }`}>
        <div className="flex items-center">
          {isError && <FaExclamationTriangle className="mr-2" />}
          {isSuccess && <FaCheck className="mr-2" />}
          <span>{message.text}</span>
        </div>
        <button 
          onClick={handleClose}
          className={`${
            isError ? 'text-red-700 hover:text-red-900' : 
            isSuccess ? 'text-green-700 hover:text-green-900' :
            'text-blue-700 hover:text-blue-900'
          }`}
        >
          <FaTimes />
        </button>
      </div>
    );
  }

  // Sync with parent component's state
  useEffect(() => {
    setError(initialError);
    setSuccess(initialSuccess);
  }, [initialError, initialSuccess]);

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
        if (onDismiss) onDismiss();
      }, 3000);
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
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex justify-between items-center">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <p>{error}</p>
          </div>
          <button 
            onClick={() => {
              setError(null);
              if (onDismiss) onDismiss();
            }} 
            className="text-red-700 hover:text-red-900"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded flex justify-between items-center">
          <div className="flex items-center">
            <FaCheck className="mr-2" />
            <p>{success}</p>
          </div>
          <button 
            onClick={() => {
              setSuccess(null);
              if (onDismiss) onDismiss();
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

export default StatusMessages;