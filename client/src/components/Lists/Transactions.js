/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import matchSorter from 'match-sorter';
import moment from 'moment';
import ReactTable from '../Styled/Table';
import TransactionDetails from '../View/TransactionDetails';
import DatePicker from '../Styled/DatePicker';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
	currentChannelType,
	getTransactionType,
	transactionListType,
	transactionType
} from '../types';

/* istanbul ignore next */
const monoStack = '"JetBrains Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace';

/* istanbul ignore next */
const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		hash: {
			'&, & li, & ul': {
				overflow: 'visible !important'
			},
			'& .rt-th, & .rt-td': {
				textAlign: 'left !important'
			}
		},
		partialHash: {
			textAlign: 'left',
			position: 'relative !important',
			display: 'inline-block',
			margin: 0,
			padding: 0,
			listStyle: 'none',
			cursor: 'pointer',
			fontFamily: monoStack,
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			maxWidth: '100%'
		},
		customTooltip: {
			backgroundColor: dark ? '#5e558e' : '#000000',
			borderRadius: 8,
			color: '#ffffff',
			fontSize: '12px',
			padding: '8px',
			maxWidth: 'none'
		},
		filterToolbar: {
			display: 'flex',
			flexWrap: 'wrap',
			gap: 16,
			marginBottom: 16,
			marginTop: 16
		},
		toolbarCard: {
			display: 'flex',
			alignItems: 'center',
			height: 48,
			borderRadius: 8,
			border: '1px solid #eeeeee',
			backgroundColor: dark ? '#1f1f29' : '#ffffff',
			padding: '12px 16px'
		},
		searchCard: {
			flex: '1 1 360px',
			gap: 12
		},
		searchInputField: {
			border: 'none',
			outline: 'none',
			flex: 1,
			fontSize: 14,
			background: 'transparent',
			color: dark ? '#f5f5f5' : '#1f1f1f'
		},
		dateCard: {
			flex: '0 0 220px',
			minWidth: 220,
			justifyContent: 'space-between',
			cursor: 'pointer'
		},
		dateRangeValue: {
			fontSize: 14,
			color: dark ? '#f5f5f5' : '#757575',
			fontWeight: 400,
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif'
		},
		dateCardContent: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			width: '100%',
			gap: 8
		},
		chevronIcon: {
			width: 24,
			height: 24,
			color: dark ? '#9e9e9e' : '#9e9e9e',
			flexShrink: 0
		},
		orgCard: {
			flex: '0 0 200px',
			minWidth: 200,
			justifyContent: 'space-between',
			cursor: 'pointer'
		},
		orgCardContent: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			width: '100%',
			gap: 8
		},
		orgValue: {
			fontSize: 14,
			color: dark ? '#f5f5f5' : '#757575',
			fontWeight: 400,
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			lineHeight: '20px',
			flex: 1,
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap'
		},
		orgMenu: {
			'& .MuiPaper-root': {
				borderRadius: 8,
				marginTop: 4,
				boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
			}
		},
		orgMenuItem: {
			fontSize: 14,
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			padding: '8px 16px',
			'&:hover': {
				backgroundColor: dark ? '#2a2a35' : '#f5f5f5'
			}
		},
		clearFilterButton: {
			height: 48,
			borderRadius: 8,
			backgroundColor: '#3b82f6',
			border: 'none',
			padding: '0 24px',
			fontWeight: 500,
			color: '#ffffff',
			cursor: 'pointer',
			textTransform: 'none'
		},
		datePopover: {
			padding: 16,
			maxWidth: 360,
			'& .react-datepicker-popper': {
				position: 'static !important',
				transform: 'none !important',
				zIndex: 'auto !important'
			},
			'& .react-datepicker__input-container': {
				display: 'block'
			}
		},
		datePopoverRow: {
			display: 'flex',
			flexDirection: 'column',
			gap: 8,
			marginBottom: 12
		},
		datePopoverActions: {
			display: 'flex',
			justifyContent: 'flex-end',
			gap: 8,
			marginTop: 8
		},
		dateLabel: {
			fontSize: 14,
			fontWeight: 600,
			marginBottom: 4,
			color: dark ? '#f5f5f5' : '#333'
		},
		searchRight: {
			width: 27,
			height: 24,
			border: '1px solid #E0E0E0',
			borderRadius: 4,
			padding: '2px 10px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: 'transparent',
			boxSizing: 'border-box',
			flexShrink: 0,
			marginLeft: 8
		},
		slashText: {
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 12,
			lineHeight: '24px',
			color: dark ? '#f5f5f5' : '#212121',
			fontWeight: 400,
			margin: 0,
			padding: 0,
			height: 24,
			display: 'flex',
			alignItems: 'center'
		}
	};
};
let timer;

export class Transactions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,
			search: false,
			to: moment(),
			orgs: [],
			options: [],
			filtered: [],
			sorted: [],
			err: false,
			from: moment().subtract(1, 'days'),
			//transactionId: '',
			directLinkSearchResultsFlag: false,
			directLinkDialogDoneFlag: false,
			page: 0,
			rowsPerPage: 10,
			searchClick: false,
			queryFlag: false,
			defaultQuery: true,
			transactionSearchKeyword: '',
			dateAnchorEl: null,
			orgAnchorEl: null
		};
		this.searchInputRef = React.createRef();
	}

	componentDidMount() {
		document.addEventListener('keydown', this.handleKeyDown);
		const { getTransaction } = this.props;
		if (this.props.transactionId) {
			getTransaction('ChannelNotSpecified', this.props.transactionId);
			this.setState({ directLinkSearchResultsFlag: true });
		}
		// const { transactionList } = this.props;
		const selection = {};
		// transactionList.forEach(element => {
		// 	selection[element.blocknum] = false;
		// });
		const opts = [];
		this.props.transactionByOrg.forEach(val => {
			opts.push({ label: val.creator_msp_id, value: val.creator_msp_id });
		});
		this.setState({ selection, options: opts, defaultQuery: true });
		this.handleSearch();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			this.state.search &&
			this.props.currentChannel !== prevProps.currentChannel
		) {
			if (this.interval !== undefined) {
				clearInterval(this.interval);
			}
			this.interval = setInterval(() => {
				this.searchTransactionList(this.props.currentChannel);
			}, 60000);
			this.searchTransactionList(this.props.currentChannel);
		}
		if (
			prevState.page !== this.state.page ||
			prevState.rowsPerPage !== this.state.rowsPerPage ||
			this.state.searchClick
		) {
			this.setState({ searchClick: false });
			this.handleSearch();
		}
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown);
		clearInterval(this.interval);
		clearTimeout(timer);
		if (this.props.transactionId) {
			this.props.removeTransactionId();
		}
	}

	handleKeyDown = event => {
		if (event.key === '/' && document.activeElement !== this.searchInputRef.current) {
			event.preventDefault();
			this.searchInputRef.current.focus();
		}
	};

	queueSearchRefresh = (options = {}) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			this.setState({
				page: 0,
				searchClick: true,
				...options
			});
		}, 300);
	};

	handleSearchSubmit = async e => {
		if (e) e.preventDefault();
		// Implement specific transaction search logic here if needed, 
		// currently it seems to rely on the general list search with filters
		this.queueSearchRefresh({ queryFlag: true, defaultQuery: false });
	};

	handleTransactionSearchChange = event => {
		this.setState({ transactionSearchKeyword: event.target.value });
	};

	filterTransactionList = list => {
		if (!Array.isArray(list)) return list;
		const keyword = this.state.transactionSearchKeyword.trim().toLowerCase();
		if (!keyword) return list;
		return list.filter(item => {
			const tokens = [
				item.txhash ? item.txhash.toLowerCase() : '',
				item.channelname ? item.channelname.toLowerCase() : '',
				item.creator_msp_id ? item.creator_msp_id.toLowerCase() : '',
				item.type ? item.type.toLowerCase() : '',
				item.chaincodename ? item.chaincodename.toLowerCase() : ''
			];
			return tokens.some(val => val.includes(keyword));
		});
	};

	handleDateTriggerClick = event => {
		event.preventDefault();
		event.stopPropagation();
		const target = event.currentTarget;
		this.setState(prevState => ({
			dateAnchorEl: prevState.dateAnchorEl ? null : target
		}));
	};

	handleDateRangeClose = () => {
		if (document.activeElement && document.activeElement.blur) {
			document.activeElement.blur();
		}
		this.setState({ dateAnchorEl: null });
	};

	handleFromDateChange = date => {
		if (!date) return;
		if (date > this.state.to) {
			this.setState({ err: true, from: date });
			return;
		}
		this.setState({ from: date, err: false }, () =>
			this.queueSearchRefresh({ queryFlag: true, defaultQuery: false })
		);
	};

	handleToDateChange = date => {
		if (!date) return;
		if (date < this.state.from) {
			this.setState({ err: true, to: date });
			return;
		}
		this.setState({ to: date, err: false }, () =>
			this.queueSearchRefresh({ queryFlag: true, defaultQuery: false })
		);
	};

	getDateRangeLabel = () => {
		const fromLabel = this.state.from ? moment(this.state.from).format('DD/MM/YYYY') : '--';
		const toLabel = this.state.to ? moment(this.state.to).format('DD/MM/YYYY') : '--';
		return `${fromLabel} - ${toLabel}`;
	};

	handleOrgTriggerClick = event => {
		event.preventDefault();
		event.stopPropagation();
		const target = event.currentTarget;
		this.setState(prevState => ({
			orgAnchorEl: prevState.orgAnchorEl ? null : target
		}));
	};

	handleOrgMenuClose = () => {
		this.setState({ orgAnchorEl: null });
	};

	handleOrgToggle = orgValue => {
		const { orgs } = this.state;
		const newOrgs = orgs.includes(orgValue)
			? orgs.filter(o => o !== orgValue)
			: [...orgs, orgValue];
		this.setState({ orgs: newOrgs }, () =>
			this.queueSearchRefresh({ queryFlag: true, defaultQuery: false })
		);
	};

	handleCustomRender(selected, options) {
		if (selected.length === 0) {
			return 'Select Orgs';
		}
		if (selected.length === options.length) {
			return 'All Orgs Selected';
		}

		return selected.join(',');
	}

	searchTransactionList = async channel => {
		let pageParams = { page: this.state.page + 1, size: this.state.rowsPerPage };
		let query = '';
		if (this.state.queryFlag) {
			query = this.state.from
				? `from=${new Date(this.state.from).toString()}&to=${new Date(
					this.state.to
				).toString()}`
				: ``;
			for (let i = 0; i < this.state.orgs.length; i++) {
				query += `&orgs=${this.state.orgs[i]}`;
			}
			if (this.state.transactionSearchKeyword) {
				query += `&hash=${this.state.transactionSearchKeyword}`;
			}
			this.setState({ queryFlag: false });
		} else if (this.state.defaultQuery) {
			query = '';
			this.setState({ defaultQuery: false });
		} else {
			query = this.props.transactionListSearchQuery;
		}
		let channelhash = this.props.currentChannel;
		if (channel !== undefined) {
			channelhash = channel;
		}
		await this.props.getTransactionListSearch(channelhash, query, pageParams);
	};

	handleDialogOpen = async tid => {
		const { currentChannel, getTransaction } = this.props;
		await getTransaction(currentChannel, tid);
		this.setState({ dialogOpen: true });
		if (this.props.transactionId) {
			this.setState({ directLinkDialogDoneFlag: true });
		}
	};

	handleMultiSelect = value => {
		this.setState({ orgs: value });
	};

	handleDialogClose = () => {
		this.setState({ dialogOpen: false });
	};

	handleSearch = async () => {
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
		this.interval = setInterval(() => {
			this.searchTransactionList();
		}, 60000);
		await this.searchTransactionList();
		this.setState({ search: true });
		if (this.props.transactionId) {
			this.setState({ directLinkSearchResultsFlag: false });
			const { getTransaction } = this.props;
			await getTransaction('ChannelNotSpecified', 'TransactionNotSpecified');
		}
	};

	handleClearSearch = () => {
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
		this.setState({
			to: moment(),
			orgs: [],
			err: false,
			from: moment().subtract(1, 'days'),
			transactionSearchKeyword: '',
			filtered: [],
			sorted: [],
			defaultQuery: true,
			queryFlag: false,
			dateAnchorEl: null,
			orgAnchorEl: null
		}, () => this.queueSearchRefresh());
	};

	handleEye = (row, val) => {
		const { selection } = this.state;
		const data = Object.assign({}, selection, { [row.index]: !val });
		this.setState({ selection: data });
	};
	handlePageChange = (_e, page) => {
		this.setState({ page: page });
	};
	handleRowsChange = e => {
		this.setState({ page: 0, rowsPerPage: e.target.value });
	};

	render() {
		const { classes } = this.props;
		const {
			dateAnchorEl,
			orgAnchorEl,
			from,
			to,
			orgs,
			options,
			transactionSearchKeyword
		} = this.state;
		const dateOpen = Boolean(dateAnchorEl);
		const orgOpen = Boolean(orgAnchorEl);

		const columnHeaders = [
			{
				Header: () => <div style={{ textAlign: 'left' }}>Creator</div>,
				accessor: 'creator_msp_id',
				Cell: row => (
					<div style={{ textAlign: 'left' }}>
						{row.value}
					</div>
				),
				filterMethod: (filter, rows) =>
					matchSorter(
						rows,
						filter.value,
						{ keys: ['creator_msp_id'] },
						{ threshold: matchSorter.rankings.SIMPLEMATCH }
					),
				filterAll: true
			},
			{
				Header: () => <div style={{ textAlign: 'left' }}>Channel Name</div>,
				accessor: 'channelname',
				Cell: row => (
					<div style={{ textAlign: 'left' }}>
						{row.value}
					</div>
				),
				filterMethod: (filter, rows) =>
					matchSorter(
						rows,
						filter.value,
						{ keys: ['channelname'] },
						{ threshold: matchSorter.rankings.SIMPLEMATCH }
					),
				filterAll: true
			},
			{
				Header: () => <div style={{ textAlign: 'left' }}>Tx Id</div>,
				accessor: 'txhash',
				className: classes.hash,
				Cell: row => (
					<div style={{ textAlign: 'left' }}>
						<a
							data-command="transaction-partial-hash"
							className={classes.partialHash}
							onClick={() => this.handleDialogOpen(row.value)}
							href="#/transactions"
						>
							<Tooltip
								title={row.value}
								placement="top"
								classes={{ tooltip: classes.customTooltip }}
							>
								<span>
									{row.value}
								</span>
							</Tooltip>
						</a>
					</div>
				),
				filterMethod: (filter, rows) =>
					matchSorter(
						rows,
						filter.value,
						{ keys: ['txhash'] },
						{ threshold: matchSorter.rankings.SIMPLEMATCH }
					),
				filterAll: true
			},
			{
				Header: () => <div style={{ textAlign: 'left' }}>Type</div>,
				accessor: 'type',
				Cell: row => (
					<div style={{ textAlign: 'left' }}>
						{row.value}
					</div>
				),
				filterMethod: (filter, rows) =>
					matchSorter(
						rows,
						filter.value,
						{ keys: ['type'] },
						{ threshold: matchSorter.rankings.SIMPLEMATCH }
					),
				filterAll: true
			},
			{
				Header: () => <div style={{ textAlign: 'left' }}>Chaincode</div>,
				accessor: 'chaincodename',
				Cell: row => (
					<div style={{ textAlign: 'left' }}>
						{row.value}
					</div>
				),
				filterMethod: (filter, rows) =>
					matchSorter(
						rows,
						filter.value,
						{ keys: ['chaincodename'] },
						{ threshold: matchSorter.rankings.SIMPLEMATCH }
					),
				filterAll: true
			},
			{
				Header: () => <div style={{ textAlign: 'left' }}>Timestamp</div>,
				accessor: 'createdt',
				Cell: row => (
					<div style={{ textAlign: 'left' }}>
						{moment(row.value).format('HH:mm:ss - DD/MM/YYYY')}
					</div>
				),
				filterMethod: (filter, rows) =>
					matchSorter(
						rows,
						filter.value,
						{ keys: ['createdt'] },
						{ threshold: matchSorter.rankings.SIMPLEMATCH }
					),
				filterAll: true
			}
		];

		const { transaction } = this.props;
		const { dialogOpen } = this.state;
		let transactionList;
		if (transaction && this.state.directLinkSearchResultsFlag) {
			let tlArray = [{}];
			tlArray[0] = transaction;
			transactionList = tlArray;
			if (!this.state.directLinkDialogDoneFlag) {
				this.handleDialogOpen(this.props.transactionId);
			}
		} else {
			transactionList = this.filterTransactionList(this.props.transactionListSearch);
		}

		return (
			<div>
				<div className={classes.filterToolbar}>
					{/* Search Card */}
					<div className={`${classes.toolbarCard} ${classes.searchCard}`}>
						<SearchIcon style={{ color: '#9e9e9e', width: 20, height: 20 }} />
						<input
							ref={this.searchInputRef}
							type="text"
							placeholder="Search by transaction hash..."
							className={classes.searchInputField}
							value={transactionSearchKeyword}
							onChange={this.handleTransactionSearchChange}
							onKeyDown={e => {
								if (e.key === 'Enter') this.handleSearchSubmit(e);
							}}
						/>
						<div className={classes.searchRight}>
							<p className={classes.slashText}>/</p>
						</div>
					</div>

					{/* Date Range Card */}
					<div
						className={`${classes.toolbarCard} ${classes.dateCard}`}
						onClick={this.handleDateTriggerClick}
					>
						<div className={classes.dateCardContent}>
							<span className={classes.dateRangeValue}>
								{this.getDateRangeLabel()}
							</span>
							<ExpandMoreIcon className={classes.chevronIcon} />
						</div>
					</div>

					{/* Org Select Card */}
					<div
						className={`${classes.toolbarCard} ${classes.orgCard}`}
						onClick={this.handleOrgTriggerClick}
					>
						<div className={classes.orgCardContent}>
							<span className={classes.orgValue}>
								{orgs.length > 0 ? orgs.join(', ') : 'Select Orgs'}
							</span>
							<ExpandMoreIcon className={classes.chevronIcon} />
						</div>
					</div>

					{/* Clear Filter Button */}
					<button
						className={classes.clearFilterButton}
						onClick={this.handleClearSearch}
					>
						Clear filter
					</button>

					{/* Date Range Popover */}
					<Popper
						open={dateOpen}
						anchorEl={dateAnchorEl}
						placement="bottom-start"
						transition
						style={{ zIndex: 1300 }}
					>
						{({ TransitionProps }) => (
							<Grow {...TransitionProps}>
								<Paper
									className={classes.datePopover}
									style={{
										width: dateAnchorEl
											? dateAnchorEl.clientWidth
											: undefined
									}}
								>
									<ClickAwayListener onClickAway={this.handleDateRangeClose}>
										<div>
											<div className={classes.datePopoverRow}>
												<label className={classes.dateLabel}>From</label>
												<DatePicker
													selected={from}
													onChange={this.handleFromDateChange}
													selectsStart
													startDate={from}
													endDate={to}
													dateFormat="dd/MM/yyyy"
													placeholderText="From Date"
													inline
												/>
											</div>
											<div className={classes.datePopoverRow}>
												<label className={classes.dateLabel}>To</label>
												<DatePicker
													selected={to}
													onChange={this.handleToDateChange}
													selectsEnd
													startDate={from}
													endDate={to}
													minDate={from}
													dateFormat="dd/MM/yyyy"
													placeholderText="To Date"
													inline
												/>
											</div>
											<div className={classes.datePopoverActions}>
												<button
													type="button"
													onClick={this.handleDateRangeClose}
													style={{
														padding: '8px 16px',
														borderRadius: 4,
														border: '1px solid #ddd',
														background: 'white',
														cursor: 'pointer'
													}}
												>
													Close
												</button>
											</div>
										</div>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>

					{/* Org Select Popover */}
					<Popper
						open={orgOpen}
						anchorEl={orgAnchorEl}
						placement="bottom-start"
						transition
						style={{ zIndex: 1300 }}
						className={classes.orgMenu}
					>
						{({ TransitionProps }) => (
							<Grow {...TransitionProps}>
								<Paper>
									<ClickAwayListener onClickAway={this.handleOrgMenuClose}>
										<List style={{ maxHeight: 300, overflow: 'auto' }}>
											{options.map(option => (
												<ListItem
													key={option.value}
													button
													onClick={() => this.handleOrgToggle(option.value)}
													className={classes.orgMenuItem}
												>
													<ListItemIcon style={{ minWidth: 32 }}>
														<Checkbox
															edge="start"
															checked={orgs.indexOf(option.value) !== -1}
															tabIndex={-1}
															disableRipple
															color="primary"
															size="small"
														/>
													</ListItemIcon>
													<ListItemText primary={option.label} />
												</ListItem>
											))}
										</List>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
				</div>

				<ReactTable
					className="network-table"
					data={transactionList}
					columns={columnHeaders}
					defaultPageSize={10}
					previousText="Previous"
					nextText="Next"
					pageText="Page"
					ofText="of"
					rowsText="rows"
					sorted={this.state.sorted}
					onSortedChange={sorted => {
						this.setState({ sorted });
					}}
					filtered={this.state.filtered}
					onFilteredChange={filtered => {
						this.setState({ filtered });
					}}
					minRows={0}
					showPagination={transactionList.length > 0}
				/>
				<Dialog
					open={dialogOpen}
					onClose={this.handleDialogClose}
					fullWidth={false}
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
						transaction={transaction}
						onClose={this.handleDialogClose}
					/>
				</Dialog>
			</div>
		);
	}
}

Transactions.propTypes = {
	currentChannel: currentChannelType.isRequired,
	getTransaction: getTransactionType.isRequired,
	transaction: transactionType,
	transactionList: transactionListType.isRequired
};

Transactions.defaultProps = {
	transaction: null
};

export default withStyles(styles)(Transactions);
