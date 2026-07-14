import React, { useState } from 'react';
import { View, StyleSheet, Alert, Linking, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Screen, AppText, Button, Card, IconButton, HomewoodImage, EmptyState, Divider } from '../../src/components/ui';
import { MINISTRY_EVENTS } from '../../src/data/homewoodData';
import { useSaved } from '../../src/state/SavedProvider';
import { useRsvp } from '../../src/state/RsvpProvider';
import { useAuth } from '../../src/auth/AuthProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { MinistryEvent } from '../../src/types/homewood';

// TODO(notifications): wire reminders to expo-notifications.
// TODO(wallet): Apple/Google Wallet buttons are intentionally hidden until a
//   real pass-signing service exists (see README wallet setup requirements).

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { profile } = useAuth();
  const { isSaved, toggleSave } = useSaved();
  const { getRsvp, rsvp, cancel, setGuestCount, recordExternalClick, selfConfirmExternal } = useRsvp();
  const [reminding, setReminding] = useState(false);

  const event = MINISTRY_EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        </View>
        <EmptyState icon="calendar-outline" title="Event not found" />
      </Screen>
    );
  }

  const method = event.registrationMethod ?? 'rsvp';
  const saved = isSaved('event', event.id);
  const reg = getRsvp(event.id);
  const going = reg?.status === 'going';

  const when = new Date(event.date);
  const fullDate = when.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const time = when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const endTime = event.endDate ? new Date(event.endDate).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : null;

  const onRemind = () => {
    setReminding((v) => !v);
    Alert.alert(reminding ? 'Reminder removed' : 'Reminder set', reminding ? "We've cleared your reminder." : `We'll remind you before "${event.title}".`);
  };

  const openExternal = () => {
    recordExternalClick(event.id);
    if (event.externalRegistrationUrl) Linking.openURL(event.externalRegistrationUrl);
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <IconButton
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          color={saved ? colors.accent : colors.text}
          onPress={() => toggleSave({ kind: 'event', refId: event.id, title: event.title })}
          accessibilityLabel={saved ? 'Remove from saved' : 'Save event'}
        />
      </View>

      <HomewoodImage name={event.image} height={200} radius={20} overlay={0.35} accessibilityLabel={event.title}>
        <View style={styles.heroInner}>
          <View style={[styles.pill, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
            <AppText variant="overline" weight="bold" style={{ color: palette.white }}>{event.category.toUpperCase()}</AppText>
          </View>
        </View>
      </HomewoodImage>

      <AppText variant="h4" weight="bold" serif style={{ marginTop: 16 }}>{event.title}</AppText>

      <Card style={{ marginTop: 16 }}>
        <DetailRow icon="calendar-outline" text={`${fullDate} · ${time}${endTime ? `–${endTime}` : ''}`} />
        <View style={{ height: 14 }} />
        <DetailRow icon="location-outline" text={event.location} />
        <View style={{ height: 14 }} />
        <DetailRow icon="business-outline" text={event.campus} />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <AppText weight="bold" style={{ marginBottom: 6 }}>About this event</AppText>
        <AppText tone="muted" style={{ lineHeight: 26 }}>{event.description}</AppText>
      </Card>

      {/* ── Registration ─────────────────────────────────────────── */}
      {method === 'rsvp' ? (
        going ? (
          <Ticket
            event={event}
            attendee={profile?.displayName ?? 'Guest'}
            confirmation={reg!.confirmationNumber}
            ticketCode={reg!.ticketCode}
            guestCount={reg!.guestCount}
            fullDate={fullDate}
            time={time}
            endTime={endTime}
            onGuestChange={(n) => setGuestCount(event.id, n)}
            onCancel={() => {
              Alert.alert('Cancel RSVP?', 'This will release your spot.', [
                { text: 'Keep it', style: 'cancel' },
                { text: 'Cancel RSVP', style: 'destructive', onPress: () => cancel(event.id) },
              ]);
            }}
          />
        ) : (
          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <Button label="RSVP" icon="calendar" onPress={() => rsvp(event.id)} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label={reminding ? 'Reminder set' : 'Remind me'} icon={reminding ? 'notifications' : 'notifications-outline'} variant={reminding ? 'secondary' : 'ghost'} onPress={onRemind} />
            </View>
          </View>
        )
      ) : method === 'external' ? (
        <Card style={{ marginTop: 20 }}>
          <View style={styles.extHead}>
            <Ionicons name="open-outline" size={18} color={colors.primary} />
            <AppText weight="bold" style={{ marginLeft: 8 }}>Registration</AppText>
          </View>
          <AppText tone="muted" style={{ marginTop: 6, lineHeight: 24 }}>
            This event is registered on an external site. You’ll leave Homewood Living to complete registration.
          </AppText>
          <View style={{ marginTop: 14 }}>
            <Button label={event.externalRegistrationLabel ?? 'Register externally'} iconRight="open-outline" onPress={openExternal} />
          </View>
          <Divider spacing={14} />
          {reg?.externalSelfConfirmedAt ? (
            <View style={styles.confirmRow}>
              <Ionicons name="checkmark-circle" size={20} color={palette.pine} />
              <AppText weight="semibold" style={{ marginLeft: 8, flex: 1 }}>You marked this as registered</AppText>
              <Pressable onPress={() => selfConfirmExternal(event.id)} hitSlop={8}>
                <AppText variant="caption" style={{ color: colors.link }}>Update</AppText>
              </Pressable>
            </View>
          ) : (
            <Button label="I Registered" icon="checkmark" variant="secondary" onPress={() => selfConfirmExternal(event.id)} />
          )}
          <AppText variant="overline" tone="muted" style={{ marginTop: 8 }}>
            User-confirmed. We don’t verify external registrations, so no Homewood ticket is issued.
          </AppText>
        </Card>
      ) : (
        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <Button label={reminding ? 'Reminder set' : 'Remind me'} icon={reminding ? 'notifications' : 'notifications-outline'} variant={reminding ? 'secondary' : 'primary'} onPress={onRemind} />
          </View>
        </View>
      )}
    </Screen>
  );
}

function DetailRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <AppText weight="medium" style={styles.detailText}>{text}</AppText>
    </View>
  );
}

/** In-app RSVP ticket with a scannable code. Homewood-issued, real confirmation. */
function Ticket({
  event, attendee, confirmation, ticketCode, guestCount, fullDate, time, endTime, onGuestChange, onCancel,
}: {
  event: MinistryEvent; attendee: string; confirmation: string; ticketCode: string; guestCount: number;
  fullDate: string; time: string; endTime: string | null;
  onGuestChange: (n: number) => void; onCancel: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: 20 }}>
      <View style={styles.confirmedBanner}>
        <Ionicons name="checkmark-circle" size={20} color={palette.pine} />
        <AppText weight="bold" style={{ color: palette.pine, marginLeft: 8 }}>You’re going!</AppText>
      </View>

      <View style={[styles.ticket, { borderColor: colors.border }]}>
        <HomewoodImage name={event.image} height={92} accessibilityLabel={event.title} />
        <View style={styles.ticketBody}>
          <AppText variant="overline" weight="bold" style={{ color: palette.brass, letterSpacing: 1 }}>HOMEWOOD LIVING · EVENT TICKET</AppText>
          <AppText variant="h6" weight="bold" serif style={{ marginTop: 4 }} numberOfLines={2}>{event.title}</AppText>
          <View style={styles.ticketMetaGrid}>
            <TicketMeta label="Attendee" value={attendee} />
            <TicketMeta label="Status" value="Confirmed" />
            <TicketMeta label="Date" value={fullDate} />
            <TicketMeta label="Time" value={endTime ? `${time}–${endTime}` : time} />
            <TicketMeta label="Location" value={event.location} />
            <TicketMeta label="Guests" value={String(guestCount)} />
          </View>

          <View style={styles.qrRow}>
            <View style={styles.qrBox}>
              <QRCode value={ticketCode} size={96} color={palette.navy} backgroundColor="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="overline" tone="muted">CONFIRMATION</AppText>
              <AppText weight="bold" style={{ fontSize: 18, letterSpacing: 1 }}>{confirmation}</AppText>
              <AppText variant="overline" tone="muted" style={{ marginTop: 8 }}>
                Show this code at check-in.
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Guests */}
      <View style={styles.guestRow}>
        <AppText weight="semibold">Guests joining you</AppText>
        <View style={styles.stepper}>
          <IconButton icon="remove-circle-outline" onPress={() => onGuestChange(Math.max(0, guestCount - 1))} accessibilityLabel="Fewer guests" />
          <AppText weight="bold" style={{ minWidth: 22, textAlign: 'center' }}>{guestCount}</AppText>
          <IconButton icon="add-circle-outline" onPress={() => onGuestChange(Math.min(4, guestCount + 1))} accessibilityLabel="More guests" />
        </View>
      </View>

      <AppText variant="overline" tone="muted" style={{ marginTop: 12 }}>
        Need to cancel? You can release your spot below. Questions? Contact the Homewood chaplaincy office.
      </AppText>
      <Button label="Cancel RSVP" variant="ghost" icon="close-circle-outline" onPress={onCancel} style={{ marginTop: 10 }} />
    </View>
  );
}

function TicketMeta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.ticketMeta}>
      <AppText variant="overline" tone="muted">{label.toUpperCase()}</AppText>
      <AppText weight="semibold" numberOfLines={1}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 },
  heroInner: { flex: 1, padding: 16, justifyContent: 'flex-start' },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailText: { flex: 1 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  extHead: { flexDirection: 'row', alignItems: 'center' },
  confirmRow: { flexDirection: 'row', alignItems: 'center' },
  confirmedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  ticket: { borderWidth: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  ticketBody: { padding: 16 },
  ticketMetaGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  ticketMeta: { width: '50%', marginBottom: 10, paddingRight: 8 },
  qrRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 6, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#EAE1D0', borderStyle: 'dashed' },
  qrBox: { padding: 8, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#EAE1D0' },
  guestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
