/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ButtonBase from '@material-ui/core/ButtonBase';
import { chartSelectors, chartOperations } from '../../state/redux/charts';
import TimeChart from './TimeChart';
import IconChartHeader from '../../static/images/icon_chart_header.svg';
import {
	blockPerHourType,
	blockPerMinType,
	currentChannelType,
	getBlocksPerHourType,
	getBlocksPerMinType,
	getTransactionPerHourType,
	getTransactionPerMinType,
	transactionPerHourType,
	transactionPerMinType
} from '../types';

const {
	blockPerHourSelector,
	blockPerMinSelector,
	currentChannelSelector,
	transactionPerHourSelector,
	transactionPerMinSelector
} = chartSelectors;

/* istanbul ignore next */
const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		chartContainer: {
			height: 325,
			minHeight: 325,
			margin: 0,
			padding: '16px 24px',
			borderRadius: 8,
			border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`,
			backgroundColor: dark ? '#2b2940' : '#FFF',
			boxShadow: dark
				? '0 12px 24px rgba(0,0,0,0.25)'
				: '0px 12px 24px rgba(59, 130, 246, 0.08)',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			flex: '0 0 calc(50% - 6px)',
			maxWidth: 'calc(50% - 6px)',
			minWidth: 0,
			boxSizing: 'border-box !important',
			'@media (max-width: 1200px)': {
				flex: '0 0 100%',
				maxWidth: '100%'
			}
		},
		chartHeader: {
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			fontStyle: 'normal',
			fontWeight: 600,
			fontSize: 16,
			gap: 16,
			marginBottom: 12
		},
		headerMeta: {
			display: 'flex',
			alignItems: 'center',
			gap: 12
		},
		headerIcon: {
			width: 24,
			height: 24
		},
		headerTitleButton: {
			display: 'inline-flex',
			alignItems: 'center',
			padding: '4px 0',
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 16,
			fontWeight: 600,
			lineHeight: '28px',
			color: dark ? '#ffffff' : '#212121'
		},
		menuPaper: {
			borderRadius: 8,
			border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`
		},
		menuItem: {
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14,
			fontWeight: 500
		},
		chartBody: {
			flex: 1,
			width: '100%',
			alignSelf: 'stretch',
			marginTop: 12,
			display: 'flex',
			minHeight: 0
		}
	};
};

export class ChartStats extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 'blocks_hour',
			menuAnchor: null
		};
	}

	componentDidMount() {
		this.interVal = setInterval(() => {
			const { currentChannel } = this.props;
			this.syncData(currentChannel);
		}, 60000);
	}

	componentWillUnmount() {
		clearInterval(this.interVal);
	}

	syncData = currentChannel => {
		const {
			getBlocksPerHour,
			getBlocksPerMin,
			getTransactionPerHour,
			getTransactionPerMin
		} = this.props;

		getBlocksPerMin(currentChannel);
		getBlocksPerHour(currentChannel);
		getTransactionPerMin(currentChannel);
		getTransactionPerHour(currentChannel);
	};

	timeDataSetup = (chartData = []) => {
		let dataMax = 0;
		const displayData = chartData.map(data => {
			if (parseInt(data.count, 10) > dataMax) {
				dataMax = parseInt(data.count, 10);
			}

			return {
				datetime: moment(data.datetime)
					.tz(moment.tz.guess())
					.format('HH:mm'),
				count: data.count
			};
		});

		dataMax += 5;

		return {
			displayData,
			dataMax
		};
	};

	toggle = tab => {
		this.setState({
			activeTab: tab
		});
	};

	handleMenuOpen = event => {
		this.setState({ menuAnchor: event.currentTarget });
	};

	handleMenuClose = () => {
		this.setState({ menuAnchor: null });
	};

	render() {
		const { activeTab, menuAnchor } = this.state;
		const {
			blockPerHour,
			blockPerMin,
			transactionPerHour,
			transactionPerMin,
			classes
		} = this.props;

		const tabs = [
			{ id: 'blocks_hour', label: 'Blocks / Hour', data: blockPerHour },
			{ id: 'blocks_min', label: 'Blocks / Min', data: blockPerMin },
			{ id: 'tx_hour', label: 'Transactions / Hour', data: transactionPerHour },
			{ id: 'tx_min', label: 'Transactions / Min', data: transactionPerMin }
		];
		const activeTabConfig = tabs.find(tab => tab.id === activeTab) || tabs[0];

		return (
			<div className={classes.chartContainer}>
				<div className={classes.chartHeader}>
					<div className={classes.headerMeta}>
						<img src={IconChartHeader} alt="Chart icon" className={classes.headerIcon} />
						<ButtonBase
							onClick={this.handleMenuOpen}
							className={classes.headerTitleButton}
						>
							<span>{activeTabConfig.label}</span>
						</ButtonBase>
					</div>
					<Menu
						anchorEl={menuAnchor}
						open={Boolean(menuAnchor)}
						onClose={this.handleMenuClose}
						getContentAnchorEl={null}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
						transformOrigin={{ vertical: 'top', horizontal: 'left' }}
						classes={{ paper: classes.menuPaper }}
					>
						{tabs.map(tab => (
							<MenuItem
								key={tab.id}
								selected={tab.id === activeTab}
								onClick={() => {
									this.toggle(tab.id);
									this.handleMenuClose();
								}}
								className={classes.menuItem}
							>
								{tab.label}
							</MenuItem>
						))}
					</Menu>
				</div>
				<div className={classes.chartBody}>
					<TimeChart chartData={this.timeDataSetup(activeTabConfig.data)} />
				</div>
			</div>
		);
	}
}

ChartStats.propTypes = {
	blockPerHour: blockPerHourType.isRequired,
	blockPerMin: blockPerMinType.isRequired,
	currentChannel: currentChannelType.isRequired,
	getBlocksPerHour: getBlocksPerHourType.isRequired,
	getBlocksPerMin: getBlocksPerMinType.isRequired,
	getTransactionPerHour: getTransactionPerHourType.isRequired,
	getTransactionPerMin: getTransactionPerMinType.isRequired,
	transactionPerHour: transactionPerHourType.isRequired,
	transactionPerMin: transactionPerMinType.isRequired
};

const mapStateToProps = state => {
	return {
		blockPerHour: blockPerHourSelector(state),
		blockPerMin: blockPerMinSelector(state),
		transactionPerHour: transactionPerHourSelector(state),
		transactionPerMin: transactionPerMinSelector(state),
		currentChannel: currentChannelSelector(state)
	};
};

const mapDispatchToProps = {
	getBlocksPerHour: chartOperations.blockPerHour,
	getBlocksPerMin: chartOperations.blockPerMin,
	getTransactionPerHour: chartOperations.transactionPerHour,
	getTransactionPerMin: chartOperations.transactionPerMin
};

const connectedComponent = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChartStats);
export default withStyles(styles)(connectedComponent);
