export interface ProviderScope {
    validate: (onValidated?: () => void) => void;
}
