import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  Field,
  Card,
  Button,
  Avatar,
  Divider,
  IconButton,
} from '../../src/components/ui';
import { SUGGESTED_FRIENDS } from '../../src/data/mockData';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';

/** Friend discovery: search, connect contacts, suggestions, share profile. */
export default function AddFriends() {
  const router = useRouter();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [sent, setSent] = useState<Record<string, boolean>>({});

  const filtered = SUGGESTED_FRIENDS.filter((f) =>
    [f.displayName, f.username].some((s) => s.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Go back" />
        <AppText variant="h5" weight="bold">
          Add Friends
        </AppText>
        <View style={{ width: 30 }} />
      </View>

      <Field
        icon="search-outline"
        placeholder="Search by name, email, or phone"
        autoCapitalize="none"
        value={query}
        onChangeText={setQuery}
      />

      {/* Discovery actions */}
      <View style={{ gap: 10, marginBottom: 8 }}>
        <DiscoveryRow
          icon="people-circle-outline"
          color={palette.pine}
          title="Connect contacts"
          subtitle="Find people you already know"
          onPress={() =>
            Alert.alert('Connect contacts', 'We’ll ask permission to match contacts already on Homewood Living.')
          }
        />
        <DiscoveryRow
          icon="logo-facebook"
          color={palette.slate}
          title="Add Facebook friends"
          subtitle="Coming soon"
          onPress={() => Alert.alert('Coming soon', 'Facebook friend discovery will be available shortly.')}
        />
        <DiscoveryRow
          icon="qr-code-outline"
          color={palette.brass}
          title="Scan a friend’s code"
          subtitle="Open the QR scanner"
          onPress={() => router.push('/friends/scan')}
        />
      </View>

      {/* Suggested friends */}
      <AppText variant="h6" weight="bold" style={{ marginTop: 16, marginBottom: 10 }}>
        Suggested for you
      </AppText>
      <Card>
        {filtered.length === 0 ? (
          <AppText tone="muted" center style={{ paddingVertical: 16 }}>
            No matches for “{query}”.
          </AppText>
        ) : (
          filtered.map((f, i) => (
            <View key={f.id}>
              {i > 0 ? <Divider spacing={4} /> : null}
              <View style={styles.suggestion}>
                <Avatar name={f.displayName} size={46} />
                <View style={{ flex: 1 }}>
                  <AppText weight="semibold">{f.displayName}</AppText>
                  <AppText variant="caption" tone="muted">
                    @{f.username} · {f.mutualFriends} mutual
                  </AppText>
                </View>
                <Button
                  label={sent[f.id] ? 'Requested' : 'Add'}
                  variant={sent[f.id] ? 'secondary' : 'primary'}
                  size="sm"
                  fullWidth={false}
                  onPress={() => setSent((s) => ({ ...s, [f.id]: !s[f.id] }))}
                />
              </View>
            </View>
          ))
        )}
      </Card>

      <View style={{ marginTop: 20 }}>
        <Button
          label="Share My Profile"
          icon="share-social-outline"
          variant="ghost"
          onPress={() => router.push('/friends/share')}
        />
      </View>
    </Screen>
  );
}

function DiscoveryRow({
  icon,
  color,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} padded>
      <View style={styles.discovery}>
        <View style={[styles.discoveryIcon, { backgroundColor: `${color}1A` }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="semibold">{title}</AppText>
          <AppText variant="caption" tone="muted">
            {subtitle}
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#6B7385" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
  discovery: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  discoveryIcon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
});
