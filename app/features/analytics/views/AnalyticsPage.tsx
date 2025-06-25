'use client';
import { useAppSelector } from '@/redux/hooks';
import { AnalyticsTabs } from '../components/AnalyticsTabs';
import { OverviewMetrics } from './OverviewMetrics';
import { UserDemographicsAndBehavior } from './UserDemographicsAndBehavior';
import { RevenueAnalytics } from './RevenueAnalytics';
import { TabsAnalytics } from './TabsAnalytics';
import { ContentPerformance } from './ContentPerformance';
import { LiveMetrics } from './LiveMetrics';
import React from 'react';

export function AnalyticsPage() {
  const { activeTab } = useAppSelector((state) => state.analytics);

  let content: React.ReactNode;
  switch (activeTab) {
    case 'overview':
      content = <OverviewMetrics />;
      break;
    case 'users':
      content = <UserDemographicsAndBehavior />;
      break;
    case 'revenue':
      content = <RevenueAnalytics />;
      break;
    case 'sections':
      content = <TabsAnalytics />;
      break;
    case 'content':
      content = <ContentPerformance />;
      break;
    case 'pulse':
      content = <LiveMetrics />;
      break;
    case 'chat':
      content = <div className="p-8">Chat analytics coming soon.</div>;
      break;
    default:
      content = <OverviewMetrics />;
  }

  return <AnalyticsTabs>{content}</AnalyticsTabs>;
} 