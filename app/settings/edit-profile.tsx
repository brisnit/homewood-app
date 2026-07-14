import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Screen, AppText, Avatar, Field, Button, IconButton, Divider, Chip } from '../../src/components/ui';
import { useAuth } from '../../src/auth/AuthProvider';
import { useTheme } from '../../src/theme/ThemeProvider';
import { DEFAULT_AVATAR } from '../../src/lib/assets';
import { fonts } from '../../src/theme/typography';
import { palette } from '../../src/theme/colors';
import { NO_OUTLINE } from '../../src/lib/style';
import { ChurchStatus } from '../../src/types/models';

const STATEMENT_MAX = 150;

const CHURCH_CHOICES: { key: ChurchStatus; label: string }[] = [
  { key: 'yes', label: 'Yes' },
  { key: 'not-currently', label: 'Not currently' },
  { key: 'exploring', label: 'I’m exploring' },
  { key: 'prefer-not', label: 'Prefer not to say' },
];

/** Edit profile: photo, display name, username, and personal statement. */
export default function EditProfile() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const { colors } = useTheme();

  const [name, setName] = useState(profile?.displayName ?? '');
  const [username, setUsername] = useState(profile?.username ?? '');
  const [statement, setStatement] = useState(profile?.personalStatement ?? '');
  const [churchStatus, setChurchStatus] = useState<ChurchStatus | null>(profile?.churchStatus ?? null);
  const [churchName, setChurchName] = useState(profile?.churchName ?? '');
  const [photo, setPhoto] = useState<string | null>(null); // newly picked photo uri
  const [error, setError] = useState<string | null>(null);

  // Current avatar to preview: newly picked > saved > bundled default.
  const avatarSource = photo ?? profile?.avatarUrl ?? DEFAULT_AVATAR;

  const changePhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to change your picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const onSave = () => {
    const cleanName = name.trim();
    const cleanUser = username.trim().replace(/^@+/, '').replace(/\s+/g, '');
    if (!cleanName) return setError('Please enter your name.');
    if (!cleanUser) return setError('Please choose a username.');

    updateProfile({
      displayName: cleanName,
      username: cleanUser,
      personalStatement: statement.trim() || null,
      churchStatus,
      churchName: churchStatus === 'yes' ? churchName.trim() || null : null,
      ...(photo ? { avatarUrl: photo } : {}),
    });
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} accessibilityLabel="Cancel" />
        <AppText variant="h5" weight="bold">
          Edit Profile
        </AppText>
        <Pressable onPress={onSave} hitSlop={8}>
          <AppText weight="bold" style={{ color: colors.link }}>
            Save
          </AppText>
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Photo */}
        <View style={styles.photoBlock}>
          <Pressable onPress={changePhoto} accessibilityRole="button" accessibilityLabel="Change photo">
            <Avatar name={name || 'Friend'} uri={avatarSource} size={96} ring />
            <View style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </View>
          </Pressable>
          <Pressable onPress={changePhoto} hitSlop={8} style={{ marginTop: 10 }}>
            <AppText weight="semibold" style={{ color: colors.link }}>
              Change photo
            </AppText>
          </Pressable>
        </View>

        <Divider spacing={8} />

        {/* Fields */}
        <View style={{ marginTop: 8 }}>
          <Field label="Display name" icon="person-outline" placeholder="Your name" value={name} onChangeText={setName} />
          <Field
            label="Username"
            icon="at-outline"
            placeholder="username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            error={error ?? undefined}
          />

          <AppText variant="caption" weight="semibold" style={{ marginBottom: 6 }}>
            Personal statement
          </AppText>
          <View style={[styles.statementBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <TextInput
              value={statement}
              onChangeText={(t) => setStatement(t.slice(0, STATEMENT_MAX))}
              placeholder="Share a verse, a hope, or a word about your journey…"
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              style={[styles.statementInput, { color: colors.text, fontFamily: fonts.regular }, NO_OUTLINE]}
            />
          </View>
          <AppText variant="overline" tone="muted" style={{ alignSelf: 'flex-end', marginTop: 4 }}>
            {statement.length}/{STATEMENT_MAX}
          </AppText>
        </View>

        {/* Church connection (optional, private) */}
        <Divider spacing={12} />
        <View>
          <AppText variant="caption" weight="semibold" style={{ marginBottom: 2 }}>
            Are you connected to a local church?
          </AppText>
          <AppText variant="overline" tone="muted" style={{ marginBottom: 10 }}>
            Optional and private — never shown to other members.
          </AppText>
          <View style={styles.churchChips}>
            {CHURCH_CHOICES.map((c) => (
              <Chip
                key={c.key}
                label={c.label}
                accent="navy"
                selected={churchStatus === c.key}
                onPress={() => setChurchStatus(churchStatus === c.key ? null : c.key)}
              />
            ))}
          </View>
          {churchStatus === 'yes' ? (
            <View style={{ marginTop: 12 }}>
              <Field
                label="Church community"
                icon="business-outline"
                placeholder="Church name (optional)"
                value={churchName}
                onChangeText={setChurchName}
              />
            </View>
          ) : null}
        </View>

        <View style={{ marginTop: 16 }}>
          <Button label="Save changes" icon="checkmark" onPress={onSave} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 },
  photoBlock: { alignItems: 'center', marginBottom: 12 },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statementBox: { borderWidth: 1.5, borderRadius: 14, padding: 12, minHeight: 96 },
  statementInput: { fontSize: 16, minHeight: 72 },
  churchChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
