/* eslint-disable */

export const protobufPackage = "sensat.types.v4alpha1";

/** Bounds of axis-aligned extents and bounding box are indicated by two corners */
export interface ExtentOrBoundingBox {
  /** lower corner */
  min:
    | ExtentOrBoundingBox_Position
    | undefined;
  /** upper corner */
  max: ExtentOrBoundingBox_Position | undefined;
}

/** The position of a corner */
export interface ExtentOrBoundingBox_Position {
  /**
   * X axis
   * We use optional on a required field to differentiate between 0 and unset.
   * For more info see: https://aip.dev/149#field-behavior-and-optional
   */
  x?:
    | number
    | undefined;
  /**
   * Y axis
   * We use optional on a required field to differentiate between 0 and unset.
   * For more info see: https://aip.dev/149#field-behavior-and-optional
   */
  y?:
    | number
    | undefined;
  /** Z axis. Not required because this message could be used for a 2D representation too. */
  z?: number | undefined;
}

function createBaseExtentOrBoundingBox(): ExtentOrBoundingBox {
  return { min: undefined, max: undefined };
}

export const ExtentOrBoundingBox = {
  fromJSON(object: any): ExtentOrBoundingBox {
    return {
      min: isSet(object.min) ? ExtentOrBoundingBox_Position.fromJSON(object.min) : undefined,
      max: isSet(object.max) ? ExtentOrBoundingBox_Position.fromJSON(object.max) : undefined,
    };
  },

  toJSON(message: ExtentOrBoundingBox): unknown {
    const obj: any = {};
    if (message.min !== undefined) {
      obj.min = ExtentOrBoundingBox_Position.toJSON(message.min);
    }
    if (message.max !== undefined) {
      obj.max = ExtentOrBoundingBox_Position.toJSON(message.max);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ExtentOrBoundingBox>, I>>(base?: I): ExtentOrBoundingBox {
    return ExtentOrBoundingBox.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ExtentOrBoundingBox>, I>>(object: I): ExtentOrBoundingBox {
    const message = createBaseExtentOrBoundingBox();
    message.min = (object.min !== undefined && object.min !== null)
      ? ExtentOrBoundingBox_Position.fromPartial(object.min)
      : undefined;
    message.max = (object.max !== undefined && object.max !== null)
      ? ExtentOrBoundingBox_Position.fromPartial(object.max)
      : undefined;
    return message;
  },
};

function createBaseExtentOrBoundingBox_Position(): ExtentOrBoundingBox_Position {
  return { x: undefined, y: undefined, z: undefined };
}

export const ExtentOrBoundingBox_Position = {
  fromJSON(object: any): ExtentOrBoundingBox_Position {
    return {
      x: isSet(object.x) ? globalThis.Number(object.x) : undefined,
      y: isSet(object.y) ? globalThis.Number(object.y) : undefined,
      z: isSet(object.z) ? globalThis.Number(object.z) : undefined,
    };
  },

  toJSON(message: ExtentOrBoundingBox_Position): unknown {
    const obj: any = {};
    if (message.x !== undefined) {
      obj.x = message.x;
    }
    if (message.y !== undefined) {
      obj.y = message.y;
    }
    if (message.z !== undefined) {
      obj.z = message.z;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ExtentOrBoundingBox_Position>, I>>(base?: I): ExtentOrBoundingBox_Position {
    return ExtentOrBoundingBox_Position.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ExtentOrBoundingBox_Position>, I>>(object: I): ExtentOrBoundingBox_Position {
    const message = createBaseExtentOrBoundingBox_Position();
    message.x = object.x ?? undefined;
    message.y = object.y ?? undefined;
    message.z = object.z ?? undefined;
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
