/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import { combineReducers } from 'redux';
import types from './types';



const blockListSearchReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.BLOCK_LIST_SEARCH) {
		return {
			rows: action.payload.rows.blocksData,
			loaded: true,
			errors: action.error,
			noOfpages: action.payload.rows?.noOfpages || state.noOfpages,
			query: action.payload.query,
			pageParams: action.payload.pageParams
		};
	} else {
		return state;
	}
};

const chaincodeListReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.CHAINCODE_LIST) {
		return {
			rows: action.payload.chaincode,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};

const channelsReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.CHANNELS) {
		return {
			rows: action.payload.channels,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};

const peerListReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.PEER_LIST) {
		return {
			rows: action.payload.peers,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};
const blockRangeSearchReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.BLOCK_RANGE_SEARCH) {
		return {
			rows: action.payload,
			loaded: true,
			errors: action.error
		};
	} else if (action.type === types.BLOCK_RANGE_LOADED) {
		return {
			loaded: action.payload
		};
	} else {
		return state;
	}
};

const txnListReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.TXN_LIST) {
		return {
			rows: action.payload,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};

const blockHashReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.BLOCK_HASH) {
		return {
			rows: action.payload,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};
const blockTxnIdReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.BLOCK_TXN) {
		return {
			rows: action.payload,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};
const blockSearchReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.BLOCK_SEARCH) {
		return {
			rows: action.payload,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};

const chaincodeMetaDataReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.CHAINCODE_META_DATA) {
		return {
			rows: action.payload,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};
const channelPeerDataReducer = (state = { rows: {}, loaded: false, errors: null }, action = {}) => {
	if (action.type === types.CHANNEL_PEER_DATA) {
		return {
			rows: action.payload,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};

const transactionReducer = (state = { transaction: {}, loaded: false, errors: null }, action = {}) => {
	if (action.type === types.TRANSACTION) {
		return {
			transaction: action.payload.row,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};

const transactionListReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.TRANSACTION_LIST) {
		return {
			rows: action.payload.rows?.txnsData,
			noOfpages: action.payload.rows?.noOfpages || state.noOfpages,
			loaded: true,
			errors: action.error
		};
	} else {
		return state;
	}
};

const transactionListSearchReducer = (state = { rows: [], loaded: false, errors: null }, action = {}) => {
	if (action.type === types.TRANSACTION_LIST_SEARCH) {
		return {
			rows: action.payload.rows?.txnsData,
			noOfpages: action.payload.rows?.noOfpages || state.noOfpages,
			loaded: true,
			errors: action.error,
			query: action.payload.query,
			pageParams: action.payload.pageParams
		};
	} else {
		return state;
	}
};

const reducer = combineReducers({
	chaincodeList: chaincodeListReducer,
	channels: channelsReducer,
	peerList: peerListReducer,
	blockRangeSearch: blockRangeSearchReducer,
	txnList: txnListReducer,
	blockHashList: blockHashReducer,
	blockTxnIdList: blockTxnIdReducer,
	blockSearch: blockSearchReducer,
	chaincodeMetaData: chaincodeMetaDataReducer,
	channelPeerData: channelPeerDataReducer,
	transaction: transactionReducer,
	transactionList: transactionListReducer,
	blockListSearch: blockListSearchReducer,
	transactionListSearch: transactionListSearchReducer
});

export default reducer;
