export class LocationServiceError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
        this.message = message
    }
}

export class LocationServiceGPSError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
        this.message = message
    }
}

export class LocationServiceAPIError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
        this.message = message
    }
}

export class LoggerPropertyNotAssigned extends Error {
    constructor(message = "", ...args) {
        super(message, ...args)
        this.message = message
    }
}