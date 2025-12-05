/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Label } from 'recharts';
import { sha256 } from 'js-sha256';
import { transactionByOrgType } from '../types';

/* istanbul ignore next */
const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	const labelColor = dark ? '#F5F5F5' : '#212121';
	return {
		container: {
			display: 'flex',
			width: '100%',
			height: '100%',
			alignItems: 'center',
			gap: 8
		},
		chartWrapper: {
			position: 'relative',
			flex: 2,
			minWidth: 0,
			height: '100%',
			minHeight: 181,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		},
		legendWrapper: {
			flex: 1,
			minWidth: 0,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			justifyContent: 'center',
			gap: 8,
			paddingLeft: 24
		},
		legendItem: {
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			gap: 8,
			padding: 4
		},
		legendSwatch: {
			width: 12,
			height: 12,
			borderRadius: '50%',
			border: `1px solid ${dark ? '#1F1B2E' : '#ffffff'}`,
			flexShrink: 0
		},
		legendLabel: {
			flex: 1,
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14,
			color: labelColor,
			lineHeight: '16px'
		},
		chartInnerLabel: {
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 24,
			fontWeight: 600,
			fill: labelColor
		},
		emptyState: {
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14,
			color: dark ? '#D1D5DB' : '#6B7280',
			textAlign: 'center',
			width: '100%'
		}
	};
};

const DEFAULT_COLORS = ['#3BC3DF', '#FF8A9A', '#8B7CFF', '#FFC247', '#34D399', '#F472B6'];

function intConversion(str) {
	let value = 0;
	for (let i = 0; i < str.length; i++) {
		value = str.charCodeAt(i) + ((value << 5) - value);
	}
	return value;
}

function getRGBColor(i) {
	const c = (i & 0x00ffffff).toString(16).toUpperCase();
	return '#' + '00000'.substring(0, 6 - c.length) + c;
}

function convertSha256(str) {
	const shaString = sha256(str);
	return shaString;
}

export function getOrgColor(org, index = 0) {
	const paletteColor = DEFAULT_COLORS[index % DEFAULT_COLORS.length];
	return paletteColor || getRGBColor(intConversion(convertSha256(org)));
}

export class OrgPieChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		};
	}

	componentDidMount() {
		const { transactionByOrg } = this.props;
		this.orgDataSetup(transactionByOrg);
	}

	componentDidUpdate(prevProps) {
		const { transactionByOrg } = this.props;
		if (transactionByOrg !== prevProps.transactionByOrg) {
			this.orgDataSetup(transactionByOrg);
		}
	}

	orgDataSetup = orgData => {
		if (!Array.isArray(orgData) || orgData.length === 0) {
			this.setState({ data: [] });
			return;
		}
		const temp = orgData.map((element, index) => ({
			value: parseInt(element.count, 10),
			name: element.creator_msp_id,
			fill: getOrgColor(element.creator_msp_id, index)
		}));
		this.setState({ data: temp });
	};

	renderCenterLabel = ({ viewBox }) => {
		const { classes } = this.props;
		const total = this.state.data.reduce((sum, item) => sum + (item.value || 0), 0);
		if (!viewBox || Number.isNaN(total)) {
			return null;
		}
		const { cx, cy } = viewBox;
		return (
			<text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className={classes.chartInnerLabel}>
				{total.toLocaleString()}
			</text>
		);
	};

	render() {
		const { data } = this.state;
		const { classes } = this.props;
		if (!data || data.length === 0) {
			return <div className={classes.emptyState}>No transaction data</div>;
		}
		return (
			<div className={classes.container}>
				<div className={classes.chartWrapper}>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={data}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								startAngle={90}
								endAngle={-270}
								innerRadius={45}
								outerRadius={105}
								paddingAngle={0}
								cornerRadius={0}
								stroke="none"
								labelLine={false}
							>
								{data.map(entry => (
									<Cell key={entry.name} fill={entry.fill} />
								))}
								<Label content={this.renderCenterLabel} position="center" />
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div className={classes.legendWrapper}>
					{data.map(item => (
						<div key={item.name} className={classes.legendItem}>
							<span className={classes.legendSwatch} style={{ backgroundColor: item.fill }} />
							<span className={classes.legendLabel}>{item.name}</span>
						</div>
					))}
				</div>
			</div>
		);
	}
}

OrgPieChart.propTypes = {
	transactionByOrg: transactionByOrgType.isRequired
};

export default withStyles(styles)(OrgPieChart);
