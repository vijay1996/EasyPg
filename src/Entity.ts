import EasyPgError from "./EasyPgError";
import { AddQueryExpressionInterface } from "./interfaces";
import { createEquateExpressions, db_actions, db_messages, deepCopy, delimiters } from "./utils";

export default class Entity {

    readonly tableName:string; /** This field holds the table name of the entity */
    readonly primaryKey:string; /** This field holds the name of the tables's primary key */
    readonly columnNames:string[] = []; /** This field holds an array of all the table columns */

    constructor(tableName:string, primaryKey:string, columnNames:string[]) {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
        this.columnNames = JSON.parse(JSON.stringify(columnNames));
        deepCopy(this.columnNames, columnNames);
    }

    /** Returns a select query using the provided primary key value */
    get(id: any):string {
        if (id === null) {
            throw new EasyPgError(db_messages.ID_CAN_NOT_BE_NULL);
        }
        return `SELECT * FROM ${this.tableName} where ${this.primaryKey} = ${id};`;
    }

    /** Returns a select query using the provided list of columns and corresponding values */
    getByColumnNames(columnNames:string[], values:any[]):string {
        if (columnNames.length === 0) {
            throw new EasyPgError(db_messages.COLUMNS_EMPTY);
        }
        if (values.length !== columnNames.length) {
            throw new EasyPgError(db_messages.COLUMNS_VALUES_MISMATCH);
        }
        return `SELECT * FROM ${this.tableName} WHERE ${createEquateExpressions(columnNames, values, db_actions.SELECT, delimiters.AND, null)};`;
    }

    /** 
     * Returns an insert query using the provided values. 
     * If any automatic logic is setup to update primary key, primary key can be skipped by setting include primary key to false.
     * */
    insert(values:any[], includePrimaryKey:boolean=true):string {
        if (this.columnNames.length === 0) {
            throw new EasyPgError(db_messages.COLUMNS_EMPTY);
        }
        if (values.length !== this.columnNames.length) {
            throw new EasyPgError(db_messages.COLUMNS_VALUES_MISMATCH);
        }
        let expressions: AddQueryExpressionInterface = createEquateExpressions(this.columnNames, values, db_actions.INSERT, delimiters.COMMA, includePrimaryKey ? null : this.primaryKey) as AddQueryExpressionInterface;
        return `INSERT INTO ${this.tableName} (${expressions.columns}) VALUES (${expressions.values});`;
    }

    /** Returns an update query using the provided columns and values */
    update(columnNames:string[], values:any[], id: any):string {
        if (columnNames.length === 0) {
            throw new EasyPgError(db_messages.COLUMNS_EMPTY);
        }
        if (values.length !== columnNames.length) {
            throw new EasyPgError(db_messages.COLUMNS_VALUES_MISMATCH);
        }
        return `UPDATE ${this.tableName} SET ${createEquateExpressions(columnNames, values, db_actions.UPDATE, delimiters.COMMA, null)} WHERE ${this.primaryKey} = ${id};`;
    }

    /** Returns a delete query using the provided primary key value */
    delete(id:any):string{
        if (id === null) {
            throw new EasyPgError(db_messages.ID_CAN_NOT_BE_NULL);
        }
        return `DELETE FROM  ${this.tableName} WHERE ${this.primaryKey} = ${id};`;
    }
}