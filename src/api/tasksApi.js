import { firestore, auth } from './firebase';

const tasksCollection = firestore().collection('tasks');

export const createTask = async (task) => {
    const newTask = {
        title: task.title,
        description: task.description || '',
        userId: task.userId,
        userName: task.userName,
        completed: false,
        notified: false,
        dueDate: task.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const docRef = await tasksCollection.add(newTask);
    await docRef.update({ id: docRef.id });

    return { id: docRef.id, ...newTask };
};


export const listenToTasks = (userId, callback) => {
    let query = tasksCollection.orderBy('createdAt', 'desc');

    if (userId !== 'all') {
        query = query.where('userId', '==', userId);
    }

    return query.onSnapshot(
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


export const getUsername = async () => {
    try {
        const currentUser = auth().currentUser;
        if (!currentUser) return null;

        const userDoc = await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get();

        if (userDoc.exists) {
            const data = userDoc.data();
            return data.username || null;
        } else {
            console.warn('⚠️ No user document found for:', currentUser.uid);
            return null;
        }
    } catch (error) {
        console.error('Error fetching username:', error);
        return null;
    }
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
