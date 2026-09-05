import type { ChartValue } from "@tanstack/charts"
import { Chart, RendererChart } from "@tanstack/react-charts/tooltip"
import type { ChartProps, RendererChartProps } from "@tanstack/react-charts/tooltip"

export function TsChart<TDatum, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue>(
  props: RendererChartProps<TDatum, TXValue, TYValue>
): React.JSX.Element
export function TsChart<TDatum, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue>(
  props: ChartProps<TDatum, TXValue, TYValue>
): React.JSX.Element
export function TsChart<TDatum, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue>({
  height = 256,
  ...props
}: ChartProps<TDatum, TXValue, TYValue> | RendererChartProps<TDatum, TXValue, TYValue>) {
  if ("renderer" in props) return <RendererChart height={height} {...props} />
  return <Chart height={height} {...props} />
}
