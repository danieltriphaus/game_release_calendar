/**
 * @typedef {Object} User
 * @property {UserID} id
 * @property {AuthKey} auth_key
 * @property {EmailAddress} email_address
 * @property {string} google_id
 * @property {Date} auth_key_expires_at
 * @property {boolean} test
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
 * @property {TemporaryGameID} id
 * @property {Date} matched
 * @property {string} name
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
 * @property {PlatformID} [platform]
 */

/**
 * @typedef {Object} IGDBGame IGDB API response for a single game
 * @property {number} id
 * @property {object} cover
 * @property {number} cover.id
 * @property {number} cover.height
 * @property {string} cover.url
 * @property {number} cover.width
 * @property {number} first_release_date
 * @property {object[]} involved_companies
 * @property {number} involved_companies.id
 * @property {object} involved_companies.company
 * @property {number} involved_companies.company.id
 * @property {string} involved_companies.company.name
 * @property {boolean} involved_companies.developer
 * @property {string} name
 * @property {object[]} release_dates
 * @property {number} release_dates.id
 * @property {number} release_dates.category
 * @property {number} release_dates.date
 * @property {string} release_dates.human
 * @property {object} release_dates.platform
 * @property {number} release_dates.platform.id
 * @property {string} release_dates.platform.abbreviation
 * @property {string} release_dates.platform.alternative_name
 * @property {string} release_dates.platform.name
 * @property {string} url
 */

/**
 * @typedef {Object} Calendar
 * @property {Date} createdAt
 * @property {Date} list
 * @property {string} token
 */