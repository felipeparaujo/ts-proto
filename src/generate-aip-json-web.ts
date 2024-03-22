import { MethodDescriptorProto, FileDescriptorProto, ServiceDescriptorProto, MethodOptions } from "ts-proto-descriptors";
import { Code, code, def, imp, joinCode } from "ts-poet";
import {
  requestType,
  rawRequestType,
  responsePromiseOrObservable,
  responseType,
} from "./types";
import {
  arrowFunction,
  assertInstanceOf,
  FormattedMethodDescriptor,
  maybePrefixPackage,
  tryCatchBlock,
} from "./utils";
import { contextTypeVar } from "./main";
import { Context } from "./context";

function generateRegularRpcMethod(ctx: Context, methodDesc: MethodDescriptorProto): Code {
  assertInstanceOf(methodDesc, FormattedMethodDescriptor);
  const { options } = ctx;
  const rawInputType = rawRequestType(ctx, methodDesc, { keepValueType: true });
  const inputType = requestType(ctx, methodDesc);
  const rawOutputType = responseType(ctx, methodDesc, { keepValueType: true });
  const metadataType = options.metadataType ? imp(options.metadataType) : imp("Metadata@@grpc/grpc-js");

  const params = [
    ...(options.context ? [code`ctx: Context`] : []),
    code`request: ${inputType}`,
    ...(options.metadataType || options.addGrpcMetadata ? [code`metadata?: ${metadataType}`] : []),
    ...(options.useAbortSignal ? [code`abortSignal?: AbortSignal`] : []),
  ];

  let encode = code`${rawInputType}.toJSON(request)`;
  let decode = code`${rawOutputType}.fromJSON(JSON.parse(data))`;

  if (methodDesc.clientStreaming) {
    if (options.useAsyncIterable) {
      encode = code`${rawInputType}.encodeTransform(request)`;
    } else {
      encode = code`request.pipe(${imp("map@rxjs/operators")}(request => ${encode}))`;
    }
  }

  const returnStatement = createDefaultServiceReturn(ctx, methodDesc, decode);

  return code`
    ${methodDesc.formattedName}(
      ${joinCode(params, { on: "," })}
    ): ${responsePromiseOrObservable(ctx, methodDesc)} {
      const data = ${encode};
      const result = this.http.request(method, url, {
        body,
        headers: angularHeaders,
        withCredentials: true,
        responseType: 'text',
      });
      return ${returnStatement};
    }
  `;
}

// const result = this.http.request(method, url, {
//   body
//   headers: angularHeaders,
//   withCredentials: true,
//   responseType: 'text',
// });

function createDefaultServiceReturn(
  ctx: Context,
  methodDesc: MethodDescriptorProto,
  decode: Code,
  errorHandler?: Code,
): Code {
  const { options } = ctx;
  const rawOutputType = responseType(ctx, methodDesc, { keepValueType: true });
  const returnStatement = arrowFunction("data", decode, !options.rpcAfterResponse);

  if (options.returnObservable || methodDesc.serverStreaming) {
    if (options.useAsyncIterable) {
      return code`${rawOutputType}.decodeTransform(result)`;
    } else {
      if (errorHandler) {
        const tc = arrowFunction("data", tryCatchBlock(decode, code`throw error`), !options.rpcAfterResponse);
        return code`result.pipe(${imp("map@rxjs/operators")}(${tc}))`;
      }
      return code`result.pipe(${imp("map@rxjs/operators")}(${returnStatement}))`;
    }
  }

  if (errorHandler) {
    if (!options.rpcAfterResponse) {
      decode = code`return ${decode}`;
    }
    return code`promise.then(${arrowFunction(
      "data",
      tryCatchBlock(decode, code`return Promise.reject(error);`),
      false,
    )}).catch(${arrowFunction("error", errorHandler, false)})`;
  }
  return code`promise.then(${returnStatement})`;
}

export function generateAipJsonWebClientImpl(
  ctx: Context,
  fileDesc: FileDescriptorProto,
  serviceDesc: ServiceDescriptorProto,
): Code {
  const { options } = ctx;
  const chunks: Code[] = [];

  // Determine information about the service.
  const { name } = serviceDesc;
  const serviceName = maybePrefixPackage(fileDesc, serviceDesc.name);

  // Define the service name constant.
  const serviceNameConst = `${name}ServiceName`;
  chunks.push(code`export const ${serviceNameConst} = "${serviceName}";`);

  // Define the FooServiceImpl class
  const i = options.context ? `${name}<Context>` : name;
  const t = options.context ? `<${contextTypeVar}>` : "";

  chunks.push(code`@${imp("Injectable@@angular/core")}({providedIn: 'root'})`)
  chunks.push(code`export class ${name}Client${t} implements ${def(i)} {`);

  // Create the constructor(rpc: Rpc)
  const rpcType = options.context ? "Rpc<Context>" : "Rpc";
  chunks.push(code`private readonly service: string;`);
  chunks.push(code`constructor(`)
  chunks.push(code`private readonly http: ${imp("HttpClient@@angular/common/http")},`);
  chunks.push(code`private readonly opts?: {service?: string}`);
  chunks.push(code`) {`);
  chunks.push(code`this.service = this.opts?.service || ${serviceNameConst};`);
  chunks.push(code`}`);

  // Create a method for each FooService method
  for (const methodDesc of serviceDesc.method) {
    chunks.push(generateRegularRpcMethod(ctx, methodDesc));
  }

  chunks.push(code`}`);
  return code`${chunks}`;
}

function getUrl(ctx: Context, methodDesc: MethodDescriptorProto): Code {
  MethodOptions.getExtension(methodDesc.options, )
}
