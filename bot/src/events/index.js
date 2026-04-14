import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { events } from './registry.js';

export async function loadEvents(client) {
    for (const event of events) {
        if (event.default && event.default.once) {
            client.once(event.default.name, (...args) => event.default.execute(...args));
        } else if (event.default) {
            client.on(event.default.name, (...args) => event.default.execute(...args));
        }
    }
}
