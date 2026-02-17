import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = auth.getAuthState();

  if (!user) return <>{children}</>;

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const menuItems = user.role === 'admin' ? [
    { name: 'Dashboard', path: '/admin', icon: 'fa-chart-pie' },
    { name: 'Tests', path: '/admin/tests', icon: 'fa-file-alt' },
    { name: 'Submissions', path: '/admin/submissions', icon: 'fa-history' },
  ] : [
    { name: 'Assessments', path: '/student', icon: 'fa-tasks' },
    { name: 'My Results', path: '/student/results', icon: 'fa-poll' },
  ];

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-terminal text-sm"></i>
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900 uppercase">DevAssess</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                location.pathname === item.path 
                  ? 'bg-white shadow-sm border border-slate-200 text-indigo-600' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center ${location.pathname === item.path ? 'text-indigo-600' : 'text-slate-400'}`}></i>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-all font-semibold text-sm"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {user.role === 'admin' ? 'Admin Controller' : `Cohort ${user.cohort || 'Default'}`}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">{user.name}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.role}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
              <i className="fas fa-user text-slate-400 text-xs"></i>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-white">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;