import React from 'react';
import { ArrowRight } from 'lucide-react';

interface VATReportProps {
  period: string;
}

const VATReport: React.FC<VATReportProps> = ({ period }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">VAT Return Summary</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">VAT Collection</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Standard Rate Sales (11%)</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">$458,920</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">$50,481</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Zero Rate Sales (0%)</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">$45,892</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">$0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-4">VAT Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total VAT Collected</span>
                <span className="text-sm font-medium text-gray-900">$50,481</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-700">Net VAT Due</span>
                <span className="text-lg font-semibold text-brand">$50,481</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Next VAT Payment</h2>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Q1 2024 VAT Payment Due</p>
            <p className="text-xl font-semibold text-gray-900">April 30, 2024</p>
          </div>
          <button
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors text-sm font-medium"
            onClick={() => {
              // TODO: Handle payment confirmation
              console.log('Marking VAT as paid');
            }}
          >
            Mark as Paid
          </button>
        </div>
      </div>
    </div>
  );
};

export default VATReport;