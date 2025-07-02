'use client';
export const dynamic = "force-dynamic";

import { useSearchParams } from 'next/navigation';
import { SharesAndPricing } from "@/app/features/investor/views/SharesAndPricing";
import { InvestorDirectory } from "@/app/features/investor/views/InvestorDirectory";
import { UpdatesAndCommunications } from "@/app/features/investor/views/UpdatesAndCommunications";
import { Polls } from "@/app/features/investor/views/VotingAndPolls";
import { Data } from "@/app/features/investor/views/Data";
import { InvestorTabs } from "@/app/features/investor/components/InvestorTabs";
import { useState } from 'react';

export default function Investor() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'shares';
  const [search, setSearch] = useState('');

  let content;
  switch (tab) {
    case 'shares':
      content = <SharesAndPricing />;
      break;
    case 'directory':
      content = <InvestorDirectory />;
      break;
    case 'updates':
      content = <UpdatesAndCommunications />;
      break;
    case 'polls':
      content = <Polls />;
      break;
    case 'data':
      content = <Data />;
      break;
    default:
      content = <SharesAndPricing />;
  }

  return (
    <InvestorTabs search={search} onSearchChange={setSearch}>
      {content}
    </InvestorTabs>
  );
} 