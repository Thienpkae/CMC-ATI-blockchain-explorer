/**
 *    SPDX-License-Identifier: Apache-2.0
 */
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import matchSorter from 'match-sorter';
import ReactTable from '../Styled/Table';
import { channelPeerDataType, channelsType } from '../types';
import ChannelEndorserView from '../View/ChannelEndorserView';
import ChannelCommitterView from '../View/ChannelCommitterView';
import BlockDetails from '../View/BlockDetails';
import Dialog from '@material-ui/core/Dialog';
import { E007, E008 } from './constants';
import { Info } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

const monoStack = '"JetBrains Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace';

const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
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
		fullHash: {
			display: 'none'
		},
		lastFullHash: {
			display: 'none'
		}
	};
};
class Channels extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,
			dialogOpenEndorser: false,
			sourceDialog: false,
			dialogOpenBlockDetails: false,
			selectedBlock: null
		};
	}



	handleDialogOpenCommitter = async currentChannel => {
		await this.props.getChannelPeerData(currentChannel);
		this.setState({ dialogOpen: true });
	};

	handleDialogOpen = async currentChannel => {
		await this.props.getChannelPeerData(currentChannel);
		this.setState({ dialogOpenEndorser: true });
	};
	handleDialogCloseCommitter = () => {
		this.setState({ dialogOpen: false });
	};
	handleDialogClose = () => {
		this.setState({ dialogOpenEndorser: false });
	};

	handleDialogOpenBlockDetails = async (row) => {
		const blockHash = row.channel_genesis_hash;
		const initialBlock = {
			blocknum: 0,
			channelname: row.channelname,
			createdt: row.createdat,
			txcount: 1,
			blockhash: blockHash,
			datahash: '',
			prehash: ''
		};

		if (blockHash) {
			const { blockHashList } = this.props;
			if (blockHashList && blockHashList.blockhash === blockHash) {
				this.setState({ dialogOpenBlockDetails: true, selectedBlock: blockHashList });
			} else {
				this.setState({ dialogOpenBlockDetails: true, selectedBlock: initialBlock });
				await this.props.getBlockHash(this.props.currentChannel, blockHash);
			}
		}
	};

	handleDialogCloseBlockDetails = () => {
		this.setState({ dialogOpenBlockDetails: false });
	};

	reactTableSetup = classes => [
		{
			Header: () => <div style={{ textAlign: 'left' }}>ID</div>,
			accessor: 'id',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value}
				</div>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['id'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
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
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Genesis Hash</div>,
			accessor: 'channel_genesis_hash',
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
								onClick={() => this.handleDialogOpenBlockDetails(row.original)}
								href="#/channels"
							>
								{row.value}
							</a>
						</Tooltip>
					) : '-'}
				</div>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['channel_genesis_hash'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},

		{
			Header: () => <div style={{ textAlign: 'left' }}>
				Blocks
				<sup title={E007} style={{ padding: '3px' }}>
					<Info style={{ fontSize: 'medium', marginTop: '5px' }} />
				</sup>
			</div>,
			accessor: 'blocks',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value}
				</div>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['blocks'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>
				Transactions
				<sup title={E008} style={{ padding: '3px' }}>
					<Info style={{ fontSize: 'medium', marginTop: '5px' }} />
				</sup>
			</div>,
			accessor: 'transactions',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value}
				</div>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['transactions'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Committers</div>,
			accessor: 'channel_members.committers',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['channel_members.committers'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true,
			Cell: ({ value }) => {
				if (!value) return null;
				const cts = value.slice(0, 5);
				const rcc = value.length - cts.length;

				return (
					<div style={{ textAlign: 'left' }}>
						{cts.map((committer, i) => (
							<React.Fragment key={committer}>
								{value.length > 1 && `${i + 1}. `}
								{i > 0 && ' '}
								{committer}
								<br />
							</React.Fragment>
						))}
						{rcc > 0 && (
							<span>
								<br />
								<a
									data-command="committer"
									onClick={() =>
										this.handleDialogOpenCommitter(this.props.currentChannel, rcc)
									}
									className={classes.partialHash}
									href="#/channels"
								>
									See All
								</a>
							</span>
						)}
					</div>
				);
			}
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Endorsers</div>,
			accessor: 'channel_members.endorsers',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['channel_members.endorsers'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			Cell: ({ value }) => {
				if (!value) return null;
				const etc = value.slice(0, 5);
				const rec = value.length - etc.length;

				return (
					<div style={{ textAlign: 'left' }}>
						{etc.map((endorser, i) => (
							<React.Fragment key={endorser}>
								{i > 0 && ' '}
								{i + 1}. {endorser}
								<br />
							</React.Fragment>
						))}
						{rec > 0 && (
							<span>
								<br />
								<a
									data-command="endorsers"
									onClick={() => this.handleDialogOpen(this.props.currentChannel, rec)}
									className={classes.partialHash}
									href="#/channels"
								>
									See All
								</a>
							</span>
						)}
					</div>
				);
			}
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Created At</div>,
			accessor: 'createdat',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['createdat'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true,
			Cell: ({ value }) => (
				<div style={{ textAlign: 'left' }}>
					{moment.utc(value).format('HH:mm:ss - DD/MM/YYYY')}
				</div>
			)
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Updated At</div>,
			accessor: 'latestdate',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['latestdate'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true,
			Cell: ({ value }) => (
				<div style={{ textAlign: 'left' }}>
					{moment.utc(value).format('HH:mm:ss - DD/MM/YYYY')}
				</div>
			)
		}
	];

	render() {
		const { channels, channelPeerData, classes, blockHashList } = this.props;
		const { dialogOpen, dialogOpenEndorser, dialogOpenBlockDetails, selectedBlock } = this.state;

		let blockToDisplay = selectedBlock;
		if (selectedBlock && blockHashList && blockHashList.blockhash === selectedBlock.blockhash) {
			blockToDisplay = blockHashList;
		}

		return (
			<div style={{ marginTop: 40 }}>
				<ReactTable
					className="network-table"
					data={channels}
					columns={this.reactTableSetup(classes)}
					defaultPageSize={5}
					previousText="Previous"
					nextText="Next"
					pageText="Page"
					ofText="of"
					rowsText="rows"
					minRows={0}
					showPagination={channels.length >= 5}
				/>
				<Dialog
					open={dialogOpenEndorser}
					onClose={this.handleDialogClose}
					fullWidth
					maxWidth="md"
				>
					<ChannelEndorserView
						channelPeerData={channelPeerData}
						onClose={this.handleDialogClose}
					/>
				</Dialog>

				<Dialog
					open={dialogOpen}
					onClose={this.handleDialogCloseCommitter}
					fullWidth
					maxWidth="md"
				>
					<ChannelCommitterView
						channelPeerData={channelPeerData}
						onClose={this.handleDialogCloseCommitter}
					/>
				</Dialog>

				<Dialog
					open={dialogOpenBlockDetails}
					onClose={this.handleDialogCloseBlockDetails}
					maxWidth={false}
				>
					<BlockDetails
						block={blockToDisplay}
						onClose={this.handleDialogCloseBlockDetails}
					/>
				</Dialog>
			</div>
		);
	}
}

Channels.propTypes = {
	channels: channelsType.isRequired,
	channelPeerData: channelPeerDataType
};
Channels.defaultProps = {
	channelPeerData: null
};
export default withStyles(styles)(Channels);
