# EasyPG
## A client that makes your life easy by providing crud functions to your node application.

### Introduction
*Inspired by Springboot, this package offers SQL query integration to a nodeJs application. Just a few imports will make life a lot easier. You now do not have to manually write db queries. All the basic queries like select, select based on columns, insert, update and delete is now possible via simple function calls. Moreover, updates are in way to provide support for joins and other db features. If you are using Postgresql as you db, connecting to a server is also simplified. Kindly find all the function applications in the demo below.*

### 1. Entity class
### 1.1. Initialization
This class represents a table against which sql queries will be generated. initialization of this class is as shown below -
```typescript
    const columns = ['id', 'name', 'email', 'password', 'community']
    let user:User = new User('users', 'id', columns)
```
Here,<br>    ***'user'*** is a string that represents the name of the table.<br>    ***'id'*** is a string that represents the name of the primary key.<br>    ***columns*** is an array that contains the names of the columns in the table.