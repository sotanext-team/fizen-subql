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
#### Query the project

Open your browser and head to `http://localhost:3000`.

Finally, you should see a GraphQL playground is showing in the explorer and the schemas that ready to query.
Sample query: 


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
