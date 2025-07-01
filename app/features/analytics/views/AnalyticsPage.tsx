'use client';
import { useAppSelector } from '@/redux/hooks';
import { AnalyticsTabs } from '../components/AnalyticsTabs';
import { OverviewMetrics } from './OverviewMetrics';
import { UserDemographicsAndBehavior } from './UserDemographicsAndBehavior';
import { RevenueAnalytics } from './RevenueAnalytics';
import { TabsAnalytics } from './TabsAnalytics';
import ContentPerformance from './ContentPerformance';
import { LiveMetrics } from './LiveMetrics';
import React from 'react';
import ChatTab from './ChatTab';
import { MiniAppsAnalytics } from './MiniAppsAnalytics';

export function AnalyticsPage() {
  const { activeTab, timeRange } = useAppSelector((state) => state.analytics);

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
      content = <ChatTab 
        timePeriod={timeRange === 'day' ? 'today' : timeRange === 'week' ? '7days' : timeRange === 'month' ? '30days' : timeRange}
        getAdjustedValue={(baseValue, period) => {
          switch (period) {
            case 'today':
            case 'day':
              return baseValue;
            case '7days':
            case 'week':
              return Math.round(baseValue * 1.1);
            case '30days':
            case 'month':
              return Math.round(baseValue * 1.2);
            default:
              return Math.round(baseValue * 1.3);
          }
        }}
        getAdjustedPercentage={(basePercentage, period) => {
          let base = parseFloat(basePercentage);
          let adjusted = base;
          switch (period) {
            case 'today':
            case 'day':
              adjusted = base;
              break;
            case '7days':
            case 'week':
              adjusted = base * 1.1;
              break;
            case '30days':
            case 'month':
              adjusted = base * 1.2;
              break;
            default:
              adjusted = base * 1.3;
          }
          return (adjusted > 0 ? '+' : '') + adjusted.toFixed(1) + '%';
        }}
      />;
      break;
    case 'miniapps':
      content = <MiniAppsAnalytics 
        timePeriod={timeRange === 'day' ? 'today' : timeRange === 'week' ? '7days' : timeRange === 'month' ? '30days' : timeRange}
        getAdjustedValue={(baseValue, period) => {
          switch (period) {
            case 'today':
            case 'day':
              return baseValue;
            case '7days':
            case 'week':
              return Math.round(baseValue * 1.1);
            case '30days':
            case 'month':
              return Math.round(baseValue * 1.2);
            default:
              return Math.round(baseValue * 1.3);
          }
        }}
        getAdjustedPercentage={(basePercentage, period) => {
          let base = parseFloat(basePercentage);
          let adjusted = base;
          switch (period) {
            case 'today':
            case 'day':
              adjusted = base;
              break;
            case '7days':
            case 'week':
              adjusted = base * 1.1;
              break;
            case '30days':
            case 'month':
              adjusted = base * 1.2;
              break;
            default:
              adjusted = base * 1.3;
          }
          return (adjusted > 0 ? '+' : '') + adjusted.toFixed(1) + '%';
        }}
      />;
      break;
    default:
      content = <OverviewMetrics />;
  }

  return <AnalyticsTabs>{content}</AnalyticsTabs>;
} 