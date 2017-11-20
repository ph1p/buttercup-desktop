import Buttercup from 'buttercup/dist/buttercup-web.min';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../shared/i18n';
import { ipcRenderer as ipc } from 'electron';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore from '../shared/store/configure-store';
import { linkArchiveManagerToStore } from '../shared/buttercup/store';
import {
  addArchiveFromSource,
  loadOrUnlockArchive,
  setCurrentArchive,
  importHistoryIntoArchive
} from '../shared/actions/archives';
import { setUIState } from '../shared/actions/ui-state';
import { showHistoryPasswordPrompt } from '../shared/buttercup/import';
import { setupShortcuts } from './system/shortcuts';
import { setSetting } from '../shared/actions/settings';
import { getSetting } from '../shared/selectors';
import Root from './containers/root';

// Unhandled rejections
const unhandled = require('electron-unhandled');
unhandled();

// Alter some Buttercup internals
Buttercup.Web.HashingTools.patchCorePBKDF();
Buttercup.vendor.webdavFS.setFetchMethod(window.fetch);

// Create store
const store = configureStore({}, 'renderer');

i18n.changeLanguage(getSetting(store.getState(), 'locale'));
linkArchiveManagerToStore(store);
setupShortcuts(store);

// Reset current archive
store.dispatch(setCurrentArchive(null));

ipc.send('init');

ipc.on('load-archive', (e, payload) => {
  store.dispatch(addArchiveFromSource(payload));
});

ipc.on('set-current-archive', (e, payload) => {
  store.dispatch(loadOrUnlockArchive(payload));
});

ipc.on('import-history', (e, payload) => {
  store.dispatch(importHistoryIntoArchive(payload));
});

ipc.on('import-history-prompt', (e, payload) => {
  showHistoryPasswordPrompt(payload)
    .then(result => {
      ipc.send('import-history-prompt-resp', result);
    })
    .catch(() => {
      ipc.send('import-history-prompt-resp', null);
    });
});

ipc.on('will-quit', () => {
  store.dispatch(setUIState('isExiting', true));
});

const currentLocale = getSetting(store.getState(), 'locale');
const renderApp = (RootContainer, i18n) =>
  render(
    <I18nextProvider i18n={i18n}>
      <AppContainer>
        <RootContainer store={store} />
      </AppContainer>
    </I18nextProvider>,
    document.getElementById('root')
  );

// set lang on load
ipc.send('change-locale-main', currentLocale);

// show message, when locale changed
ipc.on('change-initial-locale', (e, lang) => {
  i18n.changeLanguage(lang);
  store.dispatch(setSetting('locale', lang));
  renderApp(Root, i18n);
});

ipc.on('change-locale-main', (e, lang) => {
  // refresh main menu
  ipc.send('change-locale-main', lang);
  store.dispatch(setSetting('locale', lang));
  i18n.changeLanguage(lang);
  renderApp(Root, i18n);
});

renderApp(Root, i18n);

if (module.hot) {
  module.hot.accept('./containers/root', () => {
    const NewRoot = require('./containers/root').default;

    renderApp(NewRoot, i18n);
  });
}
