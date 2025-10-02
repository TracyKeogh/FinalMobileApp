import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { Plus } from 'lucide-react-native';

const PRESET_ACTIONS = [
  'Sleep',
  'Morning routine',
  'Workout',
  'Work',
  'Meeting',
  'Lunch',
  'Break',
  'Study',
  'Commute',
  'Dinner',
  'Family time',
  'Hobbies',
  'Reading',
];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const period = hour < 12 ? 'AM' : 'PM';
  return {
    hour,
    label: `${displayHour}${period}`,
  };
});

export default function DiaryScreen() {
  const [timeSlots, setTimeSlots] = useState<{ [key: number]: string }>({});
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const updateTimeSlot = (hour: number, value: string) => {
    setTimeSlots({ ...timeSlots, [hour]: value });
  };

  const selectPreset = (action: string) => {
    if (selectedHour !== null) {
      updateTimeSlot(selectedHour, action);
      setShowPresets(false);
      setSelectedHour(null);
    }
  };

  const openPresetPicker = (hour: number) => {
    setSelectedHour(hour);
    setShowPresets(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.paper}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Diary</Text>
          <Text style={styles.headerDate}>{today}</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {TIME_SLOTS.map((slot) => {
            const value = timeSlots[slot.hour] || '';

            return (
              <View key={slot.hour} style={styles.row}>
                <Text style={styles.time}>{slot.label}</Text>
                <View style={styles.line} />
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={(text) => updateTimeSlot(slot.hour, text)}
                  placeholder=""
                  placeholderTextColor="#d1d5db"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => openPresetPicker(slot.hour)}>
                  <Plus size={18} color="#9ca3af" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <Modal
        visible={showPresets}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPresets(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Action</Text>
            <ScrollView style={styles.presetsList}>
              {PRESET_ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action}
                  style={styles.presetItem}
                  onPress={() => selectPreset(action)}>
                  <Text style={styles.presetItemText}>{action}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setShowPresets(false);
                setSelectedHour(null);
              }}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e5db',
  },
  paper: {
    flex: 1,
    backgroundColor: '#fffef7',
    marginTop: 50,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#2c2c2c',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: '#2c2c2c',
    marginBottom: 8,
    fontFamily: 'serif',
  },
  headerDate: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'serif',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 30,
    paddingTop: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    width: 45,
    fontFamily: 'serif',
  },
  line: {
    width: 1,
    height: 20,
    backgroundColor: '#d1d5db',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2c2c2c',
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    fontFamily: 'serif',
  },
  addButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  presetsList: {
    maxHeight: 400,
  },
  presetItem: {
    backgroundColor: '#f9fafb',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  presetItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  modalCancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
});
