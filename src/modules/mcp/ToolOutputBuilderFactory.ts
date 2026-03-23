import { injectable } from 'inversify';
import { BrowserToolOutputBuilder } from './BrowserToolOutputBuilder.js';

@injectable()
export class BrowserToolOutputBuilderFactory {
    create(): BrowserToolOutputBuilder {
        return new BrowserToolOutputBuilder();
    }
}
