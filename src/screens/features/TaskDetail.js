import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from "@react-navigation/native";
import { editTask, removeTask } from '@/utils/store/taskSlice';

const TaskDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { task } = route.params;
  console.log("task:",task)
  const dispatch = useDispatch();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUpdate = () => {
    dispatch(editTask({
      id: task.id,
      updates: {
        title,
        description,
        dueDate: dueDate ? dueDate.toISOString() : null,
      },
    }));
    navigation.goBack();
  };

  const toggleCompletion = () => {
    dispatch(editTask({ id: task.id, updates: { completed: !task.completed } }));
    navigation.goBack();
  };

  const deleteHandler = () => {
    dispatch(removeTask(task.id));
    navigation.goBack();
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDueDate(selectedDate);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        Task Details
      </Text>

      {/* Assigned user (non-editable) */}
      <Text style={{ fontSize: 16, color: '#555', marginBottom: 10 }}>
        👤 Assigned to: <Text style={{ fontWeight: 'bold' }}>{task.userName || 'Unassigned'}</Text>
      </Text>

      {/* Title */}
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Task Title"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      />

      {/* Description */}
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Task Description"
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
          height: 80,
        }}
      />

      {/* Due Date Picker */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: dueDate ? '#000' : '#999' }}>
          {dueDate ? `📅 ${dueDate.toDateString()}` : 'Select Due Date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* Update Button */}
      <TouchableOpacity
        style={{ backgroundColor: '#4CAF50', padding: 10, borderRadius: 8, marginBottom: 10 }}
        onPress={handleUpdate}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Update Task</Text>
      </TouchableOpacity>

      {/* Complete/Incomplete Button */}
      <TouchableOpacity
        style={{ backgroundColor: '#FEC230', padding: 10, borderRadius: 8, marginBottom: 10 }}
        onPress={toggleCompletion}
      >
        <Text style={{ textAlign: 'center' }}>
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={{ backgroundColor: '#e74c3c', padding: 10, borderRadius: 8 }}
        onPress={deleteHandler}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Delete Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskDetail;
