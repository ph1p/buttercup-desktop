import { ipcMain as ipc, BrowserWindow } from 'electron';
import fetch from 'node-fetch';
import { Buffer } from 'buffer';
import HttpsProxyAgent from 'https-proxy-agent';
import log from 'electron-log';
import { getSetting } from '../shared/selectors';

export function setupNetwork(store) {
  ipc.on('nw-request', async (e, { url, type, id }) => {
    if (!id) {
      throw new Error('Request needs an id!');
    }
    const win = BrowserWindow.getFocusedWindow();

    const state = store.getState();

    const proxyUrl = getSetting(state, 'proxyUrl');
    const proxyPort = getSetting(state, 'proxyPort');

    const proxy =
      process.env.http_proxy ||
      (proxyUrl && proxyPort ? 'https://' + proxyUrl + ':' + proxyPort : '');

    let options = {};

    log.info('URL: %j', url);
    if (proxy) {
      log.info('using proxy server %j', proxy);
      options = {
        ...options,
        agent: new HttpsProxyAgent(proxy)
      };
    }

    try {
      const res = await fetch(url, options);
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
  });
}
