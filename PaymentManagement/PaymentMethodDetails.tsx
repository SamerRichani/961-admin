import React from 'react';
import { PaymentMethod, PaymentTab } from 'app/payments/types';
import CreditCardProviders from './providers/CreditCardProviders';
import CashPickupProviders from './providers/CashPickupProviders';
import DigitalWalletProviders from './providers/DigitalWalletProviders';
import InPersonProviders from './providers/InPersonProviders';
import StandardPaymentDetails from './StandardPaymentDetails';

interface PaymentMethodDetailsProps {
  method: PaymentMethod;
  activeTab: PaymentTab;
  onConfigure: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

const PaymentMethodDetails: React.FC<PaymentMethodDetailsProps> = ({
  method,
  activeTab,
  onConfigure,
  onToggleStatus
}) => {
  return (
    <div className="px-6 pb-6 border-t border-gray-100">
      {/* Credit Card Providers */}
      {method.category === 'credit_card' && method.providers && (
        <CreditCardProviders
          providers={method.providers}
          activeTab={activeTab}
          onConfigure={onConfigure}
          onToggleStatus={onToggleStatus}
        />
      )}

      {/* Digital Wallet Providers (excluding 961 Wallet) */}
      {method.id === 'digital_wallets' && method.providers && (
        <DigitalWalletProviders
          providers={method.providers}
          activeTab={activeTab}
          onConfigure={onConfigure}
          onToggleStatus={onToggleStatus}
        />
      )}

      {/* In-Person Providers */}
      {method.category === 'office' && method.providers && (
        <InPersonProviders
          providers={method.providers}
          onConfigure={onConfigure}
          onToggleStatus={onToggleStatus}
        />
      )}

      {/* Cash Pickup Providers */}
      {method.category === 'cash_pickup' && method.providers && (
        <CashPickupProviders
          providers={method.providers}
          onConfigure={onConfigure}
          onToggleStatus={onToggleStatus}
        />
      )}

      {/* Standard Payment Method Details */}
      {method.category !== 'cash_pickup' && 
       method.category !== 'credit_card' && 
       method.category !== 'office' && 
       method.id !== 'digital_wallets' && (
        <StandardPaymentDetails
          method={method}
          activeTab={activeTab}
          onConfigure={onConfigure}
          onToggleStatus={onToggleStatus}
        />
      )}
    </div>
  );
};

export default PaymentMethodDetails;