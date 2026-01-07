import type { IPieChartData } from "@/components/org/Org";
import type { TopCategory } from "@/types/category.types";

export const transformCategories = (data: TopCategory[]): IPieChartData[] => {
  const fixedColors = ["#FFD1A7", "#2B4DED", "#FF9E69"];
  return data.map((item, index) => {
    const useFixed = index < fixedColors.length;
    return {
      label: item.categoryName,
      value: Number(item.postCount),
      color: useFixed ? fixedColors[index] : getRandomColor(),
    };
  });
};

export const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

export function getRandomLightColor(): string {
  const r = Math.floor(Math.random() * 56 + 200); // 200–255
  const g = Math.floor(Math.random() * 56 + 200); // 200–255
  const b = Math.floor(Math.random() * 56 + 200); // 200–255

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
