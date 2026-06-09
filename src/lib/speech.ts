import * as Speech from 'expo-speech';

export interface SimpleVoice {
  id: string;
  name: string;
  language: string;
}

/**
 * Loads available voices, preferring English. On web the voice list loads
 * asynchronously, so we retry briefly if it comes back empty.
 */
export async function getEnglishVoices(): Promise<SimpleVoice[]> {
  let voices = await Speech.getAvailableVoicesAsync();
  for (let i = 0; i < 6 && voices.length === 0; i++) {
    await new Promise((r) => setTimeout(r, 250));
    voices = await Speech.getAvailableVoicesAsync();
  }
  const english = voices.filter((v) => (v.language || '').toLowerCase().startsWith('en'));
  const source = english.length ? english : voices;
  const seen = new Set<string>();
  return source
    .map((v) => ({ id: v.identifier, name: v.name || v.identifier, language: v.language || '' }))
    .filter((v) => (seen.has(v.id) ? false : (seen.add(v.id), true)));
}

/** A short, friendly label for a voice (strips noisy vendor prefixes). */
export function voiceLabel(v: SimpleVoice): string {
  return v.name.replace(/^(com\.apple\.[^.]+\.)/i, '').replace(/_/g, ' ');
}
