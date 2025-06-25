"use client";

import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Chrome,
  Variable as Safari,
  Siren as Firefox,
  Globe2,
  Smartphone,
  Monitor,
  Apple,
  Cuboid as Android,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AnalyticsTabs } from "@/app/features/analytics/components/AnalyticsTabs";

const COLORS = ["#FF0000", "#FF3333", "#FF6666", "#FF9999", "#FFCCCC"];

export function UserDemographicsAndBehavior() {
  const {
    locationData,
    deviceData,
    cellProviders,
    internetProviders,
    userProfileData,
  } = useSelector((state: RootState) => state.userDemographics);

  return (
    <div className="mt-6 space-y-6">
      {/* Location Section */}
      <div>
        <div className="grid grid-cols-12 gap-6">
          {/* Lebanon Regions - Full Width */}
          <div className="col-span-12">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Lebanon Regions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locationData[0]?.regions?.map((region, index) => (
                  <div key={region.name} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{region.name}</h4>
                      <div className="text-base font-bold text-[#FF0000]">
                        {(
                          ((region.users ?? 0) /
                            (locationData[0]?.users ?? 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {formatNumber(region.users ?? 0)} users
                    </div>
                    <div className="space-y-1.5">
                      {region.cities.map((city) => (
                        <div
                          key={city.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-600">{city.name}</span>
                          <div className="flex items-center gap-1">
                            <span>{formatNumber(city.users ?? 0)}</span>
                            <span className="text-gray-500">
                              ({((city.users ?? 0) / (region.users ?? 1) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="col-span-12 md:col-span-7">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                Top Cities in Lebanon
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={
                    locationData[0]?.regions
                      ?.flatMap((region) => region.cities)
                      .filter((city) => city.name !== "Other")
                      .sort((a, b) => (b.users ?? 0) - (a.users ?? 0))
                      .slice(0, 8) || []
                  }
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(158, 158, 158, 0.1)" />
                  <XAxis type="number" tickFormatter={(value) => formatNumber(value)} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value) => formatNumber(Number(value))}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="users" fill="#FF0000" radius={[0, 4, 4, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Pie Chart */}
          <div className="col-span-12 md:col-span-5">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">User Distribution</h3>
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-[#FF0000]" />
                  <span className="text-sm font-medium">
                    {formatNumber(locationData.reduce((acc, curr) => acc + (curr.users || 0), 0))} Users
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-stretch" style={{ height: '350px' }}>
                {/* Pie Chart */}
                <div className="w-full sm:w-3/5 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="users"
                        nameKey="country"
                        stroke="none"
                      >
                        {locationData.map((entry, index) => (
                          <Cell
                            key={entry.country}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => [
                          formatNumber(Number(value)),
                          props.payload.country
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Countries List */}
                <div className="w-full sm:w-2/5 bg-gray-50 rounded-lg p-3 h-full overflow-auto">
                  <div className="space-y-3">
                    {locationData.map((item, index) => (
                      <div key={item.country}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium">{item.country}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {((item.users / locationData.reduce((acc, curr) => acc + (curr.users || 0), 0)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-grow h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${(item.users / locationData.reduce((acc, curr) => acc + (curr.users || 0), 0)) * 100}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                                opacity: 0.7
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 min-w-[60px] text-right">
                            {formatNumber(item.users)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div>
        {/* <h2 className="text-xl font-semibold mb-4">Device Breakdown</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mobile Devices */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Mobile Devices
            </h3>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-[#FF0000]" />
                <span className="text-sm">iOS ({deviceData.mobile[0].value}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <Android className="h-5 w-5 text-[#FF3333]" />
                <span className="text-sm">Android ({deviceData.mobile[1].value}%)</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-500 mb-3">Top Models</div>
              <div className="space-y-2">
                {deviceData.mobile.flatMap((platform) =>
                  platform.details.map((model) => (
                    <div key={model.model} className="flex items-center gap-2">
                      <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF0000] rounded-full" 
                          style={{ 
                            width: `${model.share}%`,
                            opacity: platform.name === 'iOS' ? 1 : 0.7 
                          }} 
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 min-w-[120px]">
                        <span className="text-sm text-gray-600">{model.model}</span>
                        <span className="text-sm font-medium">{model.share}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* Browser Usage */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Browser Usage
            </h3>
            <div className="space-y-3 mt-2">
              {deviceData.browser.map((browser) => {
                const Icon =
                  browser.icon === "Chrome"
                    ? Chrome
                    : browser.icon === "Safari"
                    ? Safari
                    : browser.icon === "Firefox"
                    ? Firefox
                    : Globe2;
                return (
                  <div key={browser.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">{browser.name}</span>
                      </div>
                      <span className="text-sm font-medium">{browser.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF0000] rounded-full" 
                        style={{ 
                          width: `${browser.value}%`,
                          opacity: 0.7 + (browser.value / 100) * 0.3
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Network Providers Section - 2 Column Layout */}
      <div>
        {/* <h2 className="text-xl font-semibold mb-6">Network Providers</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Cell Service Providers
            </h3>
            <div className="space-y-2">
              {cellProviders.map((provider) => (
                <div
                  key={provider.name}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF0000]" />
                    <span className="font-medium">{provider.name}</span>
                  </div>
                  <div className="text-sm">
                    {provider.percentage}% • {formatNumber(provider.users)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Internet Service Providers
            </h3>
            <div className="space-y-2">
              {internetProviders.map((provider) => (
                <div
                  key={provider.name}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF3333]" />
                    <span className="font-medium">{provider.name}</span>
                  </div>
                  <div className="text-sm">
                    {provider.percentage}% • {formatNumber(provider.users)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* User Profile Section - 2 Column Layout */}
      <div>
        {/* <h2 className="text-xl font-semibold mb-4">User Profile Breakdown</h2> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Demographics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF0000]" />
                  Gender
                </h4>
                <div className="space-y-2 sm:space-y-1.5">
                  {userProfileData.gender.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 sm:w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FF0000] rounded-full"
                            style={{
                              width: `${item.value}%`,
                              opacity: 0.7 + (item.value / 100) * 0.3,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium min-w-[40px] text-right">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF3333]" />
                  Age Groups
                </h4>
                <div className="space-y-2 sm:space-y-1.5">
                  {userProfileData.ageGroups.map((item) => (
                    <div
                      key={item.age}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">{item.age}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 sm:w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FF3333] rounded-full"
                            style={{
                              width: `${item.value}%`,
                              opacity: 0.7 + (item.value / 100) * 0.3,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium min-w-[40px] text-right">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF6666]" />
                  Languages
                </h4>
                <div className="space-y-2 sm:space-y-1.5">
                  {userProfileData.languages.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 sm:w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FF6666] rounded-full"
                            style={{
                              width: `${item.value}%`,
                              opacity: 0.7 + (item.value / 100) * 0.3,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium min-w-[40px] text-right">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF9999]" />
                  Interest Areas
                </h4>
                <div className="space-y-2 sm:space-y-1.5">
                  {userProfileData.interests.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 sm:w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FF9999] rounded-full"
                            style={{
                              width: `${item.value}%`,
                              opacity: 0.7 + (item.value / 100) * 0.3,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium min-w-[40px] text-right">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
