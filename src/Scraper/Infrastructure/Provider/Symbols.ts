// This object is used as a map of all the available keys that are used in the dependency injection.
// By using symbols we are sure that there is only 1 match
export default {
    logger: Symbol.for('logger'),
    config: {
        api: {
            funda: {
                apiKey: Symbol.for('config.api.funda.apiKey'),
                host: Symbol.for('config.api.funda.host'),
                maxRetries: Symbol.for('config.api.funda.maxRetries'),
            },
        },
    },
    repository: {
        listing: {
            rest: Symbol.for('repository.lising.rest'),
        },
    },
    service: {
        query: {
            broker: Symbol.for('service.query.broker'),
        }
    },
    client: {
        funda: {
            api: Symbol.for('client.api'),
        },
    },
    factory: {
        listing: Symbol.for('factory.listing'),
    },
};
