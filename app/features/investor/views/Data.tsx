"use client"

import { InvestorTabs } from '@/app/features/investor/components/InvestorTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgeDistributionChart } from '../components/DataPage/AgeDistributionChart';
import { GenderDistributionChart } from '../components/DataPage/GenderDistributionChart';
import { LocationDistributionChart } from '../components/DataPage/LocationDistributionChart';

export function Data() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgeDistributionChart />
        <GenderDistributionChart />
      </div>
      <div className="mt-6">
        <LocationDistributionChart />
      </div>
    </div>
  );
}