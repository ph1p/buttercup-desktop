import { ipcMain as ipc, BrowserWindow, session } from 'electron';
import { Buffer } from 'buffer';
import log from 'electron-log';
import { getSetting } from '../shared/selectors';
import fetch from 'electron-fetch';

export function setupNetwork(store) {
  const state = store.getState();

  const proxySchema = getSetting(state, 'proxySchema');
  const proxyUrl = getSetting(state, 'proxyUrl');
  const proxyPort = getSetting(state, 'proxyPort');

  const ses = session.defaultSession;
  if (proxyUrl && proxyPort) {
    const url = `${proxySchema}=${proxyUrl}:${proxyPort}`;

    ses.setProxy(
      {
        proxyRules: url,
        proxyBypassRules: 'localhost'
      },
      d => {
        console.log('USING PROXY: ', url);
      }
    );
  }

  ipc.on('nw-request', async (e, { url, type, id }) => {
    if (!id) {
      throw new Error('Request needs an id!');
    }
    const win = BrowserWindow.getFocusedWindow();

    log.info('URL: %j', url);

    if (win) {
      try {
        const res = await fetch(url);
        let response = res.body;

        if (type === 'text') {
          response = await res.text();
        } else if (type === 'buffer') {
          response = Buffer.from(await res.arrayBuffer());
        }

        win.webContents.send('nw-response-' + id, response);
      } catch (e) {
        win.webContents.send('nw-response-' + id, null);
      }
    }
  });
}
