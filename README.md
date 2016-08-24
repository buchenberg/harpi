![a harpy](https://raw.githubusercontent.com/buchenberg/harpi/master/modules/core/client/img/brand/logo.png "Harpi")

# Harpi

Harpi is an HTTP Archive pipeline. It helps in analysing web API's by converting HTTP Archive files to OpenAPI (Swagger) documentation. It will eventually produce UML class and activity diagrams.


## Status

Harpi is far from complete. Most of the work is being done at the API level now. Here is what is supported so far:

* Create projects and upload har files to the project.
* Generate a distinct URL report on project HAR files.
* Convert Har file to Swagger (API only).

## Goals

* Har to UML Class Diagram
* Har to UML Activity Diagram
* Add metadata to HAR like x-swagger-definition
* Take advantage of versioning for the Swagger specs

## REST API

Verb | Path
---|---
GET | /foo
