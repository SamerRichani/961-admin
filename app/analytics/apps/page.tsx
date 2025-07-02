'use client';
import { MiniAppsAnalytics } from "@/app/features/analytics/views/MiniAppsAnalytics";
import { useAppSelector } from "@/redux/hooks";

export default function AnalyticsApps() {
  const { timeRange } = useAppSelector((state) => state.analytics);

  return (
    <MiniAppsAnalytics
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
    />
  );
} 