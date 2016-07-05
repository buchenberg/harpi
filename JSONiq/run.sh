#!/bin/sh

JSON_PATH=./json
XQ_PATH=./xq
OUT_PATH=./out
OUTPUT_JSON=$OUT_PATH/out.json
INPUT_JSON=$JSON_PATH/email.har.json
INPUT_QUERY=$XQ_PATH/test.xq


zorba \
--external-variable json-file:=$INPUT_JSON \
-f -q $INPUT_QUERY \
--indent \
--output-file $OUTPUT_JSON
