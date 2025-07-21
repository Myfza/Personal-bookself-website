import React from 'react';
import { BookStats } from '../types/Book';
import { Book, BookOpen, CheckCircle, Clock } from 'lucide-react';
import StatsCard from './StatsCard';

interface DashboardProps {
  stats: BookStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Statistik</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Buku"
          count={stats.totalBooks}
          icon={Book}
          color="bg-blue-600"
        />
        <StatsCard
          title="Selesai"
          count={stats.finishedBooks}
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatsCard
          title="Sedang Dibaca"
          count={stats.readingBooks}
          icon={BookOpen}
          color="bg-yellow-600"
        />
        <StatsCard
          title="Belum Dibaca"
          count={stats.unreadBooks}
          icon={Clock}
          color="bg-gray-600"
        />
      </div>
    </div>
  );
};

export default Dashboard;