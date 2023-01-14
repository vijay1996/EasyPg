import { MessageInterface } from "./interfaces";

export default class EasyPgError extends Error {

    readonly code:string|number; /** This field holds error code */
    readonly type:string; /** This field holds error type */
    readonly message:string; /** This field holds error message type */
    readonly errorObject:MessageInterface = {code: "", type: "", message: ""}; /** This field holds JSON value of the error details */

    constructor(error:MessageInterface) {
        const { code, type, message } = error
        super();
        this.code = code;
        this.type = type;
        this.message = message;
        this.errorObject = { code, type, message };
    }

    /** Returns error details in JSON format */
    getJSON():MessageInterface {
        return this.errorObject;
    }

    /** Returns error details in string format using JSON.stringify() */
    getString():string {
        return JSON.stringify(this.errorObject);
    }

}