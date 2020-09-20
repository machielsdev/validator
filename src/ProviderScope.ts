export interface ProviderScope {
    /**
     * Validate all areas in the provider and call callback when valid
     */
    validate: (onValidated?: () => void) => Promise<void>;
}
