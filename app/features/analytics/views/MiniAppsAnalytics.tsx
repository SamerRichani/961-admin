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
import { Droplet, Users, Heart, TrendingUp } from "lucide-react";

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

export function MiniAppsAnalytics() {
  const { timeRange } = useAppSelector((state) => state.analytics);
  const [activeApp, setActiveApp] = useState("blood");

  const timePeriod = timeRange === "day" ? "today" : timeRange === "week" ? "7days" : timeRange === "month" ? "30days" : timeRange;

  const getAdjustedValue = (baseValue: number, period: string) => {
    switch (period) {
      case "today":
      case "day":
        return baseValue;
      case "7days":
      case "week":
        return Math.round(baseValue * 1.1);
      case "30days":
      case "month":
        return Math.round(baseValue * 1.2);
      default:
        return Math.round(baseValue * 1.3);
    }
  };

  // Blood App Data
  const bloodData = {
    requestsSent: getAdjustedValue(1247, timePeriod),
    registeredDonors: getAdjustedValue(892, timePeriod),
    timesDonated: getAdjustedValue(2156, timePeriod),
    requestedBloodTypes: [
      { type: 'A+', count: getAdjustedValue(320, timePeriod) },
      { type: 'A-', count: getAdjustedValue(180, timePeriod) },
      { type: 'B+', count: getAdjustedValue(280, timePeriod) },
      { type: 'B-', count: getAdjustedValue(150, timePeriod) },
      { type: 'AB+', count: getAdjustedValue(120, timePeriod) },
      { type: 'AB-', count: getAdjustedValue(80, timePeriod) },
      { type: 'O+', count: getAdjustedValue(350, timePeriod) },
      { type: 'O-', count: getAdjustedValue(200, timePeriod) },
    ],
    donorsByBloodType: [
      { type: 'A+', count: getAdjustedValue(280, timePeriod) },
      { type: 'A-', count: getAdjustedValue(160, timePeriod) },
      { type: 'B+', count: getAdjustedValue(250, timePeriod) },
      { type: 'B-', count: getAdjustedValue(140, timePeriod) },
      { type: 'AB+', count: getAdjustedValue(100, timePeriod) },
      { type: 'AB-', count: getAdjustedValue(70, timePeriod) },
      { type: 'O+', count: getAdjustedValue(320, timePeriod) },
      { type: 'O-', count: getAdjustedValue(180, timePeriod) },
    ],
    topDonors: [
      { name: "Ahmed Hassan", donations: 15, bloodType: "O+" },
      { name: "Sarah Johnson", donations: 12, bloodType: "A+" },
      { name: "Mohammed Ali", donations: 10, bloodType: "B+" },
      { name: "Fatima Zahra", donations: 9, bloodType: "AB+" },
      { name: "John Smith", donations: 8, bloodType: "O-" },
    ],
    monthlyTrends: [
      { month: 'Jan', requests: 120, donations: 95 },
      { month: 'Feb', requests: 135, donations: 110 },
      { month: 'Mar', requests: 150, donations: 125 },
      { month: 'Apr', requests: 140, donations: 115 },
      { month: 'May', requests: 160, donations: 130 },
      { month: 'Jun', requests: 175, donations: 145 },
    ]
  };

  return (
    <div className="space-y-6">
      {/* App Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mini-Apps Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeApp} onValueChange={setActiveApp}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="blood" className="flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                Blood App
              </TabsTrigger>
              <TabsTrigger value="coins" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Coins App
              </TabsTrigger>
              <TabsTrigger value="points" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Points App
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blood" className="space-y-6 mt-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Requests Sent</p>
                        <p className="text-2xl font-bold text-gray-900">{bloodData.requestsSent.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+12.5% from last period</p>
                      </div>
                      <Droplet className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Registered Donors</p>
                        <p className="text-2xl font-bold text-gray-900">{bloodData.registeredDonors.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+8.3% from last period</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Times Donated</p>
                        <p className="text-2xl font-bold text-gray-900">{bloodData.timesDonated.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+15.7% from last period</p>
                      </div>
                      <Heart className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Requested Blood Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={bloodData.requestedBloodTypes}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#FF6B6B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Donors by Blood Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={bloodData.donorsByBloodType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {bloodData.donorsByBloodType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bloodData.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="requests" stroke="#FF6B6B" strokeWidth={2} name="Requests" />
                      <Line type="monotone" dataKey="donations" stroke="#4ECDC4" strokeWidth={2} name="Donations" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Donors */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Donors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bloodData.topDonors.map((donor, index) => (
                      <div key={donor.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{donor.name}</p>
                            <p className="text-sm text-gray-500">Blood Type: {donor.bloodType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{donor.donations}</p>
                          <p className="text-sm text-gray-500">donations</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="coins" className="space-y-6 mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-gray-500">Coins App analytics coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="points" className="space-y-6 mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-gray-500">Points App analytics coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
