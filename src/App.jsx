import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Layout from './resuables/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Medicines from './components/Medicines';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Inventory from './components/Inventory';
import Invoices from './components/Invoices';
import Users from './components/Users';

const App = () => {
  return (
    <Router>
      <SignedOut>
        <Login />
      </SignedOut>
      <SignedIn>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </Layout>
      </SignedIn>
    </Router>
  )
}

export default App



