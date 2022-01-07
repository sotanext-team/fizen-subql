## Configure your project

- The Manifest in `project.yaml`
- The GraphQL Schema in `schema.graphql`
- The Mapping functions in `src/mappings/` directory

#### Code generation

Run this command under the project directory.

````
yarn codegen
````

## Build the project

```
yarn build
```

## Indexing and Query

#### Run required systems in docker


Under the project directory run following command:

```
docker-compose pull && docker-compose up
```

## On Error

#### On "Unknown name app" error
First run Postgres for db, then go to project folder and run two following command
```
NODE_TLS_REJECT_UNAUTHORIZED=0 subql-node -f . --force-clean --subquery-name=fizen-subql
```
```
DB_USER=postgres DB_PASS=postgres DB_DATABASE=postgres subql-query --name fizen-subql --playground
```
After that, close it and try to rerun docker-compose up
#### Query the project

Open your browser and head to `http://localhost:3000`.

Finally, you should see a GraphQL playground is showing in the explorer and the schemas that ready to query.
Sample query to get all Loan of a user: 


````graphql
{
    query{
        loanPositions(
            first:10,
            filter: {
                ownerId: {
                    equalTo: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
                }
            }
        ){
            nodes{
                ownerId
                id,
                collateralId,
                debitAmount,
                collateralAmount
            },
            totalCount
        }
    }
}
````

Sample query to get all loan history of a collateral:

````graphql
{
    query{
        loanActions(
            first:2,
            filter: {
                accountId: {
                    equalTo: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
                },
                collateral: {
                    equalTo: 11
                }
            }
        ){
            nodes{
                accountId
                id,
                collateral,
                type,
                data,
                extrinsicId,
                timestamp
            },
            totalCount
        }
    }
}
````