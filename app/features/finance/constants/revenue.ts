// Chart colors
export const CHART_COLORS = ['#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC'];

// Mock data
export const revenueData = [
  { month: 'Jan', revenue: 120000 },
  { month: 'Feb', revenue: 150000 },
  { month: 'Mar', revenue: 180000 },
  { month: 'Apr', revenue: 220000 },
  { month: 'May', revenue: 250000 },
  { month: 'Jun', revenue: 300000 },
];

export const revenueStreams = [
  { name: 'Advertising', value: 35 },
  { name: 'Coins Purchase', value: 25 },
  { name: 'Merch & Logistics', value: 40 },
].map(stream => ({
  ...stream,
  amount: (stream.value / 100) * 1200000
}));

export const topCreators = [
  {
    id: 'CR001',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&q=80',
    revenue: 50000,
    category: 'Food & Dining',
  },
  {
    id: 'CR002',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&q=80',
    revenue: 45000,
    category: 'Lifestyle',
  },
  {
    id: 'CR003',
    name: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&q=80',
    revenue: 42000,
    category: 'Fashion',
  },
];

export const topPlaces = [
  {
    id: 'PL001',
    name: 'Le Bristol',
    location: 'Beirut',
    revenue: 75000,
    bookings: 450,
    category: 'Restaurant',
  },
  {
    id: 'PL002',
    name: 'The Grand Hotel',
    location: 'Jounieh',
    revenue: 68000,
    bookings: 320,
    category: 'Hotel',
  },
  {
    id: 'PL003',
    name: 'Club Oxygen',
    location: 'Beirut',
    revenue: 62000,
    bookings: 280,
    category: 'Nightlife',
  },
];

export const topAdvertisers = [
  {
    id: 'AD001',
    name: 'Lebanese Bank',
    spend: 100000,
    category: 'Banking',
  },
  {
    id: 'AD002',
    name: 'TechCo Lebanon',
    spend: 85000,
    category: 'Technology',
  },
  {
    id: 'AD003',
    name: 'Luxury Cars',
    spend: 75000,
    category: 'Automotive',
  },
];