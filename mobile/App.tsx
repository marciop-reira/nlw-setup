import "./src/lib/dayjs";

import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold, useFonts
} from '@expo-google-fonts/inter';
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import { StatusBar } from 'react-native';
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });

  async function scheduleNotification() {
    const trigger = new Date(Date.now());
    trigger.setSeconds(trigger.getSeconds() + 1);
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Habit",
        body: "Você abriu o app!"
      },
      trigger
    });
  }

  async function getScheduledNotifications() {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log(notifications);
  }

  useEffect(() => {
    scheduleNotification();
  }, []);

  if (!fontsLoaded) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    </>
  );
}