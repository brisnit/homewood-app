import { Platform } from 'react-native';

/**
 * Removes the browser focus outline that web shows on a focused TextInput
 * (the stroke that appears while writing). No-op on native.
 */
export const NO_OUTLINE = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null;
