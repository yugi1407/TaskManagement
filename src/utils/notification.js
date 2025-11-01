import notifee, { AndroidImportance } from '@notifee/react-native';
import { updateTask } from 'src/api/tasksApi';

export const requestNotificationPermission = async () => {
    try {
        await notifee.requestPermission();
    } catch (e) {
        console.warn('Notification permission error:', e);
    }
};

const createNotificationChannel = async () => {
    return await notifee.createChannel({
        id: 'default',
        name: 'Default Notifications',
        importance: AndroidImportance.HIGH,
    });
};

export const checkAndNotifyDueTasks = async (tasks = []) => {
    if (!tasks || tasks.length === 0) return;

    const now = new Date();
    const channelId = await createNotificationChannel();

    for (const task of tasks) {
        if (!task?.dueDate || task?.notified || task?.completed) continue; 

        const dueDate = new Date(task.dueDate);
        const diffInMinutes = (now - dueDate) / 60000;

        if (diffInMinutes >= 1 && diffInMinutes < 2) {
            await notifee.displayNotification({
                title: '⏰ Task Due!',
                body: `Your task "${task.title}" is due now.`,
                android: { channelId, importance: AndroidImportance.HIGH },
            });

            if (task.id) {
                await updateTask(task.id, { notified: true });
            }

        }
    }
};

export const notifyTaskCompleted = async (task) => {
  if (!task || task.notified || !task.completed) return;

  try {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Notifications',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: '✅ Task Completed!',
      body: `You’ve completed the task "${task.title}". Great job!`,
      android: { channelId, importance: AndroidImportance.HIGH },
    });

    if (task.id) await updateTask(task.id, { notified: true });
  } catch (error) {
    console.warn('Notification error:', error);
  }
};