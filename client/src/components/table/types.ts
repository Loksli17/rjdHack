export interface Column {
    fieldName: string;
    displayedName: string;
    columnHandler?: (value: any) => string;
}

export interface Action {
    /** Name of the action, which will be displayed in the table */
    name?: string;
    /** If action is a route, it requires a specified path, which must
     * be generated for each row of the table, and must include the id of the row
     */
    path?: (id: number | string) => string;
    /** A handler functon for the action. Will be called upon clicking on the
     * action.
     * 
     * NOTE: Handlers may require to bind their 'this' parameter
     */
    handler?: (arg: any) => void;
    imgPath?: string;
    cssClassName?: string;
}

/**
 * Table configuration
 */
export interface TableConfig {
    /** If defined, denotes which columns must be hidden */
    hideColumn?: Array<number>;
    /** Enables sorting of the table be the means of clicking on the column header */
    sortableByColumn: boolean;
    /** Function for sorting the table. If undefined, a default comparator is used
     * ! I have suddenly realised, that this couldn't possibly work
     */
    // comparator?: (row1: any, row2: any) => number;
}

export enum SortOrder {
    ASCENDING = 1,
    DESCENDING = -1
}

export type columnType = string | number | boolean | Date | Action | Array<Action>;