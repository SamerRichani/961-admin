export function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function formatFee(fee: { percentage?: number; fixed?: number }) {
  if (!fee) return 'N/A';
  const parts = [];
  if (fee.percentage) parts.push(`${fee.percentage}%`);
  if (fee.fixed) parts.push(`$${fee.fixed.toFixed(2)}`);
  return parts.length ? parts.join(' + ') : 'Free';
}

export function shouldShowFeeInSummary(method: any) {
  // Show fee in summary if there is a fee for the current tab
  return !!(method.fees && (method.fees['topup'] || method.fees['checkout']));
} 