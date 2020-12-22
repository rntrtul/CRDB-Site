import React from 'react';
import PropTypes from 'prop-types';
import ReactFrappeChart from 'react-frappe-charts';

export default function BarChart({
  datasets,
  labels,
  xToolTip = '',
  yToolTip = '',
  title = '',
  colors = [],
  yMarkers = undefined,
  valuesOverPoints = false,
}) {
  const chartData = { labels, datasets };
  if (typeof yMarkers !== 'undefined') {
    chartData.yMarkers = yMarkers;
  }

  return (
    <ReactFrappeChart
      type="bar"
      title={title}
      colors={colors}
      axisOptions={{ xAxisMode: 'tick ' }}
      tooltipOptions={{
        formatTooltipX: (d) => xToolTip + d,
        formatTooltipY: (d) => (d + yToolTip + (d !== 1 ? 's' : '')),
      }}
      data={chartData}
      valuesOverPoints={valuesOverPoints}
    />
  );
}

BarChart.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.number),
    }),
  ).isRequired,
  labels: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  title: PropTypes.string,
  valuesOverPoints: PropTypes.bool,
  xToolTip: PropTypes.string,
  yToolTip: PropTypes.string,
  yMarkers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
    }),
  ),
};
