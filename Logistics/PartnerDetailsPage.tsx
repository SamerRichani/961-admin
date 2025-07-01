import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, DollarSign, Star, Truck, FileText, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { LogisticsPartner } from '../../types/logistics';
import EditZoneModal from './EditZoneModal';
import AddZoneModal from './AddZoneModal';

interface PartnerDetailsPageProps {
  partner: LogisticsPartner;
  onBack: () => void;
}

const PartnerDetailsPage: React.FC<PartnerDetailsPageProps> = ({
  partner,
  onBack
}) => {
  const [editingZone, setEditingZone] = useState<any>(null);
  const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
  
  const is961Captains = partner.id === '961_captains';

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
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center space-x-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Partners</span>
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Truck className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{partner.name}</h1>
              </div>
              <Badge className={getStatusColor(partner.status)}>
                {partner.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">{partner.overallRating}</p>
              <p className="text-sm text-gray-500">Overall Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">{partner.totalDeliveries.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Deliveries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="space-y-1">
                {partner.services.map((service) => (
                  <p key={service} className="text-sm font-medium text-gray-900">
                    {service.replace('_', ' ').toUpperCase()}
                  </p>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Services</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">
                {new Date(partner.joinedDate).getFullYear()}
              </p>
              <p className="text-sm text-gray-500">Member Since</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information Cards */}
        {!is961Captains && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 font-semibold text-xl">@</span>
                    </div>
                    <p className="text-sm text-blue-600 font-medium mb-2">Email</p>
                    <p className="text-gray-900 font-medium">{partner.contactInfo.email}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 font-semibold text-xl">📞</span>
                    </div>
                    <p className="text-sm text-green-600 font-medium mb-2">Phone</p>
                    <p className="text-gray-900 font-medium">{partner.contactInfo.phone}</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-purple-600 font-medium mb-2">Address</p>
                    <p className="text-gray-900 font-medium text-center">{partner.contactInfo.address}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Zone Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{is961Captains ? 'Driver Coverage Zones' : 'Coverage Zones'}</span>
              {is961Captains && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddZoneModalOpen(true)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Add Zone
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {partner.zones.map((zoneInfo, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: zoneInfo.color }}
                    />
                    <h3 className="text-xl font-semibold text-gray-900">{zoneInfo.name}</h3>
                    {is961Captains && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto"
                        onClick={() => setEditingZone(zoneInfo)}
                      >
                        Edit Zone
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    {is961Captains 
                      ? `${zoneInfo.description} - Managed by 961 driver network`
                      : zoneInfo.description
                    }
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pricing */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        {is961Captains ? 'Driver Rates' : 'Pricing'}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cash Pickup:</span>
                          <span className="font-medium">${zoneInfo.rates.cashPickupFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery:</span>
                          <span className="font-medium">${zoneInfo.rates.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-600">Est. Time:</span>
                          <span className="font-medium">{zoneInfo.estimatedDeliveryTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Operating Hours */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        {is961Captains ? 'Driver Availability' : 'Operating Hours'}
                      </h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(zoneInfo.operatingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between py-1">
                            <span className="text-gray-600 capitalize">{getDayName(day).slice(0, 3)}:</span>
                            <span className={`font-medium ${hours.available ? 'text-gray-900' : 'text-gray-500'}`}>
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{is961Captains ? 'Driver Network Coverage' : 'Coverage Map'}</span>
              {is961Captains && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddZoneModalOpen(true)}
                >
                  Manage Coverage
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className={`absolute inset-0 ${
                is961Captains 
                  ? 'bg-gradient-to-br from-red-50 to-orange-50' 
                  : 'bg-gradient-to-br from-blue-50 to-green-50'
              }`}>
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
                      className="w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: zone.color }}
                    />
                  </div>
                ))}
              </div>
              <div className="relative z-10 text-center text-gray-600">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="font-medium text-lg">
                  {is961Captains ? 'Driver Network Coverage' : 'Interactive Coverage Map'}
                </p>
                <p className="text-sm">
                  {is961Captains 
                    ? `${partner.zones.length} active zone${partner.zones.length !== 1 ? 's' : ''} with driver coverage`
                    : `Showing ${partner.zones.length} coverage zone${partner.zones.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
              
              {/* Zone Legend */}
              <div className="absolute bottom-6 left-6 bg-white rounded-lg p-4 shadow-lg">
                <h6 className="text-sm font-medium text-gray-900 mb-3">
                  {is961Captains ? 'Driver Zones' : 'Coverage Zones'}
                </h6>
                <div className="space-y-2">
                  {partner.zones.map((zone) => (
                    <div key={zone.id} className="flex items-center space-x-3 text-sm">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="text-gray-700 font-medium">{zone.name}</span>
                      <span className="text-gray-500">${zone.rates.fixedFee}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Documents */}
        {!is961Captains && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-red-600" />
                <span>Legal Documents ({partner.documents.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {partner.documents.map((doc, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="mb-4">
                        <p className="font-medium text-gray-900 text-sm">{getDocumentName(doc.name)}</p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Driver Management for 961 Captains */}
        {is961Captains && (
          <Card>
            <CardHeader>
              <CardTitle>Driver Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-700">247</p>
                    <p className="text-sm text-red-600 font-medium">Active Drivers</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-700">89%</p>
                    <p className="text-sm text-orange-600 font-medium">Availability Rate</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-700">4.7</p>
                    <p className="text-sm text-green-600 font-medium">Avg Driver Rating</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Zone Modal */}
        <EditZoneModal
          isOpen={!!editingZone}
          zone={editingZone}
          onClose={() => setEditingZone(null)}
          onSave={(updatedZone) => {
            console.log('Save zone:', updatedZone);
            setEditingZone(null);
          }}
        />

        {/* Add Zone Modal */}
        <AddZoneModal
          isOpen={isAddZoneModalOpen}
          onClose={() => setIsAddZoneModalOpen(false)}
          onAdd={(newZone) => {
            console.log('Add zone:', newZone);
            setIsAddZoneModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default PartnerDetailsPage;