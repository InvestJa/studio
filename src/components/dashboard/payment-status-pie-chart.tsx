"use client"

import { Pie, PieChart, Tooltip, Cell } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { PaymentStatusData } from "@/types"
import { Skeleton } from "../ui/skeleton"

const chartData: PaymentStatusData[] = [
  { status: "Pago", count: 250, fill: "hsl(var(--chart-2))" }, // Uses updated --chart-2 (orange)
  { status: "Pendente", count: 100, fill: "hsl(var(--chart-3))" }, // Orange
  { status: "Atrasado", count: 50, fill: "hsl(var(--destructive))" }, // Red
];

const chartConfig = {
  count: {
    label: "Contagem",
  },
  Pago: { label: "Pago", color: "hsl(var(--chart-2))" },
  Pendente: { label: "Pendente", color: "hsl(var(--chart-3))" },
  Atrasado: { label: "Atrasado", color: "hsl(var(--destructive))" },
} satisfies Record<string, any>;

interface PaymentStatusPieChartProps {
  isLoading?: boolean;
}

export function PaymentStatusPieChart({ isLoading }: PaymentStatusPieChartProps) {
  if (isLoading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Skeleton className="h-[250px] w-[250px] rounded-full" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Status dos Pagamentos</CardTitle>
        <CardDescription>Distribuição dos status de pagamento atuais</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="status" />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                 <Cell key={`cell-${entry.status}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
