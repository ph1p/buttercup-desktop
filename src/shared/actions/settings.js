import { createAction } from 'redux-actions';
import { COLUMN_SIZE_SET, SETTING_SET, GLOBAL_SHORTCUT_SET } from './types';

export const setColumnSize = createAction(COLUMN_SIZE_SET);
export const setGlobalShortcut = createAction(GLOBAL_SHORTCUT_SET);
export const setSetting = (key, value) => ({
  type: SETTING_SET,
  payload: {
    key,
    value
  }
});
