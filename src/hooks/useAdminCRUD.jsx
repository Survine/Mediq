import { useState, useCallback, useEffect } from "react";

const useAdminCRUD = (endpoint) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createItem = useCallback(async (itemData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Create failed");
      }

      const result = await response.json();
      setSuccess("Item created successfully");
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  const updateItem = useCallback(async (id, itemData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Update failed");
      }

      const result = await response.json();
      setSuccess("Item updated successfully");
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  const deleteItem = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (response.status === 204 || response.status === 200) {
        setData(prev => prev.filter(item => item.id !== id));
        setSuccess("Item deleted successfully");
        return true;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Delete failed");
      }

      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    success,
    fetchAll,
    createItem,
    updateItem,
    deleteItem,
    setError,
    setSuccess,
    clearMessages,
  };
};

export default useAdminCRUD;
