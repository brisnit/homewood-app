import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Screen, AppText, Card, IconButton, SettingsRow, Divider } from '../../src/components/ui';
import { usePreferences } from '../../src/state/PreferencesProvider';

/** Notification preferences — toggles + quiet hours, persisted. */
export default function NotificationSettings() {
  const router = useRouter();
  const { notifications, setNotification } = usePreferences();

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Back" />
        <AppText variant="h5" weight="bold">
          Notifications
        </AppText>
        <View style={{ width: 30 }} />
      </View>

      <AppText tone="muted" style={{ marginBottom: 16 }}>
        Choose what Homewood Living can remind you about.
      </AppText>

      <Group title="Daily">
        <SettingsRow
          icon="sunny-outline"
          label="Verse of the Day"
          toggle
          toggleValue={notifications.verseOfTheDay}
          onToggle={(v) => setNotification('verseOfTheDay', v)}
        />
        <Divider />
        <SettingsRow
          icon="calendar-outline"
          label="Plan reminders"
          toggle
          toggleValue={notifications.planReminders}
          onToggle={(v) => setNotification('planReminders', v)}
        />
        <Divider />
        <SettingsRow
          icon="flame-outline"
          label="Streak reminders"
          toggle
          toggleValue={notifications.streakReminders}
          onToggle={(v) => setNotification('streakReminders', v)}
        />
      </Group>

      <Group title="Community">
        <SettingsRow
          icon="people-outline"
          label="Friend activity"
          toggle
          toggleValue={notifications.friendActivity}
          onToggle={(v) => setNotification('friendActivity', v)}
        />
      </Group>

      <Group title="Quiet hours">
        <SettingsRow
          icon="moon-outline"
          label="Pause notifications"
          toggle
          toggleValue={notifications.quietHoursEnabled}
          onToggle={(v) => setNotification('quietHoursEnabled', v)}
        />
        {notifications.quietHoursEnabled ? (
          <>
            <Divider />
            <SettingsRow icon="time-outline" label="From" value={formatTime(notifications.quietHoursStart)} />
            <Divider />
            <SettingsRow icon="time-outline" label="Until" value={formatTime(notifications.quietHoursEnd)} />
          </>
        ) : null}
      </Group>

      <AppText variant="overline" tone="muted" center style={{ marginTop: 8 }}>
        We’ll never send notifications during your quiet hours.
      </AppText>
    </Screen>
  );
}

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <AppText variant="overline" weight="bold" tone="muted" style={{ marginBottom: 8, letterSpacing: 1 }}>
        {title.toUpperCase()}
      </AppText>
      <Card>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
});
