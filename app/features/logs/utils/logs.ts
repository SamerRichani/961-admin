export function getStatusColor(status: string) {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getCategoryColor(category: string) {
  switch (category) {
    case 'user':
      return 'bg-blue-100 text-blue-800';
    case 'content':
      return 'bg-purple-100 text-purple-800';
    case 'wallet':
      return 'bg-green-100 text-green-800';
    case 'security':
      return 'bg-orange-100 text-orange-800';
    case 'system':
      return 'bg-gray-200 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
} 