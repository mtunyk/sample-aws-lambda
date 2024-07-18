## Usage

### Deployment

```bash
cd stripe/nodejs && pnpm i
cd ../../
sam build --config-env staging
sam validate --config-env staging
sam deploy --config-env staging --no-confirm-changeset --no-fail-on-empty-changeset
```

> for production deployment: `sam deploy --config-env production`

### Local development

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input
that the function receives from the event source:

```bash
sam local start-lambda --config-env staging
aws lambda invoke --function-name FindLocationsFunction --endpoint-url http://127.0.0.1:3001 --no-verify-ssl out.txt

sam local invoke FindLocationsFunction -e events/find-locations.json
```

## Cleanup

To delete the application from AWS you can run the following:

```bash
sam delete --stack-name sampletld-api-stg
aws s3 rm s3://sampletld-api-cloudformation/staging/ --recursive
```

## Lambda layers

Any package set as external in the `custom.esbuild` will not be bundled into the output file,
but packed as a `node_modules` dependency.

If packing a package is not required, for instance if it exists in a layer, you may set it in the option exclude,
so it will neither be packed nor bundled. `@aws-sdk` is excluded by default.
