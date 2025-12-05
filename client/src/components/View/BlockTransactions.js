/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as CloseIcon } from '../../static/images/Close16.svg';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { blockHashType, onCloseType } from '../types';
import ReactTable from '../Styled/Table';
import { get } from '../../services/request';
import moment from 'moment';
import matchSorter from 'match-sorter';
import Tooltip from '@material-ui/core/Tooltip';

const monoStack = '"JetBrains Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace';
const bodyStack = '"Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif';

const styles = theme => {
    const { type } = theme.palette;
    const dark = type === 'dark';
    return {
        root: {
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
            width: '100%',
            padding: '16px',
            minHeight: '500px',
            fontFamily: bodyStack,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 16px 16px 24px',
            backgroundColor: '#ffffff',
        },
        title: {
            color: '#3B82F6',
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
            fontFamily: monoStack
        },
        breadcrumb: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: monoStack
        },
        breadcrumbText: {
            color: '#9E9E9E',
        },
        breadcrumbIcon: {
            color: '#9E9E9E',
            margin: '0 8px',
            width: 20,
            height: 20
        },
        breadcrumbActive: {
            color: '#3B82F6',
        },
        closeBtn: {
            background: 'none',
            border: 'none',
            marginRight: 8,
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
                opacity: 0.85
            },
            '&:focus': {
                outline: 'none'
            }
        },
        body: {
            flex: 1,
            width: 1400,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
        },
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

export class BlockTransactions extends Component {
    state = {
        transactions: [],
        loading: false,
        sorted: [],
        filtered: []
    };

    componentDidMount() {
        this.fetchTransactions();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.block !== this.props.block) {
            this.fetchTransactions();
        }
    }

    fetchTransactions = async () => {
        const { block } = this.props;
        if (!block || !block.txhash) {
            this.setState({ transactions: [], loading: false });
            return;
        }

        this.setState({ loading: true });
        const promises = block.txhash.map(hash =>
            get(`/api/transaction/${block.channelname}/${hash}`)
                .then(resp => resp.row)
                .catch(err => {
                    console.error(err);
                    return null;
                })
        );

        const results = await Promise.all(promises);
        const transactions = results.filter(t => t !== null);
        this.setState({ transactions, loading: false });
    };

    handleClose = () => {
        const { onClose } = this.props;
        onClose();
    };

    render() {
        const { block, classes, onViewTransaction } = this.props;
        const { transactions, loading } = this.state;

        if (!block) return null;

        const columns = [
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
                            onClick={(e) => {
                                e.preventDefault();
                                onViewTransaction && onViewTransaction(row.value);
                            }}
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

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <div className={classes.breadcrumb}>
                        <span className={classes.breadcrumbText}>Block #{block.blocknum}</span>
                        <NavigateNextIcon className={classes.breadcrumbIcon} />
                        <span className={classes.breadcrumbActive}>List transaction</span>
                    </div>
                    <button
                        type="button"
                        onClick={this.handleClose}
                        className={classes.closeBtn}
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className={classes.body}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>Loading transactions...</div>
                    ) : (
                        <ReactTable
                            className="network-table"
                            data={transactions}
                            columns={columns}
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
                            showPagination={transactions.length > 5}
                        />
                    )}
                </div>
            </div>
        );
    }
}

BlockTransactions.propTypes = {
    block: blockHashType.isRequired,
    onClose: onCloseType.isRequired
};

export default withStyles(styles)(BlockTransactions);
