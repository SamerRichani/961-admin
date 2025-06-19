// Status Colors
export const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-yellow-100 text-yellow-800',
  disabled: 'bg-red-100 text-red-800',
  available: 'bg-green-100 text-green-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800'
};

// Task Type Colors
export const typeColors = {
  delivery: 'bg-purple-100 text-purple-800',
  pickup: 'bg-blue-100 text-blue-800',
  return: 'bg-orange-100 text-orange-800'
};

// Document Labels
export const documentLabels = {
  national_id: 'National ID',
  drivers_license: "Driver's License",
  vehicle_registration: 'Vehicle Registration',
  insurance: 'Insurance'
};

// Metrics
export const metrics = {
  activeFlexers: {
    today: 250,
    week: 850,
    month: 2500,
    total: 5000,
    change: 12.5
  },
  completedBlocks: {
    today: 450,
    week: 2800,
    month: 12000,
    change: 8.2
  },
  completedTasks: {
    deliveries: 8500,
    cashPickups: 3200,
    returns: 450,
    failed: 320,
    change: 15.3
  },
  cashCollected: {
    today: 25000,
    week: 150000,
    month: 650000,
    change: 10.5
  },
  flexerEarnings: {
    today: 12500,
    week: 75000,
    month: 325000,
    change: 18.2
  }
};