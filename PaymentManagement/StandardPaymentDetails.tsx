import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import { PaymentMethod, PaymentTab } from 'app/payments/types';
import { getStatusColor, formatFee } from '../../utils/paymentUtils';

interface StandardPaymentDetailsProps {
  method: PaymentMethod;
  activeTab: PaymentTab;
  onConfigure: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

const StandardPaymentDetails: React.FC<StandardPaymentDetailsProps> = ({
  method,
  activeTab,
  onConfigure,
  onToggleStatus
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Fees for Current Tab */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            {activeTab === 'topup' ? 'Top-up' : 'Checkout'} Fees
          </h4>
          {method.fees[activeTab] ? (
            <div className={`p-3 rounded-lg ${
              activeTab === 'topup' ? 'bg-green-50' : 'bg-blue-50'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium ${
                  activeTab === 'topup' ? 'text-green-900' : 'text-blue-900'
                }`}>
                  {formatFee(method.fees[activeTab]!)}
                </span>
                {activeTab === 'checkout' && (
                  <Badge variant="outline" className="text-xs">
                    Paid by {method.fees[activeTab]!.paidBy}
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">
                Not available for {activeTab}
              </p>
            </div>
          )}
        </div>

        {/* Processing Info */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Processing</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Time:</span>
              <span className="text-sm font-medium">{method.processingTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge className={getStatusColor(method.status)}>
                {method.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onConfigure(method.id)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </Button>
        <Button 
          variant={method.status === 'active' ? 'destructive' : 'default'} 
          size="sm"
          onClick={() => onToggleStatus(method.id, method.status)}
        >
          {method.status === 'active' ? 'Disable' : 'Enable'}
        </Button>
      </div>
    </>
  );
};

export default StandardPaymentDetails;