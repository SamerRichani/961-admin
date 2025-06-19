import React from 'react';
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

interface VATSummaryProps {
  period: any;
}

const VATSummary: React.FC<VATSummaryProps> = ({ period }) => {
  if (!period) return null;

  const changePercentage = period.changePercentage || 0;
  const isPositive = changePercentage >= 0;

  // Safely get values with defaults
  const totalTaxableSales = period.totalTaxableSales || 0;
  const totalVatCollected = period.totalVatCollected || 0;
  const standardRateAmount = period.standardRateAmount || 0;
  const zeroRateAmount = period.zeroRateAmount || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="bg-brand/10 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-brand" />
            </div>
            <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{changePercentage}%
              {isPositive ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm text-gray-500">Taxable Sales</h3>
            <p className="text-3xl font-semibold text-gray-900">${totalTaxableSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{changePercentage}%
              {isPositive ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm text-gray-500">VAT Collected</h3>
            <p className="text-3xl font-semibold text-gray-900">${totalVatCollected.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Collection by Rate</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Standard Rate (11%)</span>
              <span className="font-medium text-gray-900">${standardRateAmount.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand" 
                style={{ 
                  width: `${totalTaxableSales > 0 ? (standardRateAmount / totalTaxableSales) * 100 : 0}%` 
                }} 
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Zero Rate (0%)</span>
              <span className="font-medium text-gray-900">${zeroRateAmount.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand" 
                style={{ 
                  width: `${totalTaxableSales > 0 ? (zeroRateAmount / totalTaxableSales) * 100 : 0}%` 
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VATSummary;