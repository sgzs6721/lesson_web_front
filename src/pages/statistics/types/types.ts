export interface CoachData {
  totalCoaches: number;
  averageLessons: number;
  averageSalary: number;
  retentionRate: number;
  coachGrowth: number;
  lessonGrowth: number;
  salaryGrowth: number;
  retentionGrowth: number;
}

export interface FinanceData {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitRate: number;
  revenueGrowth: number;
  costGrowth: number;
  profitGrowth: number;
  profitRateGrowth: number;
  costStructure: { value: number; name: string }[];
  monthlyData: {
    months: string[];
    revenue: number[];
    cost: number[];
    profit: number[];
  };
}

export interface StatisticsData {
  // ... existing code ...
} 