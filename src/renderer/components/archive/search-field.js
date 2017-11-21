import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import SearchIcon from 'react-icons/lib/md/search';
import styles from '../../styles/search-field';
// import SortButton from './sort-button';

class SearchField extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    entries: PropTypes.array,
    filter: PropTypes.string,
    t: PropTypes.func
  };

  handleClearClick() {
    if (this.textInput) {
      this.textInput.value = '';
      this.props.onChange('');
    }
  }

  handleKeyUp(e) {
    if (e.which === 27) {
      this.handleClearClick();
      e.target.blur();
    }
  }

  // <SortButton mode={sortMode} onChange={this.handleSortModeChange} />
  render() {
    const { filter, onChange, t, entries } = this.props;

    return (
      <div className={styles.wrapper}>
        <input
          type="text"
          value={filter}
          onChange={e => onChange(e.target.value)}
          onKeyUp={e => this.handleKeyUp(e)}
          className={styles.field}
          placeholder={t('search') + '...'}
          ref={input => {
            this.textInput = input;
          }}
        />
        <span className={styles.icon}>
          <SearchIcon />
        </span>
        {filter !== '' && (
          <span
            className={styles.clear}
            onClick={() => this.handleClearClick()}
          />
        )}
        <If condition={filter}>
          <div className={styles.results}>
            <ul>
              {entries.length > 0 ? (
                entries.map((entry, index) => (
                  <li key={index}>
                    {entry.properties.title}
                    <p>{entry.properties.username}</p>
                  </li>
                ))
              ) : (
                <li className={styles.nothingFound}>
                  <Trans i18nKey="nothing-found" parent="span">
                    Nothing found
                  </Trans>
                </li>
              )}
            </ul>
          </div>
        </If>
      </div>
    );
  }
}

export default translate()(SearchField);
