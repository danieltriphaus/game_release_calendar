/**
 * @typedef {Object} User
 * @property {UserID} id
 * @property {AuthKey} auth_key
 * @property {EmailAddress} email_address
 */

/**
 * @typedef {string} UserID
 */

/**
 * @typedef {string} AuthKey
 */

/**
 * @typedef {string} EmailAddress
 */

/**
 * @typedef {number | string} GameID
 */

/**
 * @typedef {Object} TemporaryGame
 */

/**
 * @typedef {string} TemporaryGameID
 */

/**
 * @typedef {string} GameListID
 */

/**
 * @typedef {number} PlatformID
 */

/**
 * @typedef {Object} GameListEntry
 * @property {GameID} id
 * @property {PlatformID} platform
 */

/**
 * @typedef {Object} IGDBAccessToken
 * @property {string} access_token
 * @property {number} expires_in
 * @property {string} token_type
 */

/**
 * @typedef {string} IGDBQuery Query against IGDB API
 */

/**
 * @typedef {object} IGDBGameData
 */

/**
 * @typedef {IGDBGameData[]} IGDBGameAPIResponse
 */

/**
 * @typedef {Object} UserGame
 * @property {GameID} id
 * @property {PlatformID} platform
 */