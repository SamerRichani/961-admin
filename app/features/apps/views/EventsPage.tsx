"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { formatMoney, formatNumber } from "@/lib/format";

export function EventsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold">
            Events Analytics
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(1250)}
                </p>
                <p className="text-sm text-emerald-600">+12.5% this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 sm:h-6 w-5 sm:w-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Total Tickets</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(25000)}
                </p>
                <p className="text-sm text-emerald-600">+8.2% this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatMoney(750000)}
                </p>
                <p className="text-sm text-emerald-600">+15.3% this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 sm:h-6 w-5 sm:w-6 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Our Earnings</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatMoney(75000)}
                </p>
                <p className="text-sm text-emerald-600">+15.3% this month</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon Message */}
        <Card className="p-6 sm:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            🎉 Coming Soon!
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base">
            We're working on bringing you detailed analytics for events,
            including ticket sales, revenue breakdowns, engagement metrics, and
            more.
          </p>
        </Card>
      </div>
    </div>
  );
}
