import {
  Iconographer,
  setDataFetcher,
  setTextFetcher
} from '@buttercup/iconographer';
import IconFileStorage from './IconFileStorage';
import electron, { ipcRenderer } from 'electron';
import path from 'path';

const app = electron.app || electron.remote.app;
const iconPath = path.join(app.getPath('userData'), 'icons');

const randomNumber = max => Math.floor(Math.random() * Math.floor(max));

setTextFetcher(url => {
  // id to prevent returning wrong data
  const id = Date.now() - randomNumber(1000);

  ipcRenderer.send('nw-request', { url, id, type: 'text' });

  return new Promise((resolve, reject) => {
    try {
      ipcRenderer.once('nw-response-' + id, (e, res) => resolve(res));
    } catch (e) {
      reject(e);
    }
  });
});

setDataFetcher(url => {
  // id to prevent returning wrong data
  const id = Date.now() - randomNumber(1000);

  ipcRenderer.send('nw-request', { url, id, type: 'buffer' });

  return new Promise((resolve, reject) => {
    try {
      ipcRenderer.once('nw-response-' + id, (e, res) => resolve(res));
    } catch (e) {
      reject(e);
    }
  });
});

const storage = new IconFileStorage(iconPath);
const iconographer = new Iconographer();
iconographer.storageInterface = storage;

export default iconographer;
