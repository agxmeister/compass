import { container } from '@/container.js';
import { dependencies } from '@/dependencies.js';
import type { Tool } from './types.js';

export function RegisterTool() {
    return function <T extends new (...args: any[]) => Tool>(constructor: T) {
        container.bind<Tool>(dependencies.Tools).to(constructor);
        return constructor;
    };
}
