import React, { useState } from 'react';
import { LogisticsTab, LogisticsPartner, LogisticsApplication } from './types';
import LogisticsTabs from './LogisticsTabs';
import PartnersTab from './tabs/PartnersTab';
import CaptainsTab from './tabs/CaptainsTab';
import ApplicationsTab from './tabs/ApplicationsTab';
import PartnerDetailsPage from './PartnerDetailsPage';
import ApplicationDetailsPage from './ApplicationDetailsPage';
import LogisticsOverview from './LogisticsOverview';

const Logistics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LogisticsTab>('overview');
  const [selectedPartner, setSelectedPartner] = useState<LogisticsPartner | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<LogisticsApplication | null>(null);

  const handleViewPartner = (partner: LogisticsPartner) => {
    setSelectedPartner(partner);
  };

  const handleViewApplication = (application: LogisticsApplication) => {
    setSelectedApplication(application);
  };

  const handleBackToPartners = () => {
    setSelectedPartner(null);
    setActiveTab('partners');
  };

  const handleBackToApplications = () => {
    setSelectedApplication(null);
    setActiveTab('applications');
  };

  const handleApproveApplication = (applicationId: string) => {
    console.log('Approve application:', applicationId);
    // Implementation for approving application
  };

  const handleRejectApplication = (applicationId: string) => {
    console.log('Reject application:', applicationId);
    // Implementation for rejecting application
  };

  // Show partner details page
  if (selectedPartner) {
    return (
      <PartnerDetailsPage
        partner={selectedPartner}
        onBack={handleBackToPartners}
      />
    );
  }

  // Show application details page
  if (selectedApplication) {
    return (
      <ApplicationDetailsPage
        application={selectedApplication}
        onBack={handleBackToApplications}
        onApprove={handleApproveApplication}
        onReject={handleRejectApplication}
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <LogisticsOverview onTabChange={setActiveTab} />;
      case 'partners':
        return <PartnersTab onViewPartner={handleViewPartner} />;
      case 'captains':
        return <CaptainsTab />;
      case 'applications':
        return <ApplicationsTab onViewApplication={handleViewApplication} />;
      default:
        return <LogisticsOverview onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Logistics</h1>
        </div>

        {/* Tabs */}
        <LogisticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Logistics;