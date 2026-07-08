/**
 * Role-based access scaffolding. Auth is mocked for MVP, but content and
 * navigation can already respect roles. Swap `useRole()` for real claims later.
 */
import { UserRole } from '../types/models';

export const ROLES: { key: UserRole; label: string; blurb: string }[] = [
  { key: 'resident', label: 'Resident', blurb: 'Daily Bible reading, courses, events, prayer & media.' },
  { key: 'employee', label: 'Employee', blurb: 'Resident support, training, and internal resources.' },
  { key: 'community', label: 'Community Member', blurb: 'Public teaching, events, and selected resources.' },
];

/** Feature areas that can be gated by role. */
export type Capability =
  | 'daily-bible'
  | 'plans'
  | 'study-bible'
  | 'resources'
  | 'media'
  | 'events'
  | 'photos'
  | 'courses'
  | 'prayer'
  | 'resident-support'
  | 'training'
  | 'internal-resources';

const MATRIX: Record<UserRole, Capability[]> = {
  resident: ['daily-bible', 'plans', 'study-bible', 'resources', 'media', 'events', 'photos', 'courses', 'prayer'],
  employee: ['daily-bible', 'plans', 'study-bible', 'resources', 'media', 'events', 'photos', 'courses', 'prayer', 'resident-support', 'training', 'internal-resources'],
  community: ['daily-bible', 'plans', 'study-bible', 'media', 'events', 'photos'],
};

export function can(role: UserRole, capability: Capability): boolean {
  return MATRIX[role].includes(capability);
}

/** Filter a list of items that carry optional `roles` visibility. */
export function visibleTo<T extends { roles?: UserRole[] }>(items: T[], role: UserRole): T[] {
  return items.filter((i) => !i.roles || i.roles.includes(role));
}

/** A short, role-aware welcome line for the Home screen. */
export function roleGreeting(role: UserRole): string {
  switch (role) {
    case 'employee':
      return 'Thank you for serving faithfully today.';
    case 'community':
      return 'We’re glad you’re part of the Homewood family.';
    case 'resident':
    default:
      return 'May today’s time in the Word bless you.';
  }
}
