/**
 * Error thrown when there is a general location service error.
 * @extends Error
 * @param {string} [message=""] - The error message.
 * @param {...any} args - Additional arguments for the Error constructor.
 */
export class LocationServiceError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
        this.message = message
    }
}

/**
 * Error thrown when there is a GPS-specific location service error.
 * @extends Error
 * @param {string} [message=""] - The error message.
 * @param {...any} args - Additional arguments for the Error constructor.
 */
export class LocationServiceGPSError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
        this.message = message
    }
}

/**
 * Error thrown when there is an API-specific location service error.
 * @extends Error
 * @param {string} [message=""] - The error message.
 * @param {...any} args - Additional arguments for the Error constructor.
 */
export class LocationServiceAPIError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
        this.message = message
    }
}
/**
 * Error thrown when a logger property is not assigned.
 * @extends Error
 * @param {string} [message=""] - The error message.
 * @param {...any} args - Additional arguments for the Error constructor.
 */
export class LoggerPropertyNotAssigned extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
        this.message = message
    }
}