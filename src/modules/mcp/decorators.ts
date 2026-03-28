import { container } from '@/container.js';
import type { Tool } from './types.js';

export function RegisterTool(group: symbol) {
    return function <T extends new (...args: any[]) => Tool>(constructor: T) {
        container.bind<Tool>(group).to(constructor);
        return constructor;
    };
}
