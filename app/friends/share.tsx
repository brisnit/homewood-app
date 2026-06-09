import React from 'react';
import { View, StyleSheet, Share as RNShare, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { Screen, AppText, Avatar, Button, IconButton, BrandMark } from '../../src/components/ui';
import { useAuth } from '../../src/auth/AuthProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { palette } from '../../src/theme/colors';
import { DEFAULT_AVATAR } from '../../src/lib/assets';

/** Share Profile: avatar, name, QR that links to the user's profile, share/copy. */
export default function ShareProfile() {
  const router = useRouter();
  const { profile } = useAuth();
  const { colors } = useTheme();

  // Deep link other users can scan. Matches the app scheme in app.json.
  const profileUrl = `homewood://u/${profile?.username ?? 'friend'}`;

  const onShare = async () => {
    try {
      await RNShare.share({
        message: `Add me on Homewood Living Ministries: ${profileUrl}`,
      });
    } catch {
      /* user dismissed */
    }
  };

  const onCopy = () => {
    // TODO(clipboard): use expo-clipboard setStringAsync(profileUrl) once installed.
    Alert.alert('Copied', profileUrl);
  };

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <IconButton icon="close" onPress={() => router.back()} accessibilityLabel="Close" />
        <AppText variant="h5" weight="bold">
          Share Profile
        </AppText>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.body}>
        <View style={[styles.qrCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Avatar name={profile?.displayName ?? 'Friend'} uri={profile?.avatarUrl ?? DEFAULT_AVATAR} size={72} ring />
          <AppText variant="h5" weight="bold" style={{ marginTop: 12 }}>
            {profile?.displayName ?? 'Friend'}
          </AppText>
          <AppText variant="caption" tone="muted">
            @{profile?.username ?? 'friend'}
          </AppText>

          <View style={styles.qrWrap}>
            <QRCode
              value={profileUrl}
              size={196}
              color={palette.navy}
              backgroundColor="#FFFFFF"
              logoBackgroundColor="transparent"
            />
            <View style={styles.qrMark}>
              <BrandMark size={28} color={palette.navy} />
            </View>
          </View>

          <AppText center tone="muted" style={{ marginTop: 16, maxWidth: 240 }}>
            To send a friend request, scan this code.
          </AppText>
        </View>

        <View style={styles.actions}>
          <Button label="Share" icon="share-social-outline" onPress={onShare} />
          <View style={{ height: 10 }} />
          <Button label="Copy link" icon="copy-outline" variant="secondary" onPress={onCopy} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
  body: { flex: 1, justifyContent: 'space-between', paddingBottom: 12 },
  qrCard: { alignItems: 'center', borderRadius: 24, borderWidth: 1, padding: 24, marginTop: 8 },
  qrWrap: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrMark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { marginTop: 20 },
});
