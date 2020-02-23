import { join } from 'path';

/**
 * Environment.
 */
export const NODE_ENV = 'NODE_ENV';

/**
 * Path to folder or environment .env files.
 */
export const FOLDER_ENV = join(process.cwd(), 'src/environments');

/**
 * Application server port.
 */
export const PORT = 'PORT';

/**
 * Database URL.
 */
export const DATABASE_URL = 'DATABASE_URL';

/**
 * If true, static content is served.
 */
export const STATIC_SERVE = 'STATIC_SERVE';

/**
 * Folder path of static content.
 */
export const STATIC_FOLDER = 'STATIC_FOLDER';

/**
 * Number of files or number of days to keep log file (see maxFiles of winston-daily-rotate-file).
 */
export const LOG_RETENTION = 'LOG_RETENTION';

/**
 * Maximum size of the file after which it will rotate (see maxSize of winston-daily-rotate-file).
 */
export const LOG_ROTATION_SIZE = 'LOG_ROTATION_SIZE';

/**
 * Default minimal log level.
 */
export const LOG_LEVEL = 'LOG_LEVEL';

/**
 * Folder path of log files.
 */
export const LOG_FOLDER = 'LOG_FOLDER';

/**
 * If true enables Cross-origin resource sharing (CORS).
 */
export const ENABLE_CORS = 'ENABLE_CORS';

/**
 * If true activates HTTPS/SSL support.
 */
export const ENABLE_SSL = 'ENABLE_SSL';

/**
 * SSL key file path.
 */
export const SSL_KEY_FILE = 'SSL_KEY_FILE';

/**
 * SSL certificate file path.
 */
export const SSL_CERT_FILE = 'SSL_CERT_FILE';
