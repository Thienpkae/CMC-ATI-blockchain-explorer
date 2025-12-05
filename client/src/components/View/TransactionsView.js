/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import View from '../Styled/View';
import Transactions from '../Lists/Transactions';
import {
	currentChannelType,
	getTransactionType,
	transactionType,
	transactionListType
} from '../types';

export const TransactionsView = ({
	currentChannel,
	getTransaction,
	transaction,
	transactionList,
	getTransactionListSearch,
	transactionByOrg,
	transactionListSearch,
	transactionId,
	removeTransactionId,
	transactionListSearchTotalPages,
	transactionListTotalPages,
	transactionListSearchPageParam,
	transactionListSearchQuery
}) => (
	<View>
		<Transactions
			currentChannel={currentChannel}
			transactionList={transactionList}
			transaction={transaction}
			transactionByOrg={transactionByOrg}
			getTransaction={getTransaction}
			getTransactionListSearch={getTransactionListSearch}
			transactionListSearch={transactionListSearch}
			transactionId={transactionId}
			removeTransactionId={removeTransactionId}
			transactionListSearchTotalPages={transactionListSearchTotalPages}
			transactionListTotalPages={transactionListTotalPages}
			transactionListSearchPageParam={transactionListSearchPageParam}
			transactionListSearchQuery={transactionListSearchQuery}
		/>
	</View>
);

TransactionsView.propTypes = {
	currentChannel: currentChannelType.isRequired,
	getTransaction: getTransactionType.isRequired,
	transaction: transactionType.isRequired,
	transactionList: transactionListType.isRequired
};

export default TransactionsView;
