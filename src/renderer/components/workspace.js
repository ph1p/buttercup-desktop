import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { remote } from 'electron';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import Archive from '../containers/archive';
import Sidebar from '../containers/sidebar';
import '../styles/workspace.global.scss';
import UpdateNotice from './update-notice';
import SavingModal from './saving-modal';
import { NoArchiveSelected, WelcomeScreen } from './empty-view';
const win = remote.getCurrentWindow();
const Primary = styled(Flex)`
  position: relative;
`;

export default class Workspace extends Component {
  static propTypes = {
    currentArchive: PropTypes.object,
    archivesCount: PropTypes.number,
    update: PropTypes.object,
    columnSizes: PropTypes.object,
    condencedSidebar: PropTypes.bool,
    installUpdate: PropTypes.func,
    setColumnSize: PropTypes.func
  };

  state = {
    isFocused: false
  };
  componentDidMount() {
    win.on('focus', () => {
      this.setState({
        isFocused: true
      });
    });
    win.on('blur', () => {
      this.setState({
        isFocused: false
      });
    });
  }

  closeApp() {
    win.close();
  }

  maxApp() {}

  minApp() {
    win.minimize();
  }

  render() {
    const {
      currentArchive,
      archivesCount,
      update,
      installUpdate,
      setColumnSize,
      columnSizes,
      condencedSidebar
    } = this.props;
    const { isFocused } = this.state;

    return (
      <Flex flexAuto>
        <div className={'titlebar' + (isFocused ? ' active' : '')}>
          <div className="titlebar-stoplight">
            <div className="titlebar-close" onClick={this.closeApp} />
            <div className="titlebar-minimize" onClick={this.minApp} />
            <div className="titlebar-fullscreen" onClick={this.maxApp} />
          </div>
        </div>

        {archivesCount > 0 && <Sidebar condenced={condencedSidebar} />}
        <Primary flexAuto>
          <Choose>
            <When condition={archivesCount === 0}>
              <WelcomeScreen />
            </When>
            <When condition={archivesCount > 0 && currentArchive === null}>
              <NoArchiveSelected />
            </When>
            <Otherwise>
              <Archive
                columnSizes={columnSizes}
                onColumnSizeChange={setColumnSize}
              />
            </Otherwise>
          </Choose>
        </Primary>
        <UpdateNotice {...update} onClick={() => installUpdate()} />
        <SavingModal />
      </Flex>
    );
  }
}
