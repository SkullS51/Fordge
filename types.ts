
export interface Artwork {
  id: string;
  title: string;
  image: string;
  price: string;
  creator: string;
  genre: string;
}

export interface LyricResult {
  title: string;
  lyrics: string;
  genre: string;
}

export interface CodeForgeOutput {
  code: string;
  explanation: string;
  htmlPreview?: string; // Optional HTML preview for UI components
}

export enum StudioMode {
  PAINT = 'PAINT',
  LYRICS = 'LYRICS',
  MARKET = 'MARKET',
  CODE_FORGE = 'CODE_FORGE' // New mode for code generation
}