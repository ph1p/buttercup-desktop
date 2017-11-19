import { connect } from 'react-redux';
import Archive from '../../components/archive';
import {
  getGroups,
  getCurrentEntry,
  getEntries,
  getCurrentGroup
} from '../../../shared/selectors';
import * as entries from '../../../shared/actions/entries';

export default connect(
  state => ({
    groups: getGroups(state),
    filter: state.entries.filter,
    sortMode: state.entries.sortMode,
    entries: getEntries(state),
    currentEntry: getCurrentEntry(state),
    currentGroup: getCurrentGroup(state)
  }),
  {
    onSelectEntry: entries.selectEntry,
    onEntryMove: entries.moveEntry,
    onFilterChange: entries.setFilter,
    onSortModeChange: entries.setSortMode,
    onDelete: entries.deleteEntry,
    handleAddEntry: entries.changeMode('new')
  }
)(Archive, 'Archive');
