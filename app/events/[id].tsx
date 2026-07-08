import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, Button, Card, IconButton, HomewoodImage, EmptyState } from '../../src/components/ui';
import { MINISTRY_EVENTS } from '../../src/data/homewoodData';
import { useSaved } from '../../src/state/SavedProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

// TODO(api): wire RSVP + calendar reminder to a real backend / expo-notifications.

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { isSaved, toggleSave } = useSaved();
  const [going, setGoing] = useState(false);
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

  const saved = isSaved('event', event.id);

  const when = new Date(event.date);
  const fullDate = when.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const time = when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  const onRsvp = () => {
    const next = !going;
    setGoing(next);
    if (next) {
      Alert.alert("You're going", `We've saved your RSVP for "${event.title}".`);
    } else {
      Alert.alert('RSVP cancelled', "We've removed your RSVP.");
    }
  };

  const onRemind = () => {
    const next = !reminding;
    setReminding(next);
    if (next) {
      Alert.alert('Reminder set', `We'll remind you before "${event.title}".`);
    } else {
      Alert.alert('Reminder removed', "We've cleared your reminder.");
    }
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
            <AppText variant="overline" weight="bold" style={{ color: palette.white }}>
              {event.category.toUpperCase()}
            </AppText>
          </View>
        </View>
      </HomewoodImage>

      <AppText variant="h4" weight="bold" serif style={{ marginTop: 16 }}>{event.title}</AppText>

      <Card style={{ marginTop: 16 }}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <AppText weight="medium" style={styles.detailText}>{fullDate} · {time}</AppText>
        </View>
        <View style={[styles.detailRow, { marginTop: 14 }]}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <AppText weight="medium" style={styles.detailText}>{event.location}</AppText>
        </View>
        <View style={[styles.detailRow, { marginTop: 14 }]}>
          <Ionicons name="business-outline" size={20} color={colors.primary} />
          <AppText weight="medium" style={styles.detailText}>{event.campus}</AppText>
        </View>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <AppText weight="bold" style={{ marginBottom: 6 }}>About this event</AppText>
        <AppText tone="muted" style={{ lineHeight: 26 }}>{event.description}</AppText>
      </Card>

      <View style={styles.actions}>
        <View style={{ flex: 1 }}>
          <Button
            label={going ? "You're going ✓" : 'RSVP'}
            icon={going ? 'checkmark-circle' : 'calendar'}
            variant={going ? 'secondary' : 'primary'}
            onPress={onRsvp}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            label={reminding ? 'Reminder set' : 'Remind me'}
            icon={reminding ? 'notifications' : 'notifications-outline'}
            variant={reminding ? 'secondary' : 'ghost'}
            onPress={onRemind}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 },
  heroInner: { flex: 1, padding: 16, justifyContent: 'flex-start' },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailText: { flex: 1 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
});
