import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Plus } from 'lucide-react-native';

export default function SimpleDiary() {
  const [entries, setEntries] = useState<{ [key: string]: string }>({});
  const [showPresets, setShowPresets] = useState<string | null>(null);
  
  // These would come from user's custom presets in the web app
  const presets = [
    'Feed Brian',
    'Take medication',
    'Walk dog',
    'Check email',
    'Lunch break',
    'Team standup'
  ];

  const times = [
    '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
    '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM',
    '7PM', '8PM', '9PM', '10PM', '11PM'
  ];

  const addPreset = (time: string, slot: number, preset: string) => {
    setEntries((prev: { [key: string]: string }) => ({
      ...prev,
      [`${time}-${slot}`]: preset
    }));
    setShowPresets(null);
  };

  const updateEntry = (time: string, slot: number, value: string) => {
    setEntries((prev: { [key: string]: string }) => ({
      ...prev,
      [`${time}-${slot}`]: value
    }));
  };

  const Slot = ({ time, slot }: { time: string; slot: number }) => {
    const key = `${time}-${slot}`;
    const value = entries[key];

    return (
      <View style={styles.slotContainer}>
        <TextInput
          style={styles.slotInput}
          value={value || ''}
          onChangeText={(text: string) => updateEntry(time, slot, text)}
          placeholder="Type here"
          placeholderTextColor="#d1d5db"
        />
        <View style={styles.presetButtonContainer}>
          <TouchableOpacity
            onPress={() => setShowPresets(showPresets === key ? null : key)}
            style={styles.presetButton}
          >
            <Plus size={16} color="#9ca3af" />
          </TouchableOpacity>
          {showPresets === key && (
            <View style={styles.presetDropdown}>
              {presets.map((preset, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => addPreset(time, slot, preset)}
                  style={styles.presetItem}
                >
                  <Text style={styles.presetItemText}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.maxWidth}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </Text>
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
                  <Slot time={time} slot={1} />
                  <Slot time={time} slot={2} />
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
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerDate: {
    fontSize: 32,
    fontWeight: '300',
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
    width: 64,
    paddingTop: 16,
    paddingLeft: 20,
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  slotsContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 20,
  },
  slotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  slotInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  presetButtonContainer: {
    position: 'relative',
    marginLeft: 8,
  },
  presetButton: {
    padding: 4,
    borderRadius: 4,
  },
  presetDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
    width: 192,
  },
  presetItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  presetItemText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'left',
  },
});
