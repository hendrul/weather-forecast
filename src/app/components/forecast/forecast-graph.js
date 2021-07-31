import { Axis } from "@visx/axis";
import { curveNatural } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { MarkerCircle } from "@visx/marker";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { Text } from "@visx/text";
import { theme } from "app/shared/tailwind-config";
import { days, hours } from "./utils";

const colors = {
  white: theme.colors.white,
  black: theme.colors.gray[600],
  gray: "#98A7C0",
  darkGray: "#2A2A2A",
  accent: theme.colors.orange[200],
  darkAccent: theme.colors.orange[300]
};

export const ForecastGraph = ({
  className,
  height = 400,
  width = 600,
  padding = 55,
  hourly,
  city,
  data
}) => {
  const tickLabels = hourly ? hours : days;
  const tdata = data.map(([k, v], i) => {
    return [i + 1, v, tickLabels[k - 1]];
  });

  const xScale = scaleLinear({
    domain: [1, data.length],
    range: [0 + padding, width - padding]
  });

  const yScale = scaleLinear({
    domain: [0, 50],
    range: [height - padding, padding * 2]
  });

  return (
    <svg height={height} width={width} className={className}>
      {/* Rectangle */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        style={{
          fill: colors.black
        }}
        rx={5}
      />

      {/* X Axis */}
      <Axis
        scale={xScale}
        top={height - padding}
        orientation="bottom"
        stroke={colors.darkGray}
        strokeWidth={1.5}
        numTicks={data.length}
        tickStroke={colors.darkGray}
        tickLabelProps={() => ({
          fill: colors.gray,
          textAnchor: "middle",
          verticalAnchor: "middle"
        })}
        tickValues={tdata.map((d) => d[0])}
        tickFormat={(value) => tdata[value - 1][2]}
      />

      {/* Y Axis */}
      <Axis
        hideZero
        scale={yScale}
        numTicks={5}
        left={padding}
        orientation="left"
        stroke={colors.darkGray}
        strokeWidth={1.5}
        tickStroke={colors.darkGray}
        tickLabelProps={() => ({
          fill: colors.gray,
          textAnchor: "end",
          verticalAnchor: "middle"
        })}
        tickFormat={(value) => `${value}°`}
      />

      {/* Gradient for actual line */}
      <LinearGradient
        id="line-gradient"
        from={colors.darkAccent}
        to={colors.accent}
      />
      <MarkerCircle id="marker-circle" fill={colors.gray} size={1.5} refX={2} />

      {/* Actual Line */}
      <LinePath
        data={tdata}
        x={(d) => xScale(d[0])}
        y={(d) => yScale(d[1])}
        stroke="url('#line-gradient')"
        strokeWidth={3}
        curve={curveNatural}
        markerEnd="url(#marker-circle)"
      />

      {/* Title */}
      <Text
        style={{
          fill: colors.white,
          fontSize: 24,
          fontWeight: 600
        }}
        x={padding / 2}
        y={padding}
      >
        {hourly ? `Hourly Forecast (${city})` : `Daily Forecast (${city})`}
      </Text>

      {/* X Axis title */}
      <Text
        angle={-90}
        style={{
          fill: colors.white,
          fontSize: 16,
          fontWeight: 400
        }}
        x={12}
        y={height / 2 + 20}
      >
        Temp (°C)
      </Text>

      {/* Y Axis title */}
      <Text
        style={{
          fill: colors.white,
          fontSize: 16,
          fontWeight: 400
        }}
        x={width / 2 + 7}
        y={height - 5}
      >
        {hourly ? "Hours" : "Days"}
      </Text>
    </svg>
  );
};
