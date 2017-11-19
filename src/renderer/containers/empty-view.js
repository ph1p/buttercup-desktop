import { connect } from 'react-redux';
import EmptyView from '../components/empty-view';
import * as entries from '../../shared/actions/entries';

export default connect(state => ({}), {
  handleAddEntry: entries.changeMode('new')
})(EmptyView, 'EmptyView');
