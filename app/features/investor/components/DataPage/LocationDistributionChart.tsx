import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export function LocationDistributionChart() {
  const { locationData, locationConfig } = useSelector((state: RootState) => state.investorAnalytics);

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold">Geographic Distribution</h2>
      </div>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={locationData}
            layout="vertical"
            margin={{ top: 0, right: 30, bottom: 0, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              axisLine={true}
              tickLine={true}
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              dataKey="country"
              type="category"
              axisLine={false}
              tickLine={false}
              width={80}
              tick={{ fontSize: 12 }}
              tickFormatter={(value: string) => {
                const label = locationConfig[value as keyof typeof locationConfig]?.label;
                return typeof label === 'string' ? label : value;
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const label = locationConfig[name as keyof typeof locationConfig]?.label;
                return [`${value}%`, label || name];
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '8px'
              }}
            />
            <Bar
              dataKey="value"
              fill="#FF0000"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}