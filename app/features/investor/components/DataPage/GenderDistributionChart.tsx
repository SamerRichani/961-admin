import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const COLORS = ["#FF0000", "#FF6666"];

export function GenderDistributionChart() {
  const { genderData, genderConfig } = useSelector((state: RootState) => state.investorAnalytics);

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Gender Distribution</h2>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={genderData}
              dataKey="value"
              nameKey="id"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              label={({ id, value }) => {
                const label = genderConfig[id as keyof typeof genderConfig]?.label;
                return `${label}: ${value}%`;
              }}
              labelLine={false}
            >
              {genderData.map((entry, index) => (
                <Cell
                  key={entry.id}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => {
                const label = genderConfig[name as keyof typeof genderConfig]?.label;
                return [`${value}%`, label];
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '8px'
              }}
            />
            <Legend
              formatter={(value) => {
                const label = genderConfig[value as keyof typeof genderConfig]?.label;
                const entry = genderData.find(item => item.id === value);
                return entry ? `${label}: ${entry.value}%` : label;
              }}
              wrapperStyle={{
                fontSize: '12px',
                paddingTop: '12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}