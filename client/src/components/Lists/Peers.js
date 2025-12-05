/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactTable from '../Styled/Table';
import { peerListType } from '../types';

/* istanbul ignore next */
const Peers = ({ peerList }) => {
	const columnHeaders = [
		{
			Header: 'Peer name',
			accessor: 'server_hostname'
		},
		{
			Header: 'Request URL',
			accessor: 'requests'
		},
		{
			Header: 'Peer type',
			accessor: 'peer_type'
		},
		{
			Header: 'MSPID',
			accessor: 'mspid'
		},
		{
			Header: 'High',
			accessor: 'ledger_height_high'
		},
		{
			Header: 'Low',
			accessor: 'ledger_height_low'
		},
		{
			Header: 'Unsigned',
			id: 'ledger_height_unsigned',
			accessor: d => d.ledger_height_unsigned.toString()
		},
	];

	return (
		<div style={{ marginTop: 16 }}>
			<ReactTable
				className="network-table"
				data={peerList}
				columns={columnHeaders}
				defaultPageSize={5}
				previousText="Previous"
				nextText="Next"
				pageText="Page"
				ofText="of"
				rowsText="rows"
				minRows={0}
				showPagination={peerList.length >= 5}
			/>
		</div>
	);
};

Peers.propTypes = {
	peerList: peerListType.isRequired,
};

export default Peers;