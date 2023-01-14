//This file contains all the interfaces used in the source code

interface MessageInterface {
    code: string | number,
    type: string,
    message: string
}

interface AddQueryExpressionInterface {
    columns: string,
    values: string
}

interface QueryAttributesInterface {
    text: string,
    params: any[] | any
}

export {
    MessageInterface,
    AddQueryExpressionInterface,
    QueryAttributesInterface
}