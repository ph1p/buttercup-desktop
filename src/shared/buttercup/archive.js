import path from 'path';
import {
  ArchiveManager,
  createCredentials,
  EntryFinder
} from 'buttercup/dist/buttercup-web.min';
import ElectronStorageInterface from './storage';
import { enqueue } from '../../renderer/system/queue';
import './ipc-datasource';
import i18n from '../i18n';

let __sharedManager = null;
let __sharedEntrySearch = null;

export function addArchiveToArchiveManager(masterConfig, masterPassword) {
  const { credentials, datasource, type, path: filePath, isNew } = masterConfig;

  const passwordCredentials = createCredentials.fromPassword(masterPassword);
  const sourceCredentials = createCredentials(type, credentials);
  sourceCredentials.setValue(
    'datasource',
    JSON.stringify({
      type,
      ...datasource
    })
  );

  const manager = getSharedArchiveManager();

  return manager.addSource(
    path.basename(filePath),
    sourceCredentials,
    passwordCredentials,
    isNew
  );
}

export function lockArchiveInArchiveManager(archiveId) {
  const manager = getSharedArchiveManager();
  return manager
    .lock(archiveId)
    .then(() => archiveId)
    .catch(err => {
      const { message } = err;
      if (message) {
        throw new Error(message);
      }
      throw err;
    });
}

export function removeArchiveFromArchiveManager(archiveId) {
  const manager = getSharedArchiveManager();
  return manager.remove(archiveId);
}

export function unlockArchiveInArchiveManager(archiveId, masterPassword) {
  const manager = getSharedArchiveManager();
  return manager
    .unlock(archiveId, masterPassword)
    .then(() => archiveId)
    .catch(err => {
      const { message } = err;
      if (message) {
        if (message.includes('ENOENT')) {
          throw new Error(i18n.t('archive-not-found-error'));
        } else if (message.includes('Authentication')) {
          throw new Error(i18n.t('authentication-failed-error'));
        }
        throw new Error(message);
      }
      throw err;
    });
}

export function getSharedArchiveManager() {
  if (__sharedManager === null) {
    __sharedManager = new ArchiveManager(new ElectronStorageInterface());
  }
  return __sharedManager;
}

export function getArchive(archiveId) {
  const manager = getSharedArchiveManager();
  const sourceIndex = manager.indexOfSource(archiveId);
  const source = manager.sources[sourceIndex];
  return source.workspace.primary.archive;
}

export function getArchiveEntryFinder(archiveId, reload = false) {
  const archive = getArchive(archiveId);

  if (__sharedEntrySearch === null || reload) {
    __sharedEntrySearch = new EntryFinder([archive]);
  }
  return __sharedEntrySearch;
}

export function saveWorkspace(archiveId) {
  const manager = getSharedArchiveManager();
  const sourceIndex = manager.indexOfSource(archiveId);
  const { workspace } = manager.sources[sourceIndex];

  enqueue('saves', () => {
    return workspace
      .localDiffersFromRemote()
      .then(
        differs =>
          differs
            ? workspace.mergeSaveablesFromRemote().then(() => true)
            : false
      )
      .then(shouldSave => (shouldSave ? workspace.save() : null));
  });
}
