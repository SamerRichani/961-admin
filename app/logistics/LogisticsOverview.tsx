import React from 'react';
import { TrendingUp, Users, Package, Clock, MapPin, Star, AlertTriangle, CheckCircle, Banknote, Truck, Building, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { LogisticsTab } from '../logistics/types';

interface LogisticsOverviewProps {
  onTabChange: (tab: LogisticsTab) => void;
}

const LogisticsOverview: React.FC<LogisticsOverviewProps> = ({ onTabChange }) => {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Partners</p>
                <p className="text-3xl font-bold text-blue-900">4</p>
                <p className="text-xs text-blue-700 mt-1">3 active, 1 inactive</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Captains</p>
                <p className="text-3xl font-bold text-green-900">247</p>
                <p className="text-xs text-green-700 mt-1">89% availability rate</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Operations</p>
                <p className="text-3xl font-bold text-purple-900">33.4K</p>
                <p className="text-xs text-purple-700 mt-1">+18.5% this month</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-orange-900">47m</p>
                <p className="text-xs text-orange-700 mt-1">-12% improvement</p>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Banknote className="w-5 h-5 text-green-600" />
              <span>Cash Pickup Operations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-green-900">Total Cash Pickups</p>
                  <p className="text-2xl font-bold text-green-700">18.2K</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">This Month</p>
                  <p className="text-lg font-semibold text-green-700">+22.3%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Average Time</p>
                  <p className="text-lg font-bold text-gray-900">38 min</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-lg font-bold text-gray-900">97.8%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">961 Captains</span>
                  <span className="font-medium">12.4K (68%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Partner Networks</span>
                  <span className="font-medium">5.8K (32%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>Delivery Operations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-blue-900">Total Deliveries</p>
                  <p className="text-2xl font-bold text-blue-700">15.2K</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">This Month</p>
                  <p className="text-lg font-semibold text-blue-700">+14.7%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Time</p>
                  <p className="text-lg font-bold text-gray-900">52 min</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-lg font-bold text-gray-900">94.6%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">961 Captains</span>
                  <span className="font-medium">8.9K (58%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Partner Networks</span>
                  <span className="font-medium">6.3K (42%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Network Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 961 Captains Performance */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">961 Captains Network</h3>
                  <p className="text-sm text-gray-500">Internal driver network</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <Star className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-900">4.8</p>
                  <p className="text-sm text-red-700">Average Rating</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <Clock className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-900">42m</p>
                  <p className="text-sm text-red-700">Avg Response</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <CheckCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-900">97.2%</p>
                  <p className="text-sm text-red-700">Success Rate</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <Users className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-900">247</p>
                  <p className="text-sm text-red-700">Active Drivers</p>
                </div>
              </div>

              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => onTabChange('captains')}
                >
                  Manage 961 Captains →
                </Button>
              </div>
            </div>

            {/* Partner Networks Performance */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Partner Networks</h3>
                  <p className="text-sm text-gray-500">External logistics partners</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">4.2</p>
                  <p className="text-sm text-blue-700">Average Rating</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">58m</p>
                  <p className="text-sm text-blue-700">Avg Response</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">93.8%</p>
                  <p className="text-sm text-blue-700">Success Rate</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">3</p>
                  <p className="text-sm text-blue-700">Active Partners</p>
                </div>
              </div>

              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => onTabChange('partners')}
                >
                  Manage Partners →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default LogisticsOverview;