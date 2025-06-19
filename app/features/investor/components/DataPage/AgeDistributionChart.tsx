import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export function AgeDistributionChart() {
  const { ageData, ageConfig } = useSelector((state: RootState) => state.investorAnalytics);
  const averageAge = 34;

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold">Age Distribution</h2>
        <div className="text-xs sm:text-sm text-gray-500">Average: {averageAge} years</div>
      </div>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ageData}
            layout="vertical"
            margin={{ top: 0, right: 30, bottom: 0, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <YAxis
              dataKey="range"
              type="category"
              width={40}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <XAxis 
              type="number" 
              axisLine={true}
              tickLine={true}
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Bar
              dataKey="value"
              fill="#FF0000"
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              <LabelList
                dataKey="value"
                position="right"
                formatter={(value: number) => `${value}%`}
                style={{
                  fontSize: '12px',
                  fill: 'currentColor'
                }}
              />
            </Bar>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                    <div className="text-sm">
                      <span className="font-medium">{payload[0].payload.range}</span>
                      <span className="ml-2">{payload[0].value}%</span>
                    </div>
                  </div>
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}