import { Pool } from "pg";
import EasyPgError from "./EasyPgError";
import { MessageInterface, QueryAttributesInterface } from "./interfaces";
import { db_messages } from "./utils";

export default class Connection {

    readonly connectionString:string; /** This field holds value of postgres connection url */
    readonly logging:boolean; /** This field enables logger to log each query executed */

    constructor(connectionString:string, logging:boolean=false) {
        this.connectionString = connectionString;
        this.logging = logging;
    }

    async query(queryObject:QueryAttributesInterface):Promise<any> {
        const {text, params} = queryObject;

        /** Creates a pool to execute incoming queries */
        const pool:Pool = new Pool({connectionString: this.connectionString});
        pool.on('connect', ():void => {
            console.log("Connected to the database successfully!");
        })

        /** Enables logger if the corresponding field is set to true */
        if (this.logging) {
            console.log(text);
        }

        /** Execution of incoming query and error handling */
        let result:any;
        try {
            result = await pool.query(text, params);
        } catch (error:any) {
            let errorObject: MessageInterface = db_messages.QUERY_FAILURE
            if (error.name.length) {
                errorObject.message = `${error.name} - ${error.message}`
            }
            throw new EasyPgError(errorObject);
        }
        return result.rows;
    }
}