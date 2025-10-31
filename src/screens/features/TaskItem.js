import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

const TaskItem = ({ item, onPress }) => {

  const formattedDateTime = item.dueDate
    ? new Date(item.dueDate).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  return (
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

        {formattedDateTime && (
          <Text style={{ color: '#333', marginTop: 6 }}>
            📅 Due: {formattedDateTime}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TaskItem;
