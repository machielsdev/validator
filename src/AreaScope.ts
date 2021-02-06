export interface AreaScope {
    /**
     * The errors after validating the area
     */
    errors: string[];
    /**
     * Flag indicating the area is dirty
     */
    valid: boolean;
    /**
     * Flag indicating the area has a pending validation
     */
    pending: boolean;
    /**
     * Flag indicating the area was changed since the last valid or initial value
     */
    dirty: boolean;
    /**
     * Flag indicating the area was touched since the last valid or initial value
     */
    touched: boolean;
}
