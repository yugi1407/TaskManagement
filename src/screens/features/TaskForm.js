import React, { useEffect, useState, useMemo } from "react";
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from "react-native";
import DatePicker from "@/utils/ui/DatePicker";
import Header from "@/utils/ui/Header";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { firestore } from "@/api/firebase";
import Input from "@/utils/ui/input";
import SearchBar from "src/utils/ui/SearchBar";
import { useTheme } from "@/hooks";
import { addTask } from "@/utils/store/taskSlice";
import { isValidTitle, isValidDescription, isValidUser, isValidDueDate } from "src/utils/functions";

const TaskForm = () => {
  const { Fonts, Gutters, Layout, Colors } = useTheme();
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

  const [errors, setErrors] = useState({});
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

    let errorMsg = "";
    if (key === "title") errorMsg = isValidTitle(value);
    if (key === "description") errorMsg = isValidDescription(value);
    if (key === "dueDate") errorMsg = isValidDueDate(value);
    if (key === "selectedUser") errorMsg = isValidUser(value);

    setErrors((prev) => ({ ...prev, [key]: errorMsg }));
  };

  const handleUiChange = (key, value) => {
    setUi((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid =
    !isValidTitle(form.title) &&
    !isValidDescription(form.description) &&
    !isValidDueDate(form.dueDate) &&
    !isValidUser(form.selectedUser);

  const submitHandler = () => {
    if (!isFormValid) return;

    const { title, description, dueDate, selectedUser } = form;

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

  const LabelText = ({ text }) => (
    <Text style={[Fonts.regular, Fonts.fw600, Gutters.lmicroBMargin, {color:Colors.text}]}>{text} </Text>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bgcolor }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header headerName="Add Task" />
      <View style={{ flex: 1, padding: 20 }}>

        <LabelText text="Assign To" />

        <SearchBar
          data={filteredUsers}
          value={ui.search}
          onChangeText={(text) => {
            handleUiChange("search", text);
            handleChange("selectedUser", null);
          }}
          onSelectItem={(item) => {
            handleChange("selectedUser", item);
            handleUiChange("search", item.username);
          }}
          selectedItem={form.selectedUser}
          displayKey="username"
          placeholder="Search Users..."
          errorMessage={errors.selectedUser}
        />

        <LabelText text="Task Name" />

        <Input
          placeholder="Task Title"
          value={form.title}
          onChangeText={(text) => handleChange("title", text)}
          showError={!!errors.title}
          errorMessage={errors.title}
        />

        <LabelText text="Description" />

        <Input
          placeholder="Task Description"
          value={form.description}
          onChangeText={(text) => handleChange("description", text)}
          multiline={true}
          height={70}
          showError={!!errors.description}
          errorMessage={errors.description}
        />

        <LabelText text="Date & Time" />

        <DatePicker
          value={form.dueDate}
          onChange={(date) => handleChange("dueDate", date)}
          error={errors.dueDate}
          label="Select Due Date & Time"
        />

      </View>

      <View style={[Gutters.defPadding]}>
        <TouchableOpacity style={[Gutters.tinyPadding, Gutters.microBRadius, { backgroundColor: isFormValid ? Colors.primary : "#f5c3f5ff", width: "100%" }]}
          onPress={submitHandler} disabled={!isFormValid}
        >
          <Text style={[Fonts.fw600, Fonts.center, { color: Colors.white }]}>
            Create Task
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TaskForm;
