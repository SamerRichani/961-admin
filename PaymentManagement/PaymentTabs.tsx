import React from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { PaymentTab } from 'app/payments/types';

interface PaymentTabsProps {
  activeTab: PaymentTab;
  onTabChange: (tab: PaymentTab) => void;
}

const PaymentTabs: React.FC<PaymentTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-8 border-b border-gray-200">
      <nav className="flex space-x-8">
        <button
          onClick={() => onTabChange('topup')}
          className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'topup'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Top Up</span>
        </button>
        
        <button
          onClick={() => onTabChange('checkout')}
          className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === 'checkout'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Checkout</span>
        </button>
      </nav>
    </div>
  );
};

export default PaymentTabs;