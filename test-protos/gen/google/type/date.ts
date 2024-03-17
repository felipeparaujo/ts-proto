/* eslint-disable */

export const protobufPackage = "google.type";

/**
 * Represents a whole or partial calendar date, such as a birthday. The time of
 * day and time zone are either specified elsewhere or are insignificant. The
 * date is relative to the Gregorian Calendar. This can represent one of the
 * following:
 *
 * * A full date, with non-zero year, month, and day values
 * * A month and day value, with a zero year, such as an anniversary
 * * A year on its own, with zero month and day values
 * * A year and month value, with a zero day, such as a credit card expiration
 * date
 *
 * Related types are [google.type.TimeOfDay][google.type.TimeOfDay] and
 * `google.protobuf.Timestamp`.
 */
export interface DateMessage {
  /**
   * Year of the date. Must be from 1 to 9999, or 0 to specify a date without
   * a year.
   */
  year: number;
  /**
   * Month of a year. Must be from 1 to 12, or 0 to specify a year without a
   * month and day.
   */
  month: number;
  /**
   * Day of a month. Must be from 1 to 31 and valid for the year and month, or 0
   * to specify a year by itself or a year and month where the day isn't
   * significant.
   */
  day: number;
}

function createBaseDateMessage(): DateMessage {
  return { year: 0, month: 0, day: 0 };
}

export const DateMessage = {
  fromJSON(object: any): DateMessage {
    return {
      year: isSet(object.year) ? globalThis.Number(object.year) : 0,
      month: isSet(object.month) ? globalThis.Number(object.month) : 0,
      day: isSet(object.day) ? globalThis.Number(object.day) : 0,
    };
  },

  toJSON(message: DateMessage): unknown {
    const obj: any = {};
    if (message.year !== 0) {
      obj.year = Math.round(message.year);
    }
    if (message.month !== 0) {
      obj.month = Math.round(message.month);
    }
    if (message.day !== 0) {
      obj.day = Math.round(message.day);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DateMessage>, I>>(base?: I): DateMessage {
    return DateMessage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DateMessage>, I>>(object: I): DateMessage {
    const message = createBaseDateMessage();
    message.year = object.year ?? 0;
    message.month = object.month ?? 0;
    message.day = object.day ?? 0;
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
