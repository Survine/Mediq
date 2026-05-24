import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPills,
  FaUsers,
  FaShoppingCart,
  FaWarehouse,
  FaFileInvoice,
  FaExclamationTriangle
} from 'react-icons/fa';
import ApiService from '../services/ApiService';
import { formatCurrency } from '../utils/currency';

const Dashboard = () => {
  const [stats, setStats] = useState({
    medicines: 0,
    customers: 0,
    orders: 0,
    totalRevenue: 0,
    lowStockItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch statistics
      const [medicines, customers, orders, stocks] = await Promise.all([
        ApiService.getMedicines(),
        ApiService.getCustomers(),
        ApiService.getOrders(),
        ApiService.getStocks()
      ]);

      // Calculate total revenue from orders
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

      // Find low stock items (quantity < 10)
      const lowStock = stocks.filter(stock => stock.quantity < 10);

      setStats({
        medicines: medicines.length,
        customers: customers.length,
        orders: orders.length,
        totalRevenue: totalRevenue,
        lowStockItems: lowStock.length
      });

      // Set recent orders (last 5)
      setRecentOrders(orders.slice(-5).reverse());
      setLowStockMedicines(lowStock.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Medicines',
      value: stats.medicines,
      icon: FaPills,
      color: 'bg-blue-100 text-blue-700',
      link: '/medicines'
    },
    {
      title: 'Total Customers',
      value: stats.customers,
      icon: FaUsers,
      color: 'bg-green-100 text-green-700',
      link: '/customers'
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: FaShoppingCart,
      color: 'bg-purple-100 text-purple-700',
      link: '/orders'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: FaFileInvoice,
      color: 'bg-yellow-100 text-yellow-700',
      link: '/invoices'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: FaExclamationTriangle,
      color: 'bg-red-100 text-red-700',
      link: '/inventory'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your medicine management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className="bg-white border border-gray-200 rounded-md p-5 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center">
                <div className={`${card.color} rounded-md p-3`}>
                  <Icon className="text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 rounded-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/orders"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">Customer ID: {order.customer_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(order.total_amount)}</p>
                      <p className={`text-sm px-2 py-1 rounded-md ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-gray-200 rounded-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                Low Stock Alert
              </h2>
              <Link
                to="/inventory"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {lowStockMedicines.length > 0 ? (
              <div className="space-y-4">
                {lowStockMedicines.map((stock) => (
                  <div key={stock.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-md">
                    <div>
                      <p className="font-medium text-gray-900">Medicine ID: {stock.medicine_id}</p>
                      <p className="text-sm text-gray-500">
                        Batch: {stock.batch_number || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{stock.quantity} left</p>
                      <p className="text-sm text-gray-500">
                        Expires: {stock.expiry_date ? new Date(stock.expiry_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">All items are well stocked!</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/medicines"
            className="flex items-center justify-center p-4 bg-blue-50 border border-blue-100 rounded-md hover:bg-blue-100 transition-colors"
          >
            <FaPills className="text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">Add Medicine</span>
          </Link>
          <Link
            to="/customers"
            className="flex items-center justify-center p-4 bg-green-50 border border-green-100 rounded-md hover:bg-green-100 transition-colors"
          >
            <FaUsers className="text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Add Customer</span>
          </Link>
          <Link
            to="/orders"
            className="flex items-center justify-center p-4 bg-purple-50 border border-purple-100 rounded-md hover:bg-purple-100 transition-colors"
          >
            <FaShoppingCart className="text-purple-600 mr-2" />
            <span className="text-purple-800 font-medium">Create Order</span>
          </Link>
          <Link
            to="/inventory"
            className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-100 rounded-md hover:bg-yellow-100 transition-colors"
          >
            <FaWarehouse className="text-yellow-600 mr-2" />
            <span className="text-yellow-800 font-medium">Manage Stock</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
