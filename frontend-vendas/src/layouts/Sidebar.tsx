import { NavLink } from 'react-router-dom';
import { 
  FiHome,
  FiDollarSign, 
  FiBox,
  FiPieChart,
  FiX,
  FiChevronRight
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

type SidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
};

const navItems = [
  { 
    path: '/', 
    icon: <FiHome className="text-xl" />, 
    label: 'Dashboard'
  },
  { 
    path: '/vendas', 
    icon: <FiDollarSign className="text-xl" />, 
    label: 'Vendas'
  },
  { 
    path: '/estoque', 
    icon: <FiBox className="text-xl" />, 
    label: 'Estoque'
  },
  { 
    path: '/relatorios', 
    icon: <FiPieChart className="text-xl" />, 
    label: 'Relatórios'
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <>
      {/* Desktop */}
      <aside className={`hidden lg:flex lg:flex-shrink-0 ${isMounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <div className="flex flex-col w-64 bg-gray-800 shadow-xl">
          <div className="flex items-center h-16 px-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">
              <span className="text-blue-400">Gestor</span>Pro
            </h2>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                <span className="mr-3 p-1.5 bg-gray-700 rounded-md text-blue-400">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                <FiChevronRight className="ml-auto text-gray-500" />
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} GestorPro
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div 
          className="absolute inset-0 bg-black/30"
          onClick={onClose}
        />
        
        <div className={`relative h-full w-64 bg-gray-800 shadow-xl transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">
              <span className="text-blue-400">Gestor</span>Pro
            </h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-white"
              aria-label="Fechar menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-md"
              >
                <span className="mr-3 p-1.5 bg-gray-700 rounded-md text-blue-400">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}