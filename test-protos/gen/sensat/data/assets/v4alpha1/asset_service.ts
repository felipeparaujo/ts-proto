/* eslint-disable */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FieldMask } from "../../../../google/protobuf/field_mask";
import { Asset, Asset_Lifecycle_FailureDetails, Asset_Output, Asset_SyncTracking } from "./entities";

export const protobufPackage = "sensat.data.assets.v4alpha1";

/** Create Asset Request. */
export interface CreateAssetRequest {
  /**
   * The parent project where the asset is created.
   * Format: projects/:projectId
   */
  parent: string;
  /** The asset to create */
  asset: Asset | undefined;
}

/** Get Asset Request. */
export interface GetAssetRequest {
  /**
   * The name of the asset to retrieve.
   * Format: projects/{project}/assets/{asset}
   */
  name: string;
}

/** Update Asset Request. */
export interface UpdateAssetRequest {
  /**
   * The asset to update.
   *
   * The asset's `name` field is used to identify the asset to update.
   * Format: projects/:projectId/assets/:assetId
   */
  asset:
    | Asset
    | undefined;
  /**
   * The list of fields to update.
   *
   * Fields are specified relative to the asset
   * (e.g. `title`, `timeline.visibility`; *not* `asset.title` or `asset.timeline.visibility`)
   *
   * Map items can be individually addressed. If necessary, such as when a map key contains a dot (.),
   * paths can be escaped using backticks (`). For example. "sources.`a_file.dwg`.licence" would
   * address `sources["a_file.dwg"].licence`.
   */
  updateMask: string[] | undefined;
}

/** Delete Asset Request. */
export interface DeleteAssetRequest {
  /**
   * The name of the asset to delete.
   * Format: projects/{project}/assets/{asset}
   */
  name: string;
}

/** List Assets Request. */
export interface ListAssetsRequest {
  /**
   * The parent which owns this collection of assets.
   * Format: projects/{project}
   */
  parent: string;
  /**
   * The maximum number of assets to return.
   * The service may return fewer than this value.
   * The default value is 20. The maximum value is 200.
   */
  pageSize: number;
  /**
   * A page token, received from a previous `ListAssets` call.
   * Provide this to retrieve the subsequent page.
   *
   * When paginating, all other parameters provided to `ListAssets` must match
   * the call that provided the page token.
   */
  pageToken: string;
  /** Shows soft-deleted assets if set. */
  showDeleted: boolean;
}

/** List Assets Response. */
export interface ListAssetsResponse {
  /** All assets from the specific project. */
  assets: Asset[];
  /**
   * A token, which can be sent as `page_token` to retrieve the next page.
   * If this field is omitted, there are no subsequent pages.
   */
  nextPageToken: string;
}

/** Batch Get Assets Request. */
export interface BatchGetAssetsRequest {
  /**
   * The parent shared by all the assets being retrieved.
   * Format: projects/{project}
   * If this is set, the parent of all of the assets specified in `names`
   * must match this field.
   */
  parent: string;
  /**
   * The names of the assets to retrieve.
   * A maximum of 1000 assets can be retrieved in a batch.
   * Format: projects/{project}/assets/{asset}
   */
  names: string[];
}

/** Batch Get Assets Response. */
export interface BatchGetAssetsResponse {
  /** The requested assets. */
  assets: Asset[];
}

/** Activate Asset Request. */
export interface ActivateAssetRequest {
  /**
   * The asset to update.
   *
   * The asset's `name` field is used to identify the asset to update.
   * Format: projects/{projectId}/assets/{assetId}
   */
  name: string;
  /** Asset's output to update */
  output: Asset_Output | undefined;
}

/** Activate Asset Response. */
export interface ActivateAssetResponse {
  /** The activated asset. */
  asset: Asset | undefined;
}

/** Fail Asset Request. */
export interface FailAssetRequest {
  /**
   * The asset to update.
   *
   * The asset's `name` field is used to identify the asset to update.
   * Format: projects/{projectId}/assets/{assetId}
   */
  name: string;
  /** Details of the failure. */
  failureDetails: Asset_Lifecycle_FailureDetails | undefined;
}

/** Fail Asset Resposne. */
export interface FailAssetResponse {
  /** The asset with its failure details and state updated. */
  asset: Asset | undefined;
}

/** Complete Asset Request. */
export interface CompleteAssetRequest {
  /**
   * The asset to update.
   *
   * The asset's `name` field is used to identify the asset to update.
   * Format: projects/{projectId}/assets/{assetId}
   */
  name: string;
  /**
   * Transfer parts. Map is from source filepath to a list of `Part`s. If a source wasn't transfered
   * through a multipart transfer process, it doesn't have to be defined here.
   */
  parts: { [key: string]: CompleteAssetRequest_Parts };
  /**
   * If this is set to true, subsequent processing is enabled and the asset
   * is transitioned to PROCESSING state if its sources match our list of
   * supported file extensions.
   *
   * Default value is false.
   */
  enableProcessing: boolean;
}

/** List of transfer parts. */
export interface CompleteAssetRequest_Parts {
  /** Transfer parts. */
  parts: CompleteAssetRequest_Part[];
}

/**
 * One of the parts that compose a multipart transfer source. To be used when the consumer
 * split the source transfer into parts.
 */
export interface CompleteAssetRequest_Part {
  /** The part number. These get joined sequentially by AWS during this endpoints request processing. */
  number: number;
  /**
   * ETag of the part. These are provided by AWS on successful part transfer in the ETag header.
   * It is up to consumers to store and manage these for successful transfers.
   */
  etag: string;
}

export interface CompleteAssetRequest_PartsEntry {
  key: string;
  value: CompleteAssetRequest_Parts | undefined;
}

/** Complete Asset Response */
export interface CompleteAssetResponse {
  /** Completed asset with its state updated. */
  asset: Asset | undefined;
}

/** Generate Asset Transfer URL Request. */
export interface GenerateAssetTransferURLRequest {
  /** Asset that contains the source. */
  name: string;
  /** Path of the source. Must match one of the existing sources filepath. */
  sourceFilepath: string;
  /**
   * Number of the part to generate the request. If unset or 0, the request
   * will be treated as a single part upload.
   */
  partNumber: number;
}

/** Generate Asset Transfer URL Response */
export interface GenerateAssetTransferURLResponse {
  /** Transfer URL, valid for 60 minutes. The HTTP method must be PUT when using this URL. */
  uri: string;
}

/** Generate Asset Download URL Request */
export interface GenerateAssetDownloadURLRequest {
  /** Asset that contains the source. */
  name: string;
  /** Path of the source. Must match one of the existing sources filepath. */
  sourceFilepath: string;
}

/** Generate Asset Download URL Response */
export interface GenerateAssetDownloadURLResponse {
  /** Download URL, valid for 60 minutes */
  uri: string;
}

/** Overwrite Asset Request. */
export interface OverwriteAssetRequest {
  /**
   * The asset to update.
   *
   * The asset's `name` field is used to identify the asset to update.
   * Format: projects/{projectId}/assets/{assetId}
   */
  name: string;
  /**
   * Next source filename.
   * Replaces the key in `Asset.sources[0]`
   */
  filename: string;
  /**
   * Next source size, in bytes.
   * Replaces `Asset.sources[0].size`
   */
  sizeBytes: number;
  /**
   * Next revision label.
   * Replaces `Asset.revision_label`
   */
  revisionLabel: string;
  /**
   * Next attributes.
   * Replaces `Asset.attributes`
   */
  attributes: { [key: string]: string };
  /**
   * Next tracking information. Might contain updates to things like update_time, checksum and revision
   * Replaces `Asset.sync_tracking`
   */
  syncTracking: Asset_SyncTracking | undefined;
}

export interface OverwriteAssetRequest_AttributesEntry {
  key: string;
  value: string;
}

/** Overwrite Asset Response. */
export interface OverwriteAssetResponse {
  /** Asset bucket. */
  bucket: string;
  /** Destination the next revision of the source should be transferred to. Relative to bucket. */
  sourcePath: string;
}

/**
 * Event sent by various endpoints that modify assets
 *
 * This isn't a resource message, just an event message
 * so we disable linting for the resource annotation rule
 * (-- api-linter: core::0123::resource-annotation=disabled --)
 */
export interface AssetChangedEvent {
  /** Resource name */
  name: string;
}

function createBaseCreateAssetRequest(): CreateAssetRequest {
  return { parent: "", asset: undefined };
}

export const CreateAssetRequest = {
  fromJSON(object: any): CreateAssetRequest {
    return {
      parent: isSet(object.parent) ? globalThis.String(object.parent) : "",
      asset: isSet(object.asset) ? Asset.fromJSON(object.asset) : undefined,
    };
  },

  toJSON(message: CreateAssetRequest): unknown {
    const obj: any = {};
    if (message.parent !== "") {
      obj.parent = message.parent;
    }
    if (message.asset !== undefined) {
      obj.asset = Asset.toJSON(message.asset);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateAssetRequest>, I>>(base?: I): CreateAssetRequest {
    return CreateAssetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateAssetRequest>, I>>(object: I): CreateAssetRequest {
    const message = createBaseCreateAssetRequest();
    message.parent = object.parent ?? "";
    message.asset = (object.asset !== undefined && object.asset !== null) ? Asset.fromPartial(object.asset) : undefined;
    return message;
  },
};

function createBaseGetAssetRequest(): GetAssetRequest {
  return { name: "" };
}

export const GetAssetRequest = {
  fromJSON(object: any): GetAssetRequest {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: GetAssetRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAssetRequest>, I>>(base?: I): GetAssetRequest {
    return GetAssetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetAssetRequest>, I>>(object: I): GetAssetRequest {
    const message = createBaseGetAssetRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseUpdateAssetRequest(): UpdateAssetRequest {
  return { asset: undefined, updateMask: undefined };
}

export const UpdateAssetRequest = {
  fromJSON(object: any): UpdateAssetRequest {
    return {
      asset: isSet(object.asset) ? Asset.fromJSON(object.asset) : undefined,
      updateMask: isSet(object.updateMask) ? FieldMask.unwrap(FieldMask.fromJSON(object.updateMask)) : undefined,
    };
  },

  toJSON(message: UpdateAssetRequest): unknown {
    const obj: any = {};
    if (message.asset !== undefined) {
      obj.asset = Asset.toJSON(message.asset);
    }
    if (message.updateMask !== undefined) {
      obj.updateMask = FieldMask.toJSON(FieldMask.wrap(message.updateMask));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateAssetRequest>, I>>(base?: I): UpdateAssetRequest {
    return UpdateAssetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateAssetRequest>, I>>(object: I): UpdateAssetRequest {
    const message = createBaseUpdateAssetRequest();
    message.asset = (object.asset !== undefined && object.asset !== null) ? Asset.fromPartial(object.asset) : undefined;
    message.updateMask = object.updateMask ?? undefined;
    return message;
  },
};

function createBaseDeleteAssetRequest(): DeleteAssetRequest {
  return { name: "" };
}

export const DeleteAssetRequest = {
  fromJSON(object: any): DeleteAssetRequest {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: DeleteAssetRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteAssetRequest>, I>>(base?: I): DeleteAssetRequest {
    return DeleteAssetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteAssetRequest>, I>>(object: I): DeleteAssetRequest {
    const message = createBaseDeleteAssetRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseListAssetsRequest(): ListAssetsRequest {
  return { parent: "", pageSize: 0, pageToken: "", showDeleted: false };
}

export const ListAssetsRequest = {
  fromJSON(object: any): ListAssetsRequest {
    return {
      parent: isSet(object.parent) ? globalThis.String(object.parent) : "",
      pageSize: isSet(object.pageSize) ? globalThis.Number(object.pageSize) : 0,
      pageToken: isSet(object.pageToken) ? globalThis.String(object.pageToken) : "",
      showDeleted: isSet(object.showDeleted) ? globalThis.Boolean(object.showDeleted) : false,
    };
  },

  toJSON(message: ListAssetsRequest): unknown {
    const obj: any = {};
    if (message.parent !== "") {
      obj.parent = message.parent;
    }
    if (message.pageSize !== 0) {
      obj.pageSize = Math.round(message.pageSize);
    }
    if (message.pageToken !== "") {
      obj.pageToken = message.pageToken;
    }
    if (message.showDeleted !== false) {
      obj.showDeleted = message.showDeleted;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListAssetsRequest>, I>>(base?: I): ListAssetsRequest {
    return ListAssetsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ListAssetsRequest>, I>>(object: I): ListAssetsRequest {
    const message = createBaseListAssetsRequest();
    message.parent = object.parent ?? "";
    message.pageSize = object.pageSize ?? 0;
    message.pageToken = object.pageToken ?? "";
    message.showDeleted = object.showDeleted ?? false;
    return message;
  },
};

function createBaseListAssetsResponse(): ListAssetsResponse {
  return { assets: [], nextPageToken: "" };
}

export const ListAssetsResponse = {
  fromJSON(object: any): ListAssetsResponse {
    return {
      assets: globalThis.Array.isArray(object?.assets) ? object.assets.map((e: any) => Asset.fromJSON(e)) : [],
      nextPageToken: isSet(object.nextPageToken) ? globalThis.String(object.nextPageToken) : "",
    };
  },

  toJSON(message: ListAssetsResponse): unknown {
    const obj: any = {};
    if (message.assets?.length) {
      obj.assets = message.assets.map((e) => Asset.toJSON(e));
    }
    if (message.nextPageToken !== "") {
      obj.nextPageToken = message.nextPageToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListAssetsResponse>, I>>(base?: I): ListAssetsResponse {
    return ListAssetsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ListAssetsResponse>, I>>(object: I): ListAssetsResponse {
    const message = createBaseListAssetsResponse();
    message.assets = object.assets?.map((e) => Asset.fromPartial(e)) || [];
    message.nextPageToken = object.nextPageToken ?? "";
    return message;
  },
};

function createBaseBatchGetAssetsRequest(): BatchGetAssetsRequest {
  return { parent: "", names: [] };
}

export const BatchGetAssetsRequest = {
  fromJSON(object: any): BatchGetAssetsRequest {
    return {
      parent: isSet(object.parent) ? globalThis.String(object.parent) : "",
      names: globalThis.Array.isArray(object?.names) ? object.names.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: BatchGetAssetsRequest): unknown {
    const obj: any = {};
    if (message.parent !== "") {
      obj.parent = message.parent;
    }
    if (message.names?.length) {
      obj.names = message.names;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BatchGetAssetsRequest>, I>>(base?: I): BatchGetAssetsRequest {
    return BatchGetAssetsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BatchGetAssetsRequest>, I>>(object: I): BatchGetAssetsRequest {
    const message = createBaseBatchGetAssetsRequest();
    message.parent = object.parent ?? "";
    message.names = object.names?.map((e) => e) || [];
    return message;
  },
};

function createBaseBatchGetAssetsResponse(): BatchGetAssetsResponse {
  return { assets: [] };
}

export const BatchGetAssetsResponse = {
  fromJSON(object: any): BatchGetAssetsResponse {
    return { assets: globalThis.Array.isArray(object?.assets) ? object.assets.map((e: any) => Asset.fromJSON(e)) : [] };
  },

  toJSON(message: BatchGetAssetsResponse): unknown {
    const obj: any = {};
    if (message.assets?.length) {
      obj.assets = message.assets.map((e) => Asset.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BatchGetAssetsResponse>, I>>(base?: I): BatchGetAssetsResponse {
    return BatchGetAssetsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BatchGetAssetsResponse>, I>>(object: I): BatchGetAssetsResponse {
    const message = createBaseBatchGetAssetsResponse();
    message.assets = object.assets?.map((e) => Asset.fromPartial(e)) || [];
    return message;
  },
};

function createBaseActivateAssetRequest(): ActivateAssetRequest {
  return { name: "", output: undefined };
}

export const ActivateAssetRequest = {
  fromJSON(object: any): ActivateAssetRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      output: isSet(object.output) ? Asset_Output.fromJSON(object.output) : undefined,
    };
  },

  toJSON(message: ActivateAssetRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.output !== undefined) {
      obj.output = Asset_Output.toJSON(message.output);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActivateAssetRequest>, I>>(base?: I): ActivateAssetRequest {
    return ActivateAssetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActivateAssetRequest>, I>>(object: I): ActivateAssetRequest {
    const message = createBaseActivateAssetRequest();
    message.name = object.name ?? "";
    message.output = (object.output !== undefined && object.output !== null)
      ? Asset_Output.fromPartial(object.output)
      : undefined;
    return message;
  },
};

function createBaseActivateAssetResponse(): ActivateAssetResponse {
  return { asset: undefined };
}

export const ActivateAssetResponse = {
  fromJSON(object: any): ActivateAssetResponse {
    return { asset: isSet(object.asset) ? Asset.fromJSON(object.asset) : undefined };
  },

  toJSON(message: ActivateAssetResponse): unknown {
    const obj: any = {};
    if (message.asset !== undefined) {
      obj.asset = Asset.toJSON(message.asset);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActivateAssetResponse>, I>>(base?: I): ActivateAssetResponse {
    return ActivateAssetResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActivateAssetResponse>, I>>(object: I): ActivateAssetResponse {
    const message = createBaseActivateAssetResponse();
    message.asset = (object.asset !== undefined && object.asset !== null) ? Asset.fromPartial(object.asset) : undefined;
    return message;
  },
};

function createBaseFailAssetRequest(): FailAssetRequest {
  return { name: "", failureDetails: undefined };
}

export const FailAssetRequest = {
  fromJSON(object: any): FailAssetRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      failureDetails: isSet(object.failureDetails)
        ? Asset_Lifecycle_FailureDetails.fromJSON(object.failureDetails)
        : undefined,
    };
  },

  toJSON(message: FailAssetRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.failureDetails !== undefined) {
      obj.failureDetails = Asset_Lifecycle_FailureDetails.toJSON(message.failureDetails);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FailAssetRequest>, I>>(base?: I): FailAssetRequest {
    return FailAssetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FailAssetRequest>, I>>(object: I): FailAssetRequest {
    const message = createBaseFailAssetRequest();
    message.name = object.name ?? "";
    message.failureDetails = (object.failureDetails !== undefined && object.failureDetails !== null)
      ? Asset_Lifecycle_FailureDetails.fromPartial(object.failureDetails)
      : undefined;
    return message;
  },
};

function createBaseFailAssetResponse(): FailAssetResponse {
  return { asset: undefined };
}

export const FailAssetResponse = {
  fromJSON(object: any): FailAssetResponse {
    return { asset: isSet(object.asset) ? Asset.fromJSON(object.asset) : undefined };
  },

  toJSON(message: FailAssetResponse): unknown {
    const obj: any = {};
    if (message.asset !== undefined) {
      obj.asset = Asset.toJSON(message.asset);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FailAssetResponse>, I>>(base?: I): FailAssetResponse {
    return FailAssetResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FailAssetResponse>, I>>(object: I): FailAssetResponse {
    const message = createBaseFailAssetResponse();
    message.asset = (object.asset !== undefined && object.asset !== null) ? Asset.fromPartial(object.asset) : undefined;
    return message;
  },
};

function createBaseCompleteAssetRequest(): CompleteAssetRequest {
  return { name: "", parts: {}, enableProcessing: false };
}

export const CompleteAssetRequest = {
  fromJSON(object: any): CompleteAssetRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      parts: isObject(object.parts)
        ? Object.entries(object.parts).reduce<{ [key: string]: CompleteAssetRequest_Parts }>((acc, [key, value]) => {
          acc[key] = CompleteAssetRequest_Parts.fromJSON(value);
          return acc;
        }, {})
        : {},
      enableProcessing: isSet(object.enableProcessing) ? globalThis.Boolean(object.enableProcessing) : false,
    };
  },

  toJSON(message: CompleteAssetRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.parts) {
      const entries = Object.entries(message.parts);
      if (entries.length > 0) {
        obj.parts = {};
        entries.forEach(([k, v]) => {
          obj.parts[k] = CompleteAssetRequest_Parts.toJSON(v);
        });
      }
    }
    if (message.enableProcessing !== false) {
      obj.enableProcessing = message.enableProcessing;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CompleteAssetRequest>, I>>(base?: I): CompleteAssetRequest {
    return CompleteAssetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CompleteAssetRequest>, I>>(object: I): CompleteAssetRequest {
    const message = createBaseCompleteAssetRequest();
    message.name = object.name ?? "";
    message.parts = Object.entries(object.parts ?? {}).reduce<{ [key: string]: CompleteAssetRequest_Parts }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = CompleteAssetRequest_Parts.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    message.enableProcessing = object.enableProcessing ?? false;
    return message;
  },
};

function createBaseCompleteAssetRequest_Parts(): CompleteAssetRequest_Parts {
  return { parts: [] };
}

export const CompleteAssetRequest_Parts = {
  fromJSON(object: any): CompleteAssetRequest_Parts {
    return {
      parts: globalThis.Array.isArray(object?.parts)
        ? object.parts.map((e: any) => CompleteAssetRequest_Part.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CompleteAssetRequest_Parts): unknown {
    const obj: any = {};
    if (message.parts?.length) {
      obj.parts = message.parts.map((e) => CompleteAssetRequest_Part.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CompleteAssetRequest_Parts>, I>>(base?: I): CompleteAssetRequest_Parts {
    return CompleteAssetRequest_Parts.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CompleteAssetRequest_Parts>, I>>(object: I): CompleteAssetRequest_Parts {
    const message = createBaseCompleteAssetRequest_Parts();
    message.parts = object.parts?.map((e) => CompleteAssetRequest_Part.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCompleteAssetRequest_Part(): CompleteAssetRequest_Part {
  return { number: 0, etag: "" };
}

export const CompleteAssetRequest_Part = {
  fromJSON(object: any): CompleteAssetRequest_Part {
    return {
      number: isSet(object.number) ? globalThis.Number(object.number) : 0,
      etag: isSet(object.etag) ? globalThis.String(object.etag) : "",
    };
  },

  toJSON(message: CompleteAssetRequest_Part): unknown {
    const obj: any = {};
    if (message.number !== 0) {
      obj.number = Math.round(message.number);
    }
    if (message.etag !== "") {
      obj.etag = message.etag;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CompleteAssetRequest_Part>, I>>(base?: I): CompleteAssetRequest_Part {
    return CompleteAssetRequest_Part.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CompleteAssetRequest_Part>, I>>(object: I): CompleteAssetRequest_Part {
    const message = createBaseCompleteAssetRequest_Part();
    message.number = object.number ?? 0;
    message.etag = object.etag ?? "";
    return message;
  },
};

function createBaseCompleteAssetRequest_PartsEntry(): CompleteAssetRequest_PartsEntry {
  return { key: "", value: undefined };
}

export const CompleteAssetRequest_PartsEntry = {
  fromJSON(object: any): CompleteAssetRequest_PartsEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? CompleteAssetRequest_Parts.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: CompleteAssetRequest_PartsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = CompleteAssetRequest_Parts.toJSON(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CompleteAssetRequest_PartsEntry>, I>>(base?: I): CompleteAssetRequest_PartsEntry {
    return CompleteAssetRequest_PartsEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CompleteAssetRequest_PartsEntry>, I>>(
    object: I,
  ): CompleteAssetRequest_PartsEntry {
    const message = createBaseCompleteAssetRequest_PartsEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? CompleteAssetRequest_Parts.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseCompleteAssetResponse(): CompleteAssetResponse {
  return { asset: undefined };
}

export const CompleteAssetResponse = {
  fromJSON(object: any): CompleteAssetResponse {
    return { asset: isSet(object.asset) ? Asset.fromJSON(object.asset) : undefined };
  },

  toJSON(message: CompleteAssetResponse): unknown {
    const obj: any = {};
    if (message.asset !== undefined) {
      obj.asset = Asset.toJSON(message.asset);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CompleteAssetResponse>, I>>(base?: I): CompleteAssetResponse {
    return CompleteAssetResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CompleteAssetResponse>, I>>(object: I): CompleteAssetResponse {
    const message = createBaseCompleteAssetResponse();
    message.asset = (object.asset !== undefined && object.asset !== null) ? Asset.fromPartial(object.asset) : undefined;
    return message;
  },
};

function createBaseGenerateAssetTransferURLRequest(): GenerateAssetTransferURLRequest {
  return { name: "", sourceFilepath: "", partNumber: 0 };
}

export const GenerateAssetTransferURLRequest = {
  fromJSON(object: any): GenerateAssetTransferURLRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      sourceFilepath: isSet(object.sourceFilepath) ? globalThis.String(object.sourceFilepath) : "",
      partNumber: isSet(object.partNumber) ? globalThis.Number(object.partNumber) : 0,
    };
  },

  toJSON(message: GenerateAssetTransferURLRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.sourceFilepath !== "") {
      obj.sourceFilepath = message.sourceFilepath;
    }
    if (message.partNumber !== 0) {
      obj.partNumber = Math.round(message.partNumber);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenerateAssetTransferURLRequest>, I>>(base?: I): GenerateAssetTransferURLRequest {
    return GenerateAssetTransferURLRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GenerateAssetTransferURLRequest>, I>>(
    object: I,
  ): GenerateAssetTransferURLRequest {
    const message = createBaseGenerateAssetTransferURLRequest();
    message.name = object.name ?? "";
    message.sourceFilepath = object.sourceFilepath ?? "";
    message.partNumber = object.partNumber ?? 0;
    return message;
  },
};

function createBaseGenerateAssetTransferURLResponse(): GenerateAssetTransferURLResponse {
  return { uri: "" };
}

export const GenerateAssetTransferURLResponse = {
  fromJSON(object: any): GenerateAssetTransferURLResponse {
    return { uri: isSet(object.uri) ? globalThis.String(object.uri) : "" };
  },

  toJSON(message: GenerateAssetTransferURLResponse): unknown {
    const obj: any = {};
    if (message.uri !== "") {
      obj.uri = message.uri;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenerateAssetTransferURLResponse>, I>>(
    base?: I,
  ): GenerateAssetTransferURLResponse {
    return GenerateAssetTransferURLResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GenerateAssetTransferURLResponse>, I>>(
    object: I,
  ): GenerateAssetTransferURLResponse {
    const message = createBaseGenerateAssetTransferURLResponse();
    message.uri = object.uri ?? "";
    return message;
  },
};

function createBaseGenerateAssetDownloadURLRequest(): GenerateAssetDownloadURLRequest {
  return { name: "", sourceFilepath: "" };
}

export const GenerateAssetDownloadURLRequest = {
  fromJSON(object: any): GenerateAssetDownloadURLRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      sourceFilepath: isSet(object.sourceFilepath) ? globalThis.String(object.sourceFilepath) : "",
    };
  },

  toJSON(message: GenerateAssetDownloadURLRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.sourceFilepath !== "") {
      obj.sourceFilepath = message.sourceFilepath;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenerateAssetDownloadURLRequest>, I>>(base?: I): GenerateAssetDownloadURLRequest {
    return GenerateAssetDownloadURLRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GenerateAssetDownloadURLRequest>, I>>(
    object: I,
  ): GenerateAssetDownloadURLRequest {
    const message = createBaseGenerateAssetDownloadURLRequest();
    message.name = object.name ?? "";
    message.sourceFilepath = object.sourceFilepath ?? "";
    return message;
  },
};

function createBaseGenerateAssetDownloadURLResponse(): GenerateAssetDownloadURLResponse {
  return { uri: "" };
}

export const GenerateAssetDownloadURLResponse = {
  fromJSON(object: any): GenerateAssetDownloadURLResponse {
    return { uri: isSet(object.uri) ? globalThis.String(object.uri) : "" };
  },

  toJSON(message: GenerateAssetDownloadURLResponse): unknown {
    const obj: any = {};
    if (message.uri !== "") {
      obj.uri = message.uri;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenerateAssetDownloadURLResponse>, I>>(
    base?: I,
  ): GenerateAssetDownloadURLResponse {
    return GenerateAssetDownloadURLResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GenerateAssetDownloadURLResponse>, I>>(
    object: I,
  ): GenerateAssetDownloadURLResponse {
    const message = createBaseGenerateAssetDownloadURLResponse();
    message.uri = object.uri ?? "";
    return message;
  },
};

function createBaseOverwriteAssetRequest(): OverwriteAssetRequest {
  return { name: "", filename: "", sizeBytes: 0, revisionLabel: "", attributes: {}, syncTracking: undefined };
}

export const OverwriteAssetRequest = {
  fromJSON(object: any): OverwriteAssetRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      filename: isSet(object.filename) ? globalThis.String(object.filename) : "",
      sizeBytes: isSet(object.sizeBytes) ? globalThis.Number(object.sizeBytes) : 0,
      revisionLabel: isSet(object.revisionLabel) ? globalThis.String(object.revisionLabel) : "",
      attributes: isObject(object.attributes)
        ? Object.entries(object.attributes).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      syncTracking: isSet(object.syncTracking) ? Asset_SyncTracking.fromJSON(object.syncTracking) : undefined,
    };
  },

  toJSON(message: OverwriteAssetRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.filename !== "") {
      obj.filename = message.filename;
    }
    if (message.sizeBytes !== 0) {
      obj.sizeBytes = Math.round(message.sizeBytes);
    }
    if (message.revisionLabel !== "") {
      obj.revisionLabel = message.revisionLabel;
    }
    if (message.attributes) {
      const entries = Object.entries(message.attributes);
      if (entries.length > 0) {
        obj.attributes = {};
        entries.forEach(([k, v]) => {
          obj.attributes[k] = v;
        });
      }
    }
    if (message.syncTracking !== undefined) {
      obj.syncTracking = Asset_SyncTracking.toJSON(message.syncTracking);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OverwriteAssetRequest>, I>>(base?: I): OverwriteAssetRequest {
    return OverwriteAssetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OverwriteAssetRequest>, I>>(object: I): OverwriteAssetRequest {
    const message = createBaseOverwriteAssetRequest();
    message.name = object.name ?? "";
    message.filename = object.filename ?? "";
    message.sizeBytes = object.sizeBytes ?? 0;
    message.revisionLabel = object.revisionLabel ?? "";
    message.attributes = Object.entries(object.attributes ?? {}).reduce<{ [key: string]: string }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = globalThis.String(value);
        }
        return acc;
      },
      {},
    );
    message.syncTracking = (object.syncTracking !== undefined && object.syncTracking !== null)
      ? Asset_SyncTracking.fromPartial(object.syncTracking)
      : undefined;
    return message;
  },
};

function createBaseOverwriteAssetRequest_AttributesEntry(): OverwriteAssetRequest_AttributesEntry {
  return { key: "", value: "" };
}

export const OverwriteAssetRequest_AttributesEntry = {
  fromJSON(object: any): OverwriteAssetRequest_AttributesEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: OverwriteAssetRequest_AttributesEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OverwriteAssetRequest_AttributesEntry>, I>>(
    base?: I,
  ): OverwriteAssetRequest_AttributesEntry {
    return OverwriteAssetRequest_AttributesEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OverwriteAssetRequest_AttributesEntry>, I>>(
    object: I,
  ): OverwriteAssetRequest_AttributesEntry {
    const message = createBaseOverwriteAssetRequest_AttributesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseOverwriteAssetResponse(): OverwriteAssetResponse {
  return { bucket: "", sourcePath: "" };
}

export const OverwriteAssetResponse = {
  fromJSON(object: any): OverwriteAssetResponse {
    return {
      bucket: isSet(object.bucket) ? globalThis.String(object.bucket) : "",
      sourcePath: isSet(object.sourcePath) ? globalThis.String(object.sourcePath) : "",
    };
  },

  toJSON(message: OverwriteAssetResponse): unknown {
    const obj: any = {};
    if (message.bucket !== "") {
      obj.bucket = message.bucket;
    }
    if (message.sourcePath !== "") {
      obj.sourcePath = message.sourcePath;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OverwriteAssetResponse>, I>>(base?: I): OverwriteAssetResponse {
    return OverwriteAssetResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OverwriteAssetResponse>, I>>(object: I): OverwriteAssetResponse {
    const message = createBaseOverwriteAssetResponse();
    message.bucket = object.bucket ?? "";
    message.sourcePath = object.sourcePath ?? "";
    return message;
  },
};

function createBaseAssetChangedEvent(): AssetChangedEvent {
  return { name: "" };
}

export const AssetChangedEvent = {
  fromJSON(object: any): AssetChangedEvent {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: AssetChangedEvent): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AssetChangedEvent>, I>>(base?: I): AssetChangedEvent {
    return AssetChangedEvent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AssetChangedEvent>, I>>(object: I): AssetChangedEvent {
    const message = createBaseAssetChangedEvent();
    message.name = object.name ?? "";
    return message;
  },
};

/** A service for managing assets (files, layers, point clouds etc.) */
export interface AssetService {
  /**
   * Creates an asset.
   * Emits an `AssetChanged` event.
   */
  createAsset(request: CreateAssetRequest): Observable<Asset>;
  /**
   * Retrieves an asset.
   * Will return assets that have been soft-deleted.
   */
  getAsset(request: GetAssetRequest): Observable<Asset>;
  /**
   * Updates an asset.
   * Emits an `AssetChanged` event.
   */
  updateAsset(request: UpdateAssetRequest): Observable<Asset>;
  /**
   * Soft-deletes an asset.
   * Emits an `AssetChanged` event.
   */
  deleteAsset(request: DeleteAssetRequest): Observable<Asset>;
  /** Lists all assets. */
  listAssets(request: ListAssetsRequest): Observable<ListAssetsResponse>;
  /**
   * Get a batch of assets.
   * If any of the assets cannot be returned, the entire request will fail.
   * Will return assets that have been soft-deleted.
   */
  batchGetAssets(request: BatchGetAssetsRequest): Observable<BatchGetAssetsResponse>;
  /**
   * Generate Transfer URLs for an asset's source.
   * The URL could be for multipart or single part transfers, depending part_number being set.
   * The first time the API a request for a source with part_number set it initializes the multipart
   * transfer process. From that point onwards all requests for that source must contain part_number.
   *
   * If the asset state isn't TRANSFERRING, FAILED_PRECONDITION is returned.
   * If the source doesn't exist in the asset, NOT_FOUND is returned.
   *
   * This service does NOT generate url for Assets going through an overwrite process.
   * Overwriting is an internal-only process that requires direct access to the S3 bucket.
   *
   * These URLs are valid for 60 minutes. Users should request them as they are used rather than in batches.
   * Requests made to the generated URLs must use the HTTP PUT method.
   */
  generateAssetTransferUrl(request: GenerateAssetTransferURLRequest): Observable<GenerateAssetTransferURLResponse>;
  /**
   * Generate a download URL for an asset's source.
   *
   * These URLs are valid for 60 minutes. Users should request them as they are used rather than in batches.
   * Requests made to the generated URLs must use the HTTP GET method.
   */
  generateAssetDownloadUrl(request: GenerateAssetDownloadURLRequest): Observable<GenerateAssetDownloadURLResponse>;
  /**
   * Initiates the overwrite process for this asset, a stopgap solution for overwritting an asset's source
   * and output while we don't implement proper revisioning.
   *
   * Lifecycle management services will start treating this asset as if its state were TRANSFERRING.
   * Calls to them will start using the parameters set by this call and eventually replace
   * the top level attributes.
   *
   * Note that retrievals of this entity will still return the real state of the asset, only
   * the lifecycle management services will treat it as if it were still TRANSFERRING. This
   * is to allow for regular usage of assets while the overwrite process is happening.
   *
   * Only assets with a single source can be overwritten.
   */
  overwriteAsset(request: OverwriteAssetRequest): Observable<OverwriteAssetResponse>;
  /**
   * Activates an asset. In other words, the asset is ready to display.
   * The `state` of the asset after activating is `ACTIVE`.
   * `ActivateAsset` can be called on all assets in the state `PROCESSING`; Assets in a
   * different state returns a `FAILED_PRECONDITION` error.
   * Emits an `AssetChanged` event.
   */
  activateAsset(request: ActivateAssetRequest): Observable<ActivateAssetResponse>;
  /**
   * Complete this asset's transfer phase.
   * This endpoint triggers processing when enable_processing is set to true and the extension of
   * one of the sources is a supported one.
   * If the state of the asset isn't `TRANSFERRING`, this service will return `FAILED_PRECONDITION`.
   * If the list of sources doesn't match the one in the Asset, this service will return `INVALID_ARGUMENT`
   * For asset sources transfered through multipart transfer, all parts must be listed in the request.
   * See Asset.Lifecycle for a more in-depth explanation of the lifecycle of assets.
   * Emits an `AssetChanged` event.
   */
  completeAsset(request: CompleteAssetRequest): Observable<CompleteAssetResponse>;
  /**
   * Transition this asset into a failed state.
   *
   * If the previous state was TRANSFERRING, the next state will be TRANSFER_FAILED.
   * If the previous state was PROCESSING, the next state will be PROCESSING_FAILED.
   * Other state transitions aren't allowed and the service will return FAILED_PRECONDITION.
   * See Asset.Lifecycle for a more in-depth explanation of the lifecycle of assets.
   *
   * Any unfinished multipart transfer will be aborted as part of this request.
   * Emits an `AssetChanged` event.
   */
  failAsset(request: FailAssetRequest): Observable<FailAssetResponse>;
}

export const AssetServiceServiceName = "sensat.data.assets.v4alpha1.AssetService";
@Injectable({ providedIn: "root" })
export class AssetServiceClient implements AssetService {
  private readonly service: string;
  constructor(private readonly http: HttpClient, private readonly opts?: { service?: string }) {
    this.service = this.opts?.service || AssetServiceServiceName;
  }
  createAsset(request: CreateAssetRequest): Observable<Asset> {
    const data = CreateAssetRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => Asset.fromJSON(JSON.parse(data))));
  }

  getAsset(request: GetAssetRequest): Observable<Asset> {
    const data = GetAssetRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => Asset.fromJSON(JSON.parse(data))));
  }

  updateAsset(request: UpdateAssetRequest): Observable<Asset> {
    const data = UpdateAssetRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => Asset.fromJSON(JSON.parse(data))));
  }

  deleteAsset(request: DeleteAssetRequest): Observable<Asset> {
    const data = DeleteAssetRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => Asset.fromJSON(JSON.parse(data))));
  }

  listAssets(request: ListAssetsRequest): Observable<ListAssetsResponse> {
    const data = ListAssetsRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => ListAssetsResponse.fromJSON(JSON.parse(data))));
  }

  batchGetAssets(request: BatchGetAssetsRequest): Observable<BatchGetAssetsResponse> {
    const data = BatchGetAssetsRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => BatchGetAssetsResponse.fromJSON(JSON.parse(data))));
  }

  generateAssetTransferUrl(request: GenerateAssetTransferURLRequest): Observable<GenerateAssetTransferURLResponse> {
    const data = GenerateAssetTransferURLRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => GenerateAssetTransferURLResponse.fromJSON(JSON.parse(data))));
  }

  generateAssetDownloadUrl(request: GenerateAssetDownloadURLRequest): Observable<GenerateAssetDownloadURLResponse> {
    const data = GenerateAssetDownloadURLRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => GenerateAssetDownloadURLResponse.fromJSON(JSON.parse(data))));
  }

  overwriteAsset(request: OverwriteAssetRequest): Observable<OverwriteAssetResponse> {
    const data = OverwriteAssetRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => OverwriteAssetResponse.fromJSON(JSON.parse(data))));
  }

  activateAsset(request: ActivateAssetRequest): Observable<ActivateAssetResponse> {
    const data = ActivateAssetRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => ActivateAssetResponse.fromJSON(JSON.parse(data))));
  }

  completeAsset(request: CompleteAssetRequest): Observable<CompleteAssetResponse> {
    const data = CompleteAssetRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => CompleteAssetResponse.fromJSON(JSON.parse(data))));
  }

  failAsset(request: FailAssetRequest): Observable<FailAssetResponse> {
    const data = FailAssetRequest.toJSON(request);
    const result = this.http.request(method, url, {
      body,
      headers: angularHeaders,
      withCredentials: true,
      responseType: "text",
    });
    return result.pipe(map((data) => FailAssetResponse.fromJSON(JSON.parse(data))));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
