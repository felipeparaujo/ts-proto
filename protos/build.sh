#!/usr/bin/env bash

# Generates TS objects of the protoc plugin descriptors, which ts-proto
# uses to understand the incoming protoc codegen request objects.

protoc \
  --plugin=./node_modules/ts-proto/protoc-gen-ts_proto \
  --ts_proto_out=. \
  --ts_proto_opt=esModuleInterop=true,useExactTypes=false,initializeFieldsAsUndefined=false,exportCommonSymbols=false,unknownFields=true,usePrototypeForDefaults=true,outputExtensions=true,disableProto2Optionals=true,useOptionals=messages \
  ./google/protobuf/descriptor.proto \
  ./google/protobuf/compiler/plugin.proto \
  ./google/api/http.proto \
  ./google/api/field_behavior.proto \
  ./google/api/annotation.proto

./node_modules/.bin/tsc -p tsconfig.json
