import { connect } from 'react-redux';
import TreeView from '../components/tree-view';
import * as groupTools from '../../shared/actions/groups';
import * as entryTools from '../../shared/buttercup/entries';
import {
  getGroups,
  getCurrentGroupId,
  getExpandedKeys
} from '../../shared/selectors';
import { setExpandedKeys } from '../../shared/actions/ui';

export default connect(
  state => ({
    groups: getGroups(state),
    getEntries: groupId =>
      entryTools.loadEntries(state.currentArchive, groupId),
    sortMode: state.groups.sortMode,
    expandedKeys: getExpandedKeys(state),
    selectedKeys: [getCurrentGroupId(state)]
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
    onExpand: setExpandedKeys
  }
)(TreeView, 'TreeView');
