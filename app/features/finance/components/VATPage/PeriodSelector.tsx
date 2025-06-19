import React from 'react';
import { Filter } from 'lucide-react';

interface PeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm appearance-none bg-white"
      >
        <option value="Q1">Q1 2024</option>
        <option value="Q2">Q2 2024</option>
        <option value="Q3">Q3 2024</option>
        <option value="Q4">Q4 2024</option>
        <option value="custom">Custom Range</option>
      </select>
    </div>
  );
};