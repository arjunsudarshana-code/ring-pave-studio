export interface PlacedGem {
  id: string;
  position: [number, number, number];
  normal: [number, number, number];
  size: number;
}

export type ProfileShape = 'comfort' | 'flat' | 'knife';
export type MetalType = 'yellow' | 'rose' | 'platinum';
export type PaveModeType = 'manual' | 'array';