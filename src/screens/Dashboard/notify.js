import React, { useEffect, useRef } from 'react';
import { requestNotificationPermission, checkAndNotifyDueTasks } from '@/utils/notification';

export const useTaskNotificationChecker = (tasks) => {
  const latestTasks = useRef(tasks);
  useEffect(() => {
    latestTasks.current = tasks;
  }, [tasks]);

  useEffect(() => {
    let intervalId;

    const startChecking = async () => {
      await requestNotificationPermission();
      checkAndNotifyDueTasks(latestTasks.current);
      intervalId = setInterval(() => {
        checkAndNotifyDueTasks(latestTasks.current);
      }, 60000);
    };

    startChecking();

    return () => clearInterval(intervalId);
  }, []); 
};
