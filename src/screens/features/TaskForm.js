import React, { useEffect, useState, useMemo } from "react";
import { View, TextInput, TouchableOpacity, Text, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { firestore } from "@/api/firebase";
import { addTask } from "@/utils/store/taskSlice";

const TaskForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: null,
    selectedUser: null,
  });

  const [ui, setUi] = useState({
    showDatePicker: false,
    showTimePicker: false,
    search: "",
  });

  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .onSnapshot((snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    return unsubscribe;
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.username?.toLowerCase().includes(ui.search.toLowerCase())
    );
  }, [users, ui.search]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUiChange = (key, value) => {
    setUi((prev) => ({ ...prev, [key]: value }));
  };

  const onDateChange = (event, selectedDate) => {
    handleUiChange("showDatePicker", false);
    if (selectedDate) {
      handleChange("dueDate", new Date(selectedDate));
      handleUiChange("showTimePicker", true);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    handleUiChange("showTimePicker", false);
    if (selectedTime) {
      const newDate = new Date(form.dueDate || new Date());
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      handleChange("dueDate", newDate);
    }
  };

  const submitHandler = () => {
    const { title, description, dueDate, selectedUser } = form;
    if (!title.trim()) return alert("Enter task title");
    if (!selectedUser) return alert("Select a user to assign");
    if (!dueDate) return alert("Select a due date & time");

    const newTask = {
      title,
      description,
      userId: selectedUser.id,
      userName: selectedUser.username,
      dueDate: dueDate.toISOString(),
      createdAt: new Date().toISOString(),
    };

    dispatch(addTask(newTask));
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Task Title"
        value={form.title}
        onChangeText={(text) => handleChange("title", text)}
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
      />

      <TextInput
        placeholder="Task Description"
        value={form.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
        style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
      />

      <TextInput
        placeholder="Search User"
        value={ui.search}
        onChangeText={(text) => handleUiChange("search", text)}
        style={{ borderBottomWidth: 1, marginBottom: 8, padding: 8 }}
      />

      {filteredUsers.length > 0 && (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 8,
                backgroundColor:
                  form.selectedUser?.id === item.id ? "#FEC230" : "#eee",
                borderRadius: 6,
                marginBottom: 4,
              }}
              onPress={() => handleChange("selectedUser", item)}
            >
              <Text>{item.username}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => handleUiChange("showDatePicker", true)}
        style={{ marginVertical: 16 }}
      >
        <Text>
          {form.dueDate
            ? `📅 ${form.dueDate.toLocaleDateString()} 🕒 ${form.dueDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Select Due Date & Time"}
        </Text>
      </TouchableOpacity>

      {ui.showDatePicker && (
        <DateTimePicker
          value={form.dueDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {ui.showTimePicker && (
        <DateTimePicker
          value={form.dueDate || new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      <TouchableOpacity
        onPress={submitHandler}
        style={{ backgroundColor: "#FEC230", padding: 12, borderRadius: 8 }}
      >
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>Save Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskForm;
