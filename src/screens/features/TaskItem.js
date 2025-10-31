import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

const TaskItem = ({ item, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      padding: 16,
      backgroundColor: item.completed ? '#d4edda' : '#f8d7da',
      borderRadius: 10,
      marginBottom: 10,
    }}
  >
    <View>
       <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.userName}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
      <Text style={{ color: '#555' }}>{item.description}</Text>
      {item.dueDate && (
        <Text style={{ color: '#333', marginTop: 6 }}>
          📅 Due: {new Date(item.dueDate).toDateString()}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

export default TaskItem;
