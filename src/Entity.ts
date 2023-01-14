import EasyPgError from "./EasyPgError";
import { AddQueryExpressionInterface } from "./interfaces";
import { createEquateExpressions, db_actions, db_messages, delimiters } from "./utils";

export default class Entity {

    readonly tableName:string; /** This field holds the table name of the entity */
    readonly primaryKey:string; /** This field holds the name of the tables's primary key */
    private columns:string[] = []; /** This field holds an array of all the table columns */
    private values:any[] = []

    constructor(tableName:string, primaryKey:string) {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
    }

    setColumns(columns:string[]) {
        this.columns = structuredClone(columns);
    }

    setValues(values: any[]){
        this.values = structuredClone(values);
    }

    /** Returns a select query using the provided primary key value */
    get(id:any):string {
        if (id === null) {
            throw new EasyPgError(db_messages.ID_CAN_NOT_BE_NULL);
        }
        return `SELECT * FROM ${this.tableName} where ${this.primaryKey} = ${id};`;
    }

    /** Returns a select query using the provided list of columns and corresponding values */
    getByColumnNames():string {
        if (this.columns.length === 0) {
            throw new EasyPgError(db_messages.COLUMNS_EMPTY);
        }
        if (this.values.length !== this.columns.length) {
            throw new EasyPgError(db_messages.COLUMNS_VALUES_MISMATCH);
        }
        return `SELECT * FROM ${this.tableName} WHERE ${createEquateExpressions(this.columns, this.values, db_actions.SELECT, delimiters.AND, null)};`;
    }

    /** 
     * Returns an insert query using the provided values. 
     * If any automatic logic is setup to update primary key, primary key can be skipped by setting include primary key to false.
     * */
    insert(includePrimaryKey:boolean=true):string {
        if (this.columns.length === 0) {
            throw new EasyPgError(db_messages.COLUMNS_EMPTY);
        }
        if (this.values.length !== this.columns.length) {
            throw new EasyPgError(db_messages.COLUMNS_VALUES_MISMATCH);
        }
        let expressions: AddQueryExpressionInterface = createEquateExpressions(this.columns, this.values, db_actions.INSERT, delimiters.COMMA, includePrimaryKey ? null : this.primaryKey) as AddQueryExpressionInterface;
        return `INSERT INTO ${this.tableName} (${expressions.columns}) VALUES (${expressions.values});`;
    }

    /** Returns an update query using the provided columns and values */
    update(id: any):string {
        if (this.columns.length === 0) {
            throw new EasyPgError(db_messages.COLUMNS_EMPTY);
        }
        if (this.values.length !== this.columns.length) {
            throw new EasyPgError(db_messages.COLUMNS_VALUES_MISMATCH);
        }
        return `UPDATE ${this.tableName} SET ${createEquateExpressions(this.columns, this.values, db_actions.UPDATE, delimiters.COMMA, null)} WHERE ${this.primaryKey} = ${id};`;
    }

    /** Returns a delete query using the provided primary key value */
    delete(id:any):string{
        if (id === null) {
            throw new EasyPgError(db_messages.ID_CAN_NOT_BE_NULL);
        }
        return `DELETE FROM  ${this.tableName} WHERE ${this.primaryKey} = ${id};`;
    }
}