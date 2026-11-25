export type SharedAssetCollection = 'atoms' | 'molecules' | 'organisms' | 'layouts';

export function componentAsset(
  collection: SharedAssetCollection,
  component: string,
  file: string,
): string {
  return `assets/${collection}/${component}/assets/${file}`;
}
