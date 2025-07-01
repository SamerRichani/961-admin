import React, { useState } from 'react';
import { Search, Check, X, Clock, FileText, Eye, Building, User, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { logisticsApplications } from '../../../data/logistics';
import { LogisticsApplication } from '../../../types/logistics';

interface ApplicationsTabProps {
  onViewApplication?: (application: LogisticsApplication) => void;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ onViewApplication }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredApplications = logisticsApplications.filter(app => {
    const matchesSearch = 
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'under_review': return <Eye className="w-4 h-4" />;
      case 'approved': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleApproveApplication = (applicationId: string) => {
    console.log('Approve application:', applicationId);
    // Implementation for approving application
  };

  const handleRejectApplication = (applicationId: string) => {
    console.log('Reject application:', applicationId);
    // Implementation for rejecting application
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Types</option>
                <option value="company">Companies</option>
                <option value="captain">Captains</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      application.type === 'company' 
                        ? 'bg-blue-100' 
                        : 'bg-red-100'
                    }`}>
                      {application.type === 'company' ? (
                        <Building className="w-4 h-4 text-blue-600" />
                      ) : (
                        <User className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{application.companyName}</h3>
                      {application.type === 'captain' && application.username && (
                        <p className="text-sm text-gray-500 font-mono">{application.username}</p>
                      )}
                    </div>
                    <Badge variant="outline" className={
                      application.type === 'company' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }>
                      {application.type === 'company' ? 'Company' : 'Captain'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Contact</p>
                      <p className="font-medium">{application.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Services</p>
                      <p className="font-medium">
                        {application.requestedServices.map(s => s.replace('_', ' ')).join(', ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Zones</p>
                      <p className="font-medium">
                        {application.proposedZones.length} zone{application.proposedZones.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Submitted</p>
                      <p className="font-medium">
                        {new Date(application.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewApplication?.(application)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No applications found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTab;