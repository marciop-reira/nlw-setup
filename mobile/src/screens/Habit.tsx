import { useRoute } from "@react-navigation/native";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

interface Params {
  date: string;
}

interface Habit {
  id: string;
  title: string;
  created_at: string;
}

interface HabitsInfo {
  possibleHabits: Habit[],
  completedHabits: string[]
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = habitsInfo?.possibleHabits.length
    ? generateProgressPercentage(habitsInfo.possibleHabits.length, habitsInfo.completedHabits.length)
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);
      const response = await api.get("day", { params: { date } });

      setHabitsInfo(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "Não foi possível obter a lista de hábitos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToogleHabit(habitId: string) {
    try {
      await api.patch(`habits/${habitId}/toggle`);

      const isHabitAlreadyCompleted = habitsInfo!.completedHabits?.includes(habitId);
      const completedHabits = isHabitAlreadyCompleted
        ? habitsInfo!.completedHabits.filter(id => id != habitId)
        : [...habitsInfo!.completedHabits, habitId];

      setHabitsInfo({
        possibleHabits: habitsInfo!.possibleHabits,
        completedHabits
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "Não foi possível atualizar o hábito.");
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base capitalize">
          {dayOfWeek}
        </Text>

        <Text className=" text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6", {
          "opacity-50": isDateInPast
        })}>
          {
            habitsInfo?.possibleHabits.length
              ? habitsInfo.possibleHabits.map(habit => (
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  checked={habitsInfo.completedHabits.includes(habit.id)}
                  onPress={() => handleToogleHabit(habit.id)}
                  disabled={isDateInPast}
                />
              ))
              : <HabitsEmpty />
          }
        </View>

        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              Você não pode editar hábitos de uma data passada.
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}