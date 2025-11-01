import React, { useState, useCallback, useEffect, useMemo } from "react";
import { View, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Text, BackHandler } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { auth } from "@/api/firebase";
import { firestore } from "@/api/firebase";
import { subscribeToTasks } from "@/utils/store/taskSlice";
import { isAdmin } from "@/utils/constants/user";
import { useTheme } from "@/hooks";
import Header from "@/utils/ui/Header";
import Filter from "src/utils/fllter";
import TaskItem from "./TaskItem";
import EmptyState from "src/utils/ui/EmptyState";

export default function TaskList(props) {
  const { Colors, Layout, Gutters } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const user = auth().currentUser;

  const [selectedFilters, setSelectedFilters] = useState({
    username: "",
    title: "",
    date: "",
  });

  const [users, setUsers] = useState([]);

  console.log("users:", users)
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("users")
      .onSnapshot((snap) => {
        const userList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(userList);
      });

    return () => unsubscribe();
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.navigate("Dashboard");
    return true;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => backHandler.remove();
    }, [handleBackPress])
  );

  useEffect(() => {
    if (route.params?.selectedFilter) {
      const { type, value, userId } = route.params.selectedFilter;
      setSelectedFilters((prev) => ({
        ...prev,
        [type]: value,
        ...(userId ? { userId } : {}),
      }));
    }
  }, [route.params?.selectedFilter]);

  useEffect(() => {
    if (user) {
      const userKey = isAdmin(user) ? "all" : user.uid;
      const unsubscribe = dispatch(subscribeToTasks(userKey));
      return () => unsubscribe && unsubscribe();
    }
  }, [dispatch, user]);

  return (
    <View style={[Layout.absolute, Layout.top0, Layout.bottom0, Layout.left0, Layout.right0, { backgroundColor: Colors.white }]}>
      <Header headerName="Task List" onPress={handleBackPress} />

      <View style={[{ backgroundColor: Colors.white }, Gutters.microMargin]}>
        <FilterSection
          tasks={tasks}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          users={users}
          isAdmin={isAdmin(user)}
        />
      </View>

      <TaskScroll
        key="TaskScroll"
        props={props}
        navigation={navigation}
        tasks={tasks}
        selectedFilters={selectedFilters}
        loading={loading}
      />
    </View>
  );
}

const FilterSection = ({ tasks, selectedFilters, setSelectedFilters, users, isAdmin }) => {
  const { Fonts, Gutters, Colors } = useTheme();

  const { titles } = useMemo(() => {
    const usernamesSet = new Set();
    const titlesSet = new Set();
    tasks.forEach((t) => {
      if (t.userName) usernamesSet.add(t.userName);
      if (t.title) titlesSet.add(t.title);
    });
    return {
      usernames: Array.from(usernamesSet),
      titles: Array.from(titlesSet),
    };
  }, [tasks]);

  return (
    <View style={[Gutters.tinyTMargin, Gutters.defLMargin]}>
      <Filter
        users={users}
        titles={titles}
        isAdmin={isAdmin}
        onDateSelect={(date) =>
          setSelectedFilters((prev) => ({ ...prev, date }))
        }
      />
    </View>
  );
};

const TaskScroll = ({ navigation, tasks, selectedFilters, loading }) => {
  const { Colors, Fonts, Layout, Gutters } = useTheme();

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchUser =
        !selectedFilters.userId || t.userId === selectedFilters.userId; 
      const matchTitle =
        !selectedFilters.title || t.title === selectedFilters.title;
      const matchDate =
        !selectedFilters.date ||
        (t.dueDate &&
          new Date(t.dueDate).toLocaleDateString() ===
          new Date(selectedFilters.date).toLocaleDateString());
      return matchUser && matchTitle && matchDate;
    });
  }, [tasks, selectedFilters]);

  if (loading) {
    return (
      <View style={[Layout.center, Layout.fill]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderEmptyState = () => {
    if (filteredTasks.length === 0) {
      return (
        <View style={[Layout.center, Layout.fill]}>
          <EmptyState
            message="No tasks found"
            des="Change filters or add new task to get started"
          />
          <View style={[Gutters.defTMargin]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TaskForm')}
              style={[{ borderRadius: 50, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
              Gutters.defPadding, Gutters.lmicroBPadding, Gutters.lmicroTPadding]}
            >
              <Text style={[Fonts.ltiny, Fonts.fw500, { color: Colors.white }]}>
                + Add Task
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={[Layout.fill]}>
      {filteredTasks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              onPress={() =>
                navigation.navigate("TaskDetail", { task: item })
              }
            />
          )}
        />
      )}

      <View style={[Gutters.defPadding]}>
        <TouchableOpacity style={[Gutters.tinyPadding, Gutters.microBRadius, { backgroundColor: Colors.primary, width: "100%" }]}
          onPress={() => navigation.navigate("TaskForm")}
        >
          <Text style={[Fonts.fw600, Fonts.center, { color: Colors.white }]}>+ Add Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
