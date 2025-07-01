import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { PaymentMethod, PaymentTab } from './types';
import { getStatusColor, formatFee, shouldShowFeeInSummary } from './paymentUtils';
import PaymentMethodDetails from './PaymentMethodDetails';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  activeTab: PaymentTab;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onConfigure: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  activeTab,
  isExpanded,
  onToggleExpanded,
  onConfigure,
  onToggleStatus
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div 
          className="p-4 cursor-pointer"
          onClick={onToggleExpanded}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <method.icon className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{method.name}</h3>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex space-x-2 mb-2 justify-end">
                  <Badge className={getStatusColor(method.status)}>
                    {method.status}
                  </Badge>
                </div>
                {/*{shouldShowFeeInSummary(method) && method.fees[activeTab] && (*/}
                {/*  <div className="text-sm text-gray-600">*/}
                {/*    Fee: {formatFee(method.fees[activeTab]!)}*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
              
              <div className="text-gray-400">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <PaymentMethodDetails
            method={method}
            activeTab={activeTab}
            onConfigure={onConfigure}
            onToggleStatus={onToggleStatus}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard; 