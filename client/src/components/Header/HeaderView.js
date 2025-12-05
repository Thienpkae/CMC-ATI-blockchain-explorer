/**
 *    SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
	Nav,
	Navbar,
	NavbarBrand,
	NavbarToggler,
	Collapse,
	NavItem,
	Form,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';
import { HashRouter as Router, NavLink } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import FontAwesome from 'react-fontawesome';
import Drawer from '@material-ui/core/Drawer';
import Websocket from 'react-websocket';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import Loader from 'react-loader-spinner';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsPanel from '../Panels/NotificationsPanel';
import Logo from '../../static/images/cmc_logo_figma.png';
import BellIcon from '../../static/images/bell_icon.png';
import UserIcon from '../../static/images/user_icon.png';
import AdminPanel from '../Panels/AdminPanel';
import { chartOperations, chartSelectors } from '../../state/redux/charts';
import { tableOperations, tableSelectors } from '../../state/redux/tables';
import { themeSelectors } from '../../state/redux/theme';
import UsersPanal from '../UsersPanal/UsersPanal';
import { authOperations } from '../../state/redux/auth';

// import Enroll from '../Enroll';

import {
	currentChannelType,
	channelsType,
	getBlocksPerHourType,
	getBlocksPerMinType,
	getChaincodeListType,
	getChannelsType,
	getChangeChannelType,
	getDashStatsType,
	getPeerListType,
	getTransactionByOrgType,
	getTransactionPerHourType,
	getTransactionPerMinType,
	refreshType,
	getBlockListSearchType
} from '../types';
import { Tooltip } from '@material-ui/core';

const {
	blockPerHour,
	blockPerMin,
	transactionPerHour,
	transactionPerMin,
	transactionByOrg,
	dashStats,
	changeChannel,
	blockActivity
} = chartOperations;

const {
	blockListSearch,
	chaincodeList,
	channels,
	peerList,
	transactionList,
	transactionListSearch
} = tableOperations;

const { currentChannelSelector } = chartSelectors;
const {
	channelsSelector,
	transactionListSearchPageParamSelector,
	transactionListSearchQuerySelector,
	blockListSearchPageParamSelector,
	blockListSearchQuerySelector
} = tableSelectors;
/* istanbul ignore next */
const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	const darkNavbar = dark && {
		background: 'linear-gradient(to right, rgb(236, 233, 252), #4d4575)'
	};
	return {
		logo: {
			width: 57,
			height: 41.87,
			objectFit: 'contain',
			marginLeft: 0,
			marginTop: 0,
			display: 'block'
		},
		navbarHeader: {
			backgroundColor: '#FFFFFF',
			width: '100%',
			height: 80,
			minHeight: 80,
			borderBottom: '0.5px solid #3B82F6',
			boxShadow: '0px 0px 8.2px 4px rgba(59, 130, 246, 0.1)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 0,
			margin: 0,
			position: 'relative',
			...darkNavbar
		},
		navbarContainer: {
			width: '100%',
			maxWidth: 1400,
			height: 48,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			margin: '0 auto',
			position: 'relative',
			padding: 0,
			boxSizing: 'border-box'
		},
		logoContainer: {
			position: 'relative',
			left: 0,
			top: 0,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			height: 41.87,
			alignSelf: 'center'
		},
		navLinks: {
			display: 'flex',
			alignItems: 'center',
			gap: 64,
			margin: 0,
			padding: 0,
			listStyle: 'none',
			position: 'relative',
			height: 24
		},
		navAndControlsContainer: {
			display: 'flex',
			alignItems: 'center',
			gap: 64,
			position: 'relative',
			height: 32,
			marginLeft: 'auto'
		},
		controlsGroup: {
			display: 'flex',
			alignItems: 'center',
			gap: 24,
			position: 'relative',
			height: 32
		},
		tab: {
			color: '#757575', // Gray/600
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: '16px',
			fontWeight: 600,
			fontStyle: 'normal',
			lineHeight: '24px', // 150%
			height: 24,
			margin: 0,
			padding: 0,
			textTransform: 'none',
			letterSpacing: 0,
			whiteSpace: 'nowrap',
			fontFeatureSettings: '"liga" off, "clig" off',
			'&:hover': {
				color: '#757575',
				textDecoration: 'none'
			},
			'@media (max-width: 1415px) and (min-width: 990px)': {
				fontSize: '14px'
			}
		},
		activeTab: {
			color: '#3B82F6',
			backgroundColor: 'transparent',
			height: 24,
			margin: 0,
			padding: 0,
			textTransform: 'none',
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: '16px',
			fontWeight: 600,
			fontStyle: 'normal',
			lineHeight: '24px',
			letterSpacing: 0,
			whiteSpace: 'nowrap',
			'&:hover': {
				color: '#3B82F6',
				textDecoration: 'none'
			},
			'@media (max-width: 1415px) and (min-width: 990px)': {
				fontSize: '14px'
			}
		},
		adminButton: {
			paddingTop: '4px',
			marginTop: 0
		},
		themeSwitch: {
			// height: 50,
			// lineHeight: '50px',
			textAlign: 'center',
			margin: '0 8px 8px 8px'
			// width: 100,
			// paddingTop: 0,
			// '@media (max-width: 1415px) and (min-width: 990px)': {
			// 	display: 'flex'
			// },
			// '@media (max-width: 990px)': {
			// 	marginLeft: 0
			// }
		},
		iconContainer: {
			display: 'flex',
			alignItems: 'center',
			gap: 0,
			margin: 0,
			padding: 0,
			position: 'relative',
			height: 24
		},
		bell: {
			width: 24,
			height: 24,
			margin: 0,
			padding: 0,
			cursor: 'pointer',
			display: 'block',
			filter: 'brightness(0) saturate(100%) invert(26%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
			opacity: 1,
			'&:hover': {
				opacity: 0.8
			}
		},
		userdropdown: {
			width: 24,
			height: 24,
			margin: 0,
			padding: 0,
			cursor: 'pointer',
			display: 'block',
			filter: 'brightness(0) saturate(100%) invert(26%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
			opacity: 1,
			'&:hover': {
				opacity: 0.8
			}
		},
		channelLabel: {
			color: dark ? '#ffffff' : '#424242',
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: '14px',
			fontWeight: 400,
			marginRight: '12px',
			whiteSpace: 'nowrap',
			lineHeight: '32px'
		},
		channelContainer: {
			display: 'flex',
			alignItems: 'center',
			marginRight: 24
		},
		channel: {
			width: 158,
			minWidth: 158,
			margin: 0,
			color: dark ? '#ffffff' : '#424242',
			backgroundColor: dark ? '#242136' : '#ffffff',
			borderRadius: 8,
			height: 32,
			'& .MuiSelect-select': {
				paddingTop: 6,
				paddingBottom: 6,
				paddingLeft: 12,
				fontSize: 14,
				fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif'
			},
			'& .MuiOutlinedInput-notchedOutline': {
				borderColor: dark ? 'transparent' : '#e0e0e0'
			},
			'@media (max-width: 1415px) and (min-width: 990px)': {
				width: '9em'
			}
		},
		channelLoader: {
			textAlign: 'center',
			padding: 20
		},
		loader: {
			margin: '0 auto',
			width: 100
		},
		sunIcon: {
			color: dark ? 'rgb(247, 200, 92)' : 'rgb(245, 185, 47)',
			margin: '8px -12px 8px 8px',
			'@media (max-width: 1415px) and (min-width: 990px)': {
				margin: 8
			},
			fontSize: '18pt'
		},
		moonIcon: {
			color: dark ? '#9cd7f7' : 'rgb(104, 195, 245)',
			margin: '8px 8px 8px -12px',
			paddingLeft: '0',
			'@media (max-width: 1415px) and (min-width: 990px)': {
				margin: 8
			},
			fontSize: '18pt'
		},
		logout: {
			fontSize: '18pt',
			margin: 8
		},
		logoutIcon: {
			color: dark ? 'rgb(139, 143, 148)' : '#5f6164',
			fontSize: '16pt',
			float: 'none',
			'&:hover': {
				color: dark ? '#c1d7f0' : '#24272a'
			},
			margin: '8px',
			cursor: 'pointer'
		},
		userIcon: {
			color: dark ? 'rgb(139, 143, 148)' : '#5f6164',
			fontSize: '16pt',
			float: 'none',
			'&:hover': {
				color: dark ? '#c1d7f0' : '#24272a'
			},
			margin: 8,
			cursor: 'pointer'
		},
		toggleIcon: {
			color: dark ? '#242136' : '#58c5c2',
			fontSize: '1.75em',
			'&:focus': {
				outline: 'none'
			}
		}
	};
};

export class HeaderView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			notifyDrawer: false,
			adminDrawer: false,
			channels: [],
			notifyCount: 0,
			notifications: [],
			isLoading: true,
			modalOpen: false,
			registerOpen: false,
			selectedChannel: {},
			dropdownOpen: false
		};
	}

	componentDidMount() {
		const { channels: channelArr, currentChannel } = this.props;
		const arr = [];
		let selectedValue = {};
		channelArr.forEach(element => {
			if (element.channel_genesis_hash === currentChannel) {
				selectedValue = {
					value: element.channel_genesis_hash,
					label: element.channelname
				};
			}
			arr.push({
				value: element.channel_genesis_hash,
				label: element.channelname
			});
		});
		this.setState({
			currentChannel: currentChannel,
			channels: arr,
			isLoading: false,
			selectedChannel: selectedValue
		});

		this.interVal = setInterval(() => {
			this.syncData(currentChannel);
		}, 60000);
		this.setNotifications(this.props.blockActivity);
	}

	setNotifications = blockList => {
		const notificationsArr = [];
		if (blockList !== undefined) {
			const count = this.state.notifyCount;
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
			this.setState({ notifications: notificationsArr, notifyCount: Math.max(count, notificationsArr.length) });
		}
	};

	componentWillUnmount() {
		clearInterval(this.interVal);
	}

	componentDidUpdate(prevProps) {
		const { currentChannel, getChangeChannel, channels, blockActivity } = this.props;
		let selectedValue = {};

		if (channels !== prevProps.channels && channels.length > 0) {
			const options = [];
			channels.forEach(element => {
				options.push({
					value: element.channel_genesis_hash,
					label: (
						<Tooltip
							placement="right"
							title={
								element?.agoBlockTimes ? `Updated ${element?.agoBlockTimes} ago` : ''
							}
							arrow
						>
							<div>{element.channelname}</div>
						</Tooltip>
					)
				});
				if (
					currentChannel == null ||
					currentChannel === undefined
				) {
					if (element.channel_genesis_hash != null) {
						selectedValue = {
							value: element.channel_genesis_hash,
							label: element.channelname
						};
					}
				} else if (element.channel_genesis_hash === currentChannel) {
					selectedValue = {
						value: element.channel_genesis_hash,
						label: element.channelname
					};
				}
			});

			this.setState({
				channels: options,
				isLoading: false,
				selectedChannel: selectedValue
			});
		}

		if (
			(currentChannel === null || currentChannel === undefined) &&
			selectedValue.value
		) {
			getChangeChannel(selectedValue.value);
		}

		if (currentChannel !== prevProps.currentChannel) {
			this.setState({
				currentChannel: currentChannel
			});
			this.syncData(currentChannel);
		}
		if (blockActivity !== prevProps.blockActivity) {
			this.setNotifications(blockActivity);
		}
	}

	toggle = () => {
		const { isOpen } = this.state;
		if (window.matchMedia('(max-width:992px)').matches) {
			this.setState({
				isOpen: !isOpen
			});
		}
	};

	closeToggle = () => this.state.isOpen && this.toggle();

	handleChange = async selectedChannel => {
		if (this.state.channels.length > 1) {
			const { getChangeChannel } = this.props;
			clearInterval(this.interVal);
			await this.handleOpen();
			this.setState({ selectedChannel });
			getChangeChannel(selectedChannel.value);
			await this.syncData(selectedChannel.value);
			this.interVal = setInterval(() => {
				this.syncData(selectedChannel.value);
			}, 60000);
		}
		//  this.handleClose();
	};

	handleOpen = () => {
		this.setState({ modalOpen: true });
	};

	handleClose = () => {
		this.setState({ modalOpen: false });
	};

	registerOpen = () => {
		this.setState(() => ({ registerOpen: true }));
	};

	registerClose = () => {
		this.setState(() => ({ registerOpen: false }));
	};

	onRegister = () => {
		this.registerClose();
	};

	logout = async () => {
		const result = await this.props.logout();
		if (result.status === 'Success') {
			window.location = '/';
		}
	};

	/**enrollOpen = () => {
	this.setState(() => ({ enrollOpen: true }));
  };

  enrollClose = () => {
	this.setState(() => ({ enrollOpen: false }));
  };

  onEnroll = user => {
	alert(JSON.stringify(user, null, 2));
	this.enrollClose();
  }; */

	handleDrawOpen = drawer => {
		switch (drawer) {
			case 'notifyDrawer': {
				this.setState({ notifyDrawer: true });
				this.setState({ notifyCount: 0 });
				break;
			}
			case 'adminDrawer': {
				this.setState({ adminDrawer: true });
				break;
			}
			default: {
				break;
			}
		}
	};

	handleDrawClose = drawer => {
		switch (drawer) {
			case 'notifyDrawer': {
				this.setState({ notifyDrawer: false });
				break;
			}
			case 'adminDrawer': {
				this.setState({ adminDrawer: false });
				break;
			}
			default: {
				break;
			}
		}
	};

	handleThemeChange = mode => {
		const { refresh } = this.props;
		refresh(mode === 'dark' ? 'light' : 'dark');
	};

	handleData(notification) {
		// this.props.getNotification(notification);
		const { notifications, notifyCount, currentChannel } = this.state;
		const notifyArr = notifications;
		notifyArr.unshift(JSON.parse(notification));
		this.setState({ notifications: notifyArr });
		this.setState({ notifyCount: notifyCount + 1 });
		this.syncData(currentChannel);
	}

	async reloadChannels() {
		const { getChannels } = this.props;
		await getChannels();
	}

	async syncData(currentChannel) {
		const {
			getBlockListSearch,
			blockListSearchPageParam,
			blockListSearchQuery,
			getBlocksPerHour,
			getBlocksPerMin,
			getChaincodeList,
			getChannels,
			getDashStats,
			getPeerList,
			getTransactionByOrg,
			getTransactionList,
			getTransactionListSearch,
			transactionListSearchPageParam,
			transactionListSearchQuery,
			getTransactionPerHour,
			getTransactionPerMin,
			getBlockActivity
		} = this.props;

		await Promise.all([
			getBlockListSearch(
				currentChannel,
				blockListSearchQuery,
				blockListSearchPageParam
			),
			getBlocksPerHour(currentChannel),
			getBlocksPerMin(currentChannel),
			getChaincodeList(currentChannel),
			getChannels(),
			getDashStats(currentChannel),
			getBlockActivity(currentChannel),
			getPeerList(currentChannel),
			getTransactionByOrg(currentChannel),
			getTransactionListSearch(
				currentChannel,
				transactionListSearchQuery,
				transactionListSearchPageParam
			),
			getTransactionPerHour(currentChannel),
			getTransactionPerMin(currentChannel)
		]);
		this.handleClose();
	}

	render() {
		const { mode, classes } = this.props;
		const { hostname, port } = window.location;
		const webSocketProtocol =
			window.location.protocol === 'https:' ? 'wss' : 'ws';
		const webSocketUrl = `${webSocketProtocol}://${hostname}:${port}/`;
		const dark = mode === 'dark';
		const {
			isLoading,
			selectedChannel,
			channels: stateChannels,
			notifyCount,
			notifyDrawer,
			adminDrawer,
			modalOpen,
			registerOpen,
			notifications,
			dropdownOpen
		} = this.state;
		const links = [
			{ to: '/', label: 'Dashboard', exact: true },
			{ to: '/network', label: 'Network' },
			{ to: '/blocks', label: 'Blocks' },
			{ to: '/transactions', label: 'Transactions' },
			{ to: '/chaincodes', label: 'Chaincodes' },
			{ to: '/channels', label: 'Channels' }
		];

		return (
			<div>
				{/* production */}
				{/* development */}
				<Websocket
					url={webSocketUrl}
					onMessage={this.handleData.bind(this)}
					reconnect
				/>
				<Router>
					<div>
						<Navbar className={classes.navbarHeader} expand="lg" fixed="top">
							<div style={{ width: '100%', maxWidth: 1920, margin: '0 auto', position: 'relative', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
								<div className={classes.navbarContainer} style={{ width: '100%', maxWidth: 1400, position: 'relative' }}>
									<div className={classes.logoContainer}>
										<img src={Logo} className={classes.logo} alt="CMC ATI Logo" />
									</div>
									<NavbarToggler onClick={this.toggle}>
										<FontAwesome name="bars" className={classes.toggleIcon} />
									</NavbarToggler>
									<Collapse isOpen={this.state.isOpen} navbar style={{ marginLeft: 'auto' }}>
										<div className={classes.navAndControlsContainer}>
											<Nav
												className={classes.navLinks}
												navbar
												onMouseLeave={this.closeToggle}
											>
												{links.map(({ to, label, ...props }) => (
													<NavItem key={to} style={{ margin: 0 }}>
														<NavLink
															to={to}
															className={classes.tab}
															activeClassName={classes.activeTab}
															onClick={this.toggle}
															{...props}
														>
															{label}
														</NavLink>
													</NavItem>
												))}
											</Nav>
											<div className={classes.controlsGroup}>
												<Form inline style={{ margin: 0 }}>
													<Select
														className={classes.channel}
														value={selectedChannel.value || ''}
														onChange={e => {
															const val = e.target.value;
															const selected = stateChannels.find(c => c.value === val);
															this.handleChange(selected);
														}}
														onOpen={this.reloadChannels.bind(this)}
														displayEmpty
														variant="outlined"
													>
														{stateChannels.map(c => (
															<MenuItem key={c.value} value={c.value}>
																{c.label}
															</MenuItem>
														))}
													</Select>
												</Form>
												<div style={{ position: 'relative' }}>
													<img
														src={BellIcon}
														className={classes.bell}
														alt="Notifications"
														onClick={() => this.handleDrawOpen('notifyDrawer')}
													/>
													{notifyCount > 0 && (
														<Badge badgeContent={notifyCount} color="primary" style={{ position: 'absolute', top: -8, right: -8 }} />
													)}
												</div>
												<Dropdown
													isOpen={dropdownOpen}
													toggle={() => this.setState({ dropdownOpen: !dropdownOpen })}
												>
													<DropdownToggle nav style={{ padding: 0 }}>
														<img
															src={UserIcon}
															className={classes.userdropdown}
															alt="User"
														/>
													</DropdownToggle>
													<DropdownMenu>
														<DropdownItem>
															<div className={classes.adminButton}>
																<FontAwesome name="sun-o" className={classes.sunIcon} />
																<Switch
																	className={classes.themeSwitch}
																	onChange={() => this.handleThemeChange(mode)}
																	checked={dark}
																/>
																<FontAwesome name="moon-o" className={classes.moonIcon} />
															</div>
														</DropdownItem>
														<DropdownItem>
															<div
																className={classes.userIcon}
																onClick={() => this.registerOpen()}
															>
																<FontAwesome name="user-plus" />
																User management
															</div>
														</DropdownItem>
														<DropdownItem divider />
														<DropdownItem>
															<div className={classes.logoutIcon} onClick={() => this.logout()}>
																<FontAwesome name="sign-out" /> Sign out
															</div>
														</DropdownItem>
													</DropdownMenu>
												</Dropdown>
											</div>
										</div>
									</Collapse>
								</div>
							</div>
						</Navbar>
						<Drawer
							anchor="right"
							open={notifyDrawer}
							onClose={() => this.handleDrawClose('notifyDrawer')}
						>
							<div tabIndex={0} role="button">
								<NotificationsPanel notifications={notifications} />
							</div>
						</Drawer>
						<Drawer
							anchor="right"
							open={adminDrawer}
							onClose={() => this.handleDrawClose('adminDrawer')}
						>
							<div tabIndex={0} role="button">
								<AdminPanel />
							</div>
						</Drawer>
						<Dialog
							open={registerOpen}
							onClose={this.registerClose}
							fullWidth={false}
							maxWidth="md"
						>
							<UsersPanal onClose={this.registerClose} onRegister={this.onRegister} />
							{/* <Register onClose={this.registerClose} onRegister={this.onRegister} /> */}
						</Dialog>
						<Dialog
							open={modalOpen}
							onClose={this.handleClose}
							fullWidth={false}
							maxWidth="md"
						>
							<div className={classes.channelLoader}>
								<h4>Loading Channel Details</h4>
								<Loader
									type="ThreeDots"
									color="#005069"
									height={70}
									width={70}
									className={classes.loader}
								/>
							</div>
						</Dialog>
					</div>
				</Router>
			</div>
		);
	}
}

HeaderView.propTypes = {
	currentChannel: currentChannelType.isRequired,
	channels: channelsType.isRequired,
	getBlockListSearch: getBlockListSearchType.isRequired,
	getBlocksPerHour: getBlocksPerHourType.isRequired,
	getBlocksPerMin: getBlocksPerMinType.isRequired,
	getChangeChannel: getChangeChannelType.isRequired,
	getChaincodeList: getChaincodeListType.isRequired,
	getChannels: getChannelsType.isRequired,
	getDashStats: getDashStatsType.isRequired,
	getPeerList: getPeerListType.isRequired,
	getTransactionByOrg: getTransactionByOrgType.isRequired,
	getTransactionPerHour: getTransactionPerHourType.isRequired,
	getTransactionPerMin: getTransactionPerMinType.isRequired,
	refresh: refreshType.isRequired
};

const { modeSelector } = themeSelectors;

const mapStateToProps = state => {
	return {
		currentChannel: currentChannelSelector(state),
		channels: channelsSelector(state),
		mode: modeSelector(state),
		transactionListSearchPageParam: transactionListSearchPageParamSelector(state),
		transactionListSearchQuery: transactionListSearchQuerySelector(state),
		blockListSearchPageParam: blockListSearchPageParamSelector(state),
		blockListSearchQuery: blockListSearchQuerySelector(state)
	};
};

const mapDispatchToProps = {
	getBlockListSearch: blockListSearch,
	getBlocksPerHour: blockPerHour,
	getBlocksPerMin: blockPerMin,
	getChaincodeList: chaincodeList,
	getChangeChannel: changeChannel, // not in syncdata
	getChannels: channels,
	getDashStats: dashStats,
	getPeerList: peerList,
	getBlockActivity: blockActivity,
	getTransactionByOrg: transactionByOrg,
	getTransactionList: transactionList,
	getTransactionListSearch: transactionListSearch,
	getTransactionPerHour: transactionPerHour,
	getTransactionPerMin: transactionPerMin,
	logout: authOperations.logout
};

const connectedComponent = connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderView);
export default withStyles(styles)(connectedComponent);
