import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { PaymentProvider } from '../../../types/payment';
import { getStatusColor, formatFee } from '../../../utils/paymentUtils';

interface InPersonProvidersProps {
  providers: PaymentProvider[];
  onConfigure: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

const InPersonProviders: React.FC<InPersonProvidersProps> = ({
  providers,
  onConfigure,
  onToggleStatus
}) => {
  return (
    <div className="mt-6">
      <h4 className="font-medium text-gray-900 mb-4">Available Options</h4>
      <div className="grid grid-cols-1 gap-4">
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
                  {provider.id === 'agent' 
                    ? (provider.fees.topup?.fixed === 0 ? 'Free' : `$${provider.fees.topup?.fixed || 0}`)
                    : (provider.fees.topup ? formatFee(provider.fees.topup) : 'Free')
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing:</span>
                <span className="font-medium">{provider.processingTime}</span>
              </div>
            </div>

            {/* Office Locations */}
            {provider.coordinates && (
              <div className="mt-4">
                <h6 className="font-medium text-gray-900 mb-2">Office Locations</h6>
                <div className="space-y-2">
                  {provider.coordinates.map((location, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="font-medium text-gray-900">{location.address}</div>
                      {provider.id === 'agent' && (provider as any).availableFees
                        ? (provider as any).availableFees.map((fee: number) => fee === 0 ? 'Free' : `$${fee}`).join(', ')
                        : provider.id === 'agent'
                          ? 'Free'
                          : (provider.fees.topup ? formatFee(provider.fees.topup) : 'Free')
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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

export default InPersonProviders;