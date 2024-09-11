export type TypedObjectFromEnum<T extends string | number, K> = {
  [key in T]: K
}
