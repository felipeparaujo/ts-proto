/* eslint-disable */

export const protobufPackage = "google.protobuf";

/**
 * The protocol compiler can output a FileDescriptorSet containing the .proto
 * files it parses.
 */
export interface FileDescriptorSet {
  file: FileDescriptorProto[];
}

/** Describes a complete .proto file. */
export interface FileDescriptorProto {
  /** file name, relative to root of source tree */
  name?:
    | string
    | undefined;
  /** e.g. "foo", "foo.bar", etc. */
  package?:
    | string
    | undefined;
  /** Names of files imported by this file. */
  dependency: string[];
  /** Indexes of the public imported files in the dependency list above. */
  publicDependency: number[];
  /**
   * Indexes of the weak imported files in the dependency list.
   * For Google-internal migration only. Do not use.
   */
  weakDependency: number[];
  /** All top-level definitions in this file. */
  messageType: DescriptorProto[];
  enumType: EnumDescriptorProto[];
  service: ServiceDescriptorProto[];
  extension: FieldDescriptorProto[];
  options?:
    | FileOptions
    | undefined;
  /**
   * This field contains optional information about the original source code.
   * You may safely remove this entire field without harming runtime
   * functionality of the descriptors -- the information is needed only by
   * development tools.
   */
  sourceCodeInfo?:
    | SourceCodeInfo
    | undefined;
  /**
   * The syntax of the proto file.
   * The supported values are "proto2", "proto3", and "editions".
   *
   * If `edition` is present, this value must be "editions".
   */
  syntax?:
    | string
    | undefined;
  /** The edition of the proto file, which is an opaque string. */
  edition?: string | undefined;
}

/** Describes a message type. */
export interface DescriptorProto {
  name?: string | undefined;
  field: FieldDescriptorProto[];
  extension: FieldDescriptorProto[];
  nestedType: DescriptorProto[];
  enumType: EnumDescriptorProto[];
  extensionRange: DescriptorProto_ExtensionRange[];
  oneofDecl: OneofDescriptorProto[];
  options?: MessageOptions | undefined;
  reservedRange: DescriptorProto_ReservedRange[];
  /**
   * Reserved field names, which may not be used by fields in the same message.
   * A given name may only be reserved once.
   */
  reservedName: string[];
}

export interface DescriptorProto_ExtensionRange {
  /** Inclusive. */
  start?:
    | number
    | undefined;
  /** Exclusive. */
  end?: number | undefined;
  options?: ExtensionRangeOptions | undefined;
}

/**
 * Range of reserved tag numbers. Reserved tag numbers may not be used by
 * fields or extension ranges in the same message. Reserved ranges may
 * not overlap.
 */
export interface DescriptorProto_ReservedRange {
  /** Inclusive. */
  start?:
    | number
    | undefined;
  /** Exclusive. */
  end?: number | undefined;
}

export interface ExtensionRangeOptions {
  /** The parser stores options it doesn't recognize here. See above. */
  uninterpretedOption: UninterpretedOption[];
}

/** Describes a field within a message. */
export interface FieldDescriptorProto {
  name?: string | undefined;
  number?: number | undefined;
  label?:
    | FieldDescriptorProto_Label
    | undefined;
  /**
   * If type_name is set, this need not be set.  If both this and type_name
   * are set, this must be one of TYPE_ENUM, TYPE_MESSAGE or TYPE_GROUP.
   */
  type?:
    | FieldDescriptorProto_Type
    | undefined;
  /**
   * For message and enum types, this is the name of the type.  If the name
   * starts with a '.', it is fully-qualified.  Otherwise, C++-like scoping
   * rules are used to find the type (i.e. first the nested types within this
   * message are searched, then within the parent, on up to the root
   * namespace).
   */
  typeName?:
    | string
    | undefined;
  /**
   * For extensions, this is the name of the type being extended.  It is
   * resolved in the same manner as type_name.
   */
  extendee?:
    | string
    | undefined;
  /**
   * For numeric types, contains the original text representation of the value.
   * For booleans, "true" or "false".
   * For strings, contains the default text contents (not escaped in any way).
   * For bytes, contains the C escaped value.  All bytes >= 128 are escaped.
   */
  defaultValue?:
    | string
    | undefined;
  /**
   * If set, gives the index of a oneof in the containing type's oneof_decl
   * list.  This field is a member of that oneof.
   */
  oneofIndex?:
    | number
    | undefined;
  /**
   * JSON name of this field. The value is set by protocol compiler. If the
   * user has set a "json_name" option on this field, that option's value
   * will be used. Otherwise, it's deduced from the field's name by converting
   * it to camelCase.
   */
  jsonName?: string | undefined;
  options?:
    | FieldOptions
    | undefined;
  /**
   * If true, this is a proto3 "optional". When a proto3 field is optional, it
   * tracks presence regardless of field type.
   *
   * When proto3_optional is true, this field must be belong to a oneof to
   * signal to old proto3 clients that presence is tracked for this field. This
   * oneof is known as a "synthetic" oneof, and this field must be its sole
   * member (each proto3 optional field gets its own synthetic oneof). Synthetic
   * oneofs exist in the descriptor only, and do not generate any API. Synthetic
   * oneofs must be ordered after all "real" oneofs.
   *
   * For message fields, proto3_optional doesn't create any semantic change,
   * since non-repeated message fields always track presence. However it still
   * indicates the semantic detail of whether the user wrote "optional" or not.
   * This can be useful for round-tripping the .proto file. For consistency we
   * give message fields a synthetic oneof also, even though it is not required
   * to track presence. This is especially important because the parser can't
   * tell if a field is a message or an enum, so it must always create a
   * synthetic oneof.
   *
   * Proto2 optional fields do not set this flag, because they already indicate
   * optional with `LABEL_OPTIONAL`.
   */
  proto3Optional?: boolean | undefined;
}

export enum FieldDescriptorProto_Type {
  /**
   * TYPE_DOUBLE - 0 is reserved for errors.
   * Order is weird for historical reasons.
   */
  TYPE_DOUBLE = 1,
  TYPE_FLOAT = 2,
  /**
   * TYPE_INT64 - Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT64 if
   * negative values are likely.
   */
  TYPE_INT64 = 3,
  TYPE_UINT64 = 4,
  /**
   * TYPE_INT32 - Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT32 if
   * negative values are likely.
   */
  TYPE_INT32 = 5,
  TYPE_FIXED64 = 6,
  TYPE_FIXED32 = 7,
  TYPE_BOOL = 8,
  TYPE_STRING = 9,
  /**
   * TYPE_GROUP - Tag-delimited aggregate.
   * Group type is deprecated and not supported in proto3. However, Proto3
   * implementations should still be able to parse the group wire format and
   * treat group fields as unknown fields.
   */
  TYPE_GROUP = 10,
  /** TYPE_MESSAGE - Length-delimited aggregate. */
  TYPE_MESSAGE = 11,
  /** TYPE_BYTES - New in version 2. */
  TYPE_BYTES = 12,
  TYPE_UINT32 = 13,
  TYPE_ENUM = 14,
  TYPE_SFIXED32 = 15,
  TYPE_SFIXED64 = 16,
  /** TYPE_SINT32 - Uses ZigZag encoding. */
  TYPE_SINT32 = 17,
  /** TYPE_SINT64 - Uses ZigZag encoding. */
  TYPE_SINT64 = 18,
}

export function fieldDescriptorProto_TypeFromJSON(object: any): FieldDescriptorProto_Type {
  switch (object) {
    case 1:
    case "TYPE_DOUBLE":
      return FieldDescriptorProto_Type.TYPE_DOUBLE;
    case 2:
    case "TYPE_FLOAT":
      return FieldDescriptorProto_Type.TYPE_FLOAT;
    case 3:
    case "TYPE_INT64":
      return FieldDescriptorProto_Type.TYPE_INT64;
    case 4:
    case "TYPE_UINT64":
      return FieldDescriptorProto_Type.TYPE_UINT64;
    case 5:
    case "TYPE_INT32":
      return FieldDescriptorProto_Type.TYPE_INT32;
    case 6:
    case "TYPE_FIXED64":
      return FieldDescriptorProto_Type.TYPE_FIXED64;
    case 7:
    case "TYPE_FIXED32":
      return FieldDescriptorProto_Type.TYPE_FIXED32;
    case 8:
    case "TYPE_BOOL":
      return FieldDescriptorProto_Type.TYPE_BOOL;
    case 9:
    case "TYPE_STRING":
      return FieldDescriptorProto_Type.TYPE_STRING;
    case 10:
    case "TYPE_GROUP":
      return FieldDescriptorProto_Type.TYPE_GROUP;
    case 11:
    case "TYPE_MESSAGE":
      return FieldDescriptorProto_Type.TYPE_MESSAGE;
    case 12:
    case "TYPE_BYTES":
      return FieldDescriptorProto_Type.TYPE_BYTES;
    case 13:
    case "TYPE_UINT32":
      return FieldDescriptorProto_Type.TYPE_UINT32;
    case 14:
    case "TYPE_ENUM":
      return FieldDescriptorProto_Type.TYPE_ENUM;
    case 15:
    case "TYPE_SFIXED32":
      return FieldDescriptorProto_Type.TYPE_SFIXED32;
    case 16:
    case "TYPE_SFIXED64":
      return FieldDescriptorProto_Type.TYPE_SFIXED64;
    case 17:
    case "TYPE_SINT32":
      return FieldDescriptorProto_Type.TYPE_SINT32;
    case 18:
    case "TYPE_SINT64":
      return FieldDescriptorProto_Type.TYPE_SINT64;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldDescriptorProto_Type");
  }
}

export function fieldDescriptorProto_TypeToJSON(object: FieldDescriptorProto_Type): string {
  switch (object) {
    case FieldDescriptorProto_Type.TYPE_DOUBLE:
      return "TYPE_DOUBLE";
    case FieldDescriptorProto_Type.TYPE_FLOAT:
      return "TYPE_FLOAT";
    case FieldDescriptorProto_Type.TYPE_INT64:
      return "TYPE_INT64";
    case FieldDescriptorProto_Type.TYPE_UINT64:
      return "TYPE_UINT64";
    case FieldDescriptorProto_Type.TYPE_INT32:
      return "TYPE_INT32";
    case FieldDescriptorProto_Type.TYPE_FIXED64:
      return "TYPE_FIXED64";
    case FieldDescriptorProto_Type.TYPE_FIXED32:
      return "TYPE_FIXED32";
    case FieldDescriptorProto_Type.TYPE_BOOL:
      return "TYPE_BOOL";
    case FieldDescriptorProto_Type.TYPE_STRING:
      return "TYPE_STRING";
    case FieldDescriptorProto_Type.TYPE_GROUP:
      return "TYPE_GROUP";
    case FieldDescriptorProto_Type.TYPE_MESSAGE:
      return "TYPE_MESSAGE";
    case FieldDescriptorProto_Type.TYPE_BYTES:
      return "TYPE_BYTES";
    case FieldDescriptorProto_Type.TYPE_UINT32:
      return "TYPE_UINT32";
    case FieldDescriptorProto_Type.TYPE_ENUM:
      return "TYPE_ENUM";
    case FieldDescriptorProto_Type.TYPE_SFIXED32:
      return "TYPE_SFIXED32";
    case FieldDescriptorProto_Type.TYPE_SFIXED64:
      return "TYPE_SFIXED64";
    case FieldDescriptorProto_Type.TYPE_SINT32:
      return "TYPE_SINT32";
    case FieldDescriptorProto_Type.TYPE_SINT64:
      return "TYPE_SINT64";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldDescriptorProto_Type");
  }
}

export enum FieldDescriptorProto_Label {
  /** LABEL_OPTIONAL - 0 is reserved for errors */
  LABEL_OPTIONAL = 1,
  LABEL_REQUIRED = 2,
  LABEL_REPEATED = 3,
}

export function fieldDescriptorProto_LabelFromJSON(object: any): FieldDescriptorProto_Label {
  switch (object) {
    case 1:
    case "LABEL_OPTIONAL":
      return FieldDescriptorProto_Label.LABEL_OPTIONAL;
    case 2:
    case "LABEL_REQUIRED":
      return FieldDescriptorProto_Label.LABEL_REQUIRED;
    case 3:
    case "LABEL_REPEATED":
      return FieldDescriptorProto_Label.LABEL_REPEATED;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldDescriptorProto_Label");
  }
}

export function fieldDescriptorProto_LabelToJSON(object: FieldDescriptorProto_Label): string {
  switch (object) {
    case FieldDescriptorProto_Label.LABEL_OPTIONAL:
      return "LABEL_OPTIONAL";
    case FieldDescriptorProto_Label.LABEL_REQUIRED:
      return "LABEL_REQUIRED";
    case FieldDescriptorProto_Label.LABEL_REPEATED:
      return "LABEL_REPEATED";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldDescriptorProto_Label");
  }
}

/** Describes a oneof. */
export interface OneofDescriptorProto {
  name?: string | undefined;
  options?: OneofOptions | undefined;
}

/** Describes an enum type. */
export interface EnumDescriptorProto {
  name?: string | undefined;
  value: EnumValueDescriptorProto[];
  options?:
    | EnumOptions
    | undefined;
  /**
   * Range of reserved numeric values. Reserved numeric values may not be used
   * by enum values in the same enum declaration. Reserved ranges may not
   * overlap.
   */
  reservedRange: EnumDescriptorProto_EnumReservedRange[];
  /**
   * Reserved enum value names, which may not be reused. A given name may only
   * be reserved once.
   */
  reservedName: string[];
}

/**
 * Range of reserved numeric values. Reserved values may not be used by
 * entries in the same enum. Reserved ranges may not overlap.
 *
 * Note that this is distinct from DescriptorProto.ReservedRange in that it
 * is inclusive such that it can appropriately represent the entire int32
 * domain.
 */
export interface EnumDescriptorProto_EnumReservedRange {
  /** Inclusive. */
  start?:
    | number
    | undefined;
  /** Inclusive. */
  end?: number | undefined;
}

/** Describes a value within an enum. */
export interface EnumValueDescriptorProto {
  name?: string | undefined;
  number?: number | undefined;
  options?: EnumValueOptions | undefined;
}

/** Describes a service. */
export interface ServiceDescriptorProto {
  name?: string | undefined;
  method: MethodDescriptorProto[];
  options?: ServiceOptions | undefined;
}

/** Describes a method of a service. */
export interface MethodDescriptorProto {
  name?:
    | string
    | undefined;
  /**
   * Input and output type names.  These are resolved in the same way as
   * FieldDescriptorProto.type_name, but must refer to a message type.
   */
  inputType?: string | undefined;
  outputType?: string | undefined;
  options?:
    | MethodOptions
    | undefined;
  /** Identifies if client streams multiple client messages */
  clientStreaming?:
    | boolean
    | undefined;
  /** Identifies if server streams multiple server messages */
  serverStreaming?: boolean | undefined;
}

export interface FileOptions {
  /**
   * Sets the Java package where classes generated from this .proto will be
   * placed.  By default, the proto package is used, but this is often
   * inappropriate because proto packages do not normally start with backwards
   * domain names.
   */
  javaPackage?:
    | string
    | undefined;
  /**
   * Controls the name of the wrapper Java class generated for the .proto file.
   * That class will always contain the .proto file's getDescriptor() method as
   * well as any top-level extensions defined in the .proto file.
   * If java_multiple_files is disabled, then all the other classes from the
   * .proto file will be nested inside the single wrapper outer class.
   */
  javaOuterClassname?:
    | string
    | undefined;
  /**
   * If enabled, then the Java code generator will generate a separate .java
   * file for each top-level message, enum, and service defined in the .proto
   * file.  Thus, these types will *not* be nested inside the wrapper class
   * named by java_outer_classname.  However, the wrapper class will still be
   * generated to contain the file's getDescriptor() method as well as any
   * top-level extensions defined in the file.
   */
  javaMultipleFiles?:
    | boolean
    | undefined;
  /**
   * This option does nothing.
   *
   * @deprecated
   */
  javaGenerateEqualsAndHash?:
    | boolean
    | undefined;
  /**
   * If set true, then the Java2 code generator will generate code that
   * throws an exception whenever an attempt is made to assign a non-UTF-8
   * byte sequence to a string field.
   * Message reflection will do the same.
   * However, an extension field still accepts non-UTF-8 byte sequences.
   * This option has no effect on when used with the lite runtime.
   */
  javaStringCheckUtf8?: boolean | undefined;
  optimizeFor?:
    | FileOptions_OptimizeMode
    | undefined;
  /**
   * Sets the Go package where structs generated from this .proto will be
   * placed. If omitted, the Go package will be derived from the following:
   *   - The basename of the package import path, if provided.
   *   - Otherwise, the package statement in the .proto file, if present.
   *   - Otherwise, the basename of the .proto file, without extension.
   */
  goPackage?:
    | string
    | undefined;
  /**
   * Should generic services be generated in each language?  "Generic" services
   * are not specific to any particular RPC system.  They are generated by the
   * main code generators in each language (without additional plugins).
   * Generic services were the only kind of service generation supported by
   * early versions of google.protobuf.
   *
   * Generic services are now considered deprecated in favor of using plugins
   * that generate code specific to your particular RPC system.  Therefore,
   * these default to false.  Old code which depends on generic services should
   * explicitly set them to true.
   */
  ccGenericServices?: boolean | undefined;
  javaGenericServices?: boolean | undefined;
  pyGenericServices?: boolean | undefined;
  phpGenericServices?:
    | boolean
    | undefined;
  /**
   * Is this file deprecated?
   * Depending on the target platform, this can emit Deprecated annotations
   * for everything in the file, or it will be completely ignored; in the very
   * least, this is a formalization for deprecating files.
   */
  deprecated?:
    | boolean
    | undefined;
  /**
   * Enables the use of arenas for the proto messages in this file. This applies
   * only to generated classes for C++.
   */
  ccEnableArenas?:
    | boolean
    | undefined;
  /**
   * Sets the objective c class prefix which is prepended to all objective c
   * generated classes from this .proto. There is no default.
   */
  objcClassPrefix?:
    | string
    | undefined;
  /** Namespace for generated classes; defaults to the package. */
  csharpNamespace?:
    | string
    | undefined;
  /**
   * By default Swift generators will take the proto package and CamelCase it
   * replacing '.' with underscore and use that to prefix the types/symbols
   * defined. When this options is provided, they will use this value instead
   * to prefix the types/symbols defined.
   */
  swiftPrefix?:
    | string
    | undefined;
  /**
   * Sets the php class prefix which is prepended to all php generated classes
   * from this .proto. Default is empty.
   */
  phpClassPrefix?:
    | string
    | undefined;
  /**
   * Use this option to change the namespace of php generated classes. Default
   * is empty. When this option is empty, the package name will be used for
   * determining the namespace.
   */
  phpNamespace?:
    | string
    | undefined;
  /**
   * Use this option to change the namespace of php generated metadata classes.
   * Default is empty. When this option is empty, the proto file name will be
   * used for determining the namespace.
   */
  phpMetadataNamespace?:
    | string
    | undefined;
  /**
   * Use this option to change the package of ruby generated classes. Default
   * is empty. When this option is not set, the package name will be used for
   * determining the ruby package.
   */
  rubyPackage?:
    | string
    | undefined;
  /**
   * The parser stores options it doesn't recognize here.
   * See the documentation for the "Options" section above.
   */
  uninterpretedOption: UninterpretedOption[];
}

/** Generated classes can be optimized for speed or code size. */
export enum FileOptions_OptimizeMode {
  /** SPEED - Generate complete code for parsing, serialization, */
  SPEED = 1,
  /** CODE_SIZE - etc. */
  CODE_SIZE = 2,
  /** LITE_RUNTIME - Generate code using MessageLite and the lite runtime. */
  LITE_RUNTIME = 3,
}

export function fileOptions_OptimizeModeFromJSON(object: any): FileOptions_OptimizeMode {
  switch (object) {
    case 1:
    case "SPEED":
      return FileOptions_OptimizeMode.SPEED;
    case 2:
    case "CODE_SIZE":
      return FileOptions_OptimizeMode.CODE_SIZE;
    case 3:
    case "LITE_RUNTIME":
      return FileOptions_OptimizeMode.LITE_RUNTIME;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FileOptions_OptimizeMode");
  }
}

export function fileOptions_OptimizeModeToJSON(object: FileOptions_OptimizeMode): string {
  switch (object) {
    case FileOptions_OptimizeMode.SPEED:
      return "SPEED";
    case FileOptions_OptimizeMode.CODE_SIZE:
      return "CODE_SIZE";
    case FileOptions_OptimizeMode.LITE_RUNTIME:
      return "LITE_RUNTIME";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FileOptions_OptimizeMode");
  }
}

export interface MessageOptions {
  /**
   * Set true to use the old proto1 MessageSet wire format for extensions.
   * This is provided for backwards-compatibility with the MessageSet wire
   * format.  You should not use this for any other reason:  It's less
   * efficient, has fewer features, and is more complicated.
   *
   * The message must be defined exactly as follows:
   *   message Foo {
   *     option message_set_wire_format = true;
   *     extensions 4 to max;
   *   }
   * Note that the message cannot have any defined fields; MessageSets only
   * have extensions.
   *
   * All extensions of your type must be singular messages; e.g. they cannot
   * be int32s, enums, or repeated messages.
   *
   * Because this is an option, the above two restrictions are not enforced by
   * the protocol compiler.
   */
  messageSetWireFormat?:
    | boolean
    | undefined;
  /**
   * Disables the generation of the standard "descriptor()" accessor, which can
   * conflict with a field of the same name.  This is meant to make migration
   * from proto1 easier; new code should avoid fields named "descriptor".
   */
  noStandardDescriptorAccessor?:
    | boolean
    | undefined;
  /**
   * Is this message deprecated?
   * Depending on the target platform, this can emit Deprecated annotations
   * for the message, or it will be completely ignored; in the very least,
   * this is a formalization for deprecating messages.
   */
  deprecated?:
    | boolean
    | undefined;
  /**
   * NOTE: Do not set the option in .proto files. Always use the maps syntax
   * instead. The option should only be implicitly set by the proto compiler
   * parser.
   *
   * Whether the message is an automatically generated map entry type for the
   * maps field.
   *
   * For maps fields:
   *     map<KeyType, ValueType> map_field = 1;
   * The parsed descriptor looks like:
   *     message MapFieldEntry {
   *         option map_entry = true;
   *         optional KeyType key = 1;
   *         optional ValueType value = 2;
   *     }
   *     repeated MapFieldEntry map_field = 1;
   *
   * Implementations may choose not to generate the map_entry=true message, but
   * use a native map in the target language to hold the keys and values.
   * The reflection APIs in such implementations still need to work as
   * if the field is a repeated message field.
   */
  mapEntry?:
    | boolean
    | undefined;
  /**
   * Enable the legacy handling of JSON field name conflicts.  This lowercases
   * and strips underscored from the fields before comparison in proto3 only.
   * The new behavior takes `json_name` into account and applies to proto2 as
   * well.
   *
   * This should only be used as a temporary measure against broken builds due
   * to the change in behavior for JSON field name conflicts.
   *
   * TODO(b/261750190) This is legacy behavior we plan to remove once downstream
   * teams have had time to migrate.
   *
   * @deprecated
   */
  deprecatedLegacyJsonFieldConflicts?:
    | boolean
    | undefined;
  /** The parser stores options it doesn't recognize here. See above. */
  uninterpretedOption: UninterpretedOption[];
}

export interface FieldOptions {
  /**
   * The ctype option instructs the C++ code generator to use a different
   * representation of the field than it normally would.  See the specific
   * options below.  This option is not yet implemented in the open source
   * release -- sorry, we'll try to include it in a future version!
   */
  ctype?:
    | FieldOptions_CType
    | undefined;
  /**
   * The packed option can be enabled for repeated primitive fields to enable
   * a more efficient representation on the wire. Rather than repeatedly
   * writing the tag and type for each element, the entire array is encoded as
   * a single length-delimited blob. In proto3, only explicit setting it to
   * false will avoid using packed encoding.
   */
  packed?:
    | boolean
    | undefined;
  /**
   * The jstype option determines the JavaScript type used for values of the
   * field.  The option is permitted only for 64 bit integral and fixed types
   * (int64, uint64, sint64, fixed64, sfixed64).  A field with jstype JS_STRING
   * is represented as JavaScript string, which avoids loss of precision that
   * can happen when a large value is converted to a floating point JavaScript.
   * Specifying JS_NUMBER for the jstype causes the generated JavaScript code to
   * use the JavaScript "number" type.  The behavior of the default option
   * JS_NORMAL is implementation dependent.
   *
   * This option is an enum to permit additional types to be added, e.g.
   * goog.math.Integer.
   */
  jstype?:
    | FieldOptions_JSType
    | undefined;
  /**
   * Should this field be parsed lazily?  Lazy applies only to message-type
   * fields.  It means that when the outer message is initially parsed, the
   * inner message's contents will not be parsed but instead stored in encoded
   * form.  The inner message will actually be parsed when it is first accessed.
   *
   * This is only a hint.  Implementations are free to choose whether to use
   * eager or lazy parsing regardless of the value of this option.  However,
   * setting this option true suggests that the protocol author believes that
   * using lazy parsing on this field is worth the additional bookkeeping
   * overhead typically needed to implement it.
   *
   * This option does not affect the public interface of any generated code;
   * all method signatures remain the same.  Furthermore, thread-safety of the
   * interface is not affected by this option; const methods remain safe to
   * call from multiple threads concurrently, while non-const methods continue
   * to require exclusive access.
   *
   * Note that implementations may choose not to check required fields within
   * a lazy sub-message.  That is, calling IsInitialized() on the outer message
   * may return true even if the inner message has missing required fields.
   * This is necessary because otherwise the inner message would have to be
   * parsed in order to perform the check, defeating the purpose of lazy
   * parsing.  An implementation which chooses not to check required fields
   * must be consistent about it.  That is, for any particular sub-message, the
   * implementation must either *always* check its required fields, or *never*
   * check its required fields, regardless of whether or not the message has
   * been parsed.
   *
   * As of May 2022, lazy verifies the contents of the byte stream during
   * parsing.  An invalid byte stream will cause the overall parsing to fail.
   */
  lazy?:
    | boolean
    | undefined;
  /**
   * unverified_lazy does no correctness checks on the byte stream. This should
   * only be used where lazy with verification is prohibitive for performance
   * reasons.
   */
  unverifiedLazy?:
    | boolean
    | undefined;
  /**
   * Is this field deprecated?
   * Depending on the target platform, this can emit Deprecated annotations
   * for accessors, or it will be completely ignored; in the very least, this
   * is a formalization for deprecating fields.
   */
  deprecated?:
    | boolean
    | undefined;
  /** For Google-internal migration only. Do not use. */
  weak?:
    | boolean
    | undefined;
  /**
   * Indicate that the field value should not be printed out when using debug
   * formats, e.g. when the field contains sensitive credentials.
   */
  debugRedact?: boolean | undefined;
  retention?: FieldOptions_OptionRetention | undefined;
  target?:
    | FieldOptions_OptionTargetType
    | undefined;
  /** The parser stores options it doesn't recognize here. See above. */
  uninterpretedOption: UninterpretedOption[];
}

export enum FieldOptions_CType {
  /** STRING - Default mode. */
  STRING = 0,
  CORD = 1,
  STRING_PIECE = 2,
}

export function fieldOptions_CTypeFromJSON(object: any): FieldOptions_CType {
  switch (object) {
    case 0:
    case "STRING":
      return FieldOptions_CType.STRING;
    case 1:
    case "CORD":
      return FieldOptions_CType.CORD;
    case 2:
    case "STRING_PIECE":
      return FieldOptions_CType.STRING_PIECE;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldOptions_CType");
  }
}

export function fieldOptions_CTypeToJSON(object: FieldOptions_CType): string {
  switch (object) {
    case FieldOptions_CType.STRING:
      return "STRING";
    case FieldOptions_CType.CORD:
      return "CORD";
    case FieldOptions_CType.STRING_PIECE:
      return "STRING_PIECE";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldOptions_CType");
  }
}

export enum FieldOptions_JSType {
  /** JS_NORMAL - Use the default type. */
  JS_NORMAL = 0,
  /** JS_STRING - Use JavaScript strings. */
  JS_STRING = 1,
  /** JS_NUMBER - Use JavaScript numbers. */
  JS_NUMBER = 2,
}

export function fieldOptions_JSTypeFromJSON(object: any): FieldOptions_JSType {
  switch (object) {
    case 0:
    case "JS_NORMAL":
      return FieldOptions_JSType.JS_NORMAL;
    case 1:
    case "JS_STRING":
      return FieldOptions_JSType.JS_STRING;
    case 2:
    case "JS_NUMBER":
      return FieldOptions_JSType.JS_NUMBER;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldOptions_JSType");
  }
}

export function fieldOptions_JSTypeToJSON(object: FieldOptions_JSType): string {
  switch (object) {
    case FieldOptions_JSType.JS_NORMAL:
      return "JS_NORMAL";
    case FieldOptions_JSType.JS_STRING:
      return "JS_STRING";
    case FieldOptions_JSType.JS_NUMBER:
      return "JS_NUMBER";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldOptions_JSType");
  }
}

/**
 * If set to RETENTION_SOURCE, the option will be omitted from the binary.
 * Note: as of January 2023, support for this is in progress and does not yet
 * have an effect (b/264593489).
 */
export enum FieldOptions_OptionRetention {
  RETENTION_UNKNOWN = 0,
  RETENTION_RUNTIME = 1,
  RETENTION_SOURCE = 2,
}

export function fieldOptions_OptionRetentionFromJSON(object: any): FieldOptions_OptionRetention {
  switch (object) {
    case 0:
    case "RETENTION_UNKNOWN":
      return FieldOptions_OptionRetention.RETENTION_UNKNOWN;
    case 1:
    case "RETENTION_RUNTIME":
      return FieldOptions_OptionRetention.RETENTION_RUNTIME;
    case 2:
    case "RETENTION_SOURCE":
      return FieldOptions_OptionRetention.RETENTION_SOURCE;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldOptions_OptionRetention");
  }
}

export function fieldOptions_OptionRetentionToJSON(object: FieldOptions_OptionRetention): string {
  switch (object) {
    case FieldOptions_OptionRetention.RETENTION_UNKNOWN:
      return "RETENTION_UNKNOWN";
    case FieldOptions_OptionRetention.RETENTION_RUNTIME:
      return "RETENTION_RUNTIME";
    case FieldOptions_OptionRetention.RETENTION_SOURCE:
      return "RETENTION_SOURCE";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldOptions_OptionRetention");
  }
}

/**
 * This indicates the types of entities that the field may apply to when used
 * as an option. If it is unset, then the field may be freely used as an
 * option on any kind of entity. Note: as of January 2023, support for this is
 * in progress and does not yet have an effect (b/264593489).
 */
export enum FieldOptions_OptionTargetType {
  TARGET_TYPE_UNKNOWN = 0,
  TARGET_TYPE_FILE = 1,
  TARGET_TYPE_EXTENSION_RANGE = 2,
  TARGET_TYPE_MESSAGE = 3,
  TARGET_TYPE_FIELD = 4,
  TARGET_TYPE_ONEOF = 5,
  TARGET_TYPE_ENUM = 6,
  TARGET_TYPE_ENUM_ENTRY = 7,
  TARGET_TYPE_SERVICE = 8,
  TARGET_TYPE_METHOD = 9,
}

export function fieldOptions_OptionTargetTypeFromJSON(object: any): FieldOptions_OptionTargetType {
  switch (object) {
    case 0:
    case "TARGET_TYPE_UNKNOWN":
      return FieldOptions_OptionTargetType.TARGET_TYPE_UNKNOWN;
    case 1:
    case "TARGET_TYPE_FILE":
      return FieldOptions_OptionTargetType.TARGET_TYPE_FILE;
    case 2:
    case "TARGET_TYPE_EXTENSION_RANGE":
      return FieldOptions_OptionTargetType.TARGET_TYPE_EXTENSION_RANGE;
    case 3:
    case "TARGET_TYPE_MESSAGE":
      return FieldOptions_OptionTargetType.TARGET_TYPE_MESSAGE;
    case 4:
    case "TARGET_TYPE_FIELD":
      return FieldOptions_OptionTargetType.TARGET_TYPE_FIELD;
    case 5:
    case "TARGET_TYPE_ONEOF":
      return FieldOptions_OptionTargetType.TARGET_TYPE_ONEOF;
    case 6:
    case "TARGET_TYPE_ENUM":
      return FieldOptions_OptionTargetType.TARGET_TYPE_ENUM;
    case 7:
    case "TARGET_TYPE_ENUM_ENTRY":
      return FieldOptions_OptionTargetType.TARGET_TYPE_ENUM_ENTRY;
    case 8:
    case "TARGET_TYPE_SERVICE":
      return FieldOptions_OptionTargetType.TARGET_TYPE_SERVICE;
    case 9:
    case "TARGET_TYPE_METHOD":
      return FieldOptions_OptionTargetType.TARGET_TYPE_METHOD;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldOptions_OptionTargetType");
  }
}

export function fieldOptions_OptionTargetTypeToJSON(object: FieldOptions_OptionTargetType): string {
  switch (object) {
    case FieldOptions_OptionTargetType.TARGET_TYPE_UNKNOWN:
      return "TARGET_TYPE_UNKNOWN";
    case FieldOptions_OptionTargetType.TARGET_TYPE_FILE:
      return "TARGET_TYPE_FILE";
    case FieldOptions_OptionTargetType.TARGET_TYPE_EXTENSION_RANGE:
      return "TARGET_TYPE_EXTENSION_RANGE";
    case FieldOptions_OptionTargetType.TARGET_TYPE_MESSAGE:
      return "TARGET_TYPE_MESSAGE";
    case FieldOptions_OptionTargetType.TARGET_TYPE_FIELD:
      return "TARGET_TYPE_FIELD";
    case FieldOptions_OptionTargetType.TARGET_TYPE_ONEOF:
      return "TARGET_TYPE_ONEOF";
    case FieldOptions_OptionTargetType.TARGET_TYPE_ENUM:
      return "TARGET_TYPE_ENUM";
    case FieldOptions_OptionTargetType.TARGET_TYPE_ENUM_ENTRY:
      return "TARGET_TYPE_ENUM_ENTRY";
    case FieldOptions_OptionTargetType.TARGET_TYPE_SERVICE:
      return "TARGET_TYPE_SERVICE";
    case FieldOptions_OptionTargetType.TARGET_TYPE_METHOD:
      return "TARGET_TYPE_METHOD";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum FieldOptions_OptionTargetType");
  }
}

export interface OneofOptions {
  /** The parser stores options it doesn't recognize here. See above. */
  uninterpretedOption: UninterpretedOption[];
}

export interface EnumOptions {
  /**
   * Set this option to true to allow mapping different tag names to the same
   * value.
   */
  allowAlias?:
    | boolean
    | undefined;
  /**
   * Is this enum deprecated?
   * Depending on the target platform, this can emit Deprecated annotations
   * for the enum, or it will be completely ignored; in the very least, this
   * is a formalization for deprecating enums.
   */
  deprecated?:
    | boolean
    | undefined;
  /**
   * Enable the legacy handling of JSON field name conflicts.  This lowercases
   * and strips underscored from the fields before comparison in proto3 only.
   * The new behavior takes `json_name` into account and applies to proto2 as
   * well.
   * TODO(b/261750190) Remove this legacy behavior once downstream teams have
   * had time to migrate.
   *
   * @deprecated
   */
  deprecatedLegacyJsonFieldConflicts?:
    | boolean
    | undefined;
  /** The parser stores options it doesn't recognize here. See above. */
  uninterpretedOption: UninterpretedOption[];
}

export interface EnumValueOptions {
  /**
   * Is this enum value deprecated?
   * Depending on the target platform, this can emit Deprecated annotations
   * for the enum value, or it will be completely ignored; in the very least,
   * this is a formalization for deprecating enum values.
   */
  deprecated?:
    | boolean
    | undefined;
  /** The parser stores options it doesn't recognize here. See above. */
  uninterpretedOption: UninterpretedOption[];
}

export interface ServiceOptions {
  /**
   * Is this service deprecated?
   * Depending on the target platform, this can emit Deprecated annotations
   * for the service, or it will be completely ignored; in the very least,
   * this is a formalization for deprecating services.
   */
  deprecated?:
    | boolean
    | undefined;
  /** The parser stores options it doesn't recognize here. See above. */
  uninterpretedOption: UninterpretedOption[];
}

export interface MethodOptions {
  /**
   * Is this method deprecated?
   * Depending on the target platform, this can emit Deprecated annotations
   * for the method, or it will be completely ignored; in the very least,
   * this is a formalization for deprecating methods.
   */
  deprecated?: boolean | undefined;
  idempotencyLevel?:
    | MethodOptions_IdempotencyLevel
    | undefined;
  /** The parser stores options it doesn't recognize here. See above. */
  uninterpretedOption: UninterpretedOption[];
}

/**
 * Is this method side-effect-free (or safe in HTTP parlance), or idempotent,
 * or neither? HTTP based RPC implementation may choose GET verb for safe
 * methods, and PUT verb for idempotent methods instead of the default POST.
 */
export enum MethodOptions_IdempotencyLevel {
  IDEMPOTENCY_UNKNOWN = 0,
  /** NO_SIDE_EFFECTS - implies idempotent */
  NO_SIDE_EFFECTS = 1,
  /** IDEMPOTENT - idempotent, but may have side effects */
  IDEMPOTENT = 2,
}

export function methodOptions_IdempotencyLevelFromJSON(object: any): MethodOptions_IdempotencyLevel {
  switch (object) {
    case 0:
    case "IDEMPOTENCY_UNKNOWN":
      return MethodOptions_IdempotencyLevel.IDEMPOTENCY_UNKNOWN;
    case 1:
    case "NO_SIDE_EFFECTS":
      return MethodOptions_IdempotencyLevel.NO_SIDE_EFFECTS;
    case 2:
    case "IDEMPOTENT":
      return MethodOptions_IdempotencyLevel.IDEMPOTENT;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum MethodOptions_IdempotencyLevel");
  }
}

export function methodOptions_IdempotencyLevelToJSON(object: MethodOptions_IdempotencyLevel): string {
  switch (object) {
    case MethodOptions_IdempotencyLevel.IDEMPOTENCY_UNKNOWN:
      return "IDEMPOTENCY_UNKNOWN";
    case MethodOptions_IdempotencyLevel.NO_SIDE_EFFECTS:
      return "NO_SIDE_EFFECTS";
    case MethodOptions_IdempotencyLevel.IDEMPOTENT:
      return "IDEMPOTENT";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum MethodOptions_IdempotencyLevel");
  }
}

/**
 * A message representing a option the parser does not recognize. This only
 * appears in options protos created by the compiler::Parser class.
 * DescriptorPool resolves these when building Descriptor objects. Therefore,
 * options protos in descriptor objects (e.g. returned by Descriptor::options(),
 * or produced by Descriptor::CopyTo()) will never have UninterpretedOptions
 * in them.
 */
export interface UninterpretedOption {
  name: UninterpretedOption_NamePart[];
  /**
   * The value of the uninterpreted option, in whatever type the tokenizer
   * identified it as during parsing. Exactly one of these should be set.
   */
  identifierValue?: string | undefined;
  positiveIntValue?: number | undefined;
  negativeIntValue?: number | undefined;
  doubleValue?: number | undefined;
  stringValue?: Uint8Array | undefined;
  aggregateValue?: string | undefined;
}

/**
 * The name of the uninterpreted option.  Each string represents a segment in
 * a dot-separated name.  is_extension is true iff a segment represents an
 * extension (denoted with parentheses in options specs in .proto files).
 * E.g.,{ ["foo", false], ["bar.baz", true], ["moo", false] } represents
 * "foo.(bar.baz).moo".
 */
export interface UninterpretedOption_NamePart {
  namePart: string;
  isExtension: boolean;
}

/**
 * Encapsulates information about the original source file from which a
 * FileDescriptorProto was generated.
 */
export interface SourceCodeInfo {
  /**
   * A Location identifies a piece of source code in a .proto file which
   * corresponds to a particular definition.  This information is intended
   * to be useful to IDEs, code indexers, documentation generators, and similar
   * tools.
   *
   * For example, say we have a file like:
   *   message Foo {
   *     optional string foo = 1;
   *   }
   * Let's look at just the field definition:
   *   optional string foo = 1;
   *   ^       ^^     ^^  ^  ^^^
   *   a       bc     de  f  ghi
   * We have the following locations:
   *   span   path               represents
   *   [a,i)  [ 4, 0, 2, 0 ]     The whole field definition.
   *   [a,b)  [ 4, 0, 2, 0, 4 ]  The label (optional).
   *   [c,d)  [ 4, 0, 2, 0, 5 ]  The type (string).
   *   [e,f)  [ 4, 0, 2, 0, 1 ]  The name (foo).
   *   [g,h)  [ 4, 0, 2, 0, 3 ]  The number (1).
   *
   * Notes:
   * - A location may refer to a repeated field itself (i.e. not to any
   *   particular index within it).  This is used whenever a set of elements are
   *   logically enclosed in a single code segment.  For example, an entire
   *   extend block (possibly containing multiple extension definitions) will
   *   have an outer location whose path refers to the "extensions" repeated
   *   field without an index.
   * - Multiple locations may have the same path.  This happens when a single
   *   logical declaration is spread out across multiple places.  The most
   *   obvious example is the "extend" block again -- there may be multiple
   *   extend blocks in the same scope, each of which will have the same path.
   * - A location's span is not always a subset of its parent's span.  For
   *   example, the "extendee" of an extension declaration appears at the
   *   beginning of the "extend" block and is shared by all extensions within
   *   the block.
   * - Just because a location's span is a subset of some other location's span
   *   does not mean that it is a descendant.  For example, a "group" defines
   *   both a type and a field in a single declaration.  Thus, the locations
   *   corresponding to the type and field and their components will overlap.
   * - Code which tries to interpret locations should probably be designed to
   *   ignore those that it doesn't understand, as more types of locations could
   *   be recorded in the future.
   */
  location: SourceCodeInfo_Location[];
}

export interface SourceCodeInfo_Location {
  /**
   * Identifies which part of the FileDescriptorProto was defined at this
   * location.
   *
   * Each element is a field number or an index.  They form a path from
   * the root FileDescriptorProto to the place where the definition occurs.
   * For example, this path:
   *   [ 4, 3, 2, 7, 1 ]
   * refers to:
   *   file.message_type(3)  // 4, 3
   *       .field(7)         // 2, 7
   *       .name()           // 1
   * This is because FileDescriptorProto.message_type has field number 4:
   *   repeated DescriptorProto message_type = 4;
   * and DescriptorProto.field has field number 2:
   *   repeated FieldDescriptorProto field = 2;
   * and FieldDescriptorProto.name has field number 1:
   *   optional string name = 1;
   *
   * Thus, the above path gives the location of a field name.  If we removed
   * the last element:
   *   [ 4, 3, 2, 7 ]
   * this path refers to the whole field declaration (from the beginning
   * of the label to the terminating semicolon).
   */
  path: number[];
  /**
   * Always has exactly three or four elements: start line, start column,
   * end line (optional, otherwise assumed same as start line), end column.
   * These are packed into a single field for efficiency.  Note that line
   * and column numbers are zero-based -- typically you will want to add
   * 1 to each before displaying to a user.
   */
  span: number[];
  /**
   * If this SourceCodeInfo represents a complete declaration, these are any
   * comments appearing before and after the declaration which appear to be
   * attached to the declaration.
   *
   * A series of line comments appearing on consecutive lines, with no other
   * tokens appearing on those lines, will be treated as a single comment.
   *
   * leading_detached_comments will keep paragraphs of comments that appear
   * before (but not connected to) the current element. Each paragraph,
   * separated by empty lines, will be one comment element in the repeated
   * field.
   *
   * Only the comment content is provided; comment markers (e.g. //) are
   * stripped out.  For block comments, leading whitespace and an asterisk
   * will be stripped from the beginning of each line other than the first.
   * Newlines are included in the output.
   *
   * Examples:
   *
   *   optional int32 foo = 1;  // Comment attached to foo.
   *   // Comment attached to bar.
   *   optional int32 bar = 2;
   *
   *   optional string baz = 3;
   *   // Comment attached to baz.
   *   // Another line attached to baz.
   *
   *   // Comment attached to moo.
   *   //
   *   // Another line attached to moo.
   *   optional double moo = 4;
   *
   *   // Detached comment for corge. This is not leading or trailing comments
   *   // to moo or corge because there are blank lines separating it from
   *   // both.
   *
   *   // Detached comment for corge paragraph 2.
   *
   *   optional string corge = 5;
   *   /* Block comment attached
   *    * to corge.  Leading asterisks
   *    * will be removed. * /
   *   /* Block comment attached to
   *    * grault. * /
   *   optional int32 grault = 6;
   *
   *   // ignored detached comments.
   */
  leadingComments?: string | undefined;
  trailingComments?: string | undefined;
  leadingDetachedComments: string[];
}

/**
 * Describes the relationship between generated code and its original source
 * file. A GeneratedCodeInfo message is associated with only one generated
 * source file, but may contain references to different source .proto files.
 */
export interface GeneratedCodeInfo {
  /**
   * An Annotation connects some span of text in generated code to an element
   * of its generating .proto file.
   */
  annotation: GeneratedCodeInfo_Annotation[];
}

export interface GeneratedCodeInfo_Annotation {
  /**
   * Identifies the element in the original source .proto file. This field
   * is formatted the same as SourceCodeInfo.Location.path.
   */
  path: number[];
  /** Identifies the filesystem path to the original source .proto. */
  sourceFile?:
    | string
    | undefined;
  /**
   * Identifies the starting offset in bytes in the generated code
   * that relates to the identified object.
   */
  begin?:
    | number
    | undefined;
  /**
   * Identifies the ending offset in bytes in the generated code that
   * relates to the identified object. The end offset should be one past
   * the last relevant byte (so the length of the text = end - begin).
   */
  end?: number | undefined;
  semantic?: GeneratedCodeInfo_Annotation_Semantic | undefined;
}

/**
 * Represents the identified object's effect on the element in the original
 * .proto file.
 */
export enum GeneratedCodeInfo_Annotation_Semantic {
  /** NONE - There is no effect or the effect is indescribable. */
  NONE = 0,
  /** SET - The element is set or otherwise mutated. */
  SET = 1,
  /** ALIAS - An alias to the element is returned. */
  ALIAS = 2,
}

export function generatedCodeInfo_Annotation_SemanticFromJSON(object: any): GeneratedCodeInfo_Annotation_Semantic {
  switch (object) {
    case 0:
    case "NONE":
      return GeneratedCodeInfo_Annotation_Semantic.NONE;
    case 1:
    case "SET":
      return GeneratedCodeInfo_Annotation_Semantic.SET;
    case 2:
    case "ALIAS":
      return GeneratedCodeInfo_Annotation_Semantic.ALIAS;
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum GeneratedCodeInfo_Annotation_Semantic",
      );
  }
}

export function generatedCodeInfo_Annotation_SemanticToJSON(object: GeneratedCodeInfo_Annotation_Semantic): string {
  switch (object) {
    case GeneratedCodeInfo_Annotation_Semantic.NONE:
      return "NONE";
    case GeneratedCodeInfo_Annotation_Semantic.SET:
      return "SET";
    case GeneratedCodeInfo_Annotation_Semantic.ALIAS:
      return "ALIAS";
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum GeneratedCodeInfo_Annotation_Semantic",
      );
  }
}

function createBaseFileDescriptorSet(): FileDescriptorSet {
  return { file: [] };
}

export const FileDescriptorSet = {
  fromJSON(object: any): FileDescriptorSet {
    return {
      file: globalThis.Array.isArray(object?.file) ? object.file.map((e: any) => FileDescriptorProto.fromJSON(e)) : [],
    };
  },

  toJSON(message: FileDescriptorSet): unknown {
    const obj: any = {};
    if (message.file?.length) {
      obj.file = message.file.map((e) => FileDescriptorProto.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FileDescriptorSet>, I>>(base?: I): FileDescriptorSet {
    return FileDescriptorSet.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FileDescriptorSet>, I>>(object: I): FileDescriptorSet {
    const message = createBaseFileDescriptorSet();
    message.file = object.file?.map((e) => FileDescriptorProto.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFileDescriptorProto(): FileDescriptorProto {
  return {
    name: "",
    package: "",
    dependency: [],
    publicDependency: [],
    weakDependency: [],
    messageType: [],
    enumType: [],
    service: [],
    extension: [],
    options: undefined,
    sourceCodeInfo: undefined,
    syntax: "",
    edition: "",
  };
}

export const FileDescriptorProto = {
  fromJSON(object: any): FileDescriptorProto {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      package: isSet(object.package) ? globalThis.String(object.package) : "",
      dependency: globalThis.Array.isArray(object?.dependency)
        ? object.dependency.map((e: any) => globalThis.String(e))
        : [],
      publicDependency: globalThis.Array.isArray(object?.publicDependency)
        ? object.publicDependency.map((e: any) => globalThis.Number(e))
        : [],
      weakDependency: globalThis.Array.isArray(object?.weakDependency)
        ? object.weakDependency.map((e: any) => globalThis.Number(e))
        : [],
      messageType: globalThis.Array.isArray(object?.messageType)
        ? object.messageType.map((e: any) => DescriptorProto.fromJSON(e))
        : [],
      enumType: globalThis.Array.isArray(object?.enumType)
        ? object.enumType.map((e: any) => EnumDescriptorProto.fromJSON(e))
        : [],
      service: globalThis.Array.isArray(object?.service)
        ? object.service.map((e: any) => ServiceDescriptorProto.fromJSON(e))
        : [],
      extension: globalThis.Array.isArray(object?.extension)
        ? object.extension.map((e: any) => FieldDescriptorProto.fromJSON(e))
        : [],
      options: isSet(object.options) ? FileOptions.fromJSON(object.options) : undefined,
      sourceCodeInfo: isSet(object.sourceCodeInfo) ? SourceCodeInfo.fromJSON(object.sourceCodeInfo) : undefined,
      syntax: isSet(object.syntax) ? globalThis.String(object.syntax) : "",
      edition: isSet(object.edition) ? globalThis.String(object.edition) : "",
    };
  },

  toJSON(message: FileDescriptorProto): unknown {
    const obj: any = {};
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    if (message.package !== undefined && message.package !== "") {
      obj.package = message.package;
    }
    if (message.dependency?.length) {
      obj.dependency = message.dependency;
    }
    if (message.publicDependency?.length) {
      obj.publicDependency = message.publicDependency.map((e) => Math.round(e));
    }
    if (message.weakDependency?.length) {
      obj.weakDependency = message.weakDependency.map((e) => Math.round(e));
    }
    if (message.messageType?.length) {
      obj.messageType = message.messageType.map((e) => DescriptorProto.toJSON(e));
    }
    if (message.enumType?.length) {
      obj.enumType = message.enumType.map((e) => EnumDescriptorProto.toJSON(e));
    }
    if (message.service?.length) {
      obj.service = message.service.map((e) => ServiceDescriptorProto.toJSON(e));
    }
    if (message.extension?.length) {
      obj.extension = message.extension.map((e) => FieldDescriptorProto.toJSON(e));
    }
    if (message.options !== undefined) {
      obj.options = FileOptions.toJSON(message.options);
    }
    if (message.sourceCodeInfo !== undefined) {
      obj.sourceCodeInfo = SourceCodeInfo.toJSON(message.sourceCodeInfo);
    }
    if (message.syntax !== undefined && message.syntax !== "") {
      obj.syntax = message.syntax;
    }
    if (message.edition !== undefined && message.edition !== "") {
      obj.edition = message.edition;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FileDescriptorProto>, I>>(base?: I): FileDescriptorProto {
    return FileDescriptorProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FileDescriptorProto>, I>>(object: I): FileDescriptorProto {
    const message = createBaseFileDescriptorProto();
    message.name = object.name ?? "";
    message.package = object.package ?? "";
    message.dependency = object.dependency?.map((e) => e) || [];
    message.publicDependency = object.publicDependency?.map((e) => e) || [];
    message.weakDependency = object.weakDependency?.map((e) => e) || [];
    message.messageType = object.messageType?.map((e) => DescriptorProto.fromPartial(e)) || [];
    message.enumType = object.enumType?.map((e) => EnumDescriptorProto.fromPartial(e)) || [];
    message.service = object.service?.map((e) => ServiceDescriptorProto.fromPartial(e)) || [];
    message.extension = object.extension?.map((e) => FieldDescriptorProto.fromPartial(e)) || [];
    message.options = (object.options !== undefined && object.options !== null)
      ? FileOptions.fromPartial(object.options)
      : undefined;
    message.sourceCodeInfo = (object.sourceCodeInfo !== undefined && object.sourceCodeInfo !== null)
      ? SourceCodeInfo.fromPartial(object.sourceCodeInfo)
      : undefined;
    message.syntax = object.syntax ?? "";
    message.edition = object.edition ?? "";
    return message;
  },
};

function createBaseDescriptorProto(): DescriptorProto {
  return {
    name: "",
    field: [],
    extension: [],
    nestedType: [],
    enumType: [],
    extensionRange: [],
    oneofDecl: [],
    options: undefined,
    reservedRange: [],
    reservedName: [],
  };
}

export const DescriptorProto = {
  fromJSON(object: any): DescriptorProto {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      field: globalThis.Array.isArray(object?.field)
        ? object.field.map((e: any) => FieldDescriptorProto.fromJSON(e))
        : [],
      extension: globalThis.Array.isArray(object?.extension)
        ? object.extension.map((e: any) => FieldDescriptorProto.fromJSON(e))
        : [],
      nestedType: globalThis.Array.isArray(object?.nestedType)
        ? object.nestedType.map((e: any) => DescriptorProto.fromJSON(e))
        : [],
      enumType: globalThis.Array.isArray(object?.enumType)
        ? object.enumType.map((e: any) => EnumDescriptorProto.fromJSON(e))
        : [],
      extensionRange: globalThis.Array.isArray(object?.extensionRange)
        ? object.extensionRange.map((e: any) => DescriptorProto_ExtensionRange.fromJSON(e))
        : [],
      oneofDecl: globalThis.Array.isArray(object?.oneofDecl)
        ? object.oneofDecl.map((e: any) => OneofDescriptorProto.fromJSON(e))
        : [],
      options: isSet(object.options) ? MessageOptions.fromJSON(object.options) : undefined,
      reservedRange: globalThis.Array.isArray(object?.reservedRange)
        ? object.reservedRange.map((e: any) => DescriptorProto_ReservedRange.fromJSON(e))
        : [],
      reservedName: globalThis.Array.isArray(object?.reservedName)
        ? object.reservedName.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: DescriptorProto): unknown {
    const obj: any = {};
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    if (message.field?.length) {
      obj.field = message.field.map((e) => FieldDescriptorProto.toJSON(e));
    }
    if (message.extension?.length) {
      obj.extension = message.extension.map((e) => FieldDescriptorProto.toJSON(e));
    }
    if (message.nestedType?.length) {
      obj.nestedType = message.nestedType.map((e) => DescriptorProto.toJSON(e));
    }
    if (message.enumType?.length) {
      obj.enumType = message.enumType.map((e) => EnumDescriptorProto.toJSON(e));
    }
    if (message.extensionRange?.length) {
      obj.extensionRange = message.extensionRange.map((e) => DescriptorProto_ExtensionRange.toJSON(e));
    }
    if (message.oneofDecl?.length) {
      obj.oneofDecl = message.oneofDecl.map((e) => OneofDescriptorProto.toJSON(e));
    }
    if (message.options !== undefined) {
      obj.options = MessageOptions.toJSON(message.options);
    }
    if (message.reservedRange?.length) {
      obj.reservedRange = message.reservedRange.map((e) => DescriptorProto_ReservedRange.toJSON(e));
    }
    if (message.reservedName?.length) {
      obj.reservedName = message.reservedName;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DescriptorProto>, I>>(base?: I): DescriptorProto {
    return DescriptorProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DescriptorProto>, I>>(object: I): DescriptorProto {
    const message = createBaseDescriptorProto();
    message.name = object.name ?? "";
    message.field = object.field?.map((e) => FieldDescriptorProto.fromPartial(e)) || [];
    message.extension = object.extension?.map((e) => FieldDescriptorProto.fromPartial(e)) || [];
    message.nestedType = object.nestedType?.map((e) => DescriptorProto.fromPartial(e)) || [];
    message.enumType = object.enumType?.map((e) => EnumDescriptorProto.fromPartial(e)) || [];
    message.extensionRange = object.extensionRange?.map((e) => DescriptorProto_ExtensionRange.fromPartial(e)) || [];
    message.oneofDecl = object.oneofDecl?.map((e) => OneofDescriptorProto.fromPartial(e)) || [];
    message.options = (object.options !== undefined && object.options !== null)
      ? MessageOptions.fromPartial(object.options)
      : undefined;
    message.reservedRange = object.reservedRange?.map((e) => DescriptorProto_ReservedRange.fromPartial(e)) || [];
    message.reservedName = object.reservedName?.map((e) => e) || [];
    return message;
  },
};

function createBaseDescriptorProto_ExtensionRange(): DescriptorProto_ExtensionRange {
  return { start: 0, end: 0, options: undefined };
}

export const DescriptorProto_ExtensionRange = {
  fromJSON(object: any): DescriptorProto_ExtensionRange {
    return {
      start: isSet(object.start) ? globalThis.Number(object.start) : 0,
      end: isSet(object.end) ? globalThis.Number(object.end) : 0,
      options: isSet(object.options) ? ExtensionRangeOptions.fromJSON(object.options) : undefined,
    };
  },

  toJSON(message: DescriptorProto_ExtensionRange): unknown {
    const obj: any = {};
    if (message.start !== undefined && message.start !== 0) {
      obj.start = Math.round(message.start);
    }
    if (message.end !== undefined && message.end !== 0) {
      obj.end = Math.round(message.end);
    }
    if (message.options !== undefined) {
      obj.options = ExtensionRangeOptions.toJSON(message.options);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DescriptorProto_ExtensionRange>, I>>(base?: I): DescriptorProto_ExtensionRange {
    return DescriptorProto_ExtensionRange.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DescriptorProto_ExtensionRange>, I>>(
    object: I,
  ): DescriptorProto_ExtensionRange {
    const message = createBaseDescriptorProto_ExtensionRange();
    message.start = object.start ?? 0;
    message.end = object.end ?? 0;
    message.options = (object.options !== undefined && object.options !== null)
      ? ExtensionRangeOptions.fromPartial(object.options)
      : undefined;
    return message;
  },
};

function createBaseDescriptorProto_ReservedRange(): DescriptorProto_ReservedRange {
  return { start: 0, end: 0 };
}

export const DescriptorProto_ReservedRange = {
  fromJSON(object: any): DescriptorProto_ReservedRange {
    return {
      start: isSet(object.start) ? globalThis.Number(object.start) : 0,
      end: isSet(object.end) ? globalThis.Number(object.end) : 0,
    };
  },

  toJSON(message: DescriptorProto_ReservedRange): unknown {
    const obj: any = {};
    if (message.start !== undefined && message.start !== 0) {
      obj.start = Math.round(message.start);
    }
    if (message.end !== undefined && message.end !== 0) {
      obj.end = Math.round(message.end);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DescriptorProto_ReservedRange>, I>>(base?: I): DescriptorProto_ReservedRange {
    return DescriptorProto_ReservedRange.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DescriptorProto_ReservedRange>, I>>(
    object: I,
  ): DescriptorProto_ReservedRange {
    const message = createBaseDescriptorProto_ReservedRange();
    message.start = object.start ?? 0;
    message.end = object.end ?? 0;
    return message;
  },
};

function createBaseExtensionRangeOptions(): ExtensionRangeOptions {
  return { uninterpretedOption: [] };
}

export const ExtensionRangeOptions = {
  fromJSON(object: any): ExtensionRangeOptions {
    return {
      uninterpretedOption: globalThis.Array.isArray(object?.uninterpretedOption)
        ? object.uninterpretedOption.map((e: any) => UninterpretedOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ExtensionRangeOptions): unknown {
    const obj: any = {};
    if (message.uninterpretedOption?.length) {
      obj.uninterpretedOption = message.uninterpretedOption.map((e) => UninterpretedOption.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ExtensionRangeOptions>, I>>(base?: I): ExtensionRangeOptions {
    return ExtensionRangeOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ExtensionRangeOptions>, I>>(object: I): ExtensionRangeOptions {
    const message = createBaseExtensionRangeOptions();
    message.uninterpretedOption = object.uninterpretedOption?.map((e) => UninterpretedOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFieldDescriptorProto(): FieldDescriptorProto {
  return {
    name: "",
    number: 0,
    label: 1,
    type: 1,
    typeName: "",
    extendee: "",
    defaultValue: "",
    oneofIndex: 0,
    jsonName: "",
    options: undefined,
    proto3Optional: false,
  };
}

export const FieldDescriptorProto = {
  fromJSON(object: any): FieldDescriptorProto {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      number: isSet(object.number) ? globalThis.Number(object.number) : 0,
      label: isSet(object.label) ? fieldDescriptorProto_LabelFromJSON(object.label) : 1,
      type: isSet(object.type) ? fieldDescriptorProto_TypeFromJSON(object.type) : 1,
      typeName: isSet(object.typeName) ? globalThis.String(object.typeName) : "",
      extendee: isSet(object.extendee) ? globalThis.String(object.extendee) : "",
      defaultValue: isSet(object.defaultValue) ? globalThis.String(object.defaultValue) : "",
      oneofIndex: isSet(object.oneofIndex) ? globalThis.Number(object.oneofIndex) : 0,
      jsonName: isSet(object.jsonName) ? globalThis.String(object.jsonName) : "",
      options: isSet(object.options) ? FieldOptions.fromJSON(object.options) : undefined,
      proto3Optional: isSet(object.proto3Optional) ? globalThis.Boolean(object.proto3Optional) : false,
    };
  },

  toJSON(message: FieldDescriptorProto): unknown {
    const obj: any = {};
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    if (message.number !== undefined && message.number !== 0) {
      obj.number = Math.round(message.number);
    }
    if (message.label !== undefined && message.label !== 1) {
      obj.label = fieldDescriptorProto_LabelToJSON(message.label);
    }
    if (message.type !== undefined && message.type !== 1) {
      obj.type = fieldDescriptorProto_TypeToJSON(message.type);
    }
    if (message.typeName !== undefined && message.typeName !== "") {
      obj.typeName = message.typeName;
    }
    if (message.extendee !== undefined && message.extendee !== "") {
      obj.extendee = message.extendee;
    }
    if (message.defaultValue !== undefined && message.defaultValue !== "") {
      obj.defaultValue = message.defaultValue;
    }
    if (message.oneofIndex !== undefined && message.oneofIndex !== 0) {
      obj.oneofIndex = Math.round(message.oneofIndex);
    }
    if (message.jsonName !== undefined && message.jsonName !== "") {
      obj.jsonName = message.jsonName;
    }
    if (message.options !== undefined) {
      obj.options = FieldOptions.toJSON(message.options);
    }
    if (message.proto3Optional !== undefined && message.proto3Optional !== false) {
      obj.proto3Optional = message.proto3Optional;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FieldDescriptorProto>, I>>(base?: I): FieldDescriptorProto {
    return FieldDescriptorProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FieldDescriptorProto>, I>>(object: I): FieldDescriptorProto {
    const message = createBaseFieldDescriptorProto();
    message.name = object.name ?? "";
    message.number = object.number ?? 0;
    message.label = object.label ?? 1;
    message.type = object.type ?? 1;
    message.typeName = object.typeName ?? "";
    message.extendee = object.extendee ?? "";
    message.defaultValue = object.defaultValue ?? "";
    message.oneofIndex = object.oneofIndex ?? 0;
    message.jsonName = object.jsonName ?? "";
    message.options = (object.options !== undefined && object.options !== null)
      ? FieldOptions.fromPartial(object.options)
      : undefined;
    message.proto3Optional = object.proto3Optional ?? false;
    return message;
  },
};

function createBaseOneofDescriptorProto(): OneofDescriptorProto {
  return { name: "", options: undefined };
}

export const OneofDescriptorProto = {
  fromJSON(object: any): OneofDescriptorProto {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      options: isSet(object.options) ? OneofOptions.fromJSON(object.options) : undefined,
    };
  },

  toJSON(message: OneofDescriptorProto): unknown {
    const obj: any = {};
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    if (message.options !== undefined) {
      obj.options = OneofOptions.toJSON(message.options);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OneofDescriptorProto>, I>>(base?: I): OneofDescriptorProto {
    return OneofDescriptorProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OneofDescriptorProto>, I>>(object: I): OneofDescriptorProto {
    const message = createBaseOneofDescriptorProto();
    message.name = object.name ?? "";
    message.options = (object.options !== undefined && object.options !== null)
      ? OneofOptions.fromPartial(object.options)
      : undefined;
    return message;
  },
};

function createBaseEnumDescriptorProto(): EnumDescriptorProto {
  return { name: "", value: [], options: undefined, reservedRange: [], reservedName: [] };
}

export const EnumDescriptorProto = {
  fromJSON(object: any): EnumDescriptorProto {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      value: globalThis.Array.isArray(object?.value)
        ? object.value.map((e: any) => EnumValueDescriptorProto.fromJSON(e))
        : [],
      options: isSet(object.options) ? EnumOptions.fromJSON(object.options) : undefined,
      reservedRange: globalThis.Array.isArray(object?.reservedRange)
        ? object.reservedRange.map((e: any) => EnumDescriptorProto_EnumReservedRange.fromJSON(e))
        : [],
      reservedName: globalThis.Array.isArray(object?.reservedName)
        ? object.reservedName.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: EnumDescriptorProto): unknown {
    const obj: any = {};
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    if (message.value?.length) {
      obj.value = message.value.map((e) => EnumValueDescriptorProto.toJSON(e));
    }
    if (message.options !== undefined) {
      obj.options = EnumOptions.toJSON(message.options);
    }
    if (message.reservedRange?.length) {
      obj.reservedRange = message.reservedRange.map((e) => EnumDescriptorProto_EnumReservedRange.toJSON(e));
    }
    if (message.reservedName?.length) {
      obj.reservedName = message.reservedName;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnumDescriptorProto>, I>>(base?: I): EnumDescriptorProto {
    return EnumDescriptorProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EnumDescriptorProto>, I>>(object: I): EnumDescriptorProto {
    const message = createBaseEnumDescriptorProto();
    message.name = object.name ?? "";
    message.value = object.value?.map((e) => EnumValueDescriptorProto.fromPartial(e)) || [];
    message.options = (object.options !== undefined && object.options !== null)
      ? EnumOptions.fromPartial(object.options)
      : undefined;
    message.reservedRange = object.reservedRange?.map((e) => EnumDescriptorProto_EnumReservedRange.fromPartial(e)) ||
      [];
    message.reservedName = object.reservedName?.map((e) => e) || [];
    return message;
  },
};

function createBaseEnumDescriptorProto_EnumReservedRange(): EnumDescriptorProto_EnumReservedRange {
  return { start: 0, end: 0 };
}

export const EnumDescriptorProto_EnumReservedRange = {
  fromJSON(object: any): EnumDescriptorProto_EnumReservedRange {
    return {
      start: isSet(object.start) ? globalThis.Number(object.start) : 0,
      end: isSet(object.end) ? globalThis.Number(object.end) : 0,
    };
  },

  toJSON(message: EnumDescriptorProto_EnumReservedRange): unknown {
    const obj: any = {};
    if (message.start !== undefined && message.start !== 0) {
      obj.start = Math.round(message.start);
    }
    if (message.end !== undefined && message.end !== 0) {
      obj.end = Math.round(message.end);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnumDescriptorProto_EnumReservedRange>, I>>(
    base?: I,
  ): EnumDescriptorProto_EnumReservedRange {
    return EnumDescriptorProto_EnumReservedRange.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EnumDescriptorProto_EnumReservedRange>, I>>(
    object: I,
  ): EnumDescriptorProto_EnumReservedRange {
    const message = createBaseEnumDescriptorProto_EnumReservedRange();
    message.start = object.start ?? 0;
    message.end = object.end ?? 0;
    return message;
  },
};

function createBaseEnumValueDescriptorProto(): EnumValueDescriptorProto {
  return { name: "", number: 0, options: undefined };
}

export const EnumValueDescriptorProto = {
  fromJSON(object: any): EnumValueDescriptorProto {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      number: isSet(object.number) ? globalThis.Number(object.number) : 0,
      options: isSet(object.options) ? EnumValueOptions.fromJSON(object.options) : undefined,
    };
  },

  toJSON(message: EnumValueDescriptorProto): unknown {
    const obj: any = {};
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    if (message.number !== undefined && message.number !== 0) {
      obj.number = Math.round(message.number);
    }
    if (message.options !== undefined) {
      obj.options = EnumValueOptions.toJSON(message.options);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnumValueDescriptorProto>, I>>(base?: I): EnumValueDescriptorProto {
    return EnumValueDescriptorProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EnumValueDescriptorProto>, I>>(object: I): EnumValueDescriptorProto {
    const message = createBaseEnumValueDescriptorProto();
    message.name = object.name ?? "";
    message.number = object.number ?? 0;
    message.options = (object.options !== undefined && object.options !== null)
      ? EnumValueOptions.fromPartial(object.options)
      : undefined;
    return message;
  },
};

function createBaseServiceDescriptorProto(): ServiceDescriptorProto {
  return { name: "", method: [], options: undefined };
}

export const ServiceDescriptorProto = {
  fromJSON(object: any): ServiceDescriptorProto {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      method: globalThis.Array.isArray(object?.method)
        ? object.method.map((e: any) => MethodDescriptorProto.fromJSON(e))
        : [],
      options: isSet(object.options) ? ServiceOptions.fromJSON(object.options) : undefined,
    };
  },

  toJSON(message: ServiceDescriptorProto): unknown {
    const obj: any = {};
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    if (message.method?.length) {
      obj.method = message.method.map((e) => MethodDescriptorProto.toJSON(e));
    }
    if (message.options !== undefined) {
      obj.options = ServiceOptions.toJSON(message.options);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServiceDescriptorProto>, I>>(base?: I): ServiceDescriptorProto {
    return ServiceDescriptorProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServiceDescriptorProto>, I>>(object: I): ServiceDescriptorProto {
    const message = createBaseServiceDescriptorProto();
    message.name = object.name ?? "";
    message.method = object.method?.map((e) => MethodDescriptorProto.fromPartial(e)) || [];
    message.options = (object.options !== undefined && object.options !== null)
      ? ServiceOptions.fromPartial(object.options)
      : undefined;
    return message;
  },
};

function createBaseMethodDescriptorProto(): MethodDescriptorProto {
  return {
    name: "",
    inputType: "",
    outputType: "",
    options: undefined,
    clientStreaming: false,
    serverStreaming: false,
  };
}

export const MethodDescriptorProto = {
  fromJSON(object: any): MethodDescriptorProto {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      inputType: isSet(object.inputType) ? globalThis.String(object.inputType) : "",
      outputType: isSet(object.outputType) ? globalThis.String(object.outputType) : "",
      options: isSet(object.options) ? MethodOptions.fromJSON(object.options) : undefined,
      clientStreaming: isSet(object.clientStreaming) ? globalThis.Boolean(object.clientStreaming) : false,
      serverStreaming: isSet(object.serverStreaming) ? globalThis.Boolean(object.serverStreaming) : false,
    };
  },

  toJSON(message: MethodDescriptorProto): unknown {
    const obj: any = {};
    if (message.name !== undefined && message.name !== "") {
      obj.name = message.name;
    }
    if (message.inputType !== undefined && message.inputType !== "") {
      obj.inputType = message.inputType;
    }
    if (message.outputType !== undefined && message.outputType !== "") {
      obj.outputType = message.outputType;
    }
    if (message.options !== undefined) {
      obj.options = MethodOptions.toJSON(message.options);
    }
    if (message.clientStreaming !== undefined && message.clientStreaming !== false) {
      obj.clientStreaming = message.clientStreaming;
    }
    if (message.serverStreaming !== undefined && message.serverStreaming !== false) {
      obj.serverStreaming = message.serverStreaming;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MethodDescriptorProto>, I>>(base?: I): MethodDescriptorProto {
    return MethodDescriptorProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MethodDescriptorProto>, I>>(object: I): MethodDescriptorProto {
    const message = createBaseMethodDescriptorProto();
    message.name = object.name ?? "";
    message.inputType = object.inputType ?? "";
    message.outputType = object.outputType ?? "";
    message.options = (object.options !== undefined && object.options !== null)
      ? MethodOptions.fromPartial(object.options)
      : undefined;
    message.clientStreaming = object.clientStreaming ?? false;
    message.serverStreaming = object.serverStreaming ?? false;
    return message;
  },
};

function createBaseFileOptions(): FileOptions {
  return {
    javaPackage: "",
    javaOuterClassname: "",
    javaMultipleFiles: false,
    javaGenerateEqualsAndHash: false,
    javaStringCheckUtf8: false,
    optimizeFor: 1,
    goPackage: "",
    ccGenericServices: false,
    javaGenericServices: false,
    pyGenericServices: false,
    phpGenericServices: false,
    deprecated: false,
    ccEnableArenas: true,
    objcClassPrefix: "",
    csharpNamespace: "",
    swiftPrefix: "",
    phpClassPrefix: "",
    phpNamespace: "",
    phpMetadataNamespace: "",
    rubyPackage: "",
    uninterpretedOption: [],
  };
}

export const FileOptions = {
  fromJSON(object: any): FileOptions {
    return {
      javaPackage: isSet(object.javaPackage) ? globalThis.String(object.javaPackage) : "",
      javaOuterClassname: isSet(object.javaOuterClassname) ? globalThis.String(object.javaOuterClassname) : "",
      javaMultipleFiles: isSet(object.javaMultipleFiles) ? globalThis.Boolean(object.javaMultipleFiles) : false,
      javaGenerateEqualsAndHash: isSet(object.javaGenerateEqualsAndHash)
        ? globalThis.Boolean(object.javaGenerateEqualsAndHash)
        : false,
      javaStringCheckUtf8: isSet(object.javaStringCheckUtf8) ? globalThis.Boolean(object.javaStringCheckUtf8) : false,
      optimizeFor: isSet(object.optimizeFor) ? fileOptions_OptimizeModeFromJSON(object.optimizeFor) : 1,
      goPackage: isSet(object.goPackage) ? globalThis.String(object.goPackage) : "",
      ccGenericServices: isSet(object.ccGenericServices) ? globalThis.Boolean(object.ccGenericServices) : false,
      javaGenericServices: isSet(object.javaGenericServices) ? globalThis.Boolean(object.javaGenericServices) : false,
      pyGenericServices: isSet(object.pyGenericServices) ? globalThis.Boolean(object.pyGenericServices) : false,
      phpGenericServices: isSet(object.phpGenericServices) ? globalThis.Boolean(object.phpGenericServices) : false,
      deprecated: isSet(object.deprecated) ? globalThis.Boolean(object.deprecated) : false,
      ccEnableArenas: isSet(object.ccEnableArenas) ? globalThis.Boolean(object.ccEnableArenas) : true,
      objcClassPrefix: isSet(object.objcClassPrefix) ? globalThis.String(object.objcClassPrefix) : "",
      csharpNamespace: isSet(object.csharpNamespace) ? globalThis.String(object.csharpNamespace) : "",
      swiftPrefix: isSet(object.swiftPrefix) ? globalThis.String(object.swiftPrefix) : "",
      phpClassPrefix: isSet(object.phpClassPrefix) ? globalThis.String(object.phpClassPrefix) : "",
      phpNamespace: isSet(object.phpNamespace) ? globalThis.String(object.phpNamespace) : "",
      phpMetadataNamespace: isSet(object.phpMetadataNamespace) ? globalThis.String(object.phpMetadataNamespace) : "",
      rubyPackage: isSet(object.rubyPackage) ? globalThis.String(object.rubyPackage) : "",
      uninterpretedOption: globalThis.Array.isArray(object?.uninterpretedOption)
        ? object.uninterpretedOption.map((e: any) => UninterpretedOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: FileOptions): unknown {
    const obj: any = {};
    if (message.javaPackage !== undefined && message.javaPackage !== "") {
      obj.javaPackage = message.javaPackage;
    }
    if (message.javaOuterClassname !== undefined && message.javaOuterClassname !== "") {
      obj.javaOuterClassname = message.javaOuterClassname;
    }
    if (message.javaMultipleFiles !== undefined && message.javaMultipleFiles !== false) {
      obj.javaMultipleFiles = message.javaMultipleFiles;
    }
    if (message.javaGenerateEqualsAndHash !== undefined && message.javaGenerateEqualsAndHash !== false) {
      obj.javaGenerateEqualsAndHash = message.javaGenerateEqualsAndHash;
    }
    if (message.javaStringCheckUtf8 !== undefined && message.javaStringCheckUtf8 !== false) {
      obj.javaStringCheckUtf8 = message.javaStringCheckUtf8;
    }
    if (message.optimizeFor !== undefined && message.optimizeFor !== 1) {
      obj.optimizeFor = fileOptions_OptimizeModeToJSON(message.optimizeFor);
    }
    if (message.goPackage !== undefined && message.goPackage !== "") {
      obj.goPackage = message.goPackage;
    }
    if (message.ccGenericServices !== undefined && message.ccGenericServices !== false) {
      obj.ccGenericServices = message.ccGenericServices;
    }
    if (message.javaGenericServices !== undefined && message.javaGenericServices !== false) {
      obj.javaGenericServices = message.javaGenericServices;
    }
    if (message.pyGenericServices !== undefined && message.pyGenericServices !== false) {
      obj.pyGenericServices = message.pyGenericServices;
    }
    if (message.phpGenericServices !== undefined && message.phpGenericServices !== false) {
      obj.phpGenericServices = message.phpGenericServices;
    }
    if (message.deprecated !== undefined && message.deprecated !== false) {
      obj.deprecated = message.deprecated;
    }
    if (message.ccEnableArenas !== undefined && message.ccEnableArenas !== true) {
      obj.ccEnableArenas = message.ccEnableArenas;
    }
    if (message.objcClassPrefix !== undefined && message.objcClassPrefix !== "") {
      obj.objcClassPrefix = message.objcClassPrefix;
    }
    if (message.csharpNamespace !== undefined && message.csharpNamespace !== "") {
      obj.csharpNamespace = message.csharpNamespace;
    }
    if (message.swiftPrefix !== undefined && message.swiftPrefix !== "") {
      obj.swiftPrefix = message.swiftPrefix;
    }
    if (message.phpClassPrefix !== undefined && message.phpClassPrefix !== "") {
      obj.phpClassPrefix = message.phpClassPrefix;
    }
    if (message.phpNamespace !== undefined && message.phpNamespace !== "") {
      obj.phpNamespace = message.phpNamespace;
    }
    if (message.phpMetadataNamespace !== undefined && message.phpMetadataNamespace !== "") {
      obj.phpMetadataNamespace = message.phpMetadataNamespace;
    }
    if (message.rubyPackage !== undefined && message.rubyPackage !== "") {
      obj.rubyPackage = message.rubyPackage;
    }
    if (message.uninterpretedOption?.length) {
      obj.uninterpretedOption = message.uninterpretedOption.map((e) => UninterpretedOption.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FileOptions>, I>>(base?: I): FileOptions {
    return FileOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FileOptions>, I>>(object: I): FileOptions {
    const message = createBaseFileOptions();
    message.javaPackage = object.javaPackage ?? "";
    message.javaOuterClassname = object.javaOuterClassname ?? "";
    message.javaMultipleFiles = object.javaMultipleFiles ?? false;
    message.javaGenerateEqualsAndHash = object.javaGenerateEqualsAndHash ?? false;
    message.javaStringCheckUtf8 = object.javaStringCheckUtf8 ?? false;
    message.optimizeFor = object.optimizeFor ?? 1;
    message.goPackage = object.goPackage ?? "";
    message.ccGenericServices = object.ccGenericServices ?? false;
    message.javaGenericServices = object.javaGenericServices ?? false;
    message.pyGenericServices = object.pyGenericServices ?? false;
    message.phpGenericServices = object.phpGenericServices ?? false;
    message.deprecated = object.deprecated ?? false;
    message.ccEnableArenas = object.ccEnableArenas ?? true;
    message.objcClassPrefix = object.objcClassPrefix ?? "";
    message.csharpNamespace = object.csharpNamespace ?? "";
    message.swiftPrefix = object.swiftPrefix ?? "";
    message.phpClassPrefix = object.phpClassPrefix ?? "";
    message.phpNamespace = object.phpNamespace ?? "";
    message.phpMetadataNamespace = object.phpMetadataNamespace ?? "";
    message.rubyPackage = object.rubyPackage ?? "";
    message.uninterpretedOption = object.uninterpretedOption?.map((e) => UninterpretedOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMessageOptions(): MessageOptions {
  return {
    messageSetWireFormat: false,
    noStandardDescriptorAccessor: false,
    deprecated: false,
    mapEntry: false,
    deprecatedLegacyJsonFieldConflicts: false,
    uninterpretedOption: [],
  };
}

export const MessageOptions = {
  fromJSON(object: any): MessageOptions {
    return {
      messageSetWireFormat: isSet(object.messageSetWireFormat)
        ? globalThis.Boolean(object.messageSetWireFormat)
        : false,
      noStandardDescriptorAccessor: isSet(object.noStandardDescriptorAccessor)
        ? globalThis.Boolean(object.noStandardDescriptorAccessor)
        : false,
      deprecated: isSet(object.deprecated) ? globalThis.Boolean(object.deprecated) : false,
      mapEntry: isSet(object.mapEntry) ? globalThis.Boolean(object.mapEntry) : false,
      deprecatedLegacyJsonFieldConflicts: isSet(object.deprecatedLegacyJsonFieldConflicts)
        ? globalThis.Boolean(object.deprecatedLegacyJsonFieldConflicts)
        : false,
      uninterpretedOption: globalThis.Array.isArray(object?.uninterpretedOption)
        ? object.uninterpretedOption.map((e: any) => UninterpretedOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MessageOptions): unknown {
    const obj: any = {};
    if (message.messageSetWireFormat !== undefined && message.messageSetWireFormat !== false) {
      obj.messageSetWireFormat = message.messageSetWireFormat;
    }
    if (message.noStandardDescriptorAccessor !== undefined && message.noStandardDescriptorAccessor !== false) {
      obj.noStandardDescriptorAccessor = message.noStandardDescriptorAccessor;
    }
    if (message.deprecated !== undefined && message.deprecated !== false) {
      obj.deprecated = message.deprecated;
    }
    if (message.mapEntry !== undefined && message.mapEntry !== false) {
      obj.mapEntry = message.mapEntry;
    }
    if (
      message.deprecatedLegacyJsonFieldConflicts !== undefined && message.deprecatedLegacyJsonFieldConflicts !== false
    ) {
      obj.deprecatedLegacyJsonFieldConflicts = message.deprecatedLegacyJsonFieldConflicts;
    }
    if (message.uninterpretedOption?.length) {
      obj.uninterpretedOption = message.uninterpretedOption.map((e) => UninterpretedOption.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageOptions>, I>>(base?: I): MessageOptions {
    return MessageOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageOptions>, I>>(object: I): MessageOptions {
    const message = createBaseMessageOptions();
    message.messageSetWireFormat = object.messageSetWireFormat ?? false;
    message.noStandardDescriptorAccessor = object.noStandardDescriptorAccessor ?? false;
    message.deprecated = object.deprecated ?? false;
    message.mapEntry = object.mapEntry ?? false;
    message.deprecatedLegacyJsonFieldConflicts = object.deprecatedLegacyJsonFieldConflicts ?? false;
    message.uninterpretedOption = object.uninterpretedOption?.map((e) => UninterpretedOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFieldOptions(): FieldOptions {
  return {
    ctype: 0,
    packed: false,
    jstype: 0,
    lazy: false,
    unverifiedLazy: false,
    deprecated: false,
    weak: false,
    debugRedact: false,
    retention: 0,
    target: 0,
    uninterpretedOption: [],
  };
}

export const FieldOptions = {
  fromJSON(object: any): FieldOptions {
    return {
      ctype: isSet(object.ctype) ? fieldOptions_CTypeFromJSON(object.ctype) : 0,
      packed: isSet(object.packed) ? globalThis.Boolean(object.packed) : false,
      jstype: isSet(object.jstype) ? fieldOptions_JSTypeFromJSON(object.jstype) : 0,
      lazy: isSet(object.lazy) ? globalThis.Boolean(object.lazy) : false,
      unverifiedLazy: isSet(object.unverifiedLazy) ? globalThis.Boolean(object.unverifiedLazy) : false,
      deprecated: isSet(object.deprecated) ? globalThis.Boolean(object.deprecated) : false,
      weak: isSet(object.weak) ? globalThis.Boolean(object.weak) : false,
      debugRedact: isSet(object.debugRedact) ? globalThis.Boolean(object.debugRedact) : false,
      retention: isSet(object.retention) ? fieldOptions_OptionRetentionFromJSON(object.retention) : 0,
      target: isSet(object.target) ? fieldOptions_OptionTargetTypeFromJSON(object.target) : 0,
      uninterpretedOption: globalThis.Array.isArray(object?.uninterpretedOption)
        ? object.uninterpretedOption.map((e: any) => UninterpretedOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: FieldOptions): unknown {
    const obj: any = {};
    if (message.ctype !== undefined && message.ctype !== 0) {
      obj.ctype = fieldOptions_CTypeToJSON(message.ctype);
    }
    if (message.packed !== undefined && message.packed !== false) {
      obj.packed = message.packed;
    }
    if (message.jstype !== undefined && message.jstype !== 0) {
      obj.jstype = fieldOptions_JSTypeToJSON(message.jstype);
    }
    if (message.lazy !== undefined && message.lazy !== false) {
      obj.lazy = message.lazy;
    }
    if (message.unverifiedLazy !== undefined && message.unverifiedLazy !== false) {
      obj.unverifiedLazy = message.unverifiedLazy;
    }
    if (message.deprecated !== undefined && message.deprecated !== false) {
      obj.deprecated = message.deprecated;
    }
    if (message.weak !== undefined && message.weak !== false) {
      obj.weak = message.weak;
    }
    if (message.debugRedact !== undefined && message.debugRedact !== false) {
      obj.debugRedact = message.debugRedact;
    }
    if (message.retention !== undefined && message.retention !== 0) {
      obj.retention = fieldOptions_OptionRetentionToJSON(message.retention);
    }
    if (message.target !== undefined && message.target !== 0) {
      obj.target = fieldOptions_OptionTargetTypeToJSON(message.target);
    }
    if (message.uninterpretedOption?.length) {
      obj.uninterpretedOption = message.uninterpretedOption.map((e) => UninterpretedOption.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FieldOptions>, I>>(base?: I): FieldOptions {
    return FieldOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FieldOptions>, I>>(object: I): FieldOptions {
    const message = createBaseFieldOptions();
    message.ctype = object.ctype ?? 0;
    message.packed = object.packed ?? false;
    message.jstype = object.jstype ?? 0;
    message.lazy = object.lazy ?? false;
    message.unverifiedLazy = object.unverifiedLazy ?? false;
    message.deprecated = object.deprecated ?? false;
    message.weak = object.weak ?? false;
    message.debugRedact = object.debugRedact ?? false;
    message.retention = object.retention ?? 0;
    message.target = object.target ?? 0;
    message.uninterpretedOption = object.uninterpretedOption?.map((e) => UninterpretedOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseOneofOptions(): OneofOptions {
  return { uninterpretedOption: [] };
}

export const OneofOptions = {
  fromJSON(object: any): OneofOptions {
    return {
      uninterpretedOption: globalThis.Array.isArray(object?.uninterpretedOption)
        ? object.uninterpretedOption.map((e: any) => UninterpretedOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: OneofOptions): unknown {
    const obj: any = {};
    if (message.uninterpretedOption?.length) {
      obj.uninterpretedOption = message.uninterpretedOption.map((e) => UninterpretedOption.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OneofOptions>, I>>(base?: I): OneofOptions {
    return OneofOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OneofOptions>, I>>(object: I): OneofOptions {
    const message = createBaseOneofOptions();
    message.uninterpretedOption = object.uninterpretedOption?.map((e) => UninterpretedOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseEnumOptions(): EnumOptions {
  return { allowAlias: false, deprecated: false, deprecatedLegacyJsonFieldConflicts: false, uninterpretedOption: [] };
}

export const EnumOptions = {
  fromJSON(object: any): EnumOptions {
    return {
      allowAlias: isSet(object.allowAlias) ? globalThis.Boolean(object.allowAlias) : false,
      deprecated: isSet(object.deprecated) ? globalThis.Boolean(object.deprecated) : false,
      deprecatedLegacyJsonFieldConflicts: isSet(object.deprecatedLegacyJsonFieldConflicts)
        ? globalThis.Boolean(object.deprecatedLegacyJsonFieldConflicts)
        : false,
      uninterpretedOption: globalThis.Array.isArray(object?.uninterpretedOption)
        ? object.uninterpretedOption.map((e: any) => UninterpretedOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: EnumOptions): unknown {
    const obj: any = {};
    if (message.allowAlias !== undefined && message.allowAlias !== false) {
      obj.allowAlias = message.allowAlias;
    }
    if (message.deprecated !== undefined && message.deprecated !== false) {
      obj.deprecated = message.deprecated;
    }
    if (
      message.deprecatedLegacyJsonFieldConflicts !== undefined && message.deprecatedLegacyJsonFieldConflicts !== false
    ) {
      obj.deprecatedLegacyJsonFieldConflicts = message.deprecatedLegacyJsonFieldConflicts;
    }
    if (message.uninterpretedOption?.length) {
      obj.uninterpretedOption = message.uninterpretedOption.map((e) => UninterpretedOption.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnumOptions>, I>>(base?: I): EnumOptions {
    return EnumOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EnumOptions>, I>>(object: I): EnumOptions {
    const message = createBaseEnumOptions();
    message.allowAlias = object.allowAlias ?? false;
    message.deprecated = object.deprecated ?? false;
    message.deprecatedLegacyJsonFieldConflicts = object.deprecatedLegacyJsonFieldConflicts ?? false;
    message.uninterpretedOption = object.uninterpretedOption?.map((e) => UninterpretedOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseEnumValueOptions(): EnumValueOptions {
  return { deprecated: false, uninterpretedOption: [] };
}

export const EnumValueOptions = {
  fromJSON(object: any): EnumValueOptions {
    return {
      deprecated: isSet(object.deprecated) ? globalThis.Boolean(object.deprecated) : false,
      uninterpretedOption: globalThis.Array.isArray(object?.uninterpretedOption)
        ? object.uninterpretedOption.map((e: any) => UninterpretedOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: EnumValueOptions): unknown {
    const obj: any = {};
    if (message.deprecated !== undefined && message.deprecated !== false) {
      obj.deprecated = message.deprecated;
    }
    if (message.uninterpretedOption?.length) {
      obj.uninterpretedOption = message.uninterpretedOption.map((e) => UninterpretedOption.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnumValueOptions>, I>>(base?: I): EnumValueOptions {
    return EnumValueOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EnumValueOptions>, I>>(object: I): EnumValueOptions {
    const message = createBaseEnumValueOptions();
    message.deprecated = object.deprecated ?? false;
    message.uninterpretedOption = object.uninterpretedOption?.map((e) => UninterpretedOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseServiceOptions(): ServiceOptions {
  return { deprecated: false, uninterpretedOption: [] };
}

export const ServiceOptions = {
  fromJSON(object: any): ServiceOptions {
    return {
      deprecated: isSet(object.deprecated) ? globalThis.Boolean(object.deprecated) : false,
      uninterpretedOption: globalThis.Array.isArray(object?.uninterpretedOption)
        ? object.uninterpretedOption.map((e: any) => UninterpretedOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ServiceOptions): unknown {
    const obj: any = {};
    if (message.deprecated !== undefined && message.deprecated !== false) {
      obj.deprecated = message.deprecated;
    }
    if (message.uninterpretedOption?.length) {
      obj.uninterpretedOption = message.uninterpretedOption.map((e) => UninterpretedOption.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServiceOptions>, I>>(base?: I): ServiceOptions {
    return ServiceOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServiceOptions>, I>>(object: I): ServiceOptions {
    const message = createBaseServiceOptions();
    message.deprecated = object.deprecated ?? false;
    message.uninterpretedOption = object.uninterpretedOption?.map((e) => UninterpretedOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMethodOptions(): MethodOptions {
  return { deprecated: false, idempotencyLevel: 0, uninterpretedOption: [] };
}

export const MethodOptions = {
  fromJSON(object: any): MethodOptions {
    return {
      deprecated: isSet(object.deprecated) ? globalThis.Boolean(object.deprecated) : false,
      idempotencyLevel: isSet(object.idempotencyLevel)
        ? methodOptions_IdempotencyLevelFromJSON(object.idempotencyLevel)
        : 0,
      uninterpretedOption: globalThis.Array.isArray(object?.uninterpretedOption)
        ? object.uninterpretedOption.map((e: any) => UninterpretedOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MethodOptions): unknown {
    const obj: any = {};
    if (message.deprecated !== undefined && message.deprecated !== false) {
      obj.deprecated = message.deprecated;
    }
    if (message.idempotencyLevel !== undefined && message.idempotencyLevel !== 0) {
      obj.idempotencyLevel = methodOptions_IdempotencyLevelToJSON(message.idempotencyLevel);
    }
    if (message.uninterpretedOption?.length) {
      obj.uninterpretedOption = message.uninterpretedOption.map((e) => UninterpretedOption.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MethodOptions>, I>>(base?: I): MethodOptions {
    return MethodOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MethodOptions>, I>>(object: I): MethodOptions {
    const message = createBaseMethodOptions();
    message.deprecated = object.deprecated ?? false;
    message.idempotencyLevel = object.idempotencyLevel ?? 0;
    message.uninterpretedOption = object.uninterpretedOption?.map((e) => UninterpretedOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUninterpretedOption(): UninterpretedOption {
  return {
    name: [],
    identifierValue: "",
    positiveIntValue: 0,
    negativeIntValue: 0,
    doubleValue: 0,
    stringValue: new Uint8Array(0),
    aggregateValue: "",
  };
}

export const UninterpretedOption = {
  fromJSON(object: any): UninterpretedOption {
    return {
      name: globalThis.Array.isArray(object?.name)
        ? object.name.map((e: any) => UninterpretedOption_NamePart.fromJSON(e))
        : [],
      identifierValue: isSet(object.identifierValue) ? globalThis.String(object.identifierValue) : "",
      positiveIntValue: isSet(object.positiveIntValue) ? globalThis.Number(object.positiveIntValue) : 0,
      negativeIntValue: isSet(object.negativeIntValue) ? globalThis.Number(object.negativeIntValue) : 0,
      doubleValue: isSet(object.doubleValue) ? globalThis.Number(object.doubleValue) : 0,
      stringValue: isSet(object.stringValue) ? bytesFromBase64(object.stringValue) : new Uint8Array(0),
      aggregateValue: isSet(object.aggregateValue) ? globalThis.String(object.aggregateValue) : "",
    };
  },

  toJSON(message: UninterpretedOption): unknown {
    const obj: any = {};
    if (message.name?.length) {
      obj.name = message.name.map((e) => UninterpretedOption_NamePart.toJSON(e));
    }
    if (message.identifierValue !== undefined && message.identifierValue !== "") {
      obj.identifierValue = message.identifierValue;
    }
    if (message.positiveIntValue !== undefined && message.positiveIntValue !== 0) {
      obj.positiveIntValue = Math.round(message.positiveIntValue);
    }
    if (message.negativeIntValue !== undefined && message.negativeIntValue !== 0) {
      obj.negativeIntValue = Math.round(message.negativeIntValue);
    }
    if (message.doubleValue !== undefined && message.doubleValue !== 0) {
      obj.doubleValue = message.doubleValue;
    }
    if (message.stringValue !== undefined && message.stringValue.length !== 0) {
      obj.stringValue = base64FromBytes(message.stringValue);
    }
    if (message.aggregateValue !== undefined && message.aggregateValue !== "") {
      obj.aggregateValue = message.aggregateValue;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UninterpretedOption>, I>>(base?: I): UninterpretedOption {
    return UninterpretedOption.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UninterpretedOption>, I>>(object: I): UninterpretedOption {
    const message = createBaseUninterpretedOption();
    message.name = object.name?.map((e) => UninterpretedOption_NamePart.fromPartial(e)) || [];
    message.identifierValue = object.identifierValue ?? "";
    message.positiveIntValue = object.positiveIntValue ?? 0;
    message.negativeIntValue = object.negativeIntValue ?? 0;
    message.doubleValue = object.doubleValue ?? 0;
    message.stringValue = object.stringValue ?? new Uint8Array(0);
    message.aggregateValue = object.aggregateValue ?? "";
    return message;
  },
};

function createBaseUninterpretedOption_NamePart(): UninterpretedOption_NamePart {
  return { namePart: "", isExtension: false };
}

export const UninterpretedOption_NamePart = {
  fromJSON(object: any): UninterpretedOption_NamePart {
    return {
      namePart: isSet(object.namePart) ? globalThis.String(object.namePart) : "",
      isExtension: isSet(object.isExtension) ? globalThis.Boolean(object.isExtension) : false,
    };
  },

  toJSON(message: UninterpretedOption_NamePart): unknown {
    const obj: any = {};
    if (message.namePart !== "") {
      obj.namePart = message.namePart;
    }
    if (message.isExtension !== false) {
      obj.isExtension = message.isExtension;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UninterpretedOption_NamePart>, I>>(base?: I): UninterpretedOption_NamePart {
    return UninterpretedOption_NamePart.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UninterpretedOption_NamePart>, I>>(object: I): UninterpretedOption_NamePart {
    const message = createBaseUninterpretedOption_NamePart();
    message.namePart = object.namePart ?? "";
    message.isExtension = object.isExtension ?? false;
    return message;
  },
};

function createBaseSourceCodeInfo(): SourceCodeInfo {
  return { location: [] };
}

export const SourceCodeInfo = {
  fromJSON(object: any): SourceCodeInfo {
    return {
      location: globalThis.Array.isArray(object?.location)
        ? object.location.map((e: any) => SourceCodeInfo_Location.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SourceCodeInfo): unknown {
    const obj: any = {};
    if (message.location?.length) {
      obj.location = message.location.map((e) => SourceCodeInfo_Location.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SourceCodeInfo>, I>>(base?: I): SourceCodeInfo {
    return SourceCodeInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SourceCodeInfo>, I>>(object: I): SourceCodeInfo {
    const message = createBaseSourceCodeInfo();
    message.location = object.location?.map((e) => SourceCodeInfo_Location.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSourceCodeInfo_Location(): SourceCodeInfo_Location {
  return { path: [], span: [], leadingComments: "", trailingComments: "", leadingDetachedComments: [] };
}

export const SourceCodeInfo_Location = {
  fromJSON(object: any): SourceCodeInfo_Location {
    return {
      path: globalThis.Array.isArray(object?.path) ? object.path.map((e: any) => globalThis.Number(e)) : [],
      span: globalThis.Array.isArray(object?.span) ? object.span.map((e: any) => globalThis.Number(e)) : [],
      leadingComments: isSet(object.leadingComments) ? globalThis.String(object.leadingComments) : "",
      trailingComments: isSet(object.trailingComments) ? globalThis.String(object.trailingComments) : "",
      leadingDetachedComments: globalThis.Array.isArray(object?.leadingDetachedComments)
        ? object.leadingDetachedComments.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: SourceCodeInfo_Location): unknown {
    const obj: any = {};
    if (message.path?.length) {
      obj.path = message.path.map((e) => Math.round(e));
    }
    if (message.span?.length) {
      obj.span = message.span.map((e) => Math.round(e));
    }
    if (message.leadingComments !== undefined && message.leadingComments !== "") {
      obj.leadingComments = message.leadingComments;
    }
    if (message.trailingComments !== undefined && message.trailingComments !== "") {
      obj.trailingComments = message.trailingComments;
    }
    if (message.leadingDetachedComments?.length) {
      obj.leadingDetachedComments = message.leadingDetachedComments;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SourceCodeInfo_Location>, I>>(base?: I): SourceCodeInfo_Location {
    return SourceCodeInfo_Location.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SourceCodeInfo_Location>, I>>(object: I): SourceCodeInfo_Location {
    const message = createBaseSourceCodeInfo_Location();
    message.path = object.path?.map((e) => e) || [];
    message.span = object.span?.map((e) => e) || [];
    message.leadingComments = object.leadingComments ?? "";
    message.trailingComments = object.trailingComments ?? "";
    message.leadingDetachedComments = object.leadingDetachedComments?.map((e) => e) || [];
    return message;
  },
};

function createBaseGeneratedCodeInfo(): GeneratedCodeInfo {
  return { annotation: [] };
}

export const GeneratedCodeInfo = {
  fromJSON(object: any): GeneratedCodeInfo {
    return {
      annotation: globalThis.Array.isArray(object?.annotation)
        ? object.annotation.map((e: any) => GeneratedCodeInfo_Annotation.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GeneratedCodeInfo): unknown {
    const obj: any = {};
    if (message.annotation?.length) {
      obj.annotation = message.annotation.map((e) => GeneratedCodeInfo_Annotation.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GeneratedCodeInfo>, I>>(base?: I): GeneratedCodeInfo {
    return GeneratedCodeInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GeneratedCodeInfo>, I>>(object: I): GeneratedCodeInfo {
    const message = createBaseGeneratedCodeInfo();
    message.annotation = object.annotation?.map((e) => GeneratedCodeInfo_Annotation.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGeneratedCodeInfo_Annotation(): GeneratedCodeInfo_Annotation {
  return { path: [], sourceFile: "", begin: 0, end: 0, semantic: 0 };
}

export const GeneratedCodeInfo_Annotation = {
  fromJSON(object: any): GeneratedCodeInfo_Annotation {
    return {
      path: globalThis.Array.isArray(object?.path) ? object.path.map((e: any) => globalThis.Number(e)) : [],
      sourceFile: isSet(object.sourceFile) ? globalThis.String(object.sourceFile) : "",
      begin: isSet(object.begin) ? globalThis.Number(object.begin) : 0,
      end: isSet(object.end) ? globalThis.Number(object.end) : 0,
      semantic: isSet(object.semantic) ? generatedCodeInfo_Annotation_SemanticFromJSON(object.semantic) : 0,
    };
  },

  toJSON(message: GeneratedCodeInfo_Annotation): unknown {
    const obj: any = {};
    if (message.path?.length) {
      obj.path = message.path.map((e) => Math.round(e));
    }
    if (message.sourceFile !== undefined && message.sourceFile !== "") {
      obj.sourceFile = message.sourceFile;
    }
    if (message.begin !== undefined && message.begin !== 0) {
      obj.begin = Math.round(message.begin);
    }
    if (message.end !== undefined && message.end !== 0) {
      obj.end = Math.round(message.end);
    }
    if (message.semantic !== undefined && message.semantic !== 0) {
      obj.semantic = generatedCodeInfo_Annotation_SemanticToJSON(message.semantic);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GeneratedCodeInfo_Annotation>, I>>(base?: I): GeneratedCodeInfo_Annotation {
    return GeneratedCodeInfo_Annotation.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GeneratedCodeInfo_Annotation>, I>>(object: I): GeneratedCodeInfo_Annotation {
    const message = createBaseGeneratedCodeInfo_Annotation();
    message.path = object.path?.map((e) => e) || [];
    message.sourceFile = object.sourceFile ?? "";
    message.begin = object.begin ?? 0;
    message.end = object.end ?? 0;
    message.semantic = object.semantic ?? 0;
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
