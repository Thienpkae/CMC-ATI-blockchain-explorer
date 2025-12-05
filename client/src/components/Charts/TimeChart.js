/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip
} from 'recharts';
import { chartDataType } from '../types';

const styles = () => ({
	container: {
		width: '100%',
		height: '100%'
	},
	emptyState: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
		color: '#9CA3AF',
		border: '1px dashed #E5E7EB',
		borderRadius: 8
	}
});

export const TimeChart = ({ chartData = {}, classes }) => {
	const displayData = (chartData.displayData || []).map((entry, index) => ({
		...entry,
		count: Number(entry.count || 0),
		index
	}));
	const maxValue = Math.max(chartData.dataMax || 0, ...displayData.map(d => d.count));
	const computedMax = Math.max(Math.ceil(maxValue / 4) * 4);

	if (!displayData.length) {
		return <div className={classes.emptyState}>No timeline data available</div>;
	}

	const tickTargets = 12;
	const tickCount = Math.min(tickTargets, displayData.length);
	const step =
		tickCount > 1 ? Math.max(1, Math.floor((displayData.length - 1) / (tickCount - 1))) : 1;
	const xTicks = [];

	for (let i = 0; i < tickCount; i += 1) {
		const tickIndex = Math.min(displayData.length - 1, i * step);
		if (!xTicks.includes(tickIndex)) {
			xTicks.push(tickIndex);
		}
	}
	const lastIndex = displayData.length - 1;
	if (xTicks[xTicks.length - 1] !== lastIndex) {
		xTicks.push(lastIndex);
	}

	return (
		<div className={classes.container}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={displayData} margin={{ top: 0, right: 24, left: -24, bottom: 0 }}>
					<CartesianGrid stroke="#E5E7EB" strokeDasharray="0" vertical horizontal />
					<XAxis
						dataKey="index"
						ticks={xTicks}
						interval={0}
						tickLine={false}
						axisLine={{ stroke: '#E5E7EB' }}
						tickFormatter={value =>
							displayData[value] ? displayData[value].datetime : ''
						}
						tickMargin={12}
						tick={{
							fill: '#9CA3AF',
							fontSize: 12,
							fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif'
						}}
					/>
					<YAxis
						domain={[0, computedMax]}
						dataKey="count"
						tickLine={false}
						axisLine={{ stroke: '#E5E7EB' }}
						tickMargin={12}
						tick={{
							fill: '#9CA3AF',
							fontSize: 12,
							fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif'
						}}
					/>
					<Tooltip
						cursor={{ strokeDasharray: '4 4', stroke: '#CBD5F5' }}
						contentStyle={{
							borderRadius: 8,
							border: '1px solid #E5E7EB',
							boxShadow: '0px 10px 20px rgba(59, 130, 246, 0.1)',
							fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif'
						}}
						labelFormatter={value => (displayData[value] ? displayData[value].datetime : '')}
					/>
					<Line
						type="monotone"
						dataKey="count"
						stroke="#5B67F6"
						strokeWidth={3}
						dot={false}
						activeDot={{ r: 4, fill: '#3B82F6' }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

TimeChart.propTypes = {
	chartData: chartDataType.isRequired,
};

export default withStyles(styles)(TimeChart);
