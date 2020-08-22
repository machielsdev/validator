export interface ProviderScope {
    validate: (onValidated?: () => void) => Promise<void>;
}
