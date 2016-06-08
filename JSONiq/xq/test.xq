jsoniq version "1.0";

import module namespace file = "http://expath.org/ns/file";

declare variable $json-file external;

let $input-text := parse-json(file:read-text($json-file))

for $log in $input-text.log
return
{
	"swagger": "2.0",
	"info": {
		"version": "1.0.0",
		"title": "Swagger Test",
		"description": "A test swagger-2.0 specification",
		"termsOfService": "http://swagger.io/terms/",
		"contact": {
			"name": "G. Buchenberger"
		},
		"license": {
			"name": "MIT"
		}
  },
	"host": "petstore.swagger.io",
  "basePath": "/api",
  "schemes": [
    "https"
  ],
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
				"paths": {
					for $request in $log.entries[].request[1] return
				{
					substring-after($request.url, "https:/"): {
					lower-case($request.method): {
						"description": "A description",
						"produces": [
						"application/json"
						],
						"responses": {
							"200": {
								"description": "A list of pets.",
								"schema": {
									"type": "array",
									"items": {}
						}
					}
				}
			}
		}
	}
}
}
