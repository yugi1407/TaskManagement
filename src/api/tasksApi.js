import { firestore } from './firebase';

const tasksCollection = firestore().collection('tasks');

export const createTask = async (task) => {
    const newTask = {
        title: task.title,
        description: task.description || '',
        userId: task.userId,
        completed: false,
        dueDate: task.dueDate || null, 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const docRef = await tasksCollection.add(newTask);
    return { id: docRef.id, ...newTask };
};

export const listenToTasks = (userId, callback) => {
    return tasksCollection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
            (snapshot) => {
                if (!snapshot || !snapshot.docs) {
                    console.warn('⚠️ Firestore snapshot is null — skipping');
                    return;
                }
                const tasks = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                callback(tasks);
            },
            (error) => {
                console.error('🔥 Firestore listen error:', error);
            }
        );
};

export const updateTask = async (taskId, updates) => {
    await tasksCollection.doc(taskId).update({
        ...updates,
        updatedAt: new Date().toISOString(),
    });
};

export const deleteTask = async (taskId) => {
    await tasksCollection.doc(taskId).delete();
};
