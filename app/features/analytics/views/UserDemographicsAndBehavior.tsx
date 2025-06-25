"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const topCountries = [
  { name: "Lebanon", users: 440250, percentage: 76.8 },
  { name: "UAE", users: 45230, percentage: 7.9 },
  { name: "Saudi Arabia", users: 28150, percentage: 4.9 },
  { name: "USA", users: 18420, percentage: 3.2 },
  { name: "Canada", users: 12680, percentage: 2.2 },
  { name: "Australia", users: 8950, percentage: 1.6 },
  { name: "Germany", users: 6780, percentage: 1.2 },
  { name: "France", users: 5420, percentage: 0.9 },
  { name: "UK", users: 4230, percentage: 0.7 },
  { name: "Sweden", users: 2890, percentage: 0.5 },
];

const lebaneseCities = [
  { city: "Beirut", users: 89250, percentage: 20.3 },
  { city: "Jounieh", users: 34580, percentage: 7.9 },
  { city: "Tripoli", users: 28940, percentage: 6.6 },
  { city: "Sidon", users: 22150, percentage: 5.0 },
  { city: "Zahle", users: 18670, percentage: 4.2 },
  { city: "Baalbek", users: 15420, percentage: 3.5 },
  { city: "Tyre", users: 12890, percentage: 2.9 },
  { city: "Byblos", users: 10340, percentage: 2.4 },
  { city: "Aley", users: 8750, percentage: 2.0 },
  { city: "Nabatieh", users: 7230, percentage: 1.6 },
];

const internationalCities = [
  { city: "Dubai", users: 18420, percentage: 3.2 },
  { city: "Riyadh", users: 12680, percentage: 2.2 },
  { city: "New York", users: 8950, percentage: 1.6 },
  { city: "London", users: 6780, percentage: 1.2 },
  { city: "Paris", users: 5420, percentage: 0.9 },
  { city: "Toronto", users: 4230, percentage: 0.7 },
  { city: "Sydney", users: 3890, percentage: 0.7 },
  { city: "Berlin", users: 2890, percentage: 0.5 },
  { city: "Stockholm", users: 2340, percentage: 0.4 },
  { city: "Doha", users: 1890, percentage: 0.3 },
];

export function UserDemographicsAndBehavior() {
  const [showLebanese, setShowLebanese] = useState(true);

  return (
    <div className="space-y-6">
      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Countries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCountries.map((country) => (
              <div key={country.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{country.name} ({country.percentage}%)</span>
                <span className="text-sm font-semibold text-gray-900">{country.users.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top Cities</CardTitle>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowLebanese(true)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    showLebanese 
                      ? 'bg-red-100 text-red-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🇱🇧
                </button>
                <button
                  onClick={() => setShowLebanese(false)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    !showLebanese 
                      ? 'bg-red-100 text-red-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🌍
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(showLebanese ? lebaneseCities : internationalCities).map((city) => (
              <div key={city.city} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{city.city} ({city.percentage}%)</span>
                <span className="text-sm font-semibold">{city.users.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Technical & Network */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ISP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { isp: 'Ogero', percentage: 34.2 },
              { isp: 'IDM', percentage: 28.7 },
              { isp: 'Cyberia', percentage: 18.5 },
              { isp: 'Sodetel', percentage: 12.3 },
              { isp: 'Other', percentage: 6.3 },
            ].map((isp) => (
              <div key={isp.isp} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{isp.isp}</span>
                <span className="text-sm font-semibold">{isp.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Carriers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { carrier: 'Touch', percentage: 52.4 },
              { carrier: 'Alfa', percentage: 47.6 },
            ].map((carrier) => (
              <div key={carrier.carrier} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{carrier.carrier}</span>
                <span className="text-sm font-semibold">{carrier.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mobiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { brand: 'Apple', percentage: 58.2 },
              { brand: 'Samsung', percentage: 28.7 },
              { brand: 'Huawei', percentage: 6.8 },
              { brand: 'Xiaomi', percentage: 3.9 },
              { brand: 'Other', percentage: 2.4 },
            ].map((brand) => (
              <div key={brand.brand} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{brand.brand}</span>
                <span className="text-sm font-semibold">{brand.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Device Models & Technical */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phone Models</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { model: 'iPhone 15 Pro', percentage: 18.4 },
              { model: 'iPhone 14', percentage: 16.2 },
              { model: 'Galaxy S24', percentage: 15.8 },
              { model: 'iPhone 13', percentage: 14.8 },
              { model: 'iPhone 12', percentage: 12.3 },
              { model: 'Galaxy A54', percentage: 10.9 },
              { model: 'iPhone 15', percentage: 8.7 },
              { model: 'Galaxy S23', percentage: 6.2 },
            ].map((model) => (
              <div key={model.model} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{model.model}</span>
                <span className="text-sm font-semibold">{model.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Browsers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { browser: 'Safari', percentage: 45.2 },
              { browser: 'Chrome', percentage: 38.7 },
              { browser: 'Firefox', percentage: 8.9 },
              { browser: 'Edge', percentage: 4.8 },
              { browser: 'Other', percentage: 2.4 },
            ].map((browser) => (
              <div key={browser.browser} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{browser.browser}</span>
                <span className="text-sm font-semibold">{browser.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { device: 'Mobile', percentage: 78.5 },
              { device: 'Desktop', percentage: 15.2 },
              { device: 'Tablet', percentage: 6.3 },
            ].map((device) => (
              <div key={device.device} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{device.device}</span>
                <span className="text-sm font-semibold">{device.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Language</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { language: 'Arabic', percentage: 68.4 },
              { language: 'English', percentage: 24.7 },
              { language: 'French', percentage: 6.9 },
            ].map((language) => (
              <div key={language.language} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{language.language}</span>
                <span className="text-sm font-semibold">{language.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Demographics & Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gender</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { gender: 'Male', percentage: 54.2 },
              { gender: 'Female', percentage: 45.8 },
            ].map((gender) => (
              <div key={gender.gender} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{gender.gender}</span>
                <span className="text-sm font-semibold">{gender.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Age</CardTitle>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">28.4 years</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { range: '18-24', percentage: 32.4 },
              { range: '25-34', percentage: 28.7 },
              { range: '35-44', percentage: 22.1 },
              { range: '45-54', percentage: 12.3 },
              { range: '55+', percentage: 4.5 },
            ].map((age) => (
              <div key={age.range} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{age.range}</span>
                <span className="text-sm font-semibold">{age.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { interest: 'News & Politics', percentage: 68.4 },
              { interest: 'Entertainment', percentage: 52.7 },
              { interest: 'Sports', percentage: 41.3 },
              { interest: 'Food & Dining', percentage: 38.9 },
              { interest: 'Technology', percentage: 32.1 },
              { interest: 'Travel', percentage: 28.6 },
              { interest: 'Health & Fitness', percentage: 24.3 },
              { interest: 'Fashion & Beauty', percentage: 21.7 },
              { interest: 'Business', percentage: 19.4 },
              { interest: 'Education', percentage: 16.8 },
            ].map((interest) => (
              <div key={interest.interest} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{interest.interest}</span>
                <span className="text-sm font-semibold">{interest.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mobile OS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'iOS', percentage: 58.2 },
              { name: 'Android', percentage: 41.8 },
            ].map((os) => (
              <div key={os.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{os.name}</span>
                <span className="text-sm font-semibold">{os.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { status: 'Verified', count: 342150, percentage: 59.6 },
              { status: 'Unverified', count: 231650, percentage: 40.4 },
            ].map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{status.status}</span>
                <div className="text-right">
                  <p className="text-sm font-semibold">{status.count.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{status.percentage}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
