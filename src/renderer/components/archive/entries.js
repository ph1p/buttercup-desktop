import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PlusIcon from 'react-icons/lib/md/add';
import styled from 'styled-components';
import { Button } from '@buttercup/ui';
import { translate, Trans } from 'react-i18next';
import { isOSX } from '../../../shared/utils/platform';
import {
  showContextMenu,
  createMenuFromGroups,
  createCopyMenu
} from '../../system/menu';
import BaseColumn from '../column';
import List from './entries-list';

const Column = styled(BaseColumn)`
  background-color: ${'var(--entries-bg)'};
  color: #fff;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: calc(-1 * var(--spacing-half));

  button {
    color: #fff;
  }
`;

class Entries extends Component {
  static propTypes = {
    entries: PropTypes.array,
    groups: PropTypes.array,
    currentEntry: PropTypes.object,
    currentGroup: PropTypes.object,
    onSelectEntry: PropTypes.func,
    onEntryMove: PropTypes.func,
    onDelete: PropTypes.func,
    handleAddEntry: PropTypes.func,
    t: PropTypes.func
  };

  onRightClick(entry) {
    const {
      groups,
      currentGroup,
      currentEntry,
      onEntryMove,
      onDelete,
      t
    } = this.props;
    showContextMenu([
      ...createCopyMenu(entry, currentEntry),
      { type: 'separator' },
      {
        label: t('move-to-group'),
        submenu: createMenuFromGroups(groups, currentGroup, groupId => {
          onEntryMove(entry.id, groupId);
        })
      },
      {
        label: entry.isInTrash ? t('delete-permanently') : t('move-to-trash'),
        click() {
          onDelete(entry.id);
        }
      }
    ]);
  }

  render() {
    const { currentGroup, handleAddEntry, onDelete } = this.props;

    const addButton = (
      <Button
        onClick={handleAddEntry}
        disabled={!currentGroup || currentGroup.isTrash}
        full
        dark
        icon={<PlusIcon />}
      >
        <Trans i18nKey="add-entry" parent="span">
          Add Entry
        </Trans>
      </Button>
    );

    return (
      <Column footer={addButton}>
        <List
          onDelete={onDelete}
          entries={this.props.entries}
          currentEntry={this.props.currentEntry}
          onSelectEntry={this.props.onSelectEntry}
          onRightClick={entry => this.onRightClick(entry)}
        />
      </Column>
    );
  }
}

export default translate()(Entries);
