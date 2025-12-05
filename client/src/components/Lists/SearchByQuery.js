/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { txnListType } from '../types';
import { blockHashTypee } from '../types';
import { blockTxnIdType } from '../types';
import {
	TextField,
	makeStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import TransactionDetails from '../View/TransactionDetails';
import BlockDetails from '../View/BlockDetails';

const useStyles = makeStyles(theme => ({
	searchContainer: {
		width: '100%',
		maxWidth: 1400,
		height: 48,
		border: '1px solid #EDEDED',
		borderRadius: 8,
		padding: '12px 16px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'transparent',
		margin: '0 auto',
		boxSizing: 'border-box',
		'@media (max-width: 1400px)': {
			width: '100%',
			maxWidth: '100%'
		},
		'@media (max-width: 768px)': {
			height: 'auto',
			padding: '10px 12px'
		}
	},
	searchLeft: {
		display: 'flex',
		alignItems: 'center',
		gap: 8,
		flex: 1,
		minWidth: 0
	},
	searchIcon: {
		width: 24,
		height: 24,
		color: '#757575', // Gray/600
		cursor: 'pointer',
		flexShrink: 0
	},
	searchInput: {
		flex: 1,
		minWidth: 0,
		'& .MuiInputBase-root': {
			border: 'none',
			'&:before': {
				display: 'none'
			},
			'&:after': {
				display: 'none'
			},
			'&:hover:before': {
				display: 'none'
			}
		},
		'& .MuiInputBase-input': {
			padding: 0,
			fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
			fontSize: 14,
			lineHeight: '20px',
			color: '#757575', // Gray/600
			height: 20,
			'&::placeholder': {
				color: '#757575', // Gray/600
				opacity: 1,
				fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
				fontSize: 14,
				lineHeight: '20px'
			}
		}
	},
	searchRight: {
		width: 27,
		height: 24,
		border: '1px solid #E0E0E0', // Gray/300 - rgb(224, 224, 224)
		borderRadius: 4,
		padding: '2px 10px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		boxSizing: 'border-box',
		flexShrink: 0
	},
	slashText: {
		fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
		fontSize: 12,
		lineHeight: '24px',
		color: '#212121', // Gray/900
		fontWeight: 400,
		margin: 0,
		padding: 0,
		height: 24,
		display: 'flex',
		alignItems: 'center'
	},
	errorText: {
		color: '#d32f2f',
		fontSize: 12,
		marginTop: 4,
		fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif'
	}
}));

const SearchByQuery = props => {

	const classes = useStyles();

	const [search, setSearch] = useState('');
	const [selectedOp, setSelectedOp] = useState('Txn Hash');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [error, setError] = useState('');
	const [searchAttempt, setSearchAttempt] = useState(0); // 0: Idle, 1: Txn, 2: BlockHash, 3: BlockNo

	const {
		txnList,
		blockHashList,
		blockSearch,
		getBlockHash,
		currentChannel,
		getTxnList,
		getBlockSearch,
		blockTxnIdList
	} = props;

	useEffect(() => {
		if (searchAttempt === 0) return;

		const isTxnFound = txnList && typeof txnList !== 'string';
		const isBlockHashFound = blockHashList && typeof blockHashList !== 'string';
		const isBlockNoFound = blockSearch && typeof blockSearch !== 'string';

		if (searchAttempt === 3) { // Block No
			if (isBlockNoFound) {
				setSelectedOp('Block No');
				handleDialogOpen();
				setError('');
			} else {
				setError('Block not found');
			}
			setSearchAttempt(0);
		} else if (searchAttempt === 1) { // Txn Hash
			if (isTxnFound) {
				setSelectedOp('Txn Hash');
				handleDialogOpen();
				setError('');
				setSearchAttempt(0);
			} else {
				// Not found as Txn, try Block Hash
				getBlockHash(currentChannel, search).then(() => {
					setSearchAttempt(2);
				});
			}
		} else if (searchAttempt === 2) { // Block Hash
			if (isBlockHashFound) {
				setSelectedOp('Block Hash');
				handleDialogOpen();
				setError('');
			} else {
				setError('Transaction or Block not found');
			}
			setSearchAttempt(0);
		}
	}, [searchAttempt, txnList, blockHashList, blockSearch, search, currentChannel, getBlockHash]);

	const searchData = async () => {
		if (!isNaN(search) && !isNaN(parseFloat(search))) {
			await getBlockSearch(currentChannel, search);
			setSearchAttempt(3);
		} else {
			// Try Txn Hash first
			await getTxnList(currentChannel, search);
			setSearchAttempt(1);
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!search) {
			setError('Please enter valid txn hash/block no/block hash');
			return;
		}
		searchData();
	};

	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const searchInputRef = React.useRef(null);

	useEffect(() => {
		const handleKeyDown = event => {
			if (event.key === '/' && document.activeElement !== searchInputRef.current) {
				event.preventDefault();
				searchInputRef.current.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<div style={{ marginBottom: error ? '0px' : '23px' }}>
			<div className={classes.searchContainer}>
				<div className={classes.searchLeft}>
					<SearchIcon
						className={classes.searchIcon}
						onClick={handleSubmit}
					/>
					<TextField
						inputRef={searchInputRef}
						value={search}
						onChange={e => {
							setSearch(e.target.value);
							if (error) {
								setDialogOpen(false);
								setError('');
							}
						}}
						onKeyPress={e => e.key === 'Enter' && handleSubmit(e)}
						placeholder="Search by txn hash / block..."
						variant="standard"
						fullWidth
						className={classes.searchInput}
					/>
				</div>
				<div className={classes.searchRight}>
					<span className={classes.slashText}>/</span>
				</div>
			</div>
			{error && (
				<div className={classes.errorText}>{error}</div>
			)}
			<Dialog
				open={dialogOpen && !error}
				onClose={handleDialogClose}
				maxWidth={false}
				PaperProps={{
					style: {
						backgroundColor: 'transparent',
						boxShadow: 'none',
						borderRadius: 8
					}
				}}
			>
				{!error && selectedOp === 'Block No' ? (
					<BlockDetails block={blockSearch} onClose={handleDialogClose} />
				) : !error && selectedOp === 'Txn Hash' ? (
					<TransactionDetails transaction={txnList} onClose={handleDialogClose} />
				) : !error && selectedOp === 'Block By Txn ID' ? (
					<BlockDetails block={blockTxnIdList} onClose={handleDialogClose} />
				) : (
					<BlockDetails
						block={blockHashList}
						onClose={handleDialogClose}
					/>
				)}
			</Dialog>
		</div>
	);
};
SearchByQuery.propTypes = {
	txnList: txnListType.isRequired,
	blockHashList: blockHashTypee.isRequired,
	blockTxnIdList: blockTxnIdType.isRequired
};

export default withRouter(SearchByQuery);
