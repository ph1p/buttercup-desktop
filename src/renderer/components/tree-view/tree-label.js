import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Translate } from '../../../shared/i18n';
import LabelEditor from './tree-label-edit';

const Node = styled.div`
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const EntryCount = styled.div`
  display: inline-block;
  margin: 0 0 0 8px;
  color: var(--gray-dark);
  background-color: var(--sidebar-bg);
  border-radius: 10px;
  padding: 0 6px;
  font-size: 11px;
`;

class TreeLabel extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    onDismissClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onCreateNew: PropTypes.func,
    onRightClick: PropTypes.func
  };

  handleSave = title => {
    const { isNew, parentId, id } = this.props.node;
    if (isNew) {
      this.props.onCreateNew(parentId, id, title);
    } else {
      this.props.onSaveClick(id, title);
    }
  };

  handleDismiss = () => {
    this.props.onDismissClick();
  };

  render() {
    const { node, onRightClick, entries, t } = this.props;
    const { title, isNew, isRenaming } = node;

    if (isNew || isRenaming) {
      return (
        <Node>
          <LabelEditor
            node={node}
            onSave={this.handleSave}
            onDismiss={this.handleDismiss}
          />
        </Node>
      );
    }

    return (
      <Node onContextMenu={onRightClick}>
        {title.trim() || (
          <i>
            {' '}
            <Translate i18nKey="untitled" parent="span" />
          </i>
        )}
        <EntryCount>{entries.length}</EntryCount>
      </Node>
    );
  }
}

export default TreeLabel;
