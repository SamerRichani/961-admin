import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { VATTransaction } from '@/app/features/finance/type';

interface VATDetailsProps {
  period: string;
}

const mockTransactions: VATTransaction[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    organizerName: 'EventPro Lebanon SAL',
    eventName: 'Tech Conference 2024',
    taxableAmount: 250,
    vatRate: 11,
    vatAmount: 27.50,
    date: '2024-03-15',
    type: 'service_fee'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    organizerName: 'Beirut Events Co. SARL',
    eventName: 'Summer Music Festival',
    taxableAmount: 365,
    vatRate: 11,
    vatAmount: 40.15,
    date: '2024-03-14',
    type: 'service_fee'
  }
];

const VATDetails: React.FC<VATDetailsProps> = ({ period }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = mockTransactions.filter(transaction =>
    transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Invoice</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Event Details</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Taxable Amount</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">VAT Rate</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">VAT Amount</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
              <tr key={transaction.id} className="border-b border-gray-100">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900">{transaction.invoiceNumber}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900">{transaction.organizerName}</div>
                  <div className="text-sm text-gray-500">{transaction.eventName}</div>
                  <div className="text-xs text-gray-400">{transaction.type.replace('_', ' ').toUpperCase()}</div>
                </td>
                <td className="py-4 px-6 text-right font-medium text-gray-900">${transaction.taxableAmount.toFixed(2)}</td>
                <td className="py-4 px-6 text-right text-gray-600">{transaction.vatRate}%</td>
                <td className="py-4 px-6 text-right font-medium text-gray-900">${transaction.vatAmount.toFixed(2)}</td>
                <td className="py-4 px-6 text-right text-gray-500">{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VATDetails