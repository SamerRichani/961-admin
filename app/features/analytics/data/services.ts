import { Service } from '../types';

export const servicesData: Service[] = [
  {
    id: 'blood',
    name: 'Blood Donation',
    metrics: {
      primaryMetric: { label: 'Registered Donors', value: 12450 },
      secondaryMetrics: [
        { label: 'Requests Sent', value: 892, trend: '+15.3%' },
        { label: 'Successful Donations', value: 234, trend: '+28.7%' },
        { label: 'Response Rate', value: 68.5, unit: '%', trend: '+5.2%' },
        { label: 'Avg Response Time', value: 23, unit: 'min', trend: '-12.4%' }
      ]
    }
  },
  {
    id: 'weather',
    name: 'Weather',
    metrics: {
      primaryMetric: { label: 'Active Users', value: 45200 },
      secondaryMetrics: [
        { label: 'Checks', value: 156800, trend: '+12.5%' },
        { label: '14-day Forecast', value: 18900, trend: '+22.3%' },
        { label: 'Revenue', value: 12400, unit: '$', trend: '+18.7%' }
      ]
    }
  },
  {
    id: 'events',
    name: 'Events',
    metrics: {
      primaryMetric: { label: 'Tickets Sold', value: 18900 },
      secondaryMetrics: [
        { label: 'Events Created', value: 456, trend: '+32.1%' },
        { label: 'Generated for Events', value: 245800, unit: '$', trend: '+28.4%' },
        { label: '961 Events Revenue', value: 34500, unit: '$', trend: '+22.1%' },
        { label: 'Event Ratings', value: 4.6, unit: '/5', trend: '+0.3' }
      ]
    }
  }
];

export const bloodTypeData = [
  { type: 'O+', count: 3890, percentage: 31.2 },
  { type: 'A+', count: 3240, percentage: 26.0 },
  { type: 'B+', count: 2100, percentage: 16.9 },
  { type: 'AB+', count: 890, percentage: 7.1 },
  { type: 'O-', count: 1240, percentage: 10.0 },
  { type: 'A-', count: 780, percentage: 6.3 },
  { type: 'B-', count: 210, percentage: 1.7 },
  { type: 'AB-', count: 100, percentage: 0.8 }
];

export const weatherConditionsData = [
  { condition: 'Current Temperature', checks: 89400, percentage: 57.1 },
  { condition: 'Hourly Forecast', checks: 34200, percentage: 21.8 },
  { condition: 'Weekly Forecast', checks: 18900, percentage: 12.1 },
  { condition: '14-day Forecast', checks: 14300, percentage: 9.1 }
]; 