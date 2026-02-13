import Phaser from "phaser";

/**
 * Service Locator Pattern
 * Provides a global access point for services without tight coupling or singletons.
 */
export class ServiceLocator {
    private static services: Map<string, any> = new Map();

    public static register<T>(key: string, service: T): void {
        if (this.services.has(key)) {
            console.warn(`Service ${key} is already registered. Overwriting.`);
        }
        this.services.set(key, service);
        console.log(`[ServiceLocator] Registered: ${key}`);
    }

    public static get<T>(key: string): T {
        const service = this.services.get(key);
        if (!service) {
            throw new Error(`Service ${key} not found.`);
        }
        return service;
    }

    public static reset(): void {
        this.services.clear();
    }
}
