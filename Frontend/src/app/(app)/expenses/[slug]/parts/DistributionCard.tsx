'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ExpenseResponse } from '@/features/expenses';
import { getCurrencySymbol } from '@/features/expenses/utils/expense-utils';
import styles from './DistributionCard.module.css';

interface DistributionCardProps {
  expense: ExpenseResponse;
  currentUserId: string;
}

const CHART_COLORS = [
  '#8B5CFC',
  '#6BC0A0',
  '#E8C86A',
  '#E07A7A',
  '#A78BFA',
  '#5CB88A',
  '#DBBE8E',
  '#7C6CFF',
];

interface ChartData {
  name: string;
  value: number;
  fill: string;
  userId: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: ChartData }[];
  totalAmount: number;
  currencySymbol: string;
}

function CustomTooltip({ active, payload, totalAmount, currencySymbol }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = totalAmount > 0 ? ((data.value / totalAmount) * 100).toFixed(0) : 0;
    return (
      <div className={styles.tooltip}>
        <span className={styles.tooltipName}>{data.name}</span>
        <span className={styles.tooltipValue}>
          {currencySymbol} {data.value.toFixed(2)}
        </span>
        <span className={styles.tooltipPercent}>{percentage}%</span>
      </div>
    );
  }
  return null;
}

export function DistributionCard({ expense, currentUserId }: DistributionCardProps) {
  const currencySymbol = getCurrencySymbol(expense.currency || 'INR');
  const totalAmount = parseFloat(expense.totalAmount);

  const chartData = useMemo(() => {
    if (!expense.manualSplits || expense.manualSplits.length === 0) {
      return [];
    }

    return expense.manualSplits.map((split, index) => {
      const amount = parseFloat(split.amount);
      const participant = expense.participants.find((p) => p.id === split.userId);
      const name = participant
        ? participant.id === currentUserId
          ? 'You'
          : participant.name
        : 'Unknown';
      return {
        name,
        value: amount,
        fill: CHART_COLORS[index % CHART_COLORS.length],
        userId: split.userId,
      };
    });
  }, [expense, currentUserId]);

  const userShare = useMemo(() => {
    const userSplit = expense.manualSplits?.find((s) => s.userId === currentUserId);
    if (userSplit) {
      return parseFloat(userSplit.amount);
    }
    return 0;
  }, [expense.manualSplits, currentUserId]);

  const chartDataExists = chartData.length > 0 && chartData.some((d) => d.value > 0);

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Distribution</h3>

      <div className={styles.chartWrapper}>
        {chartDataExists ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="var(--color-bg-page)"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip totalAmount={totalAmount} currencySymbol={currencySymbol} />}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className={styles.noData}>
            <p>No split data available</p>
          </div>
        )}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Total</span>
          <span className={styles.summaryValue}>
            {currencySymbol} {totalAmount.toFixed(2)}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Your share</span>
          <span className={styles.summaryValue}>
            {currencySymbol} {userShare.toFixed(2)}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Status</span>
          <span className={`${styles.summaryValue} ${styles.statusValue}`}>
            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1).toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DistributionCard;