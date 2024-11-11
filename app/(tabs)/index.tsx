import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define a Note type
type Note = {
  id: string;
  text: string;
};

export default function App() {
  const [note, setNote] = useState<string>(""); // Note input state
  const [notes, setNotes] = useState<Note[]>([]); // Array of notes

  useEffect(() => {
    loadNotes();
  }, []);

  // Load notes from AsyncStorage
  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem("notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch (error) {
      console.error("Failed to load notes", error);
    }
  };

  // Save notes to AsyncStorage
  const saveNotes = async (newNotes: Note[]) => {
    try {
      await AsyncStorage.setItem("notes", JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (error) {
      console.error("Failed to save notes", error);
    }
  };

  // Add a new note
  const addNote = () => {
    if (note.trim() === "") {
      Alert.alert("Warning", "Note cannot be empty");
      return;
    }

    const newNotes = [...notes, { id: Date.now().toString(), text: note }];
    saveNotes(newNotes);
    setNote("");
  };

  // Delete a note
  const deleteNote = (id: string) => {
    const newNotes = notes.filter((item) => item.id !== id);
    saveNotes(newNotes);
  };

  // Render each note
  const renderNote = ({ item }: { item: Note }) => (
    <View style={styles.note}>
      <Text style={styles.noteText}>{item.text}</Text>
      <TouchableOpacity
        onPress={() => deleteNote(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Note-Taking App</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your note here..."
        value={note}
        onChangeText={(text) => setNote(text)}
      />

      <TouchableOpacity style={styles.addButton} onPress={addNote}>
        <Text style={styles.addButtonText}>Add Note</Text>
      </TouchableOpacity>

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        style={styles.noteList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  noteList: {
    marginTop: 20,
  },
  note: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
  },
  noteText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 5,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
  },
});
