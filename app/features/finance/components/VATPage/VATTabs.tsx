import React from 'react';
import { VATSection } from '@/app/features/finance/type';

interface VATTabsProps {
  activeTab: VATSection;
  onTabChange: (tab: VATSection) => void;
}

const tabs = [
  { id: 'summary' as const, label: 'Summary' },
  { id: 'details' as const, label: 'Detailed Report' },
  { id: 'report' as const, label: 'Collection Report' },
];

export const VATTabs: React.FC<VATTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-brand border-b-2 border-brand'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};