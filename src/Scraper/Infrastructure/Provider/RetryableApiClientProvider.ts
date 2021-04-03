import Axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { ILogger } from 'js-logger';

export default class RetryableApiClientProvider {
    private instance: AxiosInstance;

    public constructor(
        private readonly basePath: string,
        private readonly retryLimit: number,
        private readonly logger: ILogger
    ) {}

    public retrieve(): AxiosInstance {
        if (this.instance) {
            return this.instance;
        }

        const axios = Axios.create({
            baseURL: this.basePath,
        });

        axiosRetry(axios, {
            retryCondition: (error) => {
                // We want to retry the call if one of the following error statusses were returned
                return [401, 500, 502].includes(error.response.status);
            },
            retryDelay: (retryCount) => {
                this.logger.warn('API attempt %s failed, retrying... ', retryCount);

                // Exponential backoff
                return Math.pow(retryCount, 2) * 1000;
            },
            retries: this.retryLimit,
        });

        this.instance = axios;

        return this.instance;
    }
}
