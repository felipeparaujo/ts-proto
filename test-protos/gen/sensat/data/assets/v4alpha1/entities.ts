/* eslint-disable */
import { Timestamp } from "../../../../google/protobuf/timestamp";
import { Code, codeFromJSON, codeToJSON } from "../../../../google/rpc/code";
import { DateMessage } from "../../../../google/type/date";
import { ExtentOrBoundingBox } from "../../../types/v4alpha1/geometry";

export const protobufPackage = "sensat.data.assets.v4alpha1";

/**
 * An asset is a file or collection of files that can be displayed,
 * processed and generate outputs. All files uploaded or otherwise
 * created in the platform are represented by this entity.
 */
export interface Asset {
  /**
   * Unique resource identifier. This is NOT the resource title and should not be used
   * for display purposes. Follows https://aip.dev/122
   */
  name: string;
  /** Resource name of the folder this asset belongs to. */
  folder: string;
  /** Human-readable title of this asset. */
  title: string;
  /** Human-readable description of this asset. */
  description: string;
  /** In which UM panel this asset will be displayed. */
  panelVisibility: Asset_PanelVisibility;
  /** S3 bucket this asset's sources and output lives in. */
  bucket: string;
  /**
   * Path prefix in S3. This asset's sources and outputs use this attribute
   * to construct their own paths, which means all sources and outputs exist
   * under this path.
   */
  pathPrefix: string;
  /**
   * Revision label, used when this asset was synced from a remote source such as a CDE.
   * The term version is intentionally avoided as to not clash with API version
   */
  revisionLabel: string;
  /** Generic attributes of the asset. These are user-visible and shouldn't have any semantics in our systems. */
  attributes: { [key: string]: string };
  /**
   * Bounds of the displayables of this asset in the output CRS.
   * It's up to the user to interpret this attribute as either an extent or a bounding box.
   * If this is an extent (2D) the Z axis on min and max will be 0 and should be ignored.
   */
  extentOrBoundingBox:
    | ExtentOrBoundingBox
    | undefined;
  /** Asset lifecycle. See `Lifecycle` message for explanation. */
  lifecycle:
    | Asset_Lifecycle
    | undefined;
  /**
   * A map from relative filepath to the source object. For example, an asset
   * could have the following sources:
   *
   * {
   *    "cad.dwg":        {Source},
   *    "font.ttf":       {Source},
   *    "images/dog.png": {Source}
   * }
   *
   * Filepaths must be unique across all sources and their keys in the map must match
   * their filepath attribute.
   * See `Asset.Source` message for more information on what each source contains.
   *
   * Once created, this map cannot have sources added or removed, however each
   * source can be individually updated.
   */
  sources: { [key: string]: Asset_Source };
  /**
   * Filepath of the main source. Must be a key in the sources map.
   * This source is used to decide the what processing job to trigger.
   */
  mainSource: string;
  /** Asset Output. See `Asset.Output` message for more information. */
  output:
    | Asset_Output
    | undefined;
  /** Asset access information. */
  access:
    | Asset_Access
    | undefined;
  /** Information necessary to track this asset's sync process. */
  syncTracking:
    | Asset_SyncTracking
    | undefined;
  /** Timeline of the asset */
  timeline: Asset_Timeline | undefined;
}

/** Possible UM panels this asset may be displayed. */
export enum Asset_PanelVisibility {
  /** PANEL_VISIBILITY_UNSPECIFIED - Default value. This value is unused. */
  PANEL_VISIBILITY_UNSPECIFIED = 0,
  /** ONLY_2D - Shows up in the 2D enviroment panel exclusively. */
  ONLY_2D = 1,
  /** ONLY_3D - Shows up in the 3D environment panel exclusively. */
  ONLY_3D = 2,
  /** ALWAYS - Shows up in all panels. */
  ALWAYS = 3,
  /** NEVER - Never shows up. */
  NEVER = 4,
}

export function asset_PanelVisibilityFromJSON(object: any): Asset_PanelVisibility {
  switch (object) {
    case 0:
    case "PANEL_VISIBILITY_UNSPECIFIED":
      return Asset_PanelVisibility.PANEL_VISIBILITY_UNSPECIFIED;
    case 1:
    case "ONLY_2D":
      return Asset_PanelVisibility.ONLY_2D;
    case 2:
    case "ONLY_3D":
      return Asset_PanelVisibility.ONLY_3D;
    case 3:
    case "ALWAYS":
      return Asset_PanelVisibility.ALWAYS;
    case 4:
    case "NEVER":
      return Asset_PanelVisibility.NEVER;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum Asset_PanelVisibility");
  }
}

export function asset_PanelVisibilityToJSON(object: Asset_PanelVisibility): string {
  switch (object) {
    case Asset_PanelVisibility.PANEL_VISIBILITY_UNSPECIFIED:
      return "PANEL_VISIBILITY_UNSPECIFIED";
    case Asset_PanelVisibility.ONLY_2D:
      return "ONLY_2D";
    case Asset_PanelVisibility.ONLY_3D:
      return "ONLY_3D";
    case Asset_PanelVisibility.ALWAYS:
      return "ALWAYS";
    case Asset_PanelVisibility.NEVER:
      return "NEVER";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum Asset_PanelVisibility");
  }
}

export interface Asset_AttributesEntry {
  key: string;
  value: string;
}

/**
 * Asset's lifecycle management.
 *
 * State transitions (states in rectangles are rest states):
 * ```
 *             ┌──────────────────────────────────────┐
 *             │                                      │
 *             │                                  ┌───▼──┐
 * ─────►TRANSFERRING────┬────►PROCESSING──────┬─►│ACTIVE│
 *             │         │          │          │  └───┬──┘
 *             │         │          │          │      │
 *     ┌───────▼───────┐ │ ┌────────▼────────┐ │      │
 *     │TRANSFER_FAILED│ │ │PROCESSING_FAILED│ │      │
 *     └───────┬───────┘ │ └────────┬────────┘ │      │
 *             │         │          │          │      │
 *             │         └────────┐ │ ┌────────┘      │
 *             │                  │ │ │               │
 *             │                ┌─▼─▼─▼─┐             │
 *             └───────────────►│DELETED│◄────────────┘
 *                              └───────┘
 * ```
 *
 * An asset goes through a few phases in its lifecycle:
 *
 * 1. Transferring: This is the initial state, where all sources that compose this asset
 * are getting transferred to our file storage systems (buckets in S3). In this phase, the
 * asset isn't usable as it's not complete yet. Once complete an asset either transitions to PROCESSING,
 * if it has one of the sources has a supported file extensions, or it moves to ACTIVE if it doesn't.
 *
 *     * Transfer failed: Rest state. Transfer failed and the sources aren't accessible. They are treated
 * as a single entity, so if an asset is composed by more than one source and only one of them fails,
 * the state of the whole asset is `TRANSFER_FAILED`
 *
 * 2. Processing: Once transferring is complete, an asset can optionally go into the processing
 * state depending on source file extensions. At this stage all sources are present in S3 and are accessible
 * by the platform or processing jobs, which means they're downloadable. It's during this stage that the
 * `output` attribute containing canvas displayables will be generate. If processing finishes successfully,
 * the asset is transitioned to the ACTIVE state.
 *
 *     * Processing failed: Rest state. Transfer was successful but processing failed. Sources are accessible and the asset
 * is complete but not displayable on canvas as there's no output.
 *
 * 3. Active: Rest state. Processing is done, both `sources` and `output` are complete and the asset is ready
 * for displaying on canvas.
 *
 * 4. Deleted. At any point an asset can be deleted. It shouldn't be displayed in the canvas, but calls made to update
 * it will still work.
 */
export interface Asset_Lifecycle {
  /** Current state of the asset. */
  state: Asset_Lifecycle_State;
  /** Asset creation time, in UTC. */
  createTime:
    | Date
    | undefined;
  /** Asset last update time, in UTC. */
  updateTime:
    | Date
    | undefined;
  /** Asset deletion time, in UTC. */
  deleteTime:
    | Date
    | undefined;
  /** AWS Step Function execution ARN. */
  executionArn: string;
  /** Details of the failure */
  failureDetails: Asset_Lifecycle_FailureDetails | undefined;
}

/** Possible states of the asset in its lifecycle */
export enum Asset_Lifecycle_State {
  /** STATE_UNSPECIFIED - Unspecified. This state is unused and disallowed by validation. */
  STATE_UNSPECIFIED = 0,
  /** TRANSFERRING - Asset is incomplete, sources haven't finished transferring. */
  TRANSFERRING = 1,
  /** TRANSFER_FAILED - Transfer failed, failure_details will contain more information. */
  TRANSFER_FAILED = 2,
  /** PROCESSING - Asset is complete and being processed by a job. Sources are available, output is not. */
  PROCESSING = 3,
  /** PROCESSING_FAILED - Processing failed, failure_details will contain more information. */
  PROCESSING_FAILED = 4,
  /** ACTIVE - Asset is active. Transfer and processing are done. */
  ACTIVE = 5,
  /** DELETED - Asset has been deleted. */
  DELETED = 6,
}

export function asset_Lifecycle_StateFromJSON(object: any): Asset_Lifecycle_State {
  switch (object) {
    case 0:
    case "STATE_UNSPECIFIED":
      return Asset_Lifecycle_State.STATE_UNSPECIFIED;
    case 1:
    case "TRANSFERRING":
      return Asset_Lifecycle_State.TRANSFERRING;
    case 2:
    case "TRANSFER_FAILED":
      return Asset_Lifecycle_State.TRANSFER_FAILED;
    case 3:
    case "PROCESSING":
      return Asset_Lifecycle_State.PROCESSING;
    case 4:
    case "PROCESSING_FAILED":
      return Asset_Lifecycle_State.PROCESSING_FAILED;
    case 5:
    case "ACTIVE":
      return Asset_Lifecycle_State.ACTIVE;
    case 6:
    case "DELETED":
      return Asset_Lifecycle_State.DELETED;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum Asset_Lifecycle_State");
  }
}

export function asset_Lifecycle_StateToJSON(object: Asset_Lifecycle_State): string {
  switch (object) {
    case Asset_Lifecycle_State.STATE_UNSPECIFIED:
      return "STATE_UNSPECIFIED";
    case Asset_Lifecycle_State.TRANSFERRING:
      return "TRANSFERRING";
    case Asset_Lifecycle_State.TRANSFER_FAILED:
      return "TRANSFER_FAILED";
    case Asset_Lifecycle_State.PROCESSING:
      return "PROCESSING";
    case Asset_Lifecycle_State.PROCESSING_FAILED:
      return "PROCESSING_FAILED";
    case Asset_Lifecycle_State.ACTIVE:
      return "ACTIVE";
    case Asset_Lifecycle_State.DELETED:
      return "DELETED";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum Asset_Lifecycle_State");
  }
}

/** Details of the failure */
export interface Asset_Lifecycle_FailureDetails {
  /** Category of the failure. Will always be one of the gRPC error codes. */
  category: Code;
}

/**
 * A representation of one of the sources that compose this entity. An asset can
 * be composed of one or more source, which could be processed by background jobs
 * depending on file extensions.
 * Sources are references to paths in our file store system, and come along with
 * some of that source's intrinsic properties such as sizes, licences, CRSes
 *
 * As we use S3 to store our sources, there are some limits that must be observed.
 * Of note are part sizes and their limits: If a file is larger than 5GiB it must be broken
 * down into parts of at least 5MiB (except for the last part) which must be transferred separately
 * and completed once all exist within AWS.
 *
 * AWS's suggestion is to break uploads into 100MiB parts, but we leave it consumers
 * to decide how to manage their upload parts.
 *
 * The GetAssetUploadURL endpoint generates signed URLs for the uploads and the CompleteAsset
 * endpoint completes multipart uploads when they exist.
 *
 * For more information on S3 limits see https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html
 */
export interface Asset_Source {
  /** Path in S3. Always starts with `Asset.path_prefix` and will live in `Asset.bucket`. */
  path: string;
  /** Size, in bytes. */
  sizeBytes: number;
  /** Relative path of this file in disk. Must be unique across all sources. */
  filepath: string;
  /** Licence type. */
  licence: Asset_Source_Licence;
  /** Legal notice required by some of our dataset providers. */
  attribution: string;
  /**
   * Original CRS of this file. Must exist before the asset is created.
   * This is a reference to the CRS collection, not the hydrated CRS.
   */
  crs: string;
  /** Time this source was originally captured. */
  captureTime: Date | undefined;
}

/** Possible types of licence for this source. */
export enum Asset_Source_Licence {
  /** LICENCE_UNSPECIFIED - Default value, licence isn't specified. Means this file can be  downloaded. */
  LICENCE_UNSPECIFIED = 0,
  /** OPENSOURCE - Opensource. Means this file can be freely downloaded and distributed. */
  OPENSOURCE = 1,
  /** RESTRICTED - Restricted. Means this file cannot be download or distributed. */
  RESTRICTED = 2,
}

export function asset_Source_LicenceFromJSON(object: any): Asset_Source_Licence {
  switch (object) {
    case 0:
    case "LICENCE_UNSPECIFIED":
      return Asset_Source_Licence.LICENCE_UNSPECIFIED;
    case 1:
    case "OPENSOURCE":
      return Asset_Source_Licence.OPENSOURCE;
    case 2:
    case "RESTRICTED":
      return Asset_Source_Licence.RESTRICTED;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum Asset_Source_Licence");
  }
}

export function asset_Source_LicenceToJSON(object: Asset_Source_Licence): string {
  switch (object) {
    case Asset_Source_Licence.LICENCE_UNSPECIFIED:
      return "LICENCE_UNSPECIFIED";
    case Asset_Source_Licence.OPENSOURCE:
      return "OPENSOURCE";
    case Asset_Source_Licence.RESTRICTED:
      return "RESTRICTED";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum Asset_Source_Licence");
  }
}

export interface Asset_SourcesEntry {
  key: string;
  value: Asset_Source | undefined;
}

/**
 * Output generated by a processing job. An asset has no intrisic knowledge
 * on how its output is loaded except for the `loading` object,
 * which contains a reference which should be interpertred by the consumer.
 * Usually outputs will contain references to manifests which will have more
 * information on the output.
 */
export interface Asset_Output {
  /**
   * Path in S3. Always starts with `Asset.path_prefix` and will live in `Asset.bucket`.
   * Usually a path to the output manifest.
   */
  path: string;
  /** Information on how to load this output. */
  loading:
    | Asset_Output_Loading
    | undefined;
  /** CRS type this output was processed to. */
  crs: Asset_Output_CRS;
  /**
   * Maximum zoom level this entity shows up in.
   * Used by 2D datasets such as Slippy Map Tiles or Vector files processed from DXFs.
   */
  maxZoom: number;
  /**
   * Minimum zoom level this entity shows up in.
   * Used by 2D datasets such as Slippy Map Tiles or Vector files processed from DXFs.
   */
  minZoom: number;
  /**
   * Used to know when to colorize height-based pointclouds.
   *
   * Default value is false.
   */
  hasRgb: boolean;
}

/** Possible CRS types. */
export enum Asset_Output_CRS {
  /** CRS_UNSPECIFIED - Unspecified. Unused and enforced by validation. */
  CRS_UNSPECIFIED = 0,
  /** PROJECT - Project CRS. Being phased out in favour of Sensat Mercator. */
  PROJECT = 1,
  /** SENSAT_MERCATOR - Sensat Mercator CRS. */
  SENSAT_MERCATOR = 2,
}

export function asset_Output_CRSFromJSON(object: any): Asset_Output_CRS {
  switch (object) {
    case 0:
    case "CRS_UNSPECIFIED":
      return Asset_Output_CRS.CRS_UNSPECIFIED;
    case 1:
    case "PROJECT":
      return Asset_Output_CRS.PROJECT;
    case 2:
    case "SENSAT_MERCATOR":
      return Asset_Output_CRS.SENSAT_MERCATOR;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum Asset_Output_CRS");
  }
}

export function asset_Output_CRSToJSON(object: Asset_Output_CRS): string {
  switch (object) {
    case Asset_Output_CRS.CRS_UNSPECIFIED:
      return "CRS_UNSPECIFIED";
    case Asset_Output_CRS.PROJECT:
      return "PROJECT";
    case Asset_Output_CRS.SENSAT_MERCATOR:
      return "SENSAT_MERCATOR";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum Asset_Output_CRS");
  }
}

/** Information on how to load this output. */
export interface Asset_Output_Loading {
  /**
   * Freeform field for this output format. It should contain enough information
   * so that a consumer can decide how to load this output. Will look something like
   * "kml", "tileset", "slippy_map_tiles".
   * Meaning is to be interpreted by consumer.
   */
  format: string;
  /**
   * Revision of the loader. Meaning is to be interpreted by consumer.
   * follows semver: vMAJOR.MINOR.PATCH
   */
  revision: string;
}

/** Asset access information. */
export interface Asset_Access {
  /** User who created this asset. */
  creator: string;
  /**
   * Stopgap solution while we don't implement proper authorization.
   * Used in markup/comment attachments and viewpoint thumbnails so
   * contributors have access to files they normally don't have access to.
   *
   * Default value is false.
   */
  isPublic: boolean;
}

/**
 * Information used for keeping track of assets synced from remote
 * file stores. These are usually CDEs such as ACC, ProjectWise
 * or Aconex.
 */
export interface Asset_SyncTracking {
  /** External ID defined in the origin. */
  externalId: string;
  /** Integration that manages keeping this asset in sync with the origin */
  integration: string;
  /** Revision of the original source, as defined in the origin. */
  revision: number;
  /** Time of the last update for this source in the origin. */
  updateTime:
    | Date
    | undefined;
  /** Checksum information. */
  checksum: Asset_SyncTracking_Checksum | undefined;
}

/**
 * Checksum information for the file. Used to known when the original source file
 * was updated.
 */
export interface Asset_SyncTracking_Checksum {
  /** Hash value. */
  value: string;
  /** Which algorithm was used to generate the hash. */
  algorithm: Asset_SyncTracking_Checksum_Algorithm;
}

/** List of possible algorithms used for hashing. */
export enum Asset_SyncTracking_Checksum_Algorithm {
  /** ALGORITHM_UNSPECIFIED - Unspecified. Unused and disallowed by validation. */
  ALGORITHM_UNSPECIFIED = 0,
  /** MD5 - MD5 */
  MD5 = 1,
}

export function asset_SyncTracking_Checksum_AlgorithmFromJSON(object: any): Asset_SyncTracking_Checksum_Algorithm {
  switch (object) {
    case 0:
    case "ALGORITHM_UNSPECIFIED":
      return Asset_SyncTracking_Checksum_Algorithm.ALGORITHM_UNSPECIFIED;
    case 1:
    case "MD5":
      return Asset_SyncTracking_Checksum_Algorithm.MD5;
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum Asset_SyncTracking_Checksum_Algorithm",
      );
  }
}

export function asset_SyncTracking_Checksum_AlgorithmToJSON(object: Asset_SyncTracking_Checksum_Algorithm): string {
  switch (object) {
    case Asset_SyncTracking_Checksum_Algorithm.ALGORITHM_UNSPECIFIED:
      return "ALGORITHM_UNSPECIFIED";
    case Asset_SyncTracking_Checksum_Algorithm.MD5:
      return "MD5";
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum Asset_SyncTracking_Checksum_Algorithm",
      );
  }
}

/** Information on this asset's timeline visibility */
export interface Asset_Timeline {
  /**
   * Date for when this asset starts showing up in the timeline. If unset, it displays from the
   * beggining of time
   */
  startDate:
    | DateMessage
    | undefined;
  /**
   * Date for when this asset stops showing up in the timeline. If unset, it displays to the
   * end of time
   */
  endDate:
    | DateMessage
    | undefined;
  /** How end date is interpreted. */
  visibility: Asset_Timeline_Visibility;
}

/** Visibity types */
export enum Asset_Timeline_Visibility {
  /** VISIBILITY_UNSPECIFIED - Default value, unspecified visibility. Behaves the same as TEMPORARY */
  VISIBILITY_UNSPECIFIED = 0,
  /** PERMANENT - Permament. Shows during and after the specified time range. */
  PERMANENT = 1,
  /** TEMPORARY - Temporary. Shows only during the specified time range. */
  TEMPORARY = 2,
}

export function asset_Timeline_VisibilityFromJSON(object: any): Asset_Timeline_Visibility {
  switch (object) {
    case 0:
    case "VISIBILITY_UNSPECIFIED":
      return Asset_Timeline_Visibility.VISIBILITY_UNSPECIFIED;
    case 1:
    case "PERMANENT":
      return Asset_Timeline_Visibility.PERMANENT;
    case 2:
    case "TEMPORARY":
      return Asset_Timeline_Visibility.TEMPORARY;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum Asset_Timeline_Visibility");
  }
}

export function asset_Timeline_VisibilityToJSON(object: Asset_Timeline_Visibility): string {
  switch (object) {
    case Asset_Timeline_Visibility.VISIBILITY_UNSPECIFIED:
      return "VISIBILITY_UNSPECIFIED";
    case Asset_Timeline_Visibility.PERMANENT:
      return "PERMANENT";
    case Asset_Timeline_Visibility.TEMPORARY:
      return "TEMPORARY";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum Asset_Timeline_Visibility");
  }
}

function createBaseAsset(): Asset {
  return {
    name: "",
    folder: "",
    title: "",
    description: "",
    panelVisibility: 0,
    bucket: "",
    pathPrefix: "",
    revisionLabel: "",
    attributes: {},
    extentOrBoundingBox: undefined,
    lifecycle: undefined,
    sources: {},
    mainSource: "",
    output: undefined,
    access: undefined,
    syncTracking: undefined,
    timeline: undefined,
  };
}

export const Asset = {
  fromJSON(object: any): Asset {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      folder: isSet(object.folder) ? globalThis.String(object.folder) : "",
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      panelVisibility: isSet(object.panelVisibility) ? asset_PanelVisibilityFromJSON(object.panelVisibility) : 0,
      bucket: isSet(object.bucket) ? globalThis.String(object.bucket) : "",
      pathPrefix: isSet(object.pathPrefix) ? globalThis.String(object.pathPrefix) : "",
      revisionLabel: isSet(object.revisionLabel) ? globalThis.String(object.revisionLabel) : "",
      attributes: isObject(object.attributes)
        ? Object.entries(object.attributes).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      extentOrBoundingBox: isSet(object.extentOrBoundingBox)
        ? ExtentOrBoundingBox.fromJSON(object.extentOrBoundingBox)
        : undefined,
      lifecycle: isSet(object.lifecycle) ? Asset_Lifecycle.fromJSON(object.lifecycle) : undefined,
      sources: isObject(object.sources)
        ? Object.entries(object.sources).reduce<{ [key: string]: Asset_Source }>((acc, [key, value]) => {
          acc[key] = Asset_Source.fromJSON(value);
          return acc;
        }, {})
        : {},
      mainSource: isSet(object.mainSource) ? globalThis.String(object.mainSource) : "",
      output: isSet(object.output) ? Asset_Output.fromJSON(object.output) : undefined,
      access: isSet(object.access) ? Asset_Access.fromJSON(object.access) : undefined,
      syncTracking: isSet(object.syncTracking) ? Asset_SyncTracking.fromJSON(object.syncTracking) : undefined,
      timeline: isSet(object.timeline) ? Asset_Timeline.fromJSON(object.timeline) : undefined,
    };
  },

  toJSON(message: Asset): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.folder !== "") {
      obj.folder = message.folder;
    }
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.panelVisibility !== 0) {
      obj.panelVisibility = asset_PanelVisibilityToJSON(message.panelVisibility);
    }
    if (message.bucket !== "") {
      obj.bucket = message.bucket;
    }
    if (message.pathPrefix !== "") {
      obj.pathPrefix = message.pathPrefix;
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
    if (message.extentOrBoundingBox !== undefined) {
      obj.extentOrBoundingBox = ExtentOrBoundingBox.toJSON(message.extentOrBoundingBox);
    }
    if (message.lifecycle !== undefined) {
      obj.lifecycle = Asset_Lifecycle.toJSON(message.lifecycle);
    }
    if (message.sources) {
      const entries = Object.entries(message.sources);
      if (entries.length > 0) {
        obj.sources = {};
        entries.forEach(([k, v]) => {
          obj.sources[k] = Asset_Source.toJSON(v);
        });
      }
    }
    if (message.mainSource !== "") {
      obj.mainSource = message.mainSource;
    }
    if (message.output !== undefined) {
      obj.output = Asset_Output.toJSON(message.output);
    }
    if (message.access !== undefined) {
      obj.access = Asset_Access.toJSON(message.access);
    }
    if (message.syncTracking !== undefined) {
      obj.syncTracking = Asset_SyncTracking.toJSON(message.syncTracking);
    }
    if (message.timeline !== undefined) {
      obj.timeline = Asset_Timeline.toJSON(message.timeline);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset>, I>>(base?: I): Asset {
    return Asset.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset>, I>>(object: I): Asset {
    const message = createBaseAsset();
    message.name = object.name ?? "";
    message.folder = object.folder ?? "";
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.panelVisibility = object.panelVisibility ?? 0;
    message.bucket = object.bucket ?? "";
    message.pathPrefix = object.pathPrefix ?? "";
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
    message.extentOrBoundingBox = (object.extentOrBoundingBox !== undefined && object.extentOrBoundingBox !== null)
      ? ExtentOrBoundingBox.fromPartial(object.extentOrBoundingBox)
      : undefined;
    message.lifecycle = (object.lifecycle !== undefined && object.lifecycle !== null)
      ? Asset_Lifecycle.fromPartial(object.lifecycle)
      : undefined;
    message.sources = Object.entries(object.sources ?? {}).reduce<{ [key: string]: Asset_Source }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = Asset_Source.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    message.mainSource = object.mainSource ?? "";
    message.output = (object.output !== undefined && object.output !== null)
      ? Asset_Output.fromPartial(object.output)
      : undefined;
    message.access = (object.access !== undefined && object.access !== null)
      ? Asset_Access.fromPartial(object.access)
      : undefined;
    message.syncTracking = (object.syncTracking !== undefined && object.syncTracking !== null)
      ? Asset_SyncTracking.fromPartial(object.syncTracking)
      : undefined;
    message.timeline = (object.timeline !== undefined && object.timeline !== null)
      ? Asset_Timeline.fromPartial(object.timeline)
      : undefined;
    return message;
  },
};

function createBaseAsset_AttributesEntry(): Asset_AttributesEntry {
  return { key: "", value: "" };
}

export const Asset_AttributesEntry = {
  fromJSON(object: any): Asset_AttributesEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: Asset_AttributesEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_AttributesEntry>, I>>(base?: I): Asset_AttributesEntry {
    return Asset_AttributesEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_AttributesEntry>, I>>(object: I): Asset_AttributesEntry {
    const message = createBaseAsset_AttributesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseAsset_Lifecycle(): Asset_Lifecycle {
  return {
    state: 0,
    createTime: undefined,
    updateTime: undefined,
    deleteTime: undefined,
    executionArn: "",
    failureDetails: undefined,
  };
}

export const Asset_Lifecycle = {
  fromJSON(object: any): Asset_Lifecycle {
    return {
      state: isSet(object.state) ? asset_Lifecycle_StateFromJSON(object.state) : 0,
      createTime: isSet(object.createTime) ? fromJsonTimestamp(object.createTime) : undefined,
      updateTime: isSet(object.updateTime) ? fromJsonTimestamp(object.updateTime) : undefined,
      deleteTime: isSet(object.deleteTime) ? fromJsonTimestamp(object.deleteTime) : undefined,
      executionArn: isSet(object.executionArn) ? globalThis.String(object.executionArn) : "",
      failureDetails: isSet(object.failureDetails)
        ? Asset_Lifecycle_FailureDetails.fromJSON(object.failureDetails)
        : undefined,
    };
  },

  toJSON(message: Asset_Lifecycle): unknown {
    const obj: any = {};
    if (message.state !== 0) {
      obj.state = asset_Lifecycle_StateToJSON(message.state);
    }
    if (message.createTime !== undefined) {
      obj.createTime = message.createTime.toISOString();
    }
    if (message.updateTime !== undefined) {
      obj.updateTime = message.updateTime.toISOString();
    }
    if (message.deleteTime !== undefined) {
      obj.deleteTime = message.deleteTime.toISOString();
    }
    if (message.executionArn !== "") {
      obj.executionArn = message.executionArn;
    }
    if (message.failureDetails !== undefined) {
      obj.failureDetails = Asset_Lifecycle_FailureDetails.toJSON(message.failureDetails);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_Lifecycle>, I>>(base?: I): Asset_Lifecycle {
    return Asset_Lifecycle.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_Lifecycle>, I>>(object: I): Asset_Lifecycle {
    const message = createBaseAsset_Lifecycle();
    message.state = object.state ?? 0;
    message.createTime = object.createTime ?? undefined;
    message.updateTime = object.updateTime ?? undefined;
    message.deleteTime = object.deleteTime ?? undefined;
    message.executionArn = object.executionArn ?? "";
    message.failureDetails = (object.failureDetails !== undefined && object.failureDetails !== null)
      ? Asset_Lifecycle_FailureDetails.fromPartial(object.failureDetails)
      : undefined;
    return message;
  },
};

function createBaseAsset_Lifecycle_FailureDetails(): Asset_Lifecycle_FailureDetails {
  return { category: 0 };
}

export const Asset_Lifecycle_FailureDetails = {
  fromJSON(object: any): Asset_Lifecycle_FailureDetails {
    return { category: isSet(object.category) ? codeFromJSON(object.category) : 0 };
  },

  toJSON(message: Asset_Lifecycle_FailureDetails): unknown {
    const obj: any = {};
    if (message.category !== 0) {
      obj.category = codeToJSON(message.category);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_Lifecycle_FailureDetails>, I>>(base?: I): Asset_Lifecycle_FailureDetails {
    return Asset_Lifecycle_FailureDetails.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_Lifecycle_FailureDetails>, I>>(
    object: I,
  ): Asset_Lifecycle_FailureDetails {
    const message = createBaseAsset_Lifecycle_FailureDetails();
    message.category = object.category ?? 0;
    return message;
  },
};

function createBaseAsset_Source(): Asset_Source {
  return { path: "", sizeBytes: 0, filepath: "", licence: 0, attribution: "", crs: "", captureTime: undefined };
}

export const Asset_Source = {
  fromJSON(object: any): Asset_Source {
    return {
      path: isSet(object.path) ? globalThis.String(object.path) : "",
      sizeBytes: isSet(object.sizeBytes) ? globalThis.Number(object.sizeBytes) : 0,
      filepath: isSet(object.filepath) ? globalThis.String(object.filepath) : "",
      licence: isSet(object.licence) ? asset_Source_LicenceFromJSON(object.licence) : 0,
      attribution: isSet(object.attribution) ? globalThis.String(object.attribution) : "",
      crs: isSet(object.crs) ? globalThis.String(object.crs) : "",
      captureTime: isSet(object.captureTime) ? fromJsonTimestamp(object.captureTime) : undefined,
    };
  },

  toJSON(message: Asset_Source): unknown {
    const obj: any = {};
    if (message.path !== "") {
      obj.path = message.path;
    }
    if (message.sizeBytes !== 0) {
      obj.sizeBytes = Math.round(message.sizeBytes);
    }
    if (message.filepath !== "") {
      obj.filepath = message.filepath;
    }
    if (message.licence !== 0) {
      obj.licence = asset_Source_LicenceToJSON(message.licence);
    }
    if (message.attribution !== "") {
      obj.attribution = message.attribution;
    }
    if (message.crs !== "") {
      obj.crs = message.crs;
    }
    if (message.captureTime !== undefined) {
      obj.captureTime = message.captureTime.toISOString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_Source>, I>>(base?: I): Asset_Source {
    return Asset_Source.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_Source>, I>>(object: I): Asset_Source {
    const message = createBaseAsset_Source();
    message.path = object.path ?? "";
    message.sizeBytes = object.sizeBytes ?? 0;
    message.filepath = object.filepath ?? "";
    message.licence = object.licence ?? 0;
    message.attribution = object.attribution ?? "";
    message.crs = object.crs ?? "";
    message.captureTime = object.captureTime ?? undefined;
    return message;
  },
};

function createBaseAsset_SourcesEntry(): Asset_SourcesEntry {
  return { key: "", value: undefined };
}

export const Asset_SourcesEntry = {
  fromJSON(object: any): Asset_SourcesEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? Asset_Source.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: Asset_SourcesEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = Asset_Source.toJSON(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_SourcesEntry>, I>>(base?: I): Asset_SourcesEntry {
    return Asset_SourcesEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_SourcesEntry>, I>>(object: I): Asset_SourcesEntry {
    const message = createBaseAsset_SourcesEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? Asset_Source.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseAsset_Output(): Asset_Output {
  return { path: "", loading: undefined, crs: 0, maxZoom: 0, minZoom: 0, hasRgb: false };
}

export const Asset_Output = {
  fromJSON(object: any): Asset_Output {
    return {
      path: isSet(object.path) ? globalThis.String(object.path) : "",
      loading: isSet(object.loading) ? Asset_Output_Loading.fromJSON(object.loading) : undefined,
      crs: isSet(object.crs) ? asset_Output_CRSFromJSON(object.crs) : 0,
      maxZoom: isSet(object.maxZoom) ? globalThis.Number(object.maxZoom) : 0,
      minZoom: isSet(object.minZoom) ? globalThis.Number(object.minZoom) : 0,
      hasRgb: isSet(object.hasRgb) ? globalThis.Boolean(object.hasRgb) : false,
    };
  },

  toJSON(message: Asset_Output): unknown {
    const obj: any = {};
    if (message.path !== "") {
      obj.path = message.path;
    }
    if (message.loading !== undefined) {
      obj.loading = Asset_Output_Loading.toJSON(message.loading);
    }
    if (message.crs !== 0) {
      obj.crs = asset_Output_CRSToJSON(message.crs);
    }
    if (message.maxZoom !== 0) {
      obj.maxZoom = Math.round(message.maxZoom);
    }
    if (message.minZoom !== 0) {
      obj.minZoom = Math.round(message.minZoom);
    }
    if (message.hasRgb !== false) {
      obj.hasRgb = message.hasRgb;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_Output>, I>>(base?: I): Asset_Output {
    return Asset_Output.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_Output>, I>>(object: I): Asset_Output {
    const message = createBaseAsset_Output();
    message.path = object.path ?? "";
    message.loading = (object.loading !== undefined && object.loading !== null)
      ? Asset_Output_Loading.fromPartial(object.loading)
      : undefined;
    message.crs = object.crs ?? 0;
    message.maxZoom = object.maxZoom ?? 0;
    message.minZoom = object.minZoom ?? 0;
    message.hasRgb = object.hasRgb ?? false;
    return message;
  },
};

function createBaseAsset_Output_Loading(): Asset_Output_Loading {
  return { format: "", revision: "" };
}

export const Asset_Output_Loading = {
  fromJSON(object: any): Asset_Output_Loading {
    return {
      format: isSet(object.format) ? globalThis.String(object.format) : "",
      revision: isSet(object.revision) ? globalThis.String(object.revision) : "",
    };
  },

  toJSON(message: Asset_Output_Loading): unknown {
    const obj: any = {};
    if (message.format !== "") {
      obj.format = message.format;
    }
    if (message.revision !== "") {
      obj.revision = message.revision;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_Output_Loading>, I>>(base?: I): Asset_Output_Loading {
    return Asset_Output_Loading.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_Output_Loading>, I>>(object: I): Asset_Output_Loading {
    const message = createBaseAsset_Output_Loading();
    message.format = object.format ?? "";
    message.revision = object.revision ?? "";
    return message;
  },
};

function createBaseAsset_Access(): Asset_Access {
  return { creator: "", isPublic: false };
}

export const Asset_Access = {
  fromJSON(object: any): Asset_Access {
    return {
      creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
      isPublic: isSet(object.isPublic) ? globalThis.Boolean(object.isPublic) : false,
    };
  },

  toJSON(message: Asset_Access): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.isPublic !== false) {
      obj.isPublic = message.isPublic;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_Access>, I>>(base?: I): Asset_Access {
    return Asset_Access.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_Access>, I>>(object: I): Asset_Access {
    const message = createBaseAsset_Access();
    message.creator = object.creator ?? "";
    message.isPublic = object.isPublic ?? false;
    return message;
  },
};

function createBaseAsset_SyncTracking(): Asset_SyncTracking {
  return { externalId: "", integration: "", revision: 0, updateTime: undefined, checksum: undefined };
}

export const Asset_SyncTracking = {
  fromJSON(object: any): Asset_SyncTracking {
    return {
      externalId: isSet(object.externalId) ? globalThis.String(object.externalId) : "",
      integration: isSet(object.integration) ? globalThis.String(object.integration) : "",
      revision: isSet(object.revision) ? globalThis.Number(object.revision) : 0,
      updateTime: isSet(object.updateTime) ? fromJsonTimestamp(object.updateTime) : undefined,
      checksum: isSet(object.checksum) ? Asset_SyncTracking_Checksum.fromJSON(object.checksum) : undefined,
    };
  },

  toJSON(message: Asset_SyncTracking): unknown {
    const obj: any = {};
    if (message.externalId !== "") {
      obj.externalId = message.externalId;
    }
    if (message.integration !== "") {
      obj.integration = message.integration;
    }
    if (message.revision !== 0) {
      obj.revision = Math.round(message.revision);
    }
    if (message.updateTime !== undefined) {
      obj.updateTime = message.updateTime.toISOString();
    }
    if (message.checksum !== undefined) {
      obj.checksum = Asset_SyncTracking_Checksum.toJSON(message.checksum);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_SyncTracking>, I>>(base?: I): Asset_SyncTracking {
    return Asset_SyncTracking.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_SyncTracking>, I>>(object: I): Asset_SyncTracking {
    const message = createBaseAsset_SyncTracking();
    message.externalId = object.externalId ?? "";
    message.integration = object.integration ?? "";
    message.revision = object.revision ?? 0;
    message.updateTime = object.updateTime ?? undefined;
    message.checksum = (object.checksum !== undefined && object.checksum !== null)
      ? Asset_SyncTracking_Checksum.fromPartial(object.checksum)
      : undefined;
    return message;
  },
};

function createBaseAsset_SyncTracking_Checksum(): Asset_SyncTracking_Checksum {
  return { value: "", algorithm: 0 };
}

export const Asset_SyncTracking_Checksum = {
  fromJSON(object: any): Asset_SyncTracking_Checksum {
    return {
      value: isSet(object.value) ? globalThis.String(object.value) : "",
      algorithm: isSet(object.algorithm) ? asset_SyncTracking_Checksum_AlgorithmFromJSON(object.algorithm) : 0,
    };
  },

  toJSON(message: Asset_SyncTracking_Checksum): unknown {
    const obj: any = {};
    if (message.value !== "") {
      obj.value = message.value;
    }
    if (message.algorithm !== 0) {
      obj.algorithm = asset_SyncTracking_Checksum_AlgorithmToJSON(message.algorithm);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_SyncTracking_Checksum>, I>>(base?: I): Asset_SyncTracking_Checksum {
    return Asset_SyncTracking_Checksum.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_SyncTracking_Checksum>, I>>(object: I): Asset_SyncTracking_Checksum {
    const message = createBaseAsset_SyncTracking_Checksum();
    message.value = object.value ?? "";
    message.algorithm = object.algorithm ?? 0;
    return message;
  },
};

function createBaseAsset_Timeline(): Asset_Timeline {
  return { startDate: undefined, endDate: undefined, visibility: 0 };
}

export const Asset_Timeline = {
  fromJSON(object: any): Asset_Timeline {
    return {
      startDate: isSet(object.startDate) ? DateMessage.fromJSON(object.startDate) : undefined,
      endDate: isSet(object.endDate) ? DateMessage.fromJSON(object.endDate) : undefined,
      visibility: isSet(object.visibility) ? asset_Timeline_VisibilityFromJSON(object.visibility) : 0,
    };
  },

  toJSON(message: Asset_Timeline): unknown {
    const obj: any = {};
    if (message.startDate !== undefined) {
      obj.startDate = DateMessage.toJSON(message.startDate);
    }
    if (message.endDate !== undefined) {
      obj.endDate = DateMessage.toJSON(message.endDate);
    }
    if (message.visibility !== 0) {
      obj.visibility = asset_Timeline_VisibilityToJSON(message.visibility);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Asset_Timeline>, I>>(base?: I): Asset_Timeline {
    return Asset_Timeline.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Asset_Timeline>, I>>(object: I): Asset_Timeline {
    const message = createBaseAsset_Timeline();
    message.startDate = (object.startDate !== undefined && object.startDate !== null)
      ? DateMessage.fromPartial(object.startDate)
      : undefined;
    message.endDate = (object.endDate !== undefined && object.endDate !== null)
      ? DateMessage.fromPartial(object.endDate)
      : undefined;
    message.visibility = object.visibility ?? 0;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === "string") {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
