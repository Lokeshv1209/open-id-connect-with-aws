import { Cell, Pie, PieChart, Tooltip } from "recharts";

interface ChartItem {
  label: string;
  value: number;
  color: string;
}

interface SimpleDonutChartProps {
  data: ChartItem[];
}

export function ChartPieDonut({ data }: SimpleDonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { value } = payload[0];
      const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
      return (
        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white shadow-md text-center">
          <div className="text-xs font-bold text-gray-600">{percent}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex justify-center items-center min-h-[170px]">
      <PieChart width={171} height={171}>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={data.length > 0 ? data : [{ label: "No Data", value: 1, color: "#E5E7EB" }]}
          dataKey="value"
          nameKey="label"
          innerRadius={40}
          outerRadius={85.5}
          paddingAngle={0}
        >
          {(data.length > 0 ? data : [{ color: "#E5E7EB" }]).map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>

      {data.length === 0 && <span className="absolute text-gray-900 text-xs">No Data</span>}
    </div>
  );
}
