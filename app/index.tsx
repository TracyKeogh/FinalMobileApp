import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useCallback, memo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

export default function DailyPlanner() {
  const { user, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth');
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }
  const [entries, setEntries] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const times = [
    '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
    '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM',
    '7PM', '8PM', '9PM', '10PM', '11PM'
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      // For now, just load empty entries
      setLoading(false);
    } catch (error) {
      console.error('Error loading entries:', error);
      setLoading(false);
    }
  };

  const updateEntry = useCallback((blockId: string, value: string) => {
    setEntries((prev) => ({
      ...prev,
      [blockId]: value
    }));
  }, []);

  const saveEntries = async () => {
    setSaving(true);
    try {
      // For now, just simulate saving
      console.log('Saving entries:', entries);
      // TODO: Add Supabase saving back when auth is working
    } catch (error) {
      console.error('Error saving entries:', error);
    } finally {
      setSaving(false);
    }
  };

  const TimeSlot = memo(({ slot }: { slot: { id: string; time: string; hour: number; placeholder: string } }) => {
    const [currentText, setCurrentText] = useState(entries[slot.id] || '');

    const handleTextChange = (text: string) => {
      setCurrentText(text);
      updateEntry(slot.id, text);
    };

    return (
      <View style={styles.timeSlot}>
        <Text style={styles.timeLabel}>{slot.time}</Text>
        <TextInput
          style={styles.slotInput}
          value={currentText}
          onChangeText={handleTextChange}
          placeholder={slot.placeholder}
          placeholderTextColor="#9ca3af"
          multiline={false}
          autoCorrect={false}
          selectionColor="#3b82f6"
        />
      </View>
    );
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerDate}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Slots */}
        <View style={styles.slotsContainer}>
          {timeSlots.map((slot) => (
            <TimeSlot key={slot.id} slot={slot} />
          ))}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
          onPress={saveEntries}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for save button
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerDate: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  signOutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  slotsContainer: {
    padding: 20,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    width: 80,
    textAlign: 'left',
  },
  slotInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  saveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34, // Account for home indicator
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});