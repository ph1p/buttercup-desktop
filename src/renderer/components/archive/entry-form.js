import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import PlusIcon from 'react-icons/lib/md/add';
import RemoveIcon from 'react-icons/lib/fa/trash-o';
import { translate } from 'react-i18next';
import { Button } from '@buttercup/ui';
import styles from '../../styles/entry-form';
import Input from './entry-input';

const renderMeta = (
  { fields, t, meta: { touched, error } } // eslint-disable-line react/prop-types
) => (
  <div>
    <div className={styles.metaWrapper}>
      {fields.map((member, index) => (
        <div className={styles.formRow} key={index}>
          <div className={styles.labelWrapper}>
            <Field
              name={`${member}.key`}
              type="text"
              component="input"
              placeholder={t('label')}
            />
          </div>
          <Field
            name={`${member}.value`}
            type="text"
            component={Input}
            placeholder={t('new-field')}
          />
          <Button onClick={() => fields.remove(index)} icon={<RemoveIcon />} />
        </div>
      ))}
    </div>
    <Button
      onClick={e => {
        fields.push({});
        e.stopPropagation();
        e.preventDefault();
      }}
      icon={<PlusIcon />}
    >
      {t('add-new-field')}
    </Button>
    {touched && error && <span>{error}</span>}
  </div>
);

class EntryForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    t: PropTypes.func
  };

  render() {
    const { handleSubmit, t } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <label className={styles.labelWrapper} htmlFor="properties.title">
            {t('title')}
          </label>
          <Field
            name="properties.title"
            component={Input}
            type="text"
            placeholder={t('untitled')}
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.labelWrapper} htmlFor="properties.username">
            {t('username')}
          </label>
          <Field
            name="properties.username"
            component={Input}
            type="text"
            placeholder={'@' + t('username') + '...'}
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.labelWrapper} htmlFor="properties.password">
            {t('password')}
          </label>
          <Field
            name="properties.password"
            component={Input}
            type="password"
            placeholder={t('secure-password') + '...'}
          />
        </div>
        <h6 className={styles.heading}>{t('custom-fields')}:</h6>
        <FieldArray name="meta" component={renderMeta} t={t} />
      </form>
    );
  }
}

export default translate()(EntryForm);
