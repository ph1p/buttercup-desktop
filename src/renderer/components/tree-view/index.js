import React, { Component } from 'react';
import { isString } from 'lodash';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Tree, { TreeNode } from 'rc-tree';
import styled from 'styled-components';
import PlusIcon from 'react-icons/lib/md/add';
import { Button } from '@buttercup/ui';
import SearchField from '../../components/archive/search-field';
import { translate } from 'react-i18next';
import { Translate } from '../../../shared/i18n';
import {
  showContextMenu,
  createMenuFromGroups,
  createSortMenu
} from '../../system/menu';
import '../../styles/tree-view.global';
import BaseColumn from '../column';
import TreeLabel from './tree-label';

const Column = styled(BaseColumn)`
  background-color: var(--groups-bg);
  color: #fff;
  padding-top: var(--spacing-one);
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: -10px 0 0 0;
  //margin-right: calc(-1 * var(--spacing-half));

  button {
    color: #fff;
  }
`;

class TreeView extends Component {
  static propTypes = {
    expandedKeys: PropTypes.array,
    filter: PropTypes.string,
    selectedKeys: PropTypes.array,
    groups: PropTypes.array,
    sortMode: PropTypes.string,
    entriesSortMode: PropTypes.string,
    onRemoveClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onCreateNew: PropTypes.func,
    onDismissClick: PropTypes.func,
    onAddClick: PropTypes.func,
    onRenameClick: PropTypes.func,
    onGroupSelect: PropTypes.func,
    onEmptyTrash: PropTypes.func,
    onMoveGroup: PropTypes.func,
    onSortModeChange: PropTypes.func,
    getEntries: PropTypes.func,
    onExpand: PropTypes.func,
    onFilterChange: PropTypes.func,
    onEntriesSortModeChange: PropTypes.func,
    searchInArchive: PropTypes.func,
    onSelectEntry: PropTypes.func,
    t: PropTypes.func
  };

  state = {
    filteredEntries: []
  };

  handleColumnRightClick() {
    const { sortMode, onSortModeChange, t } = this.props;

    showContextMenu([
      {
        label: t('new-group'),
        click: () => this.handleAddClick()
      },
      { type: 'separator' },
      ...createSortMenu(
        [
          {
            mode: 'title-asc',
            label: t('title-asc'),
            icon: 'sort-alpha-asc'
          },
          {
            mode: 'title-desc',
            label: t('title-desc'),
            icon: 'sort-alpha-desc'
          }
        ],
        sortMode,
        newMode => onSortModeChange(newMode)
      )
    ]);
  }

  handleRightClick = (node, groups, e) => {
    const { id: groupId, isTrash, depth } = node;
    const { t } = this.props;

    // Prevent right click from propagation to parent
    e.stopPropagation();

    if (isTrash) {
      showContextMenu([
        {
          label: t('empty-trash'),
          click: () => this.props.onEmptyTrash()
        }
      ]);
    } else {
      const nonRootContextMenu =
        depth > 0
          ? [
              {
                label: t('move-to-root'),
                click: () => this.props.onMoveGroup(groupId, null)
              }
            ]
          : [];

      const availableGroups = createMenuFromGroups(
        groups,
        groupId,
        selectedGroupId => {
          this.props.onMoveGroup(groupId, selectedGroupId);
        },
        false
      );

      const groupsMenu =
        availableGroups.items.length > 0
          ? {
              submenu: availableGroups
            }
          : {};

      showContextMenu([
        {
          label: t('add-group'),
          click: () => this.handleAddClick(null, groupId)
        },
        { type: 'separator' },
        ...nonRootContextMenu,
        {
          label: t('move-to-group'),
          enabled: availableGroups.items,
          ...groupsMenu
        },
        {
          label: t('rename'),
          click: () => this.props.onRenameClick(groupId)
        },
        { type: 'separator' },
        {
          label: t('delete'),
          click: () => this.handleRemoveClick(null, groupId)
        }
      ]);
    }
  };

  handleAddClick = (e, id) => {
    if (e) {
      e.stopPropagation();
    }
    this.props.onAddClick(isString(id) ? id : null);
  };

  handleRemoveClick = (e, id = null) => {
    if (e) {
      e.stopPropagation();
    }
    this.props.onRemoveClick(isString(id) ? id : null);
  };

  handleExpand = expandedKeys => {
    this.props.onExpand(expandedKeys);
  };

  handleDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    this.props.onMoveGroup(dragKey, dropKey, info.dropToGap);
  };

  handleSelect = ([selectedGroupId], { node }) => {
    const { isNew, isRenaming } = node.props;
    if (typeof selectedGroupId === 'string' && !isNew && !isRenaming) {
      this.props.onGroupSelect(selectedGroupId);
    }
  };

  handleFilterChange = value => {
    this.props.onFilterChange(value);

    console.log('CHANGE:', this.props.searchInArchive(value));
    this.setState({
      filteredEntries: this.props
        .searchInArchive(value)
        .map(value => value.entry._remoteObject)
    });
  };

  handleSortModeChange = newMode => {
    this.props.onEntriesSortModeChange(newMode);
  };

  render() {
    const { groups, getEntries, filter, onSelectEntry } = this.props;
    const { filteredEntries } = this.state;

    const loop = children => {
      if (!children) {
        return null;
      }

      return children.map(node => {
        return (
          <TreeNode
            isTrash={node.isTrash}
            isNew={node.isNew}
            isRenaming={node.isRenaming}
            key={node.id}
            className={cx({
              'is-trash': node.isTrash,
              'is-empty': node.groups.length === 0,
              node: true
            })}
            title={
              <TreeLabel
                entries={getEntries(node.id)}
                node={node}
                onRightClick={e => this.handleRightClick(node, groups, e)}
                onAddClick={this.handleAddClick}
                onRemoveClick={this.handleRemoveClick}
                onSaveClick={this.props.onSaveClick}
                onCreateNew={this.props.onCreateNew}
                onDismissClick={this.props.onDismissClick}
              />
            }
          >
            {loop(node.groups)}
          </TreeNode>
        );
      });
    };

    const filterNode = (
      <SearchWrapper>
        <SearchField
          onChange={this.handleFilterChange}
          filter={filter}
          entries={filteredEntries}
          onSelectEntry={onSelectEntry}
        />
      </SearchWrapper>
    );

    return (
      <Column
        header={filterNode}
        footer={
          <Button onClick={this.handleAddClick} dark full icon={<PlusIcon />}>
            <Translate i18nKey="new-group" parent="span" />
          </Button>
        }
        onContextMenu={() => this.handleColumnRightClick()}
      >
        <div style={!filter ? {} : { opacity: 0.2 }}>
          <Tree
            draggable
            showLine={false}
            expandedKeys={this.props.expandedKeys}
            selectedKeys={this.props.selectedKeys}
            autoExpandParent={false}
            onSelect={this.handleSelect}
            onExpand={this.handleExpand}
            onDrop={this.handleDrop}
          >
            {loop(groups)}
          </Tree>
        </div>
      </Column>
    );
  }
}

export default translate()(TreeView);
