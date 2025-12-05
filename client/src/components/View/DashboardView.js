/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Timeago from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import shortEnglishStrings from 'react-timeago/lib/language-strings/en-short';
import Dialog from '@material-ui/core/Dialog';
import ChartStats from '../Charts/ChartStats';
import OrgPieChart from '../Charts/OrgPieChart';
import BlockDetails from './BlockDetails';
import TransactionDetails from './TransactionDetails';
import IconLatestBlock from '../../static/images/icon_latest_block.svg';
import IconArrowUpRight from '../../static/images/icon_arrow_up_right.svg';
import {
	blockListSearchType,
	dashStatsType,
	peerListType,
	txnListType,
	blockSearchType,
	blockHashTypee,
	blockTxnIdType,
	transactionByOrgType
} from '../types';
import SearchByQuery from '../Lists/SearchByQuery';
import { connect } from 'react-redux';
import { currentChannelSelector } from '../../state/redux/charts/selectors';

import { transactionListSelector, transactionSelector } from '../../state/redux/tables/selectors';
import { tableOperations } from '../../state/redux/tables';
import IconBlocks from '../../static/images/icon_blocks.svg';
import IconTransactions from '../../static/images/icon_transactions.svg';
import IconNodes from '../../static/images/icon_nodes.svg';
import IconChaincodes from '../../static/images/icon_chaincodes.svg';

const { txnList, blockSearch, blockHashList, blockTxnIdList } = tableOperations;
const baseShortFormatter = buildFormatter(shortEnglishStrings);
const shortFormatter = (...args) => `${baseShortFormatter(...args)} ago`;

/* istanbul ignore next */
const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		background: {
			backgroundColor: dark ? 'rgb(36, 32, 54)' : '#FFFFFF'
		},
		view: {
			paddingTop: 12,
			paddingBottom: 24,
			width: '100%',
			marginLeft: 'auto',
			marginRight: 'auto',
			boxSizing: 'border-box'
		},
		searchRow: {
			width: '100%',
			maxWidth: 1400,
			margin: '0 auto -12px'
		},
		statsRow: {
			width: '100%',
			maxWidth: 1400,
			margin: '16px auto',
			display: 'flex',
			flexWrap: 'wrap',
			gap: 12,
			justifyContent: 'space-between',
			'@media (max-width: 768px)': {
				gap: 8
			}
		},
		statsCard: {
			maxWidth: 'calc(25% - 9px)',
			minHeight: 92,
			backgroundColor: 'rgba(59, 130, 246, 0.05)',
			borderRadius: 8,
			padding: 24,
			display: 'flex',
			alignItems: 'center',
			gap: 24,
			boxSizing: 'border-box',
			flex: '0 0 calc(25% - 9px)',
			'@media (max-width: 1500px)': {
				maxWidth: 'calc(50% - 6px)',
				flex: '0 0 calc(50% - 6px)'
			},
			'@media (max-width: 900px)': {
				maxWidth: '100%',
				flex: '0 0 100%'
			}
		},
		statsIcon: {
			width: 40,
			height: 40,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexShrink: 0
		},
		statsIconImage: {
			width: 32,
			height: 32,
			objectFit: 'contain'
		},
		statsContent: {
			display: 'flex',
			flexDirection: 'column',
			gap: 4
		},
		statsLabel: {
			color: '#757575',
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 12,
			lineHeight: '16px'
		},
		statsValue: {
			color: dark ? '#ffffff' : '#212121',
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 20,
			lineHeight: '28px',
			fontWeight: 600
		},
		chartsRow: {
			width: '100%',
			maxWidth: 1400,
			margin: '16px auto',
			display: 'flex',
			flexWrap: 'wrap',
			gap: 12,
			justifyContent: 'space-between',
			alignItems: 'stretch',
			'@media (max-width: 1200px)': {
				flexDirection: 'column',
				gap: 16
			}
		},
		pieCard: {
			flex: '0 0 calc(50% - 6px)',
			maxWidth: 'calc(50% - 6px)',
			minWidth: 0,
			height: 325,
			borderRadius: 8,
			border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : '#E5E7EB'}`,
			backgroundColor: dark ? '#2b2940' : '#ffffff',
			display: 'flex',
			flexDirection: 'column',
			padding: 0,
			boxSizing: 'border-box',
			boxShadow: dark ? '0 12px 24px rgba(0,0,0,0.25)' : '0px 12px 24px rgba(59, 130, 246, 0.08)',
			'@media (max-width: 1200px)': {
				flex: '0 0 100%',
				maxWidth: '100%',
				width: '100%'
			}
		},
		pieHeader: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '16px 24px',
			borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`,
			minHeight: 56
		},
		pieHeaderTitle: {
			display: 'flex',
			alignItems: 'center',
			gap: 12,
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 16,
			fontWeight: 600,
			color: dark ? '#ffffff' : '#212121'
		},
		pieBody: {
			flex: '1 0 0',
			padding: '24px 24px 8px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		},
		dataRow: {
			width: '100%',
			maxWidth: 1400,
			margin: '16px auto 32px',
			display: 'flex',
			flexWrap: 'wrap',
			gap: 12,
			alignItems: 'stretch',
			'@media (max-width: 1200px)': {
				flexDirection: 'column'
			}
		},
		dataColumnLeft: {
			display: 'flex',
			flexDirection: 'column',
			gap: 12,
			flex: '0 0 341px',
			maxWidth: '100%',
			'@media (max-width: 1200px)': {
				flex: '1 1 100%'
			}
		},
		dataColumnRight: {
			display: 'flex',
			flexDirection: 'column',
			gap: 12,
			flex: 1,
			minWidth: 0,
			'@media (max-width: 1200px)': {
				flex: '1 1 100%'
			}
		},
		latestCard: {
			width: '100%',
			maxWidth: '100%',
			minHeight: 380,
			borderRadius: 8,
			border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`,
			backgroundColor: dark ? '#1f1c2f' : '#ffffff',
			boxShadow: dark ? '0 12px 24px rgba(0,0,0,0.4)' : '0px 12px 24px rgba(59, 130, 246, 0.08)',
			display: 'flex',
			flexDirection: 'column',
			overflow: 'hidden',
			'@media (max-width: 1200px)': {
				width: '100%'
			},
			'@media (max-width: 768px)': {
				minHeight: 'auto'
			}
		},
		latestHeader: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '16px 24px',
		},
		latestTitleRow: {
			display: 'flex',
			alignItems: 'center',
			gap: 12,
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 16,
			fontWeight: 600,
			color: dark ? '#F5F5F5' : '#212121'
		},
		latestIcon: {
			width: 24,
			height: 24
		},
		viewAllButton: {
			display: 'flex',
			alignItems: 'center',
			gap: 8,
			padding: '8px 12px',
			borderRadius: 4,
			border: `0.5px solid ${dark ? 'rgba(255,255,255,0.2)' : '#E0E0E0'}`,
			background: 'transparent',
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14,
			fontWeight: 600,
			color: dark ? '#F5F5F5' : '#212121',
			cursor: 'pointer'
		},
		latestBodyList: {
			display: 'flex',
			flexDirection: 'column',
			flex: '1 1 0'
		},
		latestBody: {
			padding: '16px 24px',
			display: 'flex',
			alignItems: 'flex-start',
			gap: 0,
			borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`,
			'@media (max-width: 768px)': {
				flexDirection: 'column',
				gap: 12
			}
		},
		latestMain: {
			flex: '1 1 auto',
			display: 'flex',
			flexDirection: 'column',
			gap: 8
		},
		latestBlockNumber: {
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 20,
			fontWeight: 600,
			color: '#3B82F6'
		},
		latestFieldStack: {
			display: 'flex',
			flexDirection: 'column',
			gap: 4
		},
		latestFieldRow: {
			display: 'flex',
			alignItems: 'center',
			gap: 16
		},
		latestFieldLabel: {
			width: 32,
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14,
			color: dark ? '#BFBFBF' : '#424242'
		},
		latestHeaderLabel: {
			fontFamily: '"JetBrains Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace',
			fontSize: 14,
			color: dark ? '#F5F5F5' : '#212121 !important',
			fontWeight: '500 !important',
			textTransform: 'none'
		},
		latestFieldValue: {
			flex: 1,
			fontFamily: '"Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
			fontSize: 14,
			color: dark ? '#E5E7EB' : '#212121',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap'
		},
		latestHashValue: {
			flex: 1,
			fontFamily: '"JetBrains Mono", monospace',
			fontSize: 14,
			color: '#3B82F6',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			textDecoration: 'none',
			'&:hover': {
				textDecoration: 'underline'
			}
		},
		latestTxValue: {
			flex: 1,
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14,
			color: '#3B82F6',
			textDecoration: 'none',
			'&:hover': {
				textDecoration: 'underline'
			}
		},
		latestTime: {
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14,
			color: dark ? '#E5E7EB' : '#212121',
			textAlign: 'left',
			alignSelf: 'flex-start',
			lineHeight: '20px',
			'@media (max-width: 768px)': {
				textAlign: 'left',
				marginLeft: 0
			}
		},
		latestEmpty: {
			padding: '32px 24px',
			textAlign: 'center',
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14,
			color: dark ? '#BFBFBF' : '#6B7280'
		},
		peerCard: {
			width: 341,
			maxWidth: '100%',
			minHeight: 276,
			maxHeight: 276,
			borderRadius: 8,
			border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`,
			backgroundColor: dark ? '#1f1c2f' : '#ffffff',
			boxShadow: dark ? '0 12px 24px rgba(0,0,0,0.4)' : '0px 12px 24px rgba(59, 130, 246, 0.08)',
			display: 'flex',
			flexDirection: 'column',
			overflow: 'hidden',
			'@media (max-width: 1200px)': {
				width: '100%'
			},
			'@media (max-width: 768px)': {
				maxHeight: 'none',
				minHeight: 'auto'
			}
		},
		peerHeader: {
			padding: '16px 24px',
			borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`,
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 16,
			fontWeight: 600,
			color: dark ? '#F5F5F5' : '#212121'
		},
		peerList: {
			display: 'flex',
			flexDirection: 'column',
			maxHeight: 244,
			overflowY: 'auto'
		},
		peerRow: {
			padding: '16px 24px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E0E0E0'}`,
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14
		},
		peerRowPrimary: {
			backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#F5F5F5',
			color: dark ? '#F3F4F6' : '#212121'
		},
		peerRowAlt: {
			backgroundColor: dark ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
			color: dark ? '#E5E7EB' : '#212121'
		},
		peerStatusGroup: {
			display: 'flex',
			alignItems: 'center',
			gap: 8
		},
		peerStatusDot: {
			width: 10,
			height: 10,
			borderRadius: '50%'
		},
		peerStatusUp: {
			backgroundColor: '#22C55E'
		},
		peerStatusDown: {
			backgroundColor: '#EF4444'
		},
		peerEmpty: {
			padding: '32px 24px',
			textAlign: 'center',
			fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14,
			color: dark ? '#BFBFBF' : '#6B7280'
		},
		section: {
			minWidth: 280,
			height: 335,
			marginBottom: '2%',
			color: dark ? '#ffffff' : undefined,
			backgroundColor: dark ? '#3c3558' : '#ffffff',
			boxShadow: dark ? undefined : '0px 0px 8.2px 4px rgba(59, 130, 246, 0.1)',
			borderRadius: 8
		},
		latestCardWide: {
			width: '100%',
			height: '100%',
			borderRadius: 8,
			border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`,
			backgroundColor: dark ? '#1f1c2f' : '#ffffff',
			boxShadow: dark ? '0 12px 24px rgba(0,0,0,0.4)' : '0px 12px 24px rgba(59, 130, 246, 0.08)',
			display: 'flex',
			flexDirection: 'column',
			overflow: 'hidden',
			flex: 1
		},
		latestRowWide: {
			display: 'flex',
			alignItems: 'center',
			width: '100%',
			gap: 16,
			'@media (max-width: 1200px)': {
				flexWrap: 'wrap',
				rowGap: 12
			}
		},
		latestColumn: {
			display: 'flex',
			flexDirection: 'column',
			gap: 4,
			flex: 1,
			minWidth: 0,
			'@media (max-width: 1200px)': {
				flex: '1 1 48%',
				minWidth: '48%'
			},
			'@media (max-width: 768px)': {
				flex: '1 1 100%',
				minWidth: '100%'
			}
		},
		latestColumnSmall: {
			display: 'flex',
			flexDirection: 'column',
			gap: 4,
			flex: '0 0 100px',
			minWidth: 0,
			'@media (max-width: 1200px)': {
				flex: '1 1 48%',
				minWidth: '48%',
				textAlign: 'left'
			},
			'@media (max-width: 768px)': {
				flex: '1 1 100%',
				minWidth: '100%'
			}
		},
		latestColumnMedium: {
			display: 'flex',
			flexDirection: 'column',
			gap: 4,
			flex: '0 0 150px',
			minWidth: 0,
			'@media (max-width: 1200px)': {
				flex: '1 1 48%',
				minWidth: '48%'
			},
			'@media (max-width: 768px)': {
				flex: '1 1 100%',
				minWidth: '100%'
			}
		},

	};
};

export class DashboardView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications: [],
			hasDbError: false,
			dialogOpenBlock: false,
			dialogOpenTransaction: false,
			selectedBlock: null
		};
	}

	componentDidMount() {
		const {
			blockListSearch,
			dashStats,
			peerList,
			transactionByOrg,
			blockActivity,
			currentChannel,
			getTransactionList
		} = this.props;

		if (
			blockListSearch === undefined ||
			dashStats === undefined ||
			peerList === undefined ||
			blockActivity === undefined ||
			transactionByOrg === undefined
		) {
			this.setState({ hasDbError: true });
		}

		this.setNotifications(blockActivity);
		if (currentChannel) {
			getTransactionList(currentChannel, { page: 1, size: 5 });
		}
	}

	componentDidUpdate(prevProps) {
		const { blockActivity, currentChannel, getTransactionList } = this.props;
		if (blockActivity !== prevProps.blockActivity) {
			this.setNotifications(blockActivity);
		}
		if (currentChannel !== prevProps.currentChannel) {
			getTransactionList(currentChannel, { page: 1, size: 5 });
		}
	}

	setNotifications = blockList => {
		const notificationsArr = [];
		if (blockList !== undefined) {
			for (let i = 0; i < 3 && blockList && blockList[i]; i += 1) {
				const block = blockList[i];
				const notify = {
					title: `Block ${block.blocknum} `,
					type: 'block',
					time: block.createdt,
					txcount: block.txcount,
					datahash: block.datahash,
					blockhash: block.blockhash,
					channelName: block.channelname
				};
				notificationsArr.push(notify);
			}
		}
		this.setState({ notifications: notificationsArr });
	};

	handleOpenBlockDialog = block => {
		if (!block) return;
		this.setState({ dialogOpenBlock: true, selectedBlock: block });
	};

	handleCloseBlockDialog = () => {
		this.setState({ dialogOpenBlock: false, selectedBlock: null });
	};

	handleOpenTransactionDialog = async txhash => {
		const { currentChannel, getTransaction } = this.props;
		await getTransaction(currentChannel, txhash);
		this.setState({ dialogOpenTransaction: true });
	};

	handleCloseTransactionDialog = () => {
		this.setState({ dialogOpenTransaction: false });
	};

	handleViewAllBlocks = () => {
		window.location.hash = '#/blocks';
	};

	render() {
		const {
			dashStats,
			peerList,
			txnList,
			blockSearch,
			blockHashList,
			blockTxnIdList,
			blockActivity,
			transactionByOrg,
			transactionList
		} = this.props;
		const { hasDbError, dialogOpenBlock, dialogOpenTransaction, selectedBlock } = this.state;
		var searchError = '';
		if (typeof txnList === 'string') {
			searchError = 'Txn not found';
		} else if (typeof blockSearch === 'string') {
			searchError = 'Block not found';
		} else if (typeof blockHashList === 'string') {
			searchError = 'Block not found';
		} else if (typeof blockTxnIdList === 'string') {
			searchError = 'Block not found';
		}
		if (hasDbError) {
			return (
				<div
					style={{
						height: '100vh',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<h1>
						Please verify your network configuration, database configuration and try
						again
					</h1>
				</div>
			);
		}
		const { classes } = this.props;
		const statsData = [
			{
				label: 'Blocks',
				value: dashStats?.latestBlock,
				iconSrc: IconBlocks
			},
			{
				label: 'Transactions',
				value: dashStats?.txCount,
				iconSrc: IconTransactions
			},
			{
				label: 'Nodes',
				value: dashStats?.peerCount,
				iconSrc: IconNodes
			},
			{
				label: 'Chaincodes',
				value: dashStats?.chaincodeCount,
				iconSrc: IconChaincodes
			}
		];
		const formatStatValue = value => {
			if (value === null || value === undefined || value === '') {
				return '--';
			}
			if (typeof value === 'number') {
				return value.toLocaleString();
			}
			const numericValue = Number(value);
			if (!Number.isNaN(numericValue)) {
				return numericValue.toLocaleString();
			}
			return value;
		};
		const formatHash = hash => {
			if (!hash || typeof hash !== 'string') return '--';
			if (hash.length <= 24) return hash;
			return `${hash.slice(0, 24)}…`;
		};

		const latestBlocks = Array.isArray(blockActivity) ? blockActivity.slice(0, 3) : [];
		const peerEntries = Array.isArray(peerList)
			? peerList
				.map(peer => ({
					name: peer.server_hostname || peer.name || peer.serverHostName,
					status: peer.status
				}))
				.filter(p => p.name)
			: [];
		const latestTransactions = Array.isArray(transactionList) ? transactionList.slice(0, 5) : [];

		return (
			<div className={classes.background}>
				<div className={classes.view}>
					<div className={classes.searchRow}>
						<SearchByQuery
							getTxnList={this.props.getTxnList}
							getBlockSearch={this.props.getBlockSearch}
							getBlockHash={this.props.getBlockHash}
							getBlockByTxnId={this.props.getBlockByTxnId}
							currentChannel={this.props.currentChannel}
							txnList={txnList}
							blockSearch={blockSearch}
							blockHashList={blockHashList}
							blockTxnIdList={blockTxnIdList}
							searchError={searchError}
						/>
					</div>
					<div className={classes.statsRow}>
						{statsData.map(({ label, value, iconSrc }) => (
							<div key={label} className={classes.statsCard}>
								<div className={classes.statsIcon}>
									<img src={iconSrc} alt={`${label} icon`} className={classes.statsIconImage} />
								</div>
								<div className={classes.statsContent}>
									<div className={classes.statsLabel}>{label}</div>
									<div className={classes.statsValue}>{formatStatValue(value)}</div>
								</div>
							</div>
						))}
					</div>
					<div className={classes.chartsRow}>
						<ChartStats />
						<Card className={classes.pieCard}>
							<div className={classes.pieHeader}>
								<div className={classes.pieHeaderTitle}>
									<span>Transactions by Organization</span>
								</div>
							</div>
							<div className={classes.pieBody}>
								<OrgPieChart transactionByOrg={transactionByOrg} />
							</div>
						</Card>
					</div>
					<div className={classes.dataRow}>
						<div className={classes.dataColumnLeft}>
							<Card className={classes.latestCard}>
								<div className={classes.latestHeader}>
									<div className={classes.latestTitleRow}>
										<img
											src={IconLatestBlock}
											alt="Latest blocks"
											className={classes.latestIcon}
										/>
										<span>Latest Blocks</span>
									</div>
									<button
										type="button"
										className={classes.viewAllButton}
										onClick={this.handleViewAllBlocks}
									>
										View all
										<img
											src={IconArrowUpRight}
											alt="View all arrow"
											width={16}
											height={16}
										/>
									</button>
								</div>
								{latestBlocks.length > 0 ? (
									<div className={classes.latestBodyList}>
										{latestBlocks.map(block => (
											<div
												key={`${block.blocknum}-${block.blockhash}`}
												className={classes.latestBody}
											>
												<div className={classes.latestMain}>
													<div className={classes.latestBlockNumber}>
														{block.blocknum ?? '--'}
													</div>
													<div className={classes.latestFieldStack}>
														<div className={classes.latestFieldRow}>
															<span className={classes.latestFieldLabel}>Tx</span>
															<a
																href="#/"
																onClick={e => {
																	e.preventDefault();
																	this.handleOpenBlockDialog(block);
																}}
																className={classes.latestTxValue}
															>
																{block.txcount ?? '--'}
															</a>
														</div>
														<div className={classes.latestFieldRow}>
															<span className={classes.latestFieldLabel}>Hash</span>
															<a
																href="#/"
																onClick={e => {
																	e.preventDefault();
																	this.handleOpenBlockDialog(block);
																}}
																className={classes.latestHashValue}
															>
																{formatHash(block.blockhash || block.datahash)}
															</a>
														</div>
													</div>
												</div>
												<div style={{ marginLeft: '-10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
													<span className={classes.latestTime}>
														{block.createdt ? (
															<Timeago date={block.createdt} live={false} formatter={shortFormatter} />
														) : (
															'--'
														)}
													</span>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className={classes.latestEmpty}>No recent block activity</div>
								)}
							</Card>
							<Card className={classes.peerCard}>
								<div className={classes.peerHeader}>Peer name</div>
								{peerEntries.length === 0 ? (
									<div className={classes.peerEmpty}>No peer nodes detected</div>
								) : (
									<div className={classes.peerList}>
										{peerEntries.map((peer, index) => (
											<div
												key={peer.name}
												className={`${classes.peerRow} ${index % 2 === 0
													? classes.peerRowPrimary
													: classes.peerRowAlt
													}`}
											>
												<span>{peer.name}</span>
												<div className={classes.peerStatusGroup}>
													<span
														className={`${classes.peerStatusDot} ${peer.status === 'DOWN'
															? classes.peerStatusDown
															: classes.peerStatusUp
															}`}
													/>
												</div>
											</div>
										))}
									</div>
								)}
							</Card>
						</div>
						<div className={classes.dataColumnRight}>
							<Card className={classes.latestCardWide}>
								<div className={classes.latestHeader}>
									<div className={classes.latestTitleRow}>
										<img
											src={IconTransactions}
											alt="Latest transactions"
											className={classes.latestIcon}
										/>
										<span>Latest Transactions</span>
									</div>
									<button
										type="button"
										className={classes.viewAllButton}
										onClick={() => window.location.hash = '#/transactions'}
									>
										View all
										<img
											src={IconArrowUpRight}
											alt="View all arrow"
											width={16}
											height={16}
										/>
									</button>
								</div>
								{latestTransactions.length > 0 ? (
									<div className={classes.latestBodyList}>
										<div className={classes.latestBody}>
											<div className={classes.latestRowWide}>
												<div className={classes.latestColumn}>
													<span className={classes.latestHeaderLabel}>Creator</span>
												</div>
												<div className={classes.latestColumn}>
													<span className={classes.latestHeaderLabel}>Channel</span>
												</div>
												<div className={classes.latestColumn} style={{ flex: 1.5 }}>
													<span className={classes.latestHeaderLabel}>TxId</span>
												</div>
												<div className={classes.latestColumn}>
													<span className={classes.latestHeaderLabel}>Chaincode</span>
												</div>
												<div className={classes.latestColumnSmall}>
													<span className={classes.latestHeaderLabel}>Time</span>
												</div>
											</div>
										</div>
										{latestTransactions.map(txn => (
											<div
												key={txn.txhash}
												className={classes.latestBody}
											>
												<div className={classes.latestRowWide}>
													<div className={classes.latestColumn}>
														<span className={classes.latestFieldValue} title={txn.creator_msp_id}>
															{txn.creator_msp_id}
														</span>
													</div>
													<div className={classes.latestColumn}>
														<span className={classes.latestFieldValue} title={txn.channelname || this.props.currentChannel}>
															{txn.channelname || this.props.currentChannel}
														</span>
													</div>
													<div className={classes.latestColumn} style={{ flex: 1.5 }}>
														<a
															href="#/"
															className={classes.latestHashValue}
															onClick={e => {
																e.preventDefault();
																this.handleOpenTransactionDialog(txn.txhash);
															}}
															title={txn.txhash}
														>
															{formatHash(txn.txhash)}
														</a>
													</div>
													<div className={classes.latestColumn}>
														<span className={classes.latestFieldValue} title={txn.chaincodename}>
															{txn.chaincodename}
														</span>
													</div>
													<div className={classes.latestColumnSmall}>
														<span className={classes.latestTime}>
															{txn.createdt ? (
																<Timeago date={txn.createdt} live={false} formatter={shortFormatter} />
															) : (
																'--'
															)}
														</span>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className={classes.latestEmpty}>No recent transactions</div>
								)}
							</Card>
						</div>
					</div>
					<Dialog
						open={dialogOpenBlock}
						onClose={this.handleCloseBlockDialog}
						maxWidth={false}
						PaperProps={{
							style: {
								backgroundColor: 'transparent',
								boxShadow: 'none',
								borderRadius: 8
							}
						}}
					>
						{selectedBlock && (
							<BlockDetails
								block={selectedBlock}
								onClose={this.handleCloseBlockDialog}
							/>
						)}
					</Dialog>
					<Dialog
						open={dialogOpenTransaction}
						onClose={this.handleCloseTransactionDialog}
						maxWidth={false}
						PaperProps={{
							style: {
								backgroundColor: 'transparent',
								boxShadow: 'none',
								borderRadius: 8
							}
						}}
					>
						<TransactionDetails
							transaction={this.props.transaction}
							onClose={this.handleCloseTransactionDialog}
						/>
					</Dialog>
				</div>
			</div>
		);
	}
}

DashboardView.propTypes = {
	blockListSearch: blockListSearchType.isRequired,
	dashStats: dashStatsType.isRequired,
	peerList: peerListType.isRequired,
	txnList: txnListType.isRequired,
	blockSearch: blockSearchType.isRequired,
	blockHashList: blockHashTypee.isRequired,
	blockTxnIdList: blockTxnIdType.isRequired,
	transactionByOrg: transactionByOrgType.isRequired
};

const mapStateToProps = state => {
	return {
		currentChannel: currentChannelSelector(state),
		transactionList: transactionListSelector(state),
		transaction: transactionSelector(state)
	};
};
const mapDispatchToProps = {
	getTxnList: txnList,
	getBlockSearch: blockSearch,
	getBlockHash: blockHashList,
	getBlockByTxnId: blockTxnIdList,

	getTransactionList: tableOperations.transactionList,
	getTransaction: tableOperations.transaction
};
const connectedComponent = connect(
	mapStateToProps,
	mapDispatchToProps
)(DashboardView);
export default withStyles(styles)(connectedComponent);
