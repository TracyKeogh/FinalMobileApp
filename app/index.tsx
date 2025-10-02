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
    const key = `${time}-${slot}`;
    setEntries((prev: { [key: string]: string }) => {
      if (prev[key] === value) return prev; // Avoid unnecessary re-renders
      return {
        ...prev,
        [key]: value
      };
    });
  };

  const Slot = ({ time, slot }: { time: string; slot: number }) => {
    const key = `${time}-${slot}`;
    const value = entries[key] || '';

    return (
      <View style={styles.slotContainer}>
        <TextInput
          style={styles.slotInput}
          value={value}
          onChangeText={(text: string) => updateEntry(time, slot, text)}
          placeholder="Type here"
          placeholderTextColor="#d1d5db"
          multiline={true}
          textAlignVertical="top"
          blurOnSubmit={false}
          returnKeyType="default"
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
                  style={[
                    styles.presetItem,
                    idx === presets.length - 1 && styles.presetItemLast
                  ]}
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
    maxWidth: 384, // max-w-sm = 384px
    alignSelf: 'center',
    width: '100%',
  },
  header: {
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
    textAlignVertical: 'top',
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
});
