import React, { useState } from 'react';
import { PaymentTab } from 'app/payments/types';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import PaymentTabs from './PaymentTabs';
import PaymentMethodCard from './PaymentMethodCard';
import ConfigurationModal from './ConfigurationModal';
import SaveNotification from './SaveNotification';

const PaymentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('topup');
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);
  const { 
    paymentMethods, 
    toggleMethodStatus, 
    toggleProviderStatus, 
    configureMethod,
    configurationModal,
    closeConfigurationModal,
    saveConfiguration,
    saveNotification,
    hideSaveNotification
  } = usePaymentMethods();

  const tabFilteredMethods = paymentMethods.filter(method => 
    method.availableIn.includes(activeTab)
  );

  const handleToggleStatus = (id: string, currentStatus: string) => {
    // Check if this is a provider ID or method ID
    const isProvider = paymentMethods.some(method => 
      method.providers?.some(provider => provider.id === id)
    );
    
    if (isProvider) {
      // Find the method that contains this provider
      const parentMethod = paymentMethods.find(method => 
        method.providers?.some(provider => provider.id === id)
      );
      if (parentMethod) {
        toggleProviderStatus(parentMethod.id, id);
      }
    } else {
      toggleMethodStatus(id);
    }
  };

  const handleToggleExpanded = (methodId: string) => {
    setExpandedMethod(expandedMethod === methodId ? null : methodId);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
        </div>

        {/* Tabs */}
        <PaymentTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Payment Methods List */}
        <div className="space-y-4">
          {tabFilteredMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              activeTab={activeTab}
              isExpanded={expandedMethod === method.id}
              onToggleExpanded={() => handleToggleExpanded(method.id)}
              onConfigure={configureMethod}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>

        {/* Configuration Modal */}
        <ConfigurationModal
          isOpen={configurationModal.isOpen}
          onClose={closeConfigurationModal}
          item={configurationModal.item}
          onSave={saveConfiguration}
        />

        {/* Save Notification */}
        <SaveNotification
          isVisible={saveNotification.isVisible}
          message={saveNotification.message}
          onHide={hideSaveNotification}
        />
      </div>
    </div>
  );
};

export default PaymentManagement;