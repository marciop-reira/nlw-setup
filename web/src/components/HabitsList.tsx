import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface HabitListProps {
  date: Date;
  onCompletedChanged: (completed: number) => void;
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

export function HabitsList({ date, onCompletedChanged }: HabitListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  useEffect(() => {
    getDayHabits();
  }, []);

  async function getDayHabits() {
    const response = await api.get("day", {
      params: {
        date: date.toISOString()
      }
    });

    setHabitsInfo(response.data);
  }

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  async function handleToogleHabit(habitId: string) {
    await api.patch(`habits/${habitId}/toggle`);

    const isHabitAlreadyCompleted = habitsInfo!.completedHabits?.includes(habitId);
    const completedHabits = isHabitAlreadyCompleted
      ? habitsInfo!.completedHabits.filter(id => id != habitId)
      : [...habitsInfo!.completedHabits, habitId];

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits
    });

    onCompletedChanged(completedHabits.length);
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {
        habitsInfo?.possibleHabits.map(habit => {
          return (
            <Checkbox.Root
              key={habit.id}
              className="flex items-center gap-3 p-0 group focus:outline-none disabled:cursor-not-allowed"
              disabled={isDateInPast}
              checked={habitsInfo.completedHabits?.includes(habit.id)}
              onCheckedChange={() => handleToogleHabit(habit.id)}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>

              <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                {habit.title}
              </span>
            </Checkbox.Root>
          );
        })
      }
    </div>
  );
}