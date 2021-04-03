import Symbols from './Symbols';
import config from 'config';
import RestFundaListingRepository from '../Repository/RestFundaListingRepository';
import ServiceProvider from '../../../Common/Provider/ServiceProvider';
import BrokerQueryHandler from '../../Application/Query/BrokerQueryHandler';
import ListingFactory from '../Factory/ListingFactory';
import Logger from 'js-logger';
import RetryableApiClientProvider from './RetryableApiClientProvider';
import ServiceProviderScope from '../../../Common/Provider/ServiceProviderScope';

export default class ScraperServiceProvider extends ServiceProvider {
    public bindServices() {
        this.bindConfiguration();
        this.bindHelpers();
        this.bindClients();
        this.bindRepositories();
        this.bindFactories();
        this.bindApplicationServices();
    }

    private bindConfiguration() {
        this.constant(Symbols.config.api.funda.apiKey, config.get('parameters.funda.apiKey'));
        this.constant(Symbols.config.api.funda.host, config.get('parameters.funda.host'));
        this.constant(Symbols.config.api.funda.maxRetries, config.get('parameters.funda.maxRetries'));
    }

    private bindClients() {
        // We are binding classes to our container
        // This class will be initialized only once as multiple repository instances can reuse one API client
        this.register(Symbols.client.funda.api, RetryableApiClientProvider, [
            Symbols.config.api.funda.host,
            Symbols.config.api.funda.maxRetries,
            Symbols.logger,
        ], ServiceProviderScope.singleton);
    }

    private bindHelpers() {
        // The logger package will not log to stdout if this method is not triggered
        Logger.useDefaults();
        // Some NPM packages give errors when initialized by Inversify (the IoC container)
        this.constant(Symbols.logger, Logger);
    }

    private bindRepositories() {
        // Be default a class will be initialized everytime its injected due to the transient scope
        this.register(Symbols.repository.listing.rest, RestFundaListingRepository, [
            Symbols.client.funda.api,
            Symbols.factory.listing,
            Symbols.config.api.funda.apiKey,
        ]);
    }

    private bindFactories() {
        this.register(Symbols.factory.listing, ListingFactory, []);
    }

    private bindApplicationServices() {
        this.register(Symbols.service.query.broker, BrokerQueryHandler, [
            Symbols.repository.listing.rest,
            Symbols.logger,
        ]);
    }
}
