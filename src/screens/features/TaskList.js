import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '@/api/firebase';
import { useNavigation } from "@react-navigation/native";
import { subscribeToTasks } from '@/utils/store/taskSlice';
import TaskItem from './TaskItem';

const TaskList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  console.log("tasks:",tasks)
  const user = auth().currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (userId) {
      const unsubscribe = dispatch(subscribeToTasks(userId));
      return () => unsubscribe && unsubscribe();
    }
  }, [dispatch, userId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {tasks.length === 0 ? (
        <Text>No tasks found.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem item={item} onPress={() => navigation.navigate('TaskDetail', { task: item })} />
          )}
        />
      )}

      <TouchableOpacity
        style={{
          backgroundColor: '#FEC230',
          padding: 12,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('TaskForm')}
      >
        <Text style={{ fontWeight: '600', color: '#000' }}>+ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskList;
