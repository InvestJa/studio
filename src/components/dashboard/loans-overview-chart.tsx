"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { MonthlyLoanData } from "@/types"
import { Skeleton } from "../ui/skeleton"

const chartData: MonthlyLoanData[] = [
  { month: "Jan", totalLoans: 186 },
  { month: "Fev", totalLoans: 305 },
  { month: "Mar", totalLoans: 237 },
  { month: "Abr", totalLoans: 173 },
  { month: "Mai", totalLoans: 209 },
  { month: "Jun", totalLoans: 250 },
];

const chartConfig = {
  totalLoans: {
    label: "Total de Empréstimos",
    color: "hsl(var(--chart-1))",
  },
} satisfies Record<string, any>; // Use `any` for flexible config type

interface LoansOverviewChartProps {
  isLoading?: boolean;
}

export function LoansOverviewChart({ isLoading }: LoansOverviewChartProps) {
  if (isLoading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Visão Geral de Empréstimos</CardTitle>
        <CardDescription>Total de empréstimos concedidos por mês (últimos 6 meses)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="totalLoans" fill="var(--color-totalLoans)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
