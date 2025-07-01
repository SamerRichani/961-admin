'use client';

import React, { useState } from 'react';
import LogisticsTabs from './LogisticsTabs';
import LogisticsOverview from './LogisticsOverview';
import PartnersTab from './tabs/PartnersTab';
import CaptainsTab from './tabs/CaptainsTab';
import ApplicationsTab from './tabs/ApplicationsTab';
import { LogisticsTab } from './types';

const LogisticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LogisticsTab>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <LogisticsOverview onTabChange={setActiveTab} />;
      case 'partners':
        return <PartnersTab />;
      case 'captains':
        return <CaptainsTab />;
      case 'applications':
        return <ApplicationsTab />;
      default:
        return <LogisticsOverview onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Logistics</h1>
        </div>
        <LogisticsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  );
};

export default LogisticsPage; 