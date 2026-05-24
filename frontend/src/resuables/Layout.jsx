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
    <div className="min-h-screen bg-gray-100 flex text-gray-800">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 w-64 min-h-screen p-4 ${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:relative z-30`}>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <FaPills className="text-2xl mr-2 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">MediQ</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-800"
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
                className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
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
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
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
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
