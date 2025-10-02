import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useCallback, useRef, memo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

export default function SimpleDiary() {
  const { user, loading, signOut } = useAuth();
  const [entries, setEntries] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/signin');
    }
  }, [user, loading]);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/signin');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  const times = [
    '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
    '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM',
    '7PM', '8PM', '9PM', '10PM', '11PM'
  ];

  const updateEntry = useCallback((key: string, value: string) => {
    setEntries((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const Slot = memo(({ time, slot, initialValue, onUpdate }: { 
    time: string; 
    slot: number; 
    initialValue: string;
    onUpdate: (key: string, text: string) => void;
  }) => {
    const key = `${time}-${slot}`;
    const inputRef = useRef<TextInput>(null);
    const [currentText, setCurrentText] = useState(initialValue);

    const handleTextChange = (text: string) => {
      setCurrentText(text);
    };

    const handleBlur = () => {
      onUpdate(key, currentText);
    };

    return (
      <View style={styles.slotContainer}>
        <TextInput
          ref={inputRef}
          style={styles.slotInput}
          value={currentText}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          placeholder="Type here"
          placeholderTextColor="#d1d5db"
          autoCorrect={false}
          autoCapitalize="none"
          multiline={false}
          underlineColorAndroid="transparent"
          selectionColor="transparent"
          textAlignVertical="center"
        />
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.maxWidth}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Entries */}
        <ScrollView style={styles.entriesContainer}>
          {times.map((time) => (
            <View key={time} style={styles.timeRow}>
              <View style={styles.timeRowContent}>
                <View style={styles.timeLabel}>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
                <View style={styles.slotsContainer}>
                  <Slot 
                    time={time} 
                    slot={1} 
                    initialValue={entries[`${time}-1`] || ''} 
                    onUpdate={updateEntry}
                  />
                  <Slot 
                    time={time} 
                    slot={2} 
                    initialValue={entries[`${time}-2`] || ''} 
                    onUpdate={updateEntry}
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  maxWidth: {
    flex: 1,
    maxWidth: 384, // max-w-sm = 384px
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, // px-5 = 20px
    paddingVertical: 24, // py-6 = 24px
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerDate: {
    fontSize: 24, // text-2xl = 24px
    fontWeight: '300', // font-light = 300
    color: '#000000',
  },
  entriesContainer: {
    flex: 1,
  },
  timeRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  timeRowContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeLabel: {
    width: 64, // w-16 = 64px
    paddingTop: 16, // pt-4 = 16px
    paddingLeft: 20, // pl-5 = 20px
  },
  timeText: {
    fontSize: 12, // text-xs = 12px
    color: '#9ca3af', // text-gray-400
  },
  slotsContainer: {
    flex: 1,
    paddingVertical: 12, // py-3 = 12px
    paddingRight: 20, // pr-5 = 20px
  },
  slotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // py-2 = 8px
  },
  slotInput: {
    flex: 1,
    fontSize: 14, // text-sm = 14px
    color: '#000000',
    paddingVertical: 4,
    paddingHorizontal: 0,
    minHeight: 20,
    borderWidth: 0,
    backgroundColor: 'transparent',
    outlineStyle: 'none',
    // outline-none equivalent (no border/outline)
  },
  presetButtonContainer: {
    position: 'relative',
    marginLeft: 8, // gap-2 equivalent
  },
  presetButton: {
    padding: 4, // p-1 = 4px
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  presetButtonHover: {
    backgroundColor: '#f3f4f6', // hover:bg-gray-100
  },
  presetDropdown: {
    position: 'absolute',
    top: '100%', // top-full
    right: 0, // right-0
    marginTop: 4, // mt-1 = 4px
    backgroundColor: '#ffffff', // bg-white
    borderWidth: 1, // border
    borderColor: '#d1d5db',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // shadow-lg
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10, // z-10
    width: 192, // w-48 = 192px
  },
  presetItem: {
    paddingVertical: 8, // py-2 = 8px
    paddingHorizontal: 12, // px-3 = 12px
    borderBottomWidth: 1, // border-b
    borderBottomColor: '#e5e7eb',
  },
  presetItemLast: {
    borderBottomWidth: 0, // last:border-b-0
  },
  presetItemHover: {
    backgroundColor: '#f9fafb', // hover:bg-gray-50
  },
  presetItemText: {
    fontSize: 14, // text-sm = 14px
    color: '#000000',
    textAlign: 'left',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  signOutText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});
