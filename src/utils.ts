import { AddQueryExpressionInterface, MessageInterface } from "./interfaces";

/** Return partial expressions that is used while building db queries */
function createEquateExpressions (columnNames: string[], columlnValues: any[], action: string, delimiter: string, primaryKey: string | null = null): string | MessageInterface | AddQueryExpressionInterface {
    if (columlnValues.length !== columnNames.length) {
        return db_messages.COLUMNS_VALUES_MISMATCH
    }
    
    if (action === db_actions.UPDATE || action === db_actions.SELECT) {
        /** Builds partial exlpression in case of select and update */
        let expression: string = "";
        for (let i: number = 0; i < columlnValues.length; i++) {
            if (i < columlnValues.length - 1) {
                expression += `${columnNames[i]} = ${columlnValues[i]} ${delimiter} `;
            } else {
                expression += `${columnNames[i]} = ${columlnValues[i]}`;
            }
        }
        return expression;
    } else {
        /** Builds partial exlpression in case of insert */
        let expression: AddQueryExpressionInterface = {
            columns: "",
            values: ""
        }
        for (let i: number = 0; i < columlnValues.length; i++) {
            var columnValue: string;
            if (columnNames[i] != primaryKey) {
                columnValue = `${columlnValues[i]}`;
                if (i < columlnValues.length - 1) {
                    expression.columns += `${columnNames[i]}${delimiter} `;
                    expression.values += `${columnValue}${delimiter} `;
                } else {
                    expression.columns += `${columnNames[i]}`
                    expression.values += `${columnValue}`;
                }
            }
            
        }
        return expression;
    }
}

/** Contains various db operations */
const db_actions = {
    INSERT: "insert",
    UPDATE: "update",
    DELETE: "delete",
    SELECT: "select"
}

/** Contains various message types */
const db_message_types = {
    ERROR: "error",
    WARNING: "warning",
    SUCCESS: "success"
}

/** Contains various db error/success messages */
const db_messages = {
    //error messages
    VALUES_NOT_SET: {code: "-001", type: db_message_types.ERROR , message: "values are not set"},
    ID_CAN_NOT_BE_NULL: {code: "-002", type: db_message_types.ERROR , message: "id parameter can not be null"},
    COLUMNS_EMPTY: {code: "-003", type: db_message_types.ERROR , message: "at least one column name must be specified"},
    COLUMNS_VALUES_MISMATCH: {code: "-004", type: db_message_types.ERROR , message: "length of column names and values does not match"},
    QUERY_FAILURE: {code: "-005", type: db_message_types.ERROR, message: "query execution failure"},

    //success messages
    INSERT_SUCCESS: {code: "+000", type:  db_message_types.SUCCESS, message: "Record inserted successfully"},
    UPDATE_SUCCESS: {code: "+000", type:  db_message_types.SUCCESS, message: "Record updated successfully"},
    DELETE_SUCCESS: {code: "+000", type:  db_message_types.SUCCESS, message: "Record deleted successfully"}
}

/** Contains various delimiters */
const delimiters = {
    AND: "and",
    COMMA: ',',
    SPACE: " "
}

export {
    createEquateExpressions,
    db_actions,
    db_messages,
    delimiters
}