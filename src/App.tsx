import { useState } from 'react';
import Dashboard from '@/pages/Dashboard';
import HistoryPage from '@/pages/HistoryPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === 'history' && <HistoryPage onNavigate={handleNavigate} />}
    </>
  );
}
