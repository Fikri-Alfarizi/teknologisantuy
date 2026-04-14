import * as guildMemberAdd from './guildMemberAdd.js';
import * as guildMemberRemove from './guildMemberRemove.js';
import * as interactionCreate from './interactionCreate.js';
import * as messageCreate from './messageCreate.js';
import * as ready from './ready.js';

export const events = [
    guildMemberAdd,
    guildMemberRemove,
    interactionCreate,
    messageCreate,
    ready,
];
