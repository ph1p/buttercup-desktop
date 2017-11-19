import PropTypes from 'prop-types';
import React from 'react';
import TrashIcon from 'react-icons/lib/fa/trash-o';
import styles from '../../styles/entries-list';

const List = ({
  entries,
  currentEntry,
  onSelectEntry,
  onRightClick,
  onDelete
}) => (
  <ul className={styles.list}>
    {entries.map(entry => (
      <li
        key={entry.id}
        className={
          currentEntry && entry.id === currentEntry.id && styles.active
        }
        onClick={() => onSelectEntry(entry.id)}
        onContextMenu={() => onRightClick(entry)}
      >
        <strong>{entry.properties.title}</strong>
        <small>{entry.properties.username}</small>
        <TrashIcon
          className={styles.trash}
          onClick={onDelete.bind(this, entry.id)}
        />
      </li>
    ))}
  </ul>
);

List.propTypes = {
  entries: PropTypes.array,
  currentEntry: PropTypes.object,
  onSelectEntry: PropTypes.func,
  onRightClick: PropTypes.func,
  onDelete: PropTypes.func
};

export default List;
