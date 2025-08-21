import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { 
  FaHome, 
  FaPills, 
  FaUsers, 
  FaShoppingCart, 
  FaWarehouse, 
  FaFileInvoice, 
  FaUserCog,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FaHome },
    { name: 'Medicines', href: '/medicines', icon: FaPills },
    { name: 'Customers', href: '/customers', icon: FaUsers },
    { name: 'Orders', href: '/orders', icon: FaShoppingCart },
    { name: 'Inventory', href: '/inventory', icon: FaWarehouse },
    { name: 'Invoices', href: '/invoices', icon: FaFileInvoice },
    { name: 'Users', href: '/users', icon: FaUserCog },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-indigo-800 text-white w-64 min-h-screen p-4 ${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:relative z-30`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FaPills className="text-2xl mr-2" />
            <h1 className="text-xl font-bold">MediQ</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <FaBars className="text-xl" />
          </button>
          
          <div className="flex items-center space-x-4">
            <UserButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;