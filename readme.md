# EasyPG
## A client that makes your life easy by providing crud functions to your node application.

### Introduction
*Inspired by Springboot, this package offers SQL query integration to a nodeJs application. Just a few imports will make life a lot easier. You now do not have to manually write db queries. All the basic queries like select, select based on columns, insert, update and delete is now possible via simple function calls. Moreover, updates are in way to provide support for joins and other db features. If you are using Postgresql as you db, connecting to a server is also simplified. Kindly find all the function applications in the demo below.*

### 2. Entity class

#### 2.1 Initialization

This class represents a table against which sql queries will be generated. initialization of this class is as shown below -

> Instead of directly creating a new instance of entity class, an intermediate class that extends the Entity class is created in the name of the table. Any table related logic can be defined in this class. This way, the code looks cleaner and more organised. Here, ***tableName***, ***primaryKey*** and ***columns*** are included in constructor as mandatory parameters though Entity class require only ***tableName*** and ***primaryKey***. 

```typescript
import { Entity } from "@vbr96/easypg/lib";
import {cloneDeep} from "lodash"
export class User extends Entity {
    defaultColumns: string[] = [];

    constructor(tableName: string, primaryKey: string, columns: string[]) {
        super(tableName, primaryKey);
        this.defaultColumns = cloneDeep(columns)
    }
}
```
> Later on, an instance of this intermediate class can be initialized to perform operations as shown below.

```typescript
const columns = ['id', 'name', 'email', 'password', 'community']
let user:User = new User('users', 'id', columns)
```
> Here, 
> - ***'user'*** is a string that represents the name of the table.
> - ***'id'*** is a string that represents the name of the primary key.
> - ***columns*** is an array that contains the names of the columns in the table.

#### 2.2 SELECT

##### 2.2.1 By primary key

This is the first method that will create a query to fetch a record based on the primary key specified. The syntax of the method is shown below - 
```typescript
let result:any;
try {
    result = await conn.query({text: user.get(request.params.id), params: null}); 
} catch (error) {
    if (error instanceof EasyPgError) {
        response.json(error.getJSON());
    } else {
        response.json({error: "unidentified error occured"});
    }
}
response.json(result);
```
> Here, it can be observed that the User class which was initialized in previous section has a method called get. Invoking this method with the primary key value will return the user record.
> It can also be seen that any error that occurs is handled using a custom error class ***EasyPgError***.

#### 2.2.2 By column names

This method is handy when a query has to be generated where single or multiple records have to be fetched based on columns other than the primary key. Here is the syntax of the method - 
```typescript
user.setColumns(columns);
user.setValues(values);

let result: any;
try {
    result = await conn.query({text: user.getByColumnNames(), params: null});
} catch (error) {
    if (error instanceof EasyPgError) {
        response.json(error.getJSON());
    } else {
        response.json({error: "unidentified error occured"});
    }
}
response.json(result);
```
> Here, the setters ***setColumns*** and ***setValues*** are used to set the columns using which records have to be fetched and their corresponding values.
> Then, ***getByColumnNames*** method of the user class can be used to fetch based on column criteria set using the setters - ***setColumns*** and ***setValues***.
> Like in previous section,  any error that occurs is handled using a custom error class ***EasyPgError***.

#### 2.3 INSERT
The next method in the Entity class is used for creating insert query. Application of this method is shown below - 
```typescript
user.setColumns(user.defaultColumns);
user.setValues(values);

let result:any;
try {
    result = await conn.query({text: user.insert(true), params: null})
} catch (error) {
    if (error instanceof EasyPgError) {
        response.json(error.getJSON());
    } else {
        response.json({error: "unidentified error occured"});
    }
}
response.json(db_messages.INSERT_SUCCESS)
```
> Here, similar to the previous section, setters are used to provide the column names and corresponding value.
> The user class now has ***insert*** method that can be used to insert records into the table.
> Like in previous section,  any error that occurs is handled using a custom error class ***EasyPgError***.