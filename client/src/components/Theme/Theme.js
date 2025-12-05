/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import indigo from '@material-ui/core/colors/indigo';
import lightBlue from '@material-ui/core/colors/lightBlue';
import red from '@material-ui/core/colors/red';
import { themeSelectors } from '../../state/redux/theme';
import '../../static/css/main.css';
import '../../static/css/main-dark.css';
import '../../static/css/media-queries.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'font-awesome/css/font-awesome.min.css';

class Theme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  render() {
    const { mode, children } = this.props;
    return (
      <MuiThemeProvider theme={this.getTheme(mode)}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    );
  }

  getTheme(mode) {
    return createTheme({
      palette: {
        contrastThreshold: 3,
        tonalOffset: 0.2,
        background: { paper: mode === 'dark' ? '#453e68' : '#FFFFFF' },
        primary: {
          main: '#3B82F6',
          dark: '#242036',
          light: '#3B82F6',
          ...indigo
        },
        secondary: lightBlue,
        text: {
          primary: mode === 'dark' ? '#ffffff' : '#212121',
          secondary: '#757575',
        },
        error: {
          main: red[500],
        },
        toggleClass: true,
        type: mode,
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 16,
        fontWeightRegular: 400,
        fontWeightMedium: 600,
        fontWeightBold: 700,
      },
    });
  }
}

const { modeSelector } = themeSelectors;

export default connect(state => ({
  mode: modeSelector(state),
}))(Theme);
