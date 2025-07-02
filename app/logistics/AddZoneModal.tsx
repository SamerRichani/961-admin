import React, { useState } from 'react';
import { X, Plus, MapPin, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';

interface NewZone {
  name: string;
  description: string;
  rates: {
    fixedFee: number;
    cashPickupFee: number;
    deliveryFee: number;
  };
  operatingHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
  estimatedDeliveryTime: string;
}

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (zone: NewZone) => void;
}

const AddZoneModal: React.FC<AddZoneModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cashPickupFee: 0,
    deliveryFee: 0,
    fixedFee: 0,
    estimatedDeliveryTime: '',
    operatingHours: {
      monday: { start: '08:00', end: '22:00', available: true },
      tuesday: { start: '08:00', end: '22:00', available: true },
      wednesday: { start: '08:00', end: '22:00', available: true },
      thursday: { start: '08:00', end: '22:00', available: true },
      friday: { start: '08:00', end: '22:00', available: true },
      saturday: { start: '09:00', end: '20:00', available: true },
      sunday: { start: '10:00', end: '18:00', available: true }
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Zone name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if ((formData.fixedFee ?? 0) <= 0) {
      newErrors.fixedFee = 'Fixed fee must be greater than 0';
    }
    if (formData.cashPickupFee <= 0) {
      newErrors.cashPickupFee = 'Cash pickup fee must be greater than 0';
    }
    if (formData.deliveryFee <= 0) {
      newErrors.deliveryFee = 'Delivery fee must be greater than 0';
    }
    if (!formData.estimatedDeliveryTime.trim()) {
      newErrors.estimatedDeliveryTime = 'Estimated delivery time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newZone: NewZone = {
      name: formData.name,
      description: formData.description,
      rates: {
        cashPickupFee: formData.cashPickupFee ?? 0,
        deliveryFee: formData.deliveryFee ?? 0,
        fixedFee: formData.fixedFee ?? 0,
      },
      estimatedDeliveryTime: formData.estimatedDeliveryTime,
      operatingHours: formData.operatingHours as { [key: string]: { start: string; end: string; available: boolean; } },
    };

    onAdd(newZone);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      cashPickupFee: 0,
      deliveryFee: 0,
      fixedFee: 0,
      estimatedDeliveryTime: '',
      operatingHours: {
        monday: { start: '08:00', end: '22:00', available: true },
        tuesday: { start: '08:00', end: '22:00', available: true },
        wednesday: { start: '08:00', end: '22:00', available: true },
        thursday: { start: '08:00', end: '22:00', available: true },
        friday: { start: '08:00', end: '22:00', available: true },
        saturday: { start: '09:00', end: '20:00', available: true },
        sunday: { start: '10:00', end: '18:00', available: true }
      }
    });
    setErrors({});
  };

  const getDayName = (day: string) => {
    const days = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };
    return days[day as keyof typeof days] || day;
  };

  const handleHoursChange = (day: string, field: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          [field]: value
        }
      }
    }));
  };

  const handleAvailabilityToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          available: !prev.operatingHours[day as keyof typeof prev.operatingHours].available
        }
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Coverage Zone
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Zone Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Downtown Beirut"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Central business district and surrounding areas"
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fixed Fee ($) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.fixedFee ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, fixedFee: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    className={errors.fixedFee ? 'border-red-500' : ''}
                  />
                  {errors.fixedFee && <p className="text-red-500 text-sm mt-1">{errors.fixedFee}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery Time *
                  </label>
                  <Input
                    value={formData.estimatedDeliveryTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedDeliveryTime: e.target.value }))}
                    placeholder="e.g., 30-90 minutes"
                    className={errors.estimatedDeliveryTime ? 'border-red-500' : ''}
                  />
                  {errors.estimatedDeliveryTime && <p className="text-red-500 text-sm mt-1">{errors.estimatedDeliveryTime}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(formData.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-24">
                      <p className="font-medium text-gray-900 capitalize">{getDayName(day)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={hours.available}
                        onChange={() => handleAvailabilityToggle(day)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-600">Available</span>
                    </div>

                    {hours.available && (
                      <>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">From:</label>
                          <Input
                            type="time"
                            value={hours.start}
                            onChange={(e) => handleHoursChange(day, 'start', e.target.value)}
                            className="w-32"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">To:</label>
                          <Input
                            type="time"
                            value={hours.end}
                            onChange={(e) => handleHoursChange(day, 'end', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      </>
                    )}

                    {!hours.available && (
                      <div className="flex-1 text-center">
                        <span className="text-red-600 font-medium">Closed</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coverage Area Info */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Coverage Area
              </h4>
              
              {/* Map Container */}
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-dashed border-gray-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                  {/* Simulated map interface */}
                  <div className="absolute inset-4 bg-white rounded-lg shadow-inner flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="font-medium">Interactive Map</p>
                      <p className="text-sm mt-1">Click and drag to draw coverage area</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Use the drawing tools to define zone boundaries
                      </p>
                    </div>
                  </div>
                  
                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-md">
                    <div className="space-y-2">
                      <button className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center text-xs font-bold">
                        ✏️
                      </button>
                      <button className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center text-xs font-bold">
                        🗑️
                      </button>
                      <button className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center text-xs font-bold">
                        ✓
                      </button>
                    </div>
                  </div>
                  
                  {/* Sample coverage area */}
                  <div
                    className="absolute rounded-full opacity-30 border-4 border-blue-500"
                    style={{
                      backgroundColor: '#3B82F6',
                      width: '120px',
                      height: '120px',
                      left: '40%',
                      top: '35%',
                    }}
                  />
                </div>
                
                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md">
                  <h6 className="text-xs font-medium text-gray-900 mb-2">Drawing Tools</h6>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-blue-500 rounded"></span>
                      <span>Draw Area</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-red-500 rounded"></span>
                      <span>Delete</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 bg-green-500 rounded"></span>
                      <span>Confirm</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Instructions:</strong> Use the drawing tool (✏️) to outline the coverage area on the map. 
                  Click and drag to create boundaries. Use delete (🗑️) to remove areas and confirm (✓) when finished.
                </p>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Zone
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddZoneModal;