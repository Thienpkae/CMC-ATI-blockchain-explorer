/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ReactComponent as CloseIcon } from '../../static/images/Close16.svg';
import { ReactComponent as CopyIcon } from '../../static/images/Copy16.svg';
import { ReactComponent as ChevronsDown } from '../../static/images/ChevronsDown.svg';
import { transactionType, onCloseType } from '../types';
import JSONTree from 'react-json-tree';
import moment from 'moment';

const monoStack = '"JetBrains Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace';
const bodyStack = '"Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif';

const readTheme = {
    base00: '#f3f3f3',
    base01: '#2e2f30',
    base02: '#515253',
    base03: '#737475',
    base04: '#959697',
    base05: '#b7b8b9',
    base06: '#dadbdc',
    base07: '#fcfdfe',
    base08: '#e31a1c',
    base09: '#e6550d',
    base0A: '#dca060',
    base0B: '#31a354',
    base0C: '#80b1d3',
    base0D: '#3182bd',
    base0E: '#756bb1',
    base0F: '#b15928'
};
const writeTheme = {
    base00: '#ffffff',
    base01: '#2e2f30',
    base02: '#515253',
    base03: '#737475',
    base04: '#959697',
    base05: '#b7b8b9',
    base06: '#dadbdc',
    base07: '#fcfdfe',
    base08: '#e31a1c',
    base09: '#e6550d',
    base0A: '#dca060',
    base0B: '#31a354',
    base0C: '#80b1d3',
    base0D: '#3182bd',
    base0E: '#756bb1',
    base0F: '#b15928'
};

const styles = theme => ({
    root: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
        width: '880px',
        minHeight: '380px',
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
        padding: '0 16px',
        maxHeight: '600px',
        overflowY: 'auto'
    },
    copyIcon: {
        marginLeft: 8,
        marginRight: 8,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        '&:hover': {
            opacity: 0.85
        }
    },
    hashValue: {
        fontFamily: monoStack
    },
    JSONtree: {
        marginTop: -4,
        '& ul': {
            backgroundColor: 'transparent !important',
            color: '#212121',
            margin: '0 !important',
            padding: '0 !important',
            listStyle: 'none'
        },

    },
    readset_null: {
        display: 'none'
    }
});

const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    verticalAlign: 'top',
    margin: 0
};

const thStyle = {
    borderTop: '1px solid #E5E7EB',
    padding: '12px 8px 12px 8px',
    verticalAlign: 'top',
    fontSize: '14px',
    color: '#212121',
    fontWeight: 600,
    width: '214px',
    textAlign: 'left',
    fontFamily: bodyStack
};

const tdStyle = {
    borderTop: '1px solid #E5E7EB',
    padding: '12px 0 12px 8px',
    verticalAlign: 'top',
    fontSize: '14px',
    color: '#212121',
    textAlign: 'left',
    wordBreak: 'break-all',
    fontFamily: bodyStack
};

const reads = {
    color: '#2AA233'
};
const writes = {
    color: '#DD8016'
};

export class TransactionDetails extends Component {
    state = {
        copiedKey: null
    };

    handleClose = () => {
        const { onClose } = this.props;
        onClose();
    };

    handleCopy = (key) => {
        this.setState({ copiedKey: key });
        setTimeout(() => this.setState({ copiedKey: null }), 2000);
    };

    render() {
        const { transaction, classes } = this.props;
        const { copiedKey } = this.state;

        if (!transaction) {
            return (
                <div className={classes.root}>
                    <div className={classes.header}>
                        <h3 className={classes.title}>Transaction Details</h3>
                    </div>
                    <div className={classes.body}>
                        <div style={{ padding: '24px', textAlign: 'center', fontFamily: bodyStack, color: '#757575' }}>
                            Loading...
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <h3 className={classes.title}>Transaction Details</h3>
                    <button
                        type="button"
                        onClick={this.handleClose}
                        className={classes.closeBtn}
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className={classes.body}>
                    <table style={tableStyle}>
                        <tbody>
                            <tr>
                                <th style={thStyle}>Transaction ID</th>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ flex: 1, wordBreak: 'break-all' }} className={classes.hashValue}>
                                            {transaction.txhash}
                                        </span>
                                        <CopyToClipboard text={transaction.txhash} onCopy={() => this.handleCopy('txhash')}>
                                            <button type="button" className={classes.copyIcon}>
                                                {copiedKey === 'txhash' ? <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600, whiteSpace: 'nowrap' }}>Copied</span> : <CopyIcon />}
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Validation Code</th>
                                <td style={tdStyle}>{transaction.validation_code}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Payload Proposal Hash</th>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ flex: 1, wordBreak: 'break-all' }} className={classes.hashValue}>
                                            {transaction.payload_proposal_hash}
                                        </span>
                                        <CopyToClipboard text={transaction.payload_proposal_hash} onCopy={() => this.handleCopy('payload_proposal_hash')}>
                                            <button type="button" className={classes.copyIcon}>
                                                {copiedKey === 'payload_proposal_hash' ? <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600, whiteSpace: 'nowrap' }}>Copied</span> : <CopyIcon />}
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Creator MSP</th>
                                <td style={tdStyle}>{transaction.creator_msp_id}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Endorser</th>
                                <td style={tdStyle}>{transaction.endorser_msp_id}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Chaincode Name</th>
                                <td style={tdStyle}>{transaction.chaincodename}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Type</th>
                                <td style={tdStyle}>{transaction.type}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Time</th>
                                <td style={tdStyle}>{moment(transaction.createdt).format('HH:mm:ss - DD/MM/YYYY')}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Direct Link</th>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ flex: 1, wordBreak: 'break-all' }} >
                                            {window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/?tab=transactions&transId=' + transaction.txhash}
                                        </span>
                                        <CopyToClipboard text={window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/?tab=transactions&transId=' + transaction.txhash} onCopy={() => this.handleCopy('directLink')}>
                                            <button type="button" className={classes.copyIcon}>
                                                {copiedKey === 'directLink' ? <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600, whiteSpace: 'nowrap' }}>Copied</span> : <CopyIcon />}
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>
                            </tr>
                            <tr className={!transaction.read_set ? classes.readset_null : undefined}>
                                <th style={{ ...thStyle, ...reads }}>Reads</th>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div className={classes.JSONtree} style={{ flex: 1 }}>
                                            <JSONTree
                                                data={transaction.read_set}
                                                theme={readTheme}
                                                invertTheme={false}
                                                shouldExpandNode={() => false}
                                            />
                                        </div>
                                        <ChevronsDown style={{ color: '#3B82F6', marginRight: 8, minWidth: 16 }} />
                                    </div>
                                </td>
                            </tr>
                            <tr className={!transaction.read_set ? classes.readset_null : undefined}>
                                <th style={{ ...thStyle, ...writes }}>Writes</th>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div className={classes.JSONtree} style={{ flex: 1 }}>
                                            <JSONTree
                                                data={transaction.write_set}
                                                theme={writeTheme}
                                                invertTheme={false}
                                                shouldExpandNode={() => false}
                                            />
                                        </div>
                                        <ChevronsDown style={{ color: '#3B82F6', marginRight: 8, minWidth: 16 }} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

TransactionDetails.propTypes = {
    transaction: transactionType,
    onClose: onCloseType.isRequired
};

export default withStyles(styles)(TransactionDetails);
