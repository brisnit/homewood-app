/**
 * Homewood image registry — the single swap point for imagery.
 * These are tasteful placeholder photos (Bible study, prayer, chapel, community,
 * peaceful settings). Replace the files in assets/images/ with real Homewood
 * photography later; keys stay the same so no screen code changes.
 */
import { ImageSourcePropType } from 'react-native';

export type ImageKey =
  | 'scripture' // hands holding an open Bible
  | 'chapel' // stained-glass sanctuary interior
  | 'prayer' // arms raised at sunrise
  | 'worship' // hands raised in worship
  | 'community' // small group of people together
  | 'support' // two hands reaching toward each other
  | 'peaceful' // calm, bright arched corridor
  | 'nature' // quiet forest path/bridge
  | 'sanctuary' // domed worship architecture
  | 'portrait' // friendly community-member portrait
  | 'gathering' // large gathering / event hall
  | 'hope' // silhouette at sunset
  | 'children'; // families / next generation

export const IMAGES: Record<ImageKey, ImageSourcePropType> = {
  scripture: require('../../assets/images/scripture.jpg'),
  chapel: require('../../assets/images/chapel.jpg'),
  prayer: require('../../assets/images/prayer.jpg'),
  worship: require('../../assets/images/worship.jpg'),
  community: require('../../assets/images/community.jpg'),
  support: require('../../assets/images/support.jpg'),
  peaceful: require('../../assets/images/peaceful.jpg'),
  nature: require('../../assets/images/nature.jpg'),
  sanctuary: require('../../assets/images/sanctuary.jpg'),
  portrait: require('../../assets/images/portrait.jpg'),
  gathering: require('../../assets/images/gathering.jpg'),
  hope: require('../../assets/images/hope.jpg'),
  children: require('../../assets/images/children.jpg'),
};

export function getImage(key: ImageKey): ImageSourcePropType {
  return IMAGES[key];
}
