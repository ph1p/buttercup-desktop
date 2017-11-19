import { connect } from 'react-redux';
import TreeView from '../components/tree-view';
import * as groupTools from '../../shared/actions/groups';
import * as entryTools from '../../shared/buttercup/entries';
import * as entries from '../../shared/actions/entries';
import {
  getGroups,
  getCurrentGroupId,
  getExpandedKeys,
  getFilteredEntries
} from '../../shared/selectors';
import { setExpandedKeys } from '../../shared/actions/ui';

export default connect(
  state => ({
    groups: getGroups(state),
    filter: state.entries.filter,
    entriesSortMode: state.entries.sortMode,
    getEntries: groupId =>
      entryTools.loadEntries(state.currentArchive, groupId) || [],
    sortMode: state.groups.sortMode,
    expandedKeys: getExpandedKeys(state),
    selectedKeys: [getCurrentGroupId(state)],
    filteredEntries: getFilteredEntries(state)
  }),
  {
    onAddClick: groupTools.addGroup,
    onRemoveClick: groupTools.removeGroup,
    onSaveClick: groupTools.saveGroupTitle,
    onCreateNew: groupTools.createNewGroup,
    onDismissClick: groupTools.dismissNewGroups,
    onRenameClick: groupTools.renameGroup,
    onEmptyTrash: groupTools.emptyTrash,
    onMoveGroup: groupTools.moveGroupToParent,
    onGroupSelect: groupTools.loadGroup,
    onSortModeChange: groupTools.setSortMode,
    onExpand: setExpandedKeys,
    onFilterChange: entries.setFilter,
    onEntriesSortModeChange: entries.setSortMode
  }
)(TreeView, 'TreeView');
