import React, { useState, useEffect } from 'react';
import { X, Save, Building, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { LogisticsPartner } from 'app/logistics/types';

interface EditPartnerModalProps {
  isOpen: boolean;
  partner: LogisticsPartner | null;
  onClose: () => void;
  onUpdate: (partner: LogisticsPartner) => void;
}

const EditPartnerModal: React.FC<EditPartnerModalProps> = ({
  isOpen,
  partner,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    services: [] as ('cash_pickup' | 'delivery' | 'both')[],
    status: 'active' as 'active' | 'inactive' | 'suspended'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name,
        email: partner.contactInfo.email,
        phone: partner.contactInfo.phone,
        address: partner.contactInfo.address,
        services: partner.services,
        status: partner.status
      });
    }
  }, [partner]);

  if (!isOpen || !partner) return null;

  const is961Captains = partner.id === '961_captains';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!is961Captains && formData.services.length === 0) {
      newErrors.services = 'At least one service must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const updatedPartner: LogisticsPartner = {
      ...partner,
      name: formData.name,
      status: formData.status,
      services: is961Captains ? partner.services : formData.services,
      contactInfo: {
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      }
    };

    onUpdate(updatedPartner);
  };

  const handleServiceToggle = (service: 'cash_pickup' | 'delivery' | 'both') => {
    if (is961Captains) return; // Don't allow service changes for 961 Captains
    
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              is961Captains ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {is961Captains ? (
                <User className="w-5 h-5 text-red-600" />
              ) : (
                <Building className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit {partner.name}
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
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {is961Captains ? 'Network Name' : 'Partner Name'} *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter name"
                  className={errors.name ? 'border-red-500' : ''}
                  disabled={is961Captains} // Don't allow name changes for 961 Captains
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+961 X XXXXXX"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full address"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                {[
                  { value: 'active', label: 'Active', color: 'green' },
                  { value: 'inactive', label: 'Inactive', color: 'gray' },
                  { value: 'suspended', label: 'Suspended', color: 'red' }
                ].map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: status.value as any }))}
                    className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                      formData.status === status.value
                        ? `border-${status.color}-500 bg-${status.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{status.label}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services - Only show for non-961 captains */}
          {!is961Captains && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Services Offered *</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 'cash_pickup', label: 'Cash Pickup', description: 'Collect cash from customers' },
                    { id: 'delivery', label: 'Delivery', description: 'Deliver packages and items' }
                  ].map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.services.includes(service.id as any)
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleServiceToggle(service.id as any)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{service.label}</p>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          formData.services.includes(service.id as any)
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.services.includes(service.id as any) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.services && <p className="text-red-500 text-sm mt-2">{errors.services}</p>}
              </CardContent>
            </Card>
          )}
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
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPartnerModal;