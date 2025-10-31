import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { auth, firestore } from "@/api/firebase";
import { addTask } from "@/utils/store/taskSlice";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .onSnapshot((snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(list);
      });
    return unsubscribe;
  }, []);

  const submitHandler = () => {
    if (!title.trim()) return alert("Enter title");
    if (!selectedUser) return alert("Select a user to assign");

    const newTask = {
      title,
      description,
      userId: selectedUser.id, 
      userName: selectedUser.username,
      dueDate: dueDate ? dueDate.toISOString() : null,
    };

    dispatch(addTask(newTask));
    navigation.goBack();
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

//   console.log("selectedUser.username:",selectedUser.username)

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

      {/* ✅ Assign to user */}
      <TextInput
        placeholder="Search User"
        value={search}
        onChangeText={setSearch}
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
                backgroundColor: selectedUser?.id === item.id ? "#FEC230" : "#eee",
                borderRadius: 6,
                marginBottom: 4,
              }}
              onPress={() => setSelectedUser(item)}
            >
              <Text>{item.username}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity onPress={() => setShowPicker(true)} style={{ marginVertical: 16 }}>
        <Text>{dueDate ? `📅 ${dueDate.toDateString()}` : "Select Due Date"}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setDueDate(date);
          }}
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
