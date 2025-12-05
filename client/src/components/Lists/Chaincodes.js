/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import matchSorter from 'match-sorter';
import Dialog from '@material-ui/core/Dialog';
import Tooltip from '@material-ui/core/Tooltip';
import ReactTable from '../Styled/Table';
import { chaincodeListType } from '../types';
import ChaincodeMetaDataView from '../View/ChaincodeMetaDataView';
import {
	E009
} from './constants';
import { Info } from '@material-ui/icons';

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
		}
	};
};

export class Chaincodes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,
			sourceDialog: false,
			chaincode: {}
		};
	}

	handleDialogOpen = async (channelhash, tid) => {
		await this.props.getChaincodeMetaData(channelhash, tid);
		this.setState({ dialogOpen: true });
	};

	handleDialogClose = () => {
		this.setState({ dialogOpen: false });
	};

	reactTableSetup = classes => [
		{
			Header: () => <div style={{ textAlign: 'left' }}>Chaincode Name</div>,
			accessor: 'chaincodename',
			className: classes.hash,
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					<a
						data-command="transaction-partial-hash"
						className={classes.partialHash}
						onClick={() => this.handleDialogOpen(this.props.currentChannel, row.value)}
						href="#/chaincodes"
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
					{ keys: ['chaincodename'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Channel Name</div>,
			accessor: 'channelName',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value}
				</div>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['channelName'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Path</div>,
			accessor: 'path',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value}
				</div>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['path'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>
				Transaction Count
				<sup title={E009} style={{ padding: '3px' }}>
					<Info style={{ fontSize: 'medium', marginTop: '5px' }} />
				</sup>
			</div>,
			accessor: 'txCount',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value}
				</div>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['txCount'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},
		{
			Header: () => <div style={{ textAlign: 'left' }}>Version</div>,
			accessor: 'version',
			Cell: row => (
				<div style={{ textAlign: 'left' }}>
					{row.value}
				</div>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['version'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		}
	];

	render() {
		const { chaincodeList, chaincodeMetaData, classes } = this.props;
		const { dialogOpen } = this.state;
		return (
			<div style={{ marginTop: 40 }}>
				<ReactTable
					className="network-table"
					data={chaincodeList}
					columns={this.reactTableSetup(classes)}
					defaultPageSize={5}
					previousText="Previous"
					nextText="Next"
					pageText="Page"
					ofText="of"
					rowsText="rows"
					minRows={0}
					showPagination={chaincodeList?.length >= 5}
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
					<ChaincodeMetaDataView
						chaincodeMetaData={chaincodeMetaData}
						onClose={this.handleDialogClose}
					/>
				</Dialog>
			</div>
		);
	}
}

Chaincodes.propTypes = {
	chaincodeList: chaincodeListType.isRequired
};

export default withStyles(styles)(Chaincodes);
