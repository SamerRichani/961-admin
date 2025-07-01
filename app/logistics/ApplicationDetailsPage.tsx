import React from 'react';
import { ArrowLeft, Check, X as XIcon, FileText, MapPin, Clock, DollarSign, Download, Eye, Building, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { LogisticsApplication } from './types';

interface ApplicationDetailsPageProps {
  application: LogisticsApplication;
  onBack: () => void;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
}

const ApplicationDetailsPage: React.FC<ApplicationDetailsPageProps> = ({
  application,
  onBack,
  onApprove,
  onReject
}) => {
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
            <span>Back to Applications</span>
          </Button>
          
          <div className="flex items-center justify-between">
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
                <h1 className="text-3xl font-bold text-gray-900">{application.companyName}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-gray-600">Application #{application.id}</p>
                  <Badge variant="outline" className={
                    application.type === 'company' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }>
                    {application.type === 'company' ? 'Company Application' : 'Captain Application'}
                  </Badge>
                </div>
              </div>
            </div>
            {canTakeAction && (
              <div className="flex space-x-3">
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
            )}
          </div>
        </div>

        {/* Application Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {application.type === 'company' ? 'Company Information' : 'Captain Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {application.type === 'company' ? 'Company Name' : 'Captain Name'}
                </p>
                <p className="text-gray-900 font-medium">{application.companyName}</p>
              </div>
              {application.type === 'captain' && application.username && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Username</p>
                  <p className="text-gray-900 font-medium font-mono">{application.username}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Contact Person</p>
                <p className="text-gray-900 font-medium">{application.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                <p className="text-gray-900 font-medium">{application.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Phone</p>
                <p className="text-gray-900 font-medium">{application.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Address</p>
                <p className="text-gray-900 font-medium">{application.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Submitted Date</p>
                <p className="text-gray-900 font-medium">{new Date(application.submittedDate).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requested Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Requested Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {application.requestedServices.map((service) => (
                <Badge key={service} variant="outline" className="px-4 py-2 text-sm">
                  {service.replace('_', ' ').toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proposed Coverage Zones */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Proposed Coverage Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {application.proposedZones.map((zone, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {zone.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">{zone.description}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    {/* Proposed Pricing */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Proposed Pricing
                      </h4>
                      <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Cash Pickup Fee:</span>
                          <span className="font-semibold text-blue-700">${zone.rates.cashPickupFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Delivery Fee:</span>
                          <span className="font-semibold text-blue-700">${zone.rates.deliveryFee.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Proposed Operating Hours */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Proposed Operating Hours
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(zone.operatingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-gray-600 capitalize font-medium">{getDayName(day)}:</span>
                            <span className={`font-medium ${hours.available ? 'text-green-600' : 'text-red-600'}`}>
                              {hours.available ? `${hours.start} - ${hours.end}` : 'Closed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Zone Coverage Map */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Proposed Coverage Area</h4>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                        {/* Simulated coverage area */}
                        <div
                          className="absolute rounded-full opacity-40 flex items-center justify-center"
                          style={{
                            backgroundColor: '#3B82F6',
                            width: '160px',
                            height: '160px',
                            left: '30%',
                            top: '20%',
                          }}
                        >
                          <div className="w-4 h-4 rounded-full border-2 border-white bg-blue-600" />
                        </div>
                      </div>
                      <div className="relative z-10 text-center text-gray-600">
                        <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-sm">{zone.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legal Documents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-red-600" />
              <span>Legal Documents ({application.documents.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {application.documents.map((doc, index) => (
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

        {/* Review Information */}
        {(application.reviewedBy || application.notes) && (
          <Card>
            <CardHeader>
              <CardTitle>Review Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {application.reviewedBy && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Reviewed By</p>
                    <p className="text-gray-900 font-medium">{application.reviewedBy}</p>
                  </div>
                )}
                {application.reviewedDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Review Date</p>
                    <p className="text-gray-900 font-medium">{new Date(application.reviewedDate).toLocaleString()}</p>
                  </div>
                )}
              </div>
              {application.notes && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">{application.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;