export interface AreaScope {
    /**
     * The errors after validating the area
     */
    errors: string[];
    /**
     * Flag indicating the area is dirty
     */
    dirty: boolean;
    /**
     * Flag indicating the area has a pending validation
     */
    pending: boolean;
}
