import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth } from "@/api/firebase";
import { notifyTaskCompleted } from '@/utils/notification';
import Header from "@/utils/ui/Header";
import Input from "@/utils/ui/input";
import DatePicker from "@/utils/ui/DatePicker";
import { isAdmin } from "@/utils/constants/user";
import GradientText from '@/utils/ui/Gradient.js'
import LinearGradient from 'react-native-linear-gradient';
import { editTask, removeTask } from "@/utils/store/taskSlice";
import { useTheme } from "@/hooks";
import {
  isValidTitle,
  isValidDescription,
  isValidDueDate,
} from "src/utils/functions";

const TaskDetail = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { params } = useRoute();
  const { task } = params;
  const { Fonts, Gutters, Colors, Layout } = useTheme();
  const user = auth().currentUser;

  const IsAdmin = isAdmin(user)

  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    let errorMsg = "";
    if (key === "title") errorMsg = isValidTitle(value);
    if (key === "description") errorMsg = isValidDescription(value);
    if (key === "dueDate") errorMsg = isValidDueDate(value);

    setErrors((prev) => ({ ...prev, [key]: errorMsg }));
  };

  const handleUpdate = () => {
    const titleError = isValidTitle(form.title);
    const descError = isValidDescription(form.description);
    const dateError = isValidDueDate(form.dueDate);

    if (titleError || descError || dateError) {
      setErrors({
        title: titleError,
        description: descError,
        dueDate: dateError,
      });
      return;
    }

    dispatch(
      editTask({
        id: task.id,
        updates: {
          title: form.title.trim(),
          description: form.description.trim(),
          dueDate: form.dueDate ? form.dueDate.toISOString() : null,
        },
      })
    );
    navigation.goBack();
  };

  const handleToggleComplete = async () => {
    const updatedTask = { ...task, completed: !task.completed };
    dispatch(editTask({ id: task.id, updates: { completed: updatedTask.completed } }));

    if (updatedTask.completed && !task.notified) {
      await notifyTaskCompleted(updatedTask);
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    dispatch(removeTask(task.id));
    navigation.goBack();
  };

  const Label = ({ text }) => (
    <Text style={[Fonts.small, Fonts.fw600, Gutters.lmicroBMargin, { color: Colors.text }]}>{text} </Text>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgcolor }}>
      <Header headerName="Task Details" />

      <ScrollView
        style={[Gutters.defPadding, { marginBottom: 90 }]}
        showsVerticalScrollIndicator={false}
      >

        <GradientText text={task.userName || "Unassigned"} gradientDirection='diagonalTLBR' fontSize={20} gradientColors={[Colors.primary, '#FEC230']} svgHeight={40} fontFamily={Fonts.semibold.fontFamily} />

        <Label text="Task Name" />
        <Input
          placeholder="Task Title"
          value={form.title}
          onChangeText={(title) => handleChange("title", title)}
          showError={!!errors.title}
          errorMessage={errors.title}
        />

        <Label text="Description" />
        <Input
          placeholder="Task Description"
          value={form.description}
          onChangeText={(description) =>
            handleChange("description", description)
          }
          multiline
          height={70}
          showError={!!errors.description}
          errorMessage={errors.description}
        />

        <Label text="Due Date" />
        <DatePicker
          label="Select Date & Time"
          value={form.dueDate}
          onChange={(date) => handleChange("dueDate", date)}
          error={errors.dueDate}
        />
        {IsAdmin &&
          < View style={[Layout.row, Layout.fill, Gutters.defTMargin, Gutters.defTMargin, Layout.center, Gutters.regularBMargin]}>
            <TouchableOpacity style={[Layout.fill, { marginRight: 8 }]} onPress={handleToggleComplete}>
              <LinearGradient
                colors={['#FFF9B4', '#C5AB4E']}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[Gutters.microBRadius, Layout.center, Layout.fill, { padding: 2 }]}>
                <Text style={[Fonts.ltiny, Fonts.center, Fonts.fw600, Layout.fill, Gutters.smallHPadding, Gutters.tinyVPadding, Gutters.microBRadius, { color: "#F3D26C", width: '100%', backgroundColor: Colors.primary }]}>{task.completed ? "Mark Incomplete" : "Mark Complete"}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={[Layout.fill, { marginLeft: 8 }]} onPress={handleDelete}>
              <LinearGradient
                colors={['#FFE1A6', '#D3A851']}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[Gutters.microBRadius, Layout.center, Layout.fill, Gutters.tinyVPadding,]}>
                <Text style={[Fonts.ltiny, Fonts.center, Fonts.fw600, Fonts.white]}>Delete Task</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
      </ScrollView >

      <View style={[Gutters.defPadding, { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: Colors.white }]}>
        <TouchableOpacity style={[Gutters.tinyPadding, Gutters.microBRadius,
        { backgroundColor: Colors.primary, width: "100%", }]}
          onPress={IsAdmin ? handleUpdate : handleToggleComplete}
        >
          <Text
            style={[Fonts.fw600, Fonts.center, { color: Colors.white }]}
          >
            {IsAdmin ? 'Update Task' : task.completed ? "Mark Incomplete" : "Mark Complete"}
          </Text>
        </TouchableOpacity>
      </View>
    </View >
  );
};

export default TaskDetail;
