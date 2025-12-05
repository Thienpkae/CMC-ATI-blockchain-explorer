/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ReactComponent as CloseIcon } from '../../static/images/Close16.svg';
import { ReactComponent as CopyIcon } from '../../static/images/Copy16.svg';
import { blockHashType, onCloseType } from '../types';
import moment from 'moment';

const monoStack = '"JetBrains Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace';
const bodyStack = '"Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif';

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
    },
    blueText: {
        color: '#3B82F6 !important',
        fontWeight: 600
    },
    copyIcon: {
        marginLeft: 8,
        marginRight: 8,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            opacity: 0.85
        }
    },
    hashValue: {
        fontFamily: monoStack
    }
});

const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    margin: 0
};

const thStyle = {
    borderTop: '1px solid #E5E7EB',
    padding: '12px 8px 12px 8px',
    verticalAlign: 'middle',
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
    verticalAlign: 'middle',
    fontSize: '14px',
    color: '#212121',
    textAlign: 'left',
    wordBreak: 'break-all',
    fontFamily: bodyStack
};

export class BlockDetails extends Component {
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
        const { block, classes } = this.props;
        const { copiedKey } = this.state;

        if (!block) {
            return (
                <div className={classes.root}>
                    <div className={classes.header}>
                        <h3 className={classes.title}>Block Details</h3>
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
                    <h3 className={classes.title}>Block #{block.blocknum}</h3>
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
                                <th style={thStyle}>Channel name</th>
                                <td style={tdStyle}>{block.channelname}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Block Number</th>
                                <td style={tdStyle}>{block.blocknum}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Created at</th>
                                <td style={tdStyle}>{moment(block.createdt).format('HH:mm:ss - DD/MM/YYYY')}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Number of Transactions</th>
                                <td style={{ ...tdStyle, color: '#3B82F6', fontWeight: 400 }}>{block.txcount}</td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Block Hash</th>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ flex: 1, wordBreak: 'break-all' }} className={classes.hashValue}>
                                            {block.blockhash}
                                        </span>
                                        <CopyToClipboard text={block.blockhash} onCopy={() => this.handleCopy('blockhash')}>
                                            <button type="button" className={classes.copyIcon}>
                                                {copiedKey === 'blockhash' ? <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600, whiteSpace: 'nowrap' }}>Copied</span> : <CopyIcon />}
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Data Hash</th>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ flex: 1, wordBreak: 'break-all' }} className={classes.hashValue}>
                                            {block.datahash}
                                        </span>
                                        <CopyToClipboard text={block.datahash} onCopy={() => this.handleCopy('datahash')}>
                                            <button type="button" className={classes.copyIcon}>
                                                {copiedKey === 'datahash' ? <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600, whiteSpace: 'nowrap' }}>Copied</span> : <CopyIcon />}
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th style={thStyle}>Previous Hash</th>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ flex: 1, wordBreak: 'break-all' }} className={classes.hashValue}>
                                            {block.prehash}
                                        </span>
                                        <CopyToClipboard text={block.prehash} onCopy={() => this.handleCopy('prehash')}>
                                            <button type="button" className={classes.copyIcon}>
                                                {copiedKey === 'prehash' ? <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600, whiteSpace: 'nowrap' }}>Copied</span> : <CopyIcon />}
                                            </button>
                                        </CopyToClipboard>
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

BlockDetails.propTypes = {
    block: blockHashType.isRequired,
    onClose: onCloseType.isRequired
};

export default withStyles(styles)(BlockDetails);
