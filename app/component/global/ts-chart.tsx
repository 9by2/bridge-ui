import type { ChartValue } from "@tanstack/charts"
import { Chart } from "@tanstack/react-charts"
import type { ChartProps } from "@tanstack/react-charts"

export function TsChart<TDatum, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue>({
  height = 256,
  ...props
}: ChartProps<TDatum, TXValue, TYValue>) {
  return <Chart height={height} {...props} />
}
