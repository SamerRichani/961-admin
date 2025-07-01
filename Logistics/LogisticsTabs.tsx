import React from 'react';
import { BarChart3, Bike, FileText, User } from 'lucide-react';
import { LogisticsTab } from '../../types/logistics';

interface LogisticsTabsProps {
  activeTab: LogisticsTab;
  onTabChange: (tab: LogisticsTab) => void;
}

const LogisticsTabs: React.FC<LogisticsTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview' as LogisticsTab, label: 'Overview', icon: BarChart3 },
    { id: 'partners' as LogisticsTab, label: 'Partners', icon: Bike },
    { id: 'captains' as LogisticsTab, label: 'Captains', icon: User },
    { id: 'applications' as LogisticsTab, label: 'Applications', icon: FileText }
  ];

  return (
    <div className="mb-8 border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default LogisticsTabs;