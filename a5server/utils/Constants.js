/**
 * Some useful constants
 *
 * @module Constants
 */

/** The connection URI for MongoDB. */
const DB_URI = "mongodb://localhost:27017";

/** The database name. */
const DB_NAME = "restaurantdb";

/** The collection name. */
const DB_COLLECTION = "menuitems";

/** The number of records in the collection. */
const NUM_ITEMS = 39;

/** Error number that Node uses if a file can't be found. */
const FILE_NOT_FOUND_ERRNO = -4058;

/** The port number of the web server. */
const PORT_NUM = 8000;

/** The folder containing the static files for the websites. */
const PUBLIC_FOLDER = "public";

exports.Constants = {
    DB_URI: DB_URI,
    DB_NAME: DB_NAME,
    DB_COLLECTION: DB_COLLECTION,
    NUM_ITEMS: NUM_ITEMS,
    FILE_NOT_FOUND_ERRNO: FILE_NOT_FOUND_ERRNO,
    PORT_NUM: PORT_NUM,
    PUBLIC_FOLDER: PUBLIC_FOLDER,
};
