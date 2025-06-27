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
      <Card>
        <CardHeader>
          <CardTitle>Investor Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="age" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="age">Age Distribution</TabsTrigger>
              <TabsTrigger value="gender">Gender Distribution</TabsTrigger>
              <TabsTrigger value="location">Location Distribution</TabsTrigger>
            </TabsList>
            <TabsContent value="age">
              <AgeDistributionChart />
            </TabsContent>
            <TabsContent value="gender">
              <GenderDistributionChart />
            </TabsContent>
            <TabsContent value="location">
              <LocationDistributionChart />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}