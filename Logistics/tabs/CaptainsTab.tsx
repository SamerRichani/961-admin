import React, { useState } from 'react';
import { Search, Play, Pause, MoreVertical, Star, Clock, DollarSign, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from 'components/ui/card';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import { captains as initialCaptains } from 'app/logistics/data';
import { Captain } from 'app/logistics/types';

const CaptainsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [captains, setCaptains] = useState<Captain[]>(initialCaptains);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCaptains = captains.filter(captain => {
    const matchesSearch = 
      captain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      captain.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      captain.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || captain.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleStatus = (captainId: string) => {
    setCaptains(prev => prev.map(captain => {
      if (captain.id === captainId) {
        const newStatus = captain.status === 'active' ? 'paused' : 'active';
        return { ...captain, status: newStatus };
      }
      return captain;
    }));
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Captains</p>
                <p className="text-2xl font-bold text-gray-900">{captains.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">{captains.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-green-600">
                  {captains.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">
                  {captains.reduce((sum, c) => sum + c.stats.totalTrips, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg $/Hour</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(captains.reduce((sum, c) => sum + c.stats.dollarsPerHour, 0) / captains.length).toFixed(2)}
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search captains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Captains List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Captain</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Trips</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Earnings</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">$/Hour</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Hours</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Coverage</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCaptains.map((captain) => (
                  <tr key={captain.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-semibold text-sm">
                            {captain.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{captain.name}</p>
                          <p className="text-sm text-gray-500 font-mono">{captain.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(captain.status)}>
                          {captain.status}
                        </Badge>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-3 h-3 mr-1" />
                          <span className="text-xs font-medium text-black">{captain.rating}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">{captain.stats.totalTrips.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-green-600">
                        {formatCurrency(captain.stats.totalEarnings)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">${captain.stats.dollarsPerHour.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="text-sm">{captain.stats.hoursWorked}h</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="text-sm">{captain.coverageZones.length} zone{captain.coverageZones.length !== 1 ? 's' : ''}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{formatDate(captain.joinDate)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(captain.id)}
                          className="flex items-center space-x-1"
                        >
                          {captain.status === 'active' ? (
                            <>
                              <Pause className="w-3 h-3" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              <span>Resume</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredCaptains.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No captains found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default CaptainsTab;