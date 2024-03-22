import { MethodDescriptorProto, FileDescriptorProto, ServiceDescriptorProto, MethodOptions, http, HttpRule } from "ts-proto-descriptors";
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
} from "./utils";
import { Context } from "./context";

function generateRegularRpcMethod(ctx: Context, serviceName: string, methodDesc: MethodDescriptorProto): Code {
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
  let decode = arrowFunction("data", code`${rawOutputType}.fromJSON(JSON.parse(data))`);

  if (methodDesc.clientStreaming) {
    if (options.useAsyncIterable) {
      encode = code`${rawInputType}.encodeTransform(request)`;
    } else {
      encode = code`request.pipe(${imp("map@rxjs/operators")}(request => ${encode}))`;
    }
  }

  const {method, path, bodySelector: bodySelector} = getEndpointParams(serviceName, methodDesc);

  return code`
    ${methodDesc.formattedName}(
      ${joinCode(params, { on: "," })}
    ): ${responsePromiseOrObservable(ctx, methodDesc)} {
      const { url, body, headers } = buildCall(this.baseUrl.value, '${path}', '${bodySelector}', ${rawInputType}.toJSON(request));
      return this.http.request(
        '${method}',
        url.href,
        {
          body: ${method === 'GET' ? 'undefined' : 'body'},
          headers,
          withCredentials: true,
          responseType: 'text',
        }
      ).pipe(${imp("map@rxjs/operators")}(${decode}));
    }
  `;
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
  chunks.push(code`@${imp("Injectable@@angular/core")}({providedIn: 'root'})`)
  chunks.push(code`export class ${name}Client implements ${def(name)} {`);

  chunks.push(code`constructor(`);
  chunks.push(code`private readonly http: ${imp("HttpClient@@angular/common/http")},`);
  chunks.push(code`@${imp('Inject@@angular/core')}('BASE_URL')
  private readonly baseUrl: ${imp("BehaviorSubject@rxjs")}<string>`);
  chunks.push(code`) { }`);

  // Create a method for each FooService method
  for (const methodDesc of serviceDesc.method) {
    chunks.push(generateRegularRpcMethod(ctx, name, methodDesc));
  }

  chunks.push(code`}`);

  chunks.push(generateBuildCall())
  chunks.push(generateEncodeSearchParams())
  chunks.push(generateFormatBody())
  chunks.push(generateReplacePathParams())
  chunks.push(generateToCamelCase())

  return code`${chunks}`;
}

function getEndpointParams(serviceName: string, methodDesc: MethodDescriptorProto): {path: string, method: string, bodySelector: string} {
  const rule = MethodOptions.getExtension<HttpRule>(methodDesc.options!, http)!;

  let method = 'POST';
  let path = `/${serviceName}/${methodDesc.name}`;
  let bodySelector = rule.body || '*';

  if (rule.post) method = 'POST', path = rule.post;
  else if (rule.get) method = 'GET', path = rule.get;
  else if (rule.patch) method = 'PATCH', path = rule.patch;
  else if (rule.delete) method = 'DELETE', path = rule.delete;
  else if (rule.put) method = 'PUT', path = rule.put;

  return {method, path, bodySelector}
}

function generateBuildCall(): Code {
  return code`
    function buildCall(
      baseUrl: string,
      path: string,
      bodySelector: string,
      bodyPathAndParams: any,
      headers: ${imp("HttpHeaders@@angular/common/http")} = new ${imp("HttpHeaders@@angular/common/http")}()
    ): {body: any, headers: ${imp("HttpHeaders@@angular/common/http")}, url: URL} {
      const [bodyAndParams, fullPath] = replacePathParams(
        path,
        bodyPathAndParams
      );
      const [params, body] = formatBody(bodySelector, bodyAndParams);
      const url = encodeSearchParams(new URL(fullPath, baseUrl), params);

      // ensure content-type header is present
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      return {
        url,
        body,
        headers,
      };
    }
  `
}

function generateEncodeSearchParams(): Code {
  return code`
    function encodeSearchParams(url: URL, request: any): URL {
      const searchparams = new URLSearchParams();
      for (const [name, value] of Object.entries(request)) {
        for (const param of encodeSearchParam(name, value)) {
          if (value !== '' && value !== undefined && value !== null) {
            searchparams.append(param.name, param.value as string);
            url.searchParams.append(param.name, param.value);
          }
        }
      }

      return url;
    }

    function encodeSearchParam(
      name: string,
      value: any
    ): {name: string; value: any}[] {
      const result: Array<{name: string; value: string}> = [];

      // repeated search params aren't allowed by grpc-gateway: see
      // https://github.com/grpc-ecosystem/grpc-gateway/blob/v2.15.2/runtime/query.go#L100-L103
      if (Array.isArray(value)) {
        return result;
      }

      // if this is an object, recursively encode it.
      // for {param: {param2: val}} the encoding should be
      // param.param2=val
      if (typeof value === 'object' && value !== null) {
        for (const key in value) {
          for (const encoded of encodeSearchParam(key, value[key])) {
            result.push({name: name + '.' + encoded.name, value: encoded.value});
          }
        }

        return result;
      }

      result.push({name, value: value});
      return result;
    }
  `
}

function generateFormatBody(): Code {
  return code`
    function formatBody(
      bodySelector: string,
      request: any
    ): [any, string] {
      // if no body is specified, no body will be sent in the request
      if (!bodySelector) {
        return [request, ''];
      }

      let body = request;

      // "*" is a special value in HttpRule's definition that says we should use the whole object
      // as the request body.
      if (bodySelector === '*') {
        request = {};
      } else {
        // body parameters are in snake_case but attributes are in camelCase
        // so convert here
        body = request[toCamelCase(bodySelector)];
        delete request[toCamelCase(bodySelector)];
      }

      return [request, JSON.stringify(body)];
    }
  `
}

function generateReplacePathParams(): Code {
  return code`
    // support aip-127 (https://google.aip.dev/127) http to grpc transcoding path params
    function replacePathParams(path: string, request: any): [any, string] {
      // capture fields like {abc} or {abc=def/ghi/*}.
      // discard the pattern after the equal sign.
      // relies on greedy capture within first part
      // to avoid matching 2nd group when no equal sign present.
      const pattern = new RegExp(/{([^=}]+)=?([^}]+)?}/g);
      const matches = path.matchAll(pattern);
      for (const match of matches) {
        // a match consists of three groups. For {abc=def/ghi/*}:
        // 1 - {abc=def/ghi/*}
        // 2 - abc
        // 3 - def/ghi/*
        // we replace (1) with (2)'s value in the request object
        // and (3) gets dropped.
        // the replaced value is then deleted from the request object
        const keys = match[1].split('.');
        const prop = toCamelCase(keys.pop()!);
        const req = keys.reduce((r, key) => r[toCamelCase(key)], request);

        path = path.replace(match[0], req[toCamelCase(prop)] as string);
        delete req[prop];
      }

      return [request, path];
    }
  `
}

function generateToCamelCase(): Code {
  return code`
    function toCamelCase(str: string): string {
      return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }
  `
}

function generateTransport(): Code {
  return code`
  export interface Transport {
    call$(call: Call): Observable<string>;
  }

  type Call = {
    method: string;
    url: URL;
    headers: Headers;
    body: string | undefined;
  };
  `
}
