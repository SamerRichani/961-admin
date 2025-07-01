"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/redux/hooks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Droplet, Users, Heart, TrendingUp, Search, ChevronLeft } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnalyticsTabProps, Service } from '../types';
import { servicesData, bloodTypeData, weatherConditionsData } from '../data/services';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

const ServicesTab: React.FC<AnalyticsTabProps> = ({ 
  timePeriod, 
  getAdjustedValue, 
  getAdjustedPercentage 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = servicesData.filter((service: Service) => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderServiceMetrics = (service: Service) => {
    return (
      <div className="space-y-6">
        {/* Service Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
        </div>

        {/* Primary Metric */}
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-red-600 font-medium mb-2">{service.metrics.primaryMetric.label}</p>
              <p className="text-4xl font-bold text-red-700">
                {getAdjustedValue(service.metrics.primaryMetric.value, timePeriod).toLocaleString()}
                {service.metrics.primaryMetric.unit && (
                  <span className="text-lg ml-1">{service.metrics.primaryMetric.unit}</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {service.metrics.secondaryMetrics.map((metric: any, index: number) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
                  {metric.trend && (
                    <span className="text-sm text-green-600 font-medium">
                      {getAdjustedPercentage(metric.trend, timePeriod)}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.unit === '$' && '$'}
                  {getAdjustedValue(metric.value, timePeriod).toLocaleString()}
                  {metric.unit && metric.unit !== '$' && (
                    <span className="text-sm ml-1">{metric.unit}</span>
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Blood Type Distribution (specific to blood donation service) */}
        {service.id === 'blood' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Donors by Blood Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bloodTypeData.map((bloodType: any) => (
                  <div key={bloodType.type} className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-lg font-bold text-red-700">{bloodType.type}</p>
                    <p className="text-sm text-gray-900">{getAdjustedValue(bloodType.count, timePeriod).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{bloodType.percentage}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weather Patterns (specific to weather service) */}
        {service.id === 'weather' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Most Checked Weather Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weatherConditionsData.map((item: any) => (
                  <div key={item.condition} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.condition}</span>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{getAdjustedValue(item.checks, timePeriod).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {!selectedService ? (
        <>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Services List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {filteredServices.map((service: Service) => (
                  <div 
                    key={service.id} 
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {service.metrics.primaryMetric.label}: {getAdjustedValue(service.metrics.primaryMetric.value, timePeriod).toLocaleString()}
                          {service.metrics.primaryMetric.unit && ` ${service.metrics.primaryMetric.unit}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm">
                          View →
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No services found matching your search.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedService(null)}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Services</span>
            </Button>
          </div>

          {/* Service Details */}
          {renderServiceMetrics(selectedService)}
        </>
      )}
    </div>
  );
};

export const MiniAppsAnalytics = ServicesTab;
export default ServicesTab;
