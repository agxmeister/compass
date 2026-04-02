import type { BrowserService } from '@/modules/browser/index.js';
import type { BrowserToolOutputBuilder } from './BrowserToolOutputBuilder.js';

export interface BrowserToolContext {
    browserService: BrowserService<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, unknown>;
    toolOutputBuilder: BrowserToolOutputBuilder;
}
