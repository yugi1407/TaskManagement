import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import { auth } from '@/api/firebase';
import { addTask } from '@/utils/store/taskSlice';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = auth().currentUser;
  const userId = user?.uid;

  const submitHandler = () => {
    if (!title.trim()) return;
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const newTask = {
      title,
      description,
      userId,
      dueDate: dueDate ? dueDate.toISOString() : null,
    };

    dispatch(addTask(newTask));
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
      />
      <TextInput
        placeholder="Task Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
      />

      <TouchableOpacity onPress={() => setShowPicker(true)} style={{ marginBottom: 16 }}>
        <Text style={{ color: '#555' }}>
          {dueDate ? `Due Date: ${dueDate.toDateString()}` : 'Select Due Date'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
        onPress={submitHandler}
        style={{ backgroundColor: '#FEC230', padding: 12, borderRadius: 8 }}
      >
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Save Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskForm;
