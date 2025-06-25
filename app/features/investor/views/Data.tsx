"use client"



import { InvestorTabs } from '@/app/features/investor/components/InvestorTabs';
import { useState } from 'react';
import { AgeDistributionChart } from '@/app/features/investor/components/DataPage/AgeDistributionChart';
import { GenderDistributionChart } from '@/app/features/investor/components/DataPage/GenderDistributionChart';
import { LocationDistributionChart } from '@/app/features/investor/components/DataPage/LocationDistributionChart';

export function Data() {
  const [search, setSearch] = useState('');

  return (
    <InvestorTabs 
      search={search}
      onSearchChange={setSearch}
    >
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <AgeDistributionChart />
          <GenderDistributionChart />
        </div>
        <LocationDistributionChart />
      </div>
    </InvestorTabs>
  );
}