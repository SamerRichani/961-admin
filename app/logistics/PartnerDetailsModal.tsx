import React from 'react';
import { X, MapPin, Clock, DollarSign, Star, Truck, FileText, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { LogisticsPartner } from './types';

interface PartnerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: LogisticsPartner | null;
}

const PartnerDetailsModal: React.FC<PartnerDetailsModalProps> = ({
  isOpen,
  onClose,
  partner
}) => {
  if (!isOpen || !partner) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const getDocumentName = (originalName: string) => {
    const documentMap: { [key: string]: string } = {
      'Business License': 'MOF Document',
      'Company Registration': 'MOF Document',
      'Business Permit': 'MOF Document',
      'Insurance Certificate': 'Insurance Certificate',
      'Liability Insurance': 'Insurance Certificate',
      'Insurance Policy': 'Insurance Certificate',
      'Vehicle Fleet Registration': 'Commercial Circular',
      'Operating Permits': 'Commercial Circular',
      'Taxi License': 'Commercial Circular',
      'Driver Certifications': 'VAT Certificate',
      'Driver Background Checks': 'VAT Certificate',
      'Vehicle Inspections': 'Owner(s) IDs'
    };
    return documentMap[originalName] || originalName;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Truck className="w-8 h-8 text-red-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{partner.name}</h2>
            </div>
            <Badge className={getStatusColor(partner.status)}>
              {partner.status}
            </Badge>
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
          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{partner.overallRating}</p>
                <p className="text-sm text-gray-500">Overall Rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Truck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{partner.totalDeliveries.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Deliveries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Truck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="space-y-1">
                  {partner.services.map((service) => (
                    <p key={service} className="text-sm font-medium text-gray-900">
                      {service.replace('_', ' ').toUpperCase()}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(partner.joinedDate).getFullYear()}
                </p>
                <p className="text-sm text-gray-500">Member Since</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-semibold text-lg">@</span>
                </div>
                <p className="text-sm text-blue-600 font-medium mb-1">Email</p>
                <p className="text-sm text-gray-900 font-medium">{partner.contactInfo.email}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-semibold text-lg">📞</span>
                </div>
                <p className="text-sm text-green-600 font-medium mb-1">Phone</p>
                <p className="text-sm text-gray-900 font-medium">{partner.contactInfo.phone}</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm text-purple-600 font-medium mb-1">Address</p>
                <p className="text-sm text-gray-900 font-medium text-center">{partner.contactInfo.address}</p>
              </CardContent>
            </Card>
          </div>

          {/* Zone Details */}
          <Card>
            <CardHeader>
              <CardTitle>Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {partner.zones.map((zoneInfo, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: zoneInfo.color }}
                      />
                      <h4 className="text-lg font-semibold text-gray-900">{zoneInfo.name}</h4>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{zoneInfo.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pricing */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Pricing
                        </h5>
                        <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cash Pickup Fee:</span>
                            <span className="font-medium">${zoneInfo.rates.cashPickupFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee:</span>
                            <span className="font-medium">${zoneInfo.rates.deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600">Estimated Time:</span>
                            <span className="font-medium">{zoneInfo.estimatedDeliveryTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Operating Hours */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Operating Hours
                        </h5>
                        <div className="space-y-1 text-sm">
                          {Object.entries(zoneInfo.operatingHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{getDayName(day)}:</span>
                              <span className={`font-medium ${hours.available ? 'text-green-600' : 'text-red-600'}`}>
                                {hours.available ? `${hours.start} - ${hours.end}` : 'Closed'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coverage Map */}
          <Card>
            <CardHeader>
              <CardTitle>Coverage Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                  {/* Simulated map with zones */}
                  {partner.zones.map((zone, index) => (
                    <div
                      key={zone.id}
                      className="absolute rounded-full opacity-30 flex items-center justify-center"
                      style={{
                        backgroundColor: zone.color,
                        width: `${120 + index * 20}px`,
                        height: `${120 + index * 20}px`,
                        left: `${20 + index * 25}%`,
                        top: `${15 + index * 15}%`,
                      }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: zone.color }}
                      />
                    </div>
                  ))}
                </div>
                <div className="relative z-10 text-center text-gray-600">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">Interactive Coverage Map</p>
                  <p className="text-sm">Showing {partner.zones.length} coverage zone{partner.zones.length !== 1 ? 's' : ''}</p>
                </div>
                
                {/* Zone Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md">
                  <h6 className="text-xs font-medium text-gray-900 mb-2">Zones</h6>
                  <div className="space-y-1">
                    {partner.zones.map((zone) => (
                      <div key={zone.id} className="flex items-center space-x-2 text-xs">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        />
                        <span className="text-gray-700">{zone.name}</span>
                        <span className="text-gray-500">${zone.rates.fixedFee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>Legal Documents ({partner.documents?.length ?? 0})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {partner.documents?.map((doc: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                    <div className="mb-3">
                      <p className="font-medium text-gray-900 text-sm">{getDocumentName(doc.name)}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = doc.url;
                          link.download = getDocumentName(doc.name);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div></div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              Edit Partner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailsModal;