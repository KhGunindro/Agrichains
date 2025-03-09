import { Web3Provider } from './contexts/Web3Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner'; // Import Sonner's Toaster
import Navbar from './components/NavBar.tsx';
import Dashboard from './pages/Dashboard';
import RolesManagement from './pages/RoleManagement';
import Profile from './pages/Profile.tsx';
import Products from './pages/Products';
import Transactions from './pages/Transactions';
import { Card } from '@/components/ui/card';

function App() {
  return (
    <Web3Provider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            {/* Navigation Header */}
            <Card className="rounded-none border-x-0 border-t-0 shadow-sm">
                  <Navbar />
            </Card>

            {/* Main Content */}
            <main className="flex-1 mt-16 p-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/roles" element={<RolesManagement />} />
                <Route path="/Profile" element={<Profile/>} />
              </Routes>
            </main>

            {/* Sonner Toaster */}
            <Toaster position="bottom-right" richColors />
          </div>
        </BrowserRouter>
    </Web3Provider>
  );
}

export default App;