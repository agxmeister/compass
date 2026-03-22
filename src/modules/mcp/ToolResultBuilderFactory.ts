import { injectable } from 'inversify';
import { BrowserToolResultBuilder } from './BrowserToolResultBuilder.js';

@injectable()
export class BrowserToolResultBuilderFactory {
    create(): BrowserToolResultBuilder {
        return new BrowserToolResultBuilder();
    }
}
