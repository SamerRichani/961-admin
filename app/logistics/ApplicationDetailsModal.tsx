import React from 'react';
import { X, Check, X as XIcon, FileText, MapPin, Clock, DollarSign, Download, Eye, Building, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { LogisticsApplication } from './types';

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: LogisticsApplication | null;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  isOpen,
  onClose,
  application,
  onApprove,
  onReject
}) => {
  if (!isOpen || !application) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
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
      'Vehicle Registration': 'Commercial Circular',
      'Operating Permits': 'Commercial Circular',
      'Taxi License': 'Commercial Circular',
      'Driver Licenses': 'VAT Certificate',
      'Driver Background Checks': 'VAT Certificate',
      'Vehicle Inspections': 'Owner(s) IDs',
      'Company Profile': 'Owner(s) IDs',
      'Financial Statement': 'Owner(s) IDs'
    };
    return documentMap[originalName] || originalName;
  };

  const canTakeAction = application.status === 'pending' || application.status === 'under_review';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              application.type === 'company' 
                ? 'bg-blue-100' 
                : 'bg-red-100'
            }`}>
              {application.type === 'company' ? (
                <Building className="w-5 h-5 text-blue-600" />
              ) : (
                <User className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{application.companyName}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-gray-600">Application #{application.id}</p>
                <Badge variant="outline" className={
                  application.type === 'company' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }>
                  {application.type === 'company' ? 'Company' : 'Captain'}
                </Badge>
              </div>
            </div>
            <Badge className={getStatusColor(application.status)}>
              {application.status.replace('_', ' ')}
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
          {/* Application Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                {application.type === 'company' ? 'Company Information' : 'Captain Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {application.type === 'company' ? 'Company Name' : 'Captain Name'}
                    </p>
                    <p className="text-gray-900">{application.companyName}</p>
                  </div>
                  {application.type === 'captain' && application.username && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Username</p>
                      <p className="text-gray-900 font-mono">{application.username}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">Contact Person</p>
                    <p className="text-gray-900">{application.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{application.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">{application.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-gray-900">{application.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Submitted Date</p>
                    <p className="text-gray-900">{new Date(application.submittedDate).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requested Services */}
          <Card>
            <CardHeader>
              <CardTitle>Requested Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {application.requestedServices.map((service) => (
                  <Badge key={service} variant="outline" className="px-3 py-1">
                    {service.replace('_', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Proposed Zones */}
          <Card>
            <CardHeader>
              <CardTitle>Proposed Coverage Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {application.proposedZones.map((zone, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Zone: {zone.name}
                    </h4>
                    
                    <p className="text-gray-600 mb-4">{zone.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Proposed Pricing */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Proposed Pricing
                        </h5>
                        <div className="space-y-2 text-sm bg-blue-50 p-3 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cash Pickup Fee:</span>
                            <span className="font-medium">${zone.rates.cashPickupFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee:</span>
                            <span className="font-medium">${zone.rates.deliveryFee.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Proposed Operating Hours */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Proposed Operating Hours
                        </h5>
                        <div className="space-y-1 text-sm">
                          {Object.entries(zone.operatingHours).map(([day, hours]) => (
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

                    {/* Zone Coverage Map */}
                    <div className="mt-4">
                      <h6 className="font-medium text-gray-900 mb-3">Proposed Coverage Area</h6>
                      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                          {/* Simulated coverage area */}
                          <div
                            className="absolute rounded-full opacity-40 flex items-center justify-center"
                            style={{
                              backgroundColor: '#3B82F6',
                              width: '140px',
                              height: '140px',
                              left: '30%',
                              top: '20%',
                            }}
                          >
                            <div className="w-3 h-3 rounded-full border-2 border-white bg-blue-600" />
                          </div>
                        </div>
                        <div className="relative z-10 text-center text-gray-600">
                          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="font-medium text-sm">{zone.name}</p>
                          <p className="text-xs">{zone.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Legal Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>Legal Documents ({application.documents.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {application.documents.map((doc, index) => (
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
            <Button
              variant="outline"
              onClick={() => onReject(application.id)}
              className="text-red-600 hover:text-red-700"
            >
              <XIcon className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => onApprove(application.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;