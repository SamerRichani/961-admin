import React from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { PaymentMethod, PaymentProvider } from '../../types/payment';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PaymentMethod | PaymentProvider | null;
  onSave: (config: any) => void;
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave
}) => {
  const [config, setConfig] = React.useState<any>({});

  React.useEffect(() => {
    if (item) {
      setConfig({
        name: item.name,
        description: item.description,
        processingTime: item.processingTime,
        status: item.status,
        fees: item.fees,
        // Add specific fields based on item type
        ...(('coordinates' in item) && { coordinates: item.coordinates }),
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const updateFee = (context: 'checkout' | 'topup', field: 'percentage' | 'fixed', value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      fees: {
        ...prev.fees,
        [context]: {
          ...prev.fees[context],
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  const isProvider = 'coordinates' in item || item.id.includes('_');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Configure {item.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <Input
                    value={config.name || ''}
                    onChange={(e) => setConfig((prev: any) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter display name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processing Time
                  </label>
                  <Input
                    value={config.processingTime || ''}
                    onChange={(e) => setConfig((prev: any) => ({ ...prev, processingTime: e.target.value }))}
                    placeholder="e.g., Instant, 1-3 minutes"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Configuration */}
          {config.fees && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fee Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Checkout Fees */}
                {config.fees.checkout && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Checkout Fees</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Percentage (%)
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          value={config.fees.checkout.percentage || ''}
                          onChange={(e) => updateFee('checkout', 'percentage', e.target.value)}
                          placeholder="0.0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fixed Fee ($)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={config.fees.checkout.fixed || ''}
                          onChange={(e) => updateFee('checkout', 'fixed', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Paid By
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={config.fees.checkout.paidBy || 'merchant'}
                          onChange={(e) => setConfig((prev: any) => ({
                            ...prev,
                            fees: {
                              ...prev.fees,
                              checkout: {
                                ...prev.fees.checkout,
                                paidBy: e.target.value
                              }
                            }
                          }))}
                        >
                          <option value="merchant">Merchant</option>
                          <option value="user">User</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top-up Fees */}
                {config.fees.topup && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Top-up Fees</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Percentage (%)
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          value={config.fees.topup.percentage || ''}
                          onChange={(e) => updateFee('topup', 'percentage', e.target.value)}
                          placeholder="0.0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fixed Fee ($)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={config.fees.topup.fixed || ''}
                          onChange={(e) => updateFee('topup', 'fixed', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Paid By
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={config.fees.topup.paidBy || 'user'}
                          onChange={(e) => setConfig((prev: any) => ({
                            ...prev,
                            fees: {
                              ...prev.fees,
                              topup: {
                                ...prev.fees.topup,
                                paidBy: e.target.value
                              }
                            }
                          }))}
                        >
                          <option value="merchant">Merchant</option>
                          <option value="user">User</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Office Locations (for office providers) */}
          {config.coordinates && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Office Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {config.coordinates.map((location: any, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <Input
                            value={location.address}
                            onChange={(e) => {
                              const newCoordinates = [...config.coordinates];
                              newCoordinates[index] = { ...location, address: e.target.value };
                              setConfig((prev: any) => ({ ...prev, coordinates: newCoordinates }));
                            }}
                            placeholder="Enter address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Coordinates (Lat, Lng)
                          </label>
                          <Input
                            value={`${location.lat}, ${location.lng}`}
                            onChange={(e) => {
                              const coords = e.target.value.split(',').map(c => parseFloat(c.trim()));
                              if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                                const newCoordinates = [...config.coordinates];
                                newCoordinates[index] = { ...location, lat: coords[0], lng: coords[1] };
                                setConfig((prev: any) => ({ ...prev, coordinates: newCoordinates }));
                              }
                            }}
                            placeholder="33.8938, 35.5018"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agent Fee Configuration (for agent providers) */}
          {item.id === 'agent' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agent Fee Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="fee-free"
                        checked={config.availableFees?.includes(0) ?? true}
                        onChange={(e) => {
                          const availableFees = config.availableFees || [0];
                          if (e.target.checked) {
                            if (!availableFees.includes(0)) {
                              setConfig((prev: any) => ({
                                ...prev,
                                availableFees: [...availableFees, 0].sort()
                              }));
                            }
                          } else {
                            setConfig((prev: any) => ({
                              ...prev,
                              availableFees: availableFees.filter(fee => fee !== 0)
                            }));
                          }
                        }}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="fee-free" className="font-medium">Free</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="fee-1"
                        checked={config.availableFees?.some((fee: number) => fee > 0 && fee <= 1.5) ?? false}
                        onChange={(e) => {
                          const availableFees = config.availableFees || [0];
                          const currentCustomFee = availableFees.find((fee: number) => fee > 0 && fee <= 1.5) || 1;
                          if (e.target.checked) {
                            if (!availableFees.some((fee: number) => fee > 0 && fee <= 1.5)) {
                              setConfig((prev: any) => ({
                                ...prev,
                                availableFees: [...availableFees.filter((fee: number) => fee === 0 || fee > 1.5), currentCustomFee].sort()
                              }));
                            }
                          } else {
                            setConfig((prev: any) => ({
                              ...prev,
                              availableFees: availableFees.filter((fee: number) => fee === 0 || fee > 1.5)
                            }));
                          }
                        }}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="fee-1" className="font-medium">$</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="1.5"
                        value={config.availableFees?.find((fee: number) => fee > 0 && fee <= 1.5) || 1}
                        onChange={(e) => {
                          const newFee = parseFloat(e.target.value) || 1;
                          const availableFees = config.availableFees || [0];
                          const otherFees = availableFees.filter((fee: number) => fee === 0 || fee > 1.5);
                          setConfig((prev: any) => ({
                            ...prev,
                            availableFees: [...otherFees, newFee].sort()
                          }));
                        }}
                        className="w-20"
                        disabled={!config.availableFees?.some((fee: number) => fee > 0 && fee <= 1.5)}
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="fee-2"
                        checked={config.availableFees?.some((fee: number) => fee > 1.5) ?? false}
                        onChange={(e) => {
                          const availableFees = config.availableFees || [0];
                          const currentCustomFee = availableFees.find((fee: number) => fee > 1.5) || 2;
                          if (e.target.checked) {
                            if (!availableFees.some((fee: number) => fee > 1.5)) {
                              setConfig((prev: any) => ({
                                ...prev,
                                availableFees: [...availableFees.filter((fee: number) => fee === 0 || fee <= 1.5), currentCustomFee].sort()
                              }));
                            }
                          } else {
                            setConfig((prev: any) => ({
                              ...prev,
                              availableFees: availableFees.filter((fee: number) => fee === 0 || fee <= 1.5)
                            }));
                          }
                        }}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="fee-2" className="font-medium">$</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="1.6"
                        value={config.availableFees?.find((fee: number) => fee > 1.5) || 2}
                        onChange={(e) => {
                          const newFee = parseFloat(e.target.value) || 2;
                          const availableFees = config.availableFees || [0];
                          const otherFees = availableFees.filter((fee: number) => fee === 0 || fee <= 1.5);
                          setConfig((prev: any) => ({
                            ...prev,
                            availableFees: [...otherFees, newFee].sort()
                          }));
                        }}
                        className="w-20"
                        disabled={!config.availableFees?.some((fee: number) => fee > 1.5)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Current selection:</strong> {
                        (config.availableFees || [0]).length === 0 
                          ? 'No fees selected' 
                          : (config.availableFees || [0]).map((fee: number) => fee === 0 ? 'Free' : `$${fee}`).join(', ')
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Badge className={item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {item.status}
            </Badge>
            <span className="text-sm text-gray-500">
              {isProvider ? 'Provider Configuration' : 'Payment Method Configuration'}
            </span>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationModal;