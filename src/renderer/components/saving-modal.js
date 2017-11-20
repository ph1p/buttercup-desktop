import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer as ipc } from 'electron';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import { translate } from 'react-i18next';
import spinner from '../styles/img/spinner.svg';

const SavingDialog = styled(Flex)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

const SavingDialogText = styled.div`
  color: #fff;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 10px;
  padding: var(--spacing-half) var(--spacing-one);

  p {
    margin: 0;
  }
`;

class SavingModal extends Component {
  static propTypes = {
    t: PropTypes.func
  };

  state = {
    isSaving: false
  };

  componentDidMount() {
    ipc.on('save-started', () => {
      this.setState({ isSaving: true });
    });
    ipc.on('save-completed', () => {
      this.setState({ isSaving: false });
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners('save-started');
    ipc.removeAllListeners('save-completed');
  }

  render() {
    const { t } = this.props;
    if (this.state.isSaving === false) {
      return null;
    }
    return (
      <SavingDialog align="center" justify="center">
        <SavingDialogText>
          <img width="64" src={spinner} alt="Loading" />
          <p>{t('archive-saved-loading-info')}</p>
        </SavingDialogText>
      </SavingDialog>
    );
  }
}
export default translate()(SavingModal);
