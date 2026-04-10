export const initLogger = async () => Promise.resolve();

export const log = (msg) => console.log(`[Divya] ${msg}`);
export const warn = (msg) => console.warn(`[Warn] ${msg}`);
export const debug = (msg) => console.debug(`[Debug] ${msg}`);
export const error = (msg) => console.error(`[Error] ${msg}`);
