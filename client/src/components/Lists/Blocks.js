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
import find from 'lodash/find';
import moment from 'moment';
import Timeago from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import shortEnglishStrings from 'react-timeago/lib/language-strings/en-short';
import ReactTable from '../Styled/Table';
import BlockDetails from '../View/BlockDetails';
import TransactionDetails from '../View/TransactionDetails';
import BlockTransactions from '../View/BlockTransactions';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DatePicker from '../Styled/DatePicker';
import {
	blockListSearchType,
	blockRangeSearchType,
	currentChannelType,
	getTransactionType,
	transactionType,
	getTxnListType,
	txnListType
} from '../types';
import {
	reg,
	defaultRangeLimit,
	E001,
	E002,
	E003,
	E004
} from './constants';

/* istanbul ignore next */
const monoStack = '"JetBrains Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace';

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
		tableColumn: {
			'& .rt-th, & .rt-td': {
				verticalAlign: 'middle !important'
			}
		},
		centerColumn: {
			'& .rt-th, & .rt-td': {
				textAlign: 'center !important'
			}
		},
		htinputs: {
			display: 'flex',
			marginBottom: '15px',
			position: 'relative'
		},
		errorText: {
			width: '100%',
			position: 'absolute',
			left: '0px',
			bottom: '-20px',
			cursor: 'default'
		},
		startBlock: {
			marginRight: '5px'
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
		filter: {
			width: '100%',
			textAlign: 'center',
			margin: '0px !important'
		},
		filterButton: {
			opacity: 0.8,
			margin: 'auto',
			width: '100% !important',
			'margin-bottom': '4px'
		},
		searchButton: {
			opacity: 0.8,
			margin: 'auto',
			width: '100% !important',
			backgroundColor: dark ? undefined : '#086108',
			'margin-bottom': '4px'
		},
		filterElement: {
			textAlign: 'center',
			display: 'flex',
			padding: '0px !important',
			'& .label': {
				margin: '25px 10px 0px 10px'
			}
		},
		filterDate: {
			'& > div': {
				width: '100% !important',
				marginTop: 20
			}
		},
		blockRangeRow: {
			marginBottom: '10px !important',
			marginLeft: '10px !important',
			minWidth: '25vw',
			// justifyContent: 'space-around',
			'& > div': {
				marginRight: '10px'
			},
			'& > p': {
				'white-space': 'nowrap'
			}
		},
		text: {
			alignSelf: 'left',
			marginRight: '10px',
			marginLeft: '15px'
		},
		blockrange: {
			'& > div': {
				width: '40% !important'
			}
		},
		iconButton: {
			color: '#21295c',
			alignSelf: 'center'
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
const baseShortFormatter = buildFormatter(shortEnglishStrings);
const shortFormatter = (...args) => `${baseShortFormatter(...args)} ago`;

export class Blocks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,
			dialogOpenBlockHash: false,
			dialogOpenBlockTransactions: false,
			selectedBlock: {},
			err: false,
			search: false,
			to: moment(),
			orgs: [],
			options: [],
			sorted: [],
			from: moment().subtract(1, 'days'),
			blockHash: {},
			page: 0,
			rowsPerPage: 10,
			searchClick: false,
			queryFlag: false,
			defaultQuery: true,
			startBlock: '',
			endBlock: '',
			rangeErr: '',
			brs: false,
			rangeLimit: defaultRangeLimit,
			blockSearchKeyword: '',
			dateAnchorEl: null,
			orgAnchorEl: null,
			searchAttempt: null
		};
		this.searchInputRef = React.createRef();
	}

	componentDidMount() {
		document.addEventListener('keydown', this.handleKeyDown);
		const { blockListSearch } = this.props;
		const selection = {};
		blockListSearch?.forEach(element => {
			selection[element.blocknum] = false;
		});
		const opts = [];
		this.props.transactionByOrg.forEach(val => {
			opts.push({ label: val.creator_msp_id, value: val.creator_msp_id });
		});
		this.setState({ selection, options: opts });
		this.searchBlockList();
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
				this.searchBlockList(this.props.currentChannel);
			}, 60000);
			this.searchBlockList(this.props.currentChannel);
		}
		if (
			(!this.state.brs && prevState.page !== this.state.page) ||
			this.state.searchClick
		) {
			this.setState({ searchClick: false });
			this.handleSearch();
		}

		if (prevProps.blockRangeLoaded !== this.props.blockRangeLoaded) {
			if (this.props.blockRangeLoaded) {
				if (typeof this.props.blockRangeSearch === 'string') {
					this.setState({ rangeErr: this.props.blockRangeSearch });
				}
			} else {
				if (this.state.rangeErr) this.setState({ rangeErr: '' });
			}
		}

		if (
			this.state.searchAttempt === 'block' &&
			prevProps.blockSearch !== this.props.blockSearch
		) {
			if (this.props.blockSearch && typeof this.props.blockSearch !== 'string') {
				this.setState({
					dialogOpenBlockHash: true,
					blockHash: this.props.blockSearch,
					searchAttempt: null
				});
			} else {
				this.setState({ searchAttempt: null });
			}
		}
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown);
		clearInterval(this.interval);
		clearTimeout(timer);
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
				brs: false,
				...options
			});
		}, 300);
	};

	handleSearchSubmit = async e => {
		if (e) e.preventDefault();
		const keyword = this.state.blockSearchKeyword.trim();
		if (!keyword) return;

		if (!isNaN(keyword)) {
			if (this.searchInputRef.current) {
				this.searchInputRef.current.blur();
			}
			await this.props.getBlockSearch(this.props.currentChannel, keyword);
			this.setState({ searchAttempt: 'block' });
		}
	};

	handleBlockSearchChange = event => {
		this.setState({ blockSearchKeyword: event.target.value });
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
		// Blur any focused elements to prevent aria-hidden conflict
		if (document.activeElement && document.activeElement.blur) {
			document.activeElement.blur();
		}
		this.setState({ dateAnchorEl: null });
	};

	handleFromDateChange = date => {
		if (!date) {
			return;
		}
		if (date > this.state.to) {
			this.setState({ err: true, from: date });
			return;
		}
		this.setState({ from: date, err: false }, () =>
			this.queueSearchRefresh({ queryFlag: true, defaultQuery: false })
		);
	};

	handleToDateChange = date => {
		if (!date) {
			return;
		}
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

	filterBlockList = list => {
		if (!Array.isArray(list)) {
			return list;
		}
		const keyword = this.state.blockSearchKeyword?.trim().toLowerCase();
		if (!keyword) {
			return list;
		}
		return list.filter(item => {
			const tokens = [
				item.blocknum !== undefined && item.blocknum !== null
					? item.blocknum.toString().toLowerCase()
					: '',
				item.blockhash ? item.blockhash.toLowerCase() : '',
				item.datahash ? item.datahash.toLowerCase() : '',
				item.channelname ? item.channelname.toLowerCase() : ''
			];
			return tokens.some(val => val.includes(keyword));
		});
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

	searchBlockList = async channel => {
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
			this.setState({ queryFlag: false });
		} else if (this.state.defaultQuery) {
			query = '';
			this.setState({ defaultQuery: false });
		} else {
			query = this.props.blockListSearchQuery;
		}
		let channelhash = this.props.currentChannel;
		if (channel !== undefined) {
			channelhash = channel;
		}
		await this.props.getBlockListSearch(channelhash, query, pageParams);
	};

	handleDialogOpen = async tid => {
		const { getTransaction, getTxnList, currentChannel } = this.props;
		if (this.state.brs) {
			await getTxnList(currentChannel, tid);
		} else await getTransaction(currentChannel, tid);
		this.setState({ dialogOpen: true });
	};


	handleDialogClose = () => {
		this.setState({ dialogOpen: false });
	};

	handleSearch = async () => {
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
		this.interval = setInterval(() => {
			this.searchBlockList();
		}, 60000);
		await this.searchBlockList();
		this.setState({ search: true });
	};

	searchBlockRange = async channel => {
		let channelhash = this.props.currentChannel;
		if (channel !== undefined) {
			channelhash = channel;
		}
		await this.props.getBlockRangeSearch(
			channelhash,
			this.state.startBlock,
			this.state.endBlock
		);
	};

	handleRangeChange = e => {
		const { name, value } = e.target;
		if (reg.test(value))
			this.setState({
				[name]: value,
				rangeErr: ''
			});
	};
	handleRangeSubmit = e => {
		e.preventDefault();
		if (this.state.endBlock === '' || this.state.startBlock === '') {
			this.setState({ rangeErr: E001 });
			return;
		}
		if (Number(this.state.endBlock) < Number(this.state.startBlock)) {
			console.log('err occured');
			this.setState({
				rangeErr: E002
			});
			return;
		}
		if (this.state.endBlock - this.state.startBlock >= this.state.rangeLimit) {
			if (this.state.rangeLimit < 100) {
				this.setState({ rangeErr: E004(this.state.rangeLimit) });
			} else {
				this.setState({ rangeErr: E003 });
			}
			return;
		}
		this.searchBlockRange();
		this.setState({ search: true, brs: true, page: 0 });
	};
	handleClearSearch = () => {
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
		this.setState(
			{
				to: moment(),
				orgs: [],
				err: false,
				from: moment().subtract(1, 'days'),
				startBlock: '',
				endBlock: '',
				blockSearchKeyword: '',
				filtered: [],
				sorted: [],
				defaultQuery: true,
				queryFlag: false,
				dateAnchorEl: null,
				orgAnchorEl: null
			},
			() => this.queueSearchRefresh()
		);
	};

	handleDialogOpenBlockHash = blockHash => {
		const blockList = this.state.brs
			? typeof this.props.blockRangeSearch !== 'string' &&
				this.props.blockRangeLoaded
				? this.props.blockRangeSearch
				: []
			: this.props.blockListSearch;
		const data = find(blockList, item => item.blockhash === blockHash);

		this.setState({
			dialogOpenBlockHash: true,
			blockHash: data
		});
	};

	handleDialogCloseBlockHash = () => {
		this.setState({ dialogOpenBlockHash: false });
	};

	handleDialogOpenBlockTransactions = block => {
		this.setState({
			dialogOpenBlockTransactions: true,
			selectedBlock: block
		});
	};

	handleDialogCloseBlockTransactions = () => {
		this.setState({ dialogOpenBlockTransactions: false });
	};

	handleEye = (row, val) => {
		const { selection } = this.state;
		const data = Object.assign({}, selection, { [row.index]: !val });
		this.setState({ selection: data });
	};
	handlePageChange = page => {
		this.setState({ page });
	};

	reactTableSetup = classes => [
		{
			Header: () => <div style={{ textAlign: 'left' }}>Block Number</div>,
			accessor: 'blocknum',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value ?? '-'}
				</div>
			)
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Channel Name</div>,
			accessor: 'channelname',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value ?? '-'}
				</div>
			)
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Data Hash</div>,
			accessor: 'datahash',
			className: classes.hash,
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value ? (
						<Tooltip
							title={row.value}
							placement="top"
							classes={{ tooltip: classes.customTooltip }}
						>
							<span className={classes.partialHash}>
								{row.value}
							</span>
						</Tooltip>
					) : '-'}
				</div>
			)
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Block Hash</div>,
			accessor: 'blockhash',
			className: classes.hash,
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value ? (
						<Tooltip
							title={row.value}
							placement="top"
							classes={{ tooltip: classes.customTooltip }}
						>
							<a
								data-command="block-partial-hash"
								className={classes.partialHash}
								onClick={() => this.handleDialogOpenBlockHash(row.value)}
								href="#/blocks"
							>
								{row.value}
							</a>
						</Tooltip>
					) : '-'}
				</div>
			)
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Previous Hash</div>,
			accessor: 'prehash',
			className: classes.hash,
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value ? (
						<Tooltip
							title={row.value}
							placement="top"
							classes={{ tooltip: classes.customTooltip }}
						>
							<span
								className={classes.partialHash}
								onClick={() => this.handleDialogOpenBlockHash(row.value)}
							>
								{row.value}
							</span>
						</Tooltip>
					) : ''}
				</div>
			)
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Tx</div>,
			accessor: 'txcount',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					<span
						style={{ color: '#3b82f6', cursor: 'pointer' }}
						onClick={() => this.handleDialogOpenBlockTransactions(row.original)}
					>
						{row.value ?? 0}
					</span>
				</div>
			)
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Size (KB)</div>,
			accessor: 'blksize',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value ?? '-'}
				</div>
			)
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Time</div>,
			accessor: 'createdt',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value ? (
						<Timeago date={row.value} live={false} formatter={shortFormatter} />
					) : '-'}
				</div>
			)
		}
	];

	render() {
		const reversedBlockRangeList =
			typeof this.props.blockRangeSearch !== 'string' &&
				this.props.blockRangeLoaded
				? this.props.blockRangeSearch
					.slice()
					.sort()
					.reverse()
				: [];
		const blockList = this.state.brs
			? reversedBlockRangeList
			: this.props.blockListSearch;
		const { transaction, classes } = this.props;
		const { dialogOpen, dialogOpenBlockHash, blockHash } = this.state;
		const filteredBlockList = this.filterBlockList(blockList) || [];
		return (
			<div>
				<div className={classes.filterToolbar}>
					<div className={`${classes.toolbarCard} ${classes.searchCard}`}>
						<SearchIcon />
						<input
							ref={this.searchInputRef}
							type="text"
							className={classes.searchInputField}
							placeholder="Search by block number / hash..."
							value={this.state.blockSearchKeyword}
							onChange={this.handleBlockSearchChange}
							onKeyPress={e => e.key === 'Enter' && this.handleSearchSubmit(e)}
							autoComplete="off"
						/>
						<div className={classes.searchRight}>
							<span className={classes.slashText}>/</span>
						</div>
					</div>
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
					<Popper
						open={Boolean(this.state.dateAnchorEl)}
						anchorEl={this.state.dateAnchorEl}
						placement="bottom-start"
						transition
						disablePortal={false}
						style={{ zIndex: 1300 }}
					>
						{({ TransitionProps }) => (
							<Grow {...TransitionProps}>
								<Paper
									className={classes.datePopover}
									style={{
										width: this.state.dateAnchorEl
											? this.state.dateAnchorEl.clientWidth
											: undefined
									}}
								>
									<ClickAwayListener onClickAway={this.handleDateRangeClose}>
										<div>
											<div className={classes.datePopoverRow}>
												<label className={classes.dateLabel}>From</label>
												<DatePicker
													selected={this.state.from}
													onChange={this.handleFromDateChange}
													selectsStart
													startDate={this.state.from}
													endDate={this.state.to}
													dateFormat="dd/MM/yyyy"
													placeholderText="From Date"
													inline
												/>
											</div>
											<div className={classes.datePopoverRow}>
												<label className={classes.dateLabel}>To</label>
												<DatePicker
													selected={this.state.to}
													onChange={this.handleToDateChange}
													selectsEnd
													startDate={this.state.from}
													endDate={this.state.to}
													minDate={this.state.from}
													dateFormat="dd/MM/yyyy"
													placeholderText="To Date"
													inline
												/>
											</div>
											{this.state.err && (
												<div style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>
													Invalid date range
												</div>
											)}
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
					<div
						className={`${classes.toolbarCard} ${classes.orgCard}`}
						onClick={this.handleOrgTriggerClick}
					>
						<div className={classes.orgCardContent}>
							<span className={classes.orgValue}>
								{this.handleCustomRender(this.state.orgs, this.state.options)}
							</span>
							<ExpandMoreIcon className={classes.chevronIcon} />
						</div>
					</div>
					<Popper
						open={Boolean(this.state.orgAnchorEl)}
						anchorEl={this.state.orgAnchorEl}
						placement="bottom-start"
						transition
						disablePortal={false}
						style={{ zIndex: 1300 }}
					>
						{({ TransitionProps }) => (
							<Grow {...TransitionProps}>
								<Paper className={classes.orgMenu}>
									<ClickAwayListener onClickAway={this.handleOrgMenuClose}>
										<List
											component="nav"
											aria-labelledby="org-selector-button"
											style={{ padding: 0, minWidth: 200, maxHeight: 300, overflow: 'auto' }}
										>
											{this.state.options.map(option => (
												<ListItem
													key={option.value}
													button
													onClick={() => this.handleOrgToggle(option.value)}
													className={classes.orgMenuItem}
													disableRipple
												>
													<ListItemIcon style={{ minWidth: 40 }}>
														<Checkbox
															checked={this.state.orgs.includes(option.value)}
															style={{
																padding: 0,
																color: '#3b82f6'
															}}
															size="small"
														/>
													</ListItemIcon>
													<ListItemText
														primary={option.label}
														primaryTypographyProps={{
															style: { fontSize: 14 }
														}}
													/>
												</ListItem>
											))}
										</List>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
					<button
						type="button"
						className={classes.clearFilterButton}
						onClick={this.handleClearSearch}
					>
						Clear filter
					</button>
				</div>
				<ReactTable
					className="network-table"
					data={filteredBlockList}
					columns={this.reactTableSetup(classes)}
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
					minRows={0}
					showPagination={filteredBlockList.length > 0}
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

				<Dialog
					open={dialogOpenBlockHash}
					onClose={this.handleDialogCloseBlockHash}
					maxWidth={false}
					PaperProps={{
						style: {
							backgroundColor: 'transparent',
							boxShadow: 'none',
							borderRadius: 8
						}
					}}
				>
					<BlockDetails
						block={blockHash}
						onClose={this.handleDialogCloseBlockHash}
					/>
				</Dialog>

				<Dialog
					open={this.state.dialogOpenBlockTransactions}
					onClose={this.handleDialogCloseBlockTransactions}
					maxWidth={false}
					PaperProps={{
						style: {
							backgroundColor: 'transparent',
							boxShadow: 'none',
							borderRadius: 8
						}
					}}
				>
					<BlockTransactions
						block={this.state.selectedBlock}
						onClose={this.handleDialogCloseBlockTransactions}
						onViewTransaction={this.handleDialogOpen}
					/>
				</Dialog>
			</div>
		);
	}
}

Blocks.propTypes = {
	blockRangeSearch: blockRangeSearchType.isRequired,
	blockListSearch: blockListSearchType.isRequired,
	currentChannel: currentChannelType.isRequired,
	getTransaction: getTransactionType.isRequired,
	transaction: transactionType,
	txnList: txnListType,
	getTxnList: getTxnListType
};

Blocks.defaultProps = {
	transaction: null,
	txnList: null
};

export default withStyles(styles)(Blocks);
