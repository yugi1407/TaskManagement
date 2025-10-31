import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from "@react-navigation/native";
import { editTask, removeTask } from '@/utils/store/taskSlice';

const TaskDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { task } = route.params;
  const dispatch = useDispatch();

  const toggleCompletion = () => {
    dispatch(editTask({ id: task.id, updates: { completed: !task.completed } }));
    navigation.goBack();
  };

  const deleteHandler = () => {
    dispatch(removeTask(task.id));
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{task.title}</Text>
      <Text style={{ marginVertical: 10 }}>{task.description}</Text>

      {task.dueDate && (
        <Text style={{ fontSize: 16, marginBottom: 20 }}>
          📅 Due Date: {new Date(task.dueDate).toDateString()}
        </Text>
      )}

      <TouchableOpacity
        style={{ backgroundColor: '#FEC230', padding: 10, borderRadius: 8, marginBottom: 10 }}
        onPress={toggleCompletion}
      >
        <Text>{task.completed ? 'Mark Incomplete' : 'Mark Complete'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: '#e74c3c', padding: 10, borderRadius: 8 }}
        onPress={deleteHandler}
      >
        <Text style={{ color: '#fff' }}>Delete Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskDetail;
