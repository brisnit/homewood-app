import React, { useState, useRef } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, IconButton, Avatar } from '../../src/components/ui';
import { palette } from '../../src/theme/colors';

/**
 * QR scanner. Scans another user's Homewood code (homewood://u/<username>) and
 * opens a friend-request confirmation sheet.
 */
export default function ScanQR() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<string | null>(null);
  const lock = useRef(false);

  const onScan = (result: BarcodeScanningResult) => {
    if (lock.current) return;
    const match = /^homewood:\/\/u\/(.+)$/.exec(result.data.trim());
    if (!match) return; // ignore non-Homewood codes
    lock.current = true;
    setScanned(match[1]);
  };

  const reset = () => {
    lock.current = false;
    setScanned(null);
  };

  const confirmRequest = () => {
    Alert.alert('Friend request sent', `Your request to @${scanned} is on its way.`);
    router.back();
  };

  // Permission gate
  if (!permission) {
    return <View style={styles.black} />;
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.black, styles.center]}>
        <Ionicons name="camera-outline" size={48} color={palette.cream} />
        <AppText tone="inverse" variant="h6" weight="bold" center style={{ marginTop: 16 }}>
          Camera access needed
        </AppText>
        <AppText center style={{ color: '#9AA4B8', marginTop: 8, maxWidth: 280 }}>
          Allow camera access to scan a friend’s QR code and connect.
        </AppText>
        <View style={{ marginTop: 24, width: 240 }}>
          <Button label="Allow camera" onPress={requestPermission} />
          <Button label="Not now" variant="tertiary" onPress={() => router.back()} style={{ marginTop: 4 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.black}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : onScan}
      />

      {/* Overlay */}
      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          <IconButton icon="close" color={palette.cream} onPress={() => router.back()} accessibilityLabel="Close scanner" />
          <AppText tone="inverse" weight="bold">
            Scan QR Code
          </AppText>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.frameWrap}>
          <View style={styles.frame}>
            <Corner pos="tl" />
            <Corner pos="tr" />
            <Corner pos="bl" />
            <Corner pos="br" />
          </View>
          <AppText center style={{ color: '#D7CDBA', marginTop: 20, maxWidth: 280 }}>
            Point your camera at a friend’s Homewood profile code.
          </AppText>
        </View>

        <View style={{ height: 60 }} />
      </SafeAreaView>

      {/* Confirmation sheet */}
      {scanned ? (
        <Pressable style={styles.sheetOverlay} onPress={reset}>
          <View style={styles.sheet}>
            <Avatar name={scanned} size={64} ring />
            <AppText variant="h6" weight="bold" style={{ marginTop: 12 }}>
              @{scanned}
            </AppText>
            <AppText tone="muted" center style={{ marginTop: 4 }}>
              Send a friend request to connect on Homewood Living?
            </AppText>
            <View style={{ marginTop: 18, width: '100%' }}>
              <Button label="Send friend request" icon="person-add-outline" onPress={confirmRequest} />
              <Button label="Scan again" variant="tertiary" onPress={reset} style={{ marginTop: 4 }} />
            </View>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = styles.corner;
  const map = {
    tl: { top: -2, left: -2, borderLeftWidth: 4, borderTopWidth: 4, borderTopLeftRadius: 16 },
    tr: { top: -2, right: -2, borderRightWidth: 4, borderTopWidth: 4, borderTopRightRadius: 16 },
    bl: { bottom: -2, left: -2, borderLeftWidth: 4, borderBottomWidth: 4, borderBottomLeftRadius: 16 },
    br: { bottom: -2, right: -2, borderRightWidth: 4, borderBottomWidth: 4, borderBottomRightRadius: 16 },
  } as const;
  return <View style={[base, map[pos]]} />;
}

const styles = StyleSheet.create({
  black: { flex: 1, backgroundColor: '#000' },
  center: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
  frameWrap: { alignItems: 'center' },
  frame: { width: 240, height: 240, position: 'relative' },
  corner: { position: 'absolute', width: 32, height: 32, borderColor: palette.brass },
  sheetOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: palette.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    alignItems: 'center',
    padding: 24,
    paddingBottom: 40,
  },
});
