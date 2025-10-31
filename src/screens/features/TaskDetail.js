import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { editTask, removeTask } from "@/utils/store/taskSlice";

const TaskDetail = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { task } = params;
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formattedDateTime = useMemo(() => {
    if (!form.dueDate) return "Select Due Date & Time";
    return form.dueDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [form.dueDate]);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      setForm((prev) => ({ ...prev, dueDate: newDate }));
      setShowTimePicker(true); 
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(form.dueDate || new Date());
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setForm((prev) => ({ ...prev, dueDate: newDate }));
    }
  };

  const handleUpdate = () => {
    dispatch(
      editTask({
        id: task.id,
        updates: {
          title: form.title,
          description: form.description,
          dueDate: form.dueDate ? form.dueDate.toISOString() : null,
        },
      })
    );
    navigation.goBack();
  };

  const toggleCompletion = () => {
    dispatch(editTask({ id: task.id, updates: { completed: !task.completed } }));
    navigation.goBack();
  };

  const handleDelete = () => {
    dispatch(removeTask(task.id));
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Task Details
      </Text>

      <Text style={{ fontSize: 16, color: "#555", marginBottom: 10 }}>
        👤 Assigned to:{" "}
        <Text style={{ fontWeight: "bold" }}>
          {task.userName || "Unassigned"}
        </Text>
      </Text>

      {/* Title */}
      <TextInput
        value={form.title}
        onChangeText={(title) => setForm((p) => ({ ...p, title }))}
        placeholder="Task Title"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      />

      {/* Description */}
      <TextInput
        value={form.description}
        onChangeText={(description) => setForm((p) => ({ ...p, description }))}
        placeholder="Task Description"
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
          height: 80,
        }}
      />

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: form.dueDate ? "#000" : "#999" }}>
          📅 {formattedDateTime}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={form.dueDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={form.dueDate || new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "#4CAF50",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
        onPress={handleUpdate}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Update Task</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#FEC230",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
        onPress={toggleCompletion}
      >
        <Text style={{ textAlign: "center" }}>
          {task.completed ? "Mark Incomplete" : "Mark Complete"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#e74c3c",
          padding: 10,
          borderRadius: 8,
        }}
        onPress={handleDelete}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Delete Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskDetail;
