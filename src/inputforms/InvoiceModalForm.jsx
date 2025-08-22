import { useState, useEffect } from 'react';
import { FaTimes, FaCalculator, FaSave } from 'react-icons/fa';
import ApiService from '../services/ApiService';

const InvoiceModalForm = ({ isOpen, onClose, onSubmit, invoice = null, orders = [] }) => {
  const [formData, setFormData] = useState({
    order_id: '',
    amount: '',
    tax: '0',
    discount: '0',
    notes: '',
    terms: 'Payment due within 30 days of invoice date.',
    due_date: ''
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      // Editing existing invoice
      setFormData({
        order_id: invoice.order_id || '',
        amount: invoice.amount || '',
        tax: invoice.tax || '0',
        discount: invoice.discount || '0',
        notes: invoice.notes || '',
        terms: invoice.terms || 'Payment due within 30 days of invoice date.',
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : ''
      });
    } else {
      // Creating new invoice - reset form
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);
      
      setFormData({
        order_id: '',
        amount: '',
        tax: '0',
        discount: '0',
        notes: '',
        terms: 'Payment due within 30 days of invoice date.',
        due_date: defaultDueDate.toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [invoice, isOpen]);

  useEffect(() => {
    // Calculate total whenever amount, tax, or discount changes
    const amount = parseFloat(formData.amount) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const total = amount - discount + tax;
    setCalculatedTotal(total);
  }, [formData.amount, formData.tax, formData.discount]);

  useEffect(() => {
    // Load order details when order is selected
    if (formData.order_id && orders.length > 0) {
      const order = orders.find(o => o.id.toString() === formData.order_id.toString());
      if (order) {
        setSelectedOrder(order);
        if (!invoice && order.total_amount) {
          setFormData(prev => ({
            ...prev,
            amount: order.total_amount.toString()
          }));
        }
      }
    }
  }, [formData.order_id, orders, invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.order_id) {
      newErrors.order_id = 'Please select an order';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (parseFloat(formData.tax) < 0) {
      newErrors.tax = 'Tax cannot be negative';
    }

    if (parseFloat(formData.discount) < 0) {
      newErrors.discount = 'Discount cannot be negative';
    }

    if (parseFloat(formData.discount) > parseFloat(formData.amount)) {
      newErrors.discount = 'Discount cannot be greater than amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const invoiceData = {
        ...formData,
        order_id: parseInt(formData.order_id),
        amount: parseFloat(formData.amount),
        tax: parseFloat(formData.tax),
        discount: parseFloat(formData.discount),
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
      };

      await onSubmit(invoiceData);
      onClose();
    } catch (error) {
      console.error('Error submitting invoice:', error);
      setErrors({ submit: error.message || 'Failed to save invoice' });
    } finally {
      setLoading(false);
    }
  };

  const getAvailableOrders = () => {
    if (invoice) {
      // When editing, show the current order plus other pending orders
      return orders.filter(order => 
        order.id === invoice.order_id || order.status === 'pending'
      );
    }
    // When creating, show only pending orders
    return orders.filter(order => order.status === 'pending');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order <span className="text-red-500">*</span>
            </label>
            <select
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.order_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={invoice} // Don't allow changing order for existing invoices
            >
              <option value="">Select an order</option>
              {getAvailableOrders().map(order => (
                <option key={order.id} value={order.id}>
                  Order #{order.id} - {order.customer_name || 'Unknown Customer'} - ${order.total_amount?.toFixed(2)}
                </option>
              ))}
            </select>
            {errors.order_id && <p className="text-red-500 text-sm mt-1">{errors.order_id}</p>}
          </div>

          {/* Selected Order Info */}
          {selectedOrder && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Selected Order Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Customer:</span>
                  <span className="ml-2 font-medium">{selectedOrder.customer_name || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-blue-700">Order Date:</span>
                  <span className="ml-2">{new Date(selectedOrder.order_date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-blue-700">Order Amount:</span>
                  <span className="ml-2 font-medium">${selectedOrder.total_amount?.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-blue-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Amount Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  className={`w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  step="0.01"
                  className={`w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.discount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  step="0.01"
                  className={`w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.tax ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.tax && <p className="text-red-500 text-sm mt-1">{errors.tax}</p>}
            </div>
          </div>

          {/* Total Calculation Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCalculator className="text-gray-500 mr-2" />
                <span className="font-medium">Total Amount:</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ${calculatedTotal.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Amount: ${(parseFloat(formData.amount) || 0).toFixed(2)} - 
              Discount: ${(parseFloat(formData.discount) || 0).toFixed(2)} + 
              Tax: ${(parseFloat(formData.tax) || 0).toFixed(2)}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes for this invoice..."
            />
          </div>

          {/* Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions
            </label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Payment terms and conditions..."
            />
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {invoice ? 'Update Invoice' : 'Create Invoice'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModalForm;
