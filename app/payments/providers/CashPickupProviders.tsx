import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Provider } from '../types';
import { getStatusColor } from '../paymentUtils';

interface CashPickupProvidersProps {
  providers: Provider[];
  onConfigure: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

const CashPickupProviders: React.FC<CashPickupProvidersProps> = ({
  providers,
  onConfigure,
  onToggleStatus
}) => {
  return (
    <div className="mt-6">
      <h4 className="font-medium text-gray-900 mb-4">Available Providers</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900">{provider.name}</h5>
              <Badge className={getStatusColor(provider.status)}>
                {provider.status}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fee:</span>
                <span className="font-medium">
                  {provider.fees.topup?.percentage}% + ${provider.fees.topup?.fixed?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing:</span>
                <span className="font-medium">{provider.processingTime}</span>
              </div>
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onConfigure(provider.id)}
              >
                <Settings className="w-3 h-3 mr-1" />
                Configure
              </Button>
              <Button 
                variant={provider.status === 'active' ? 'destructive' : 'default'} 
                size="sm"
                onClick={() => onToggleStatus(provider.id, provider.status)}
              >
                {provider.status === 'active' ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CashPickupProviders; 