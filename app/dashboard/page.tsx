"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export interface ITask {
  id: string;
  nama: string;
  status: string;
  tglinput: Date;
  tglupdate: Date;
}

export default function DashboardPage() {
  const [done, setDone] = useState<number>(0);
  const [doing, setDoing] = useState<number>(0);
  const [neu, setNeu] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0);

  const [tasks, setTasks] = useState<ITask[]>([]);

  const fetchTasks = async () => {
    const response = await fetch("/api");
    const data = await response.json();
    setTasks(data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const doneCount = tasks.filter((v) => v.status === "done").length;
      setDone(doneCount);

      const doingCount = tasks.filter((v) => v.status === "doing").length;
      setDoing(doingCount);

      const neuCount = tasks.filter((v) => v.status === "new").length;
      setNeu(neuCount);

      setTotalTasks(tasks.length);
    }
  }, [tasks]);

  const donePercentage =
    totalTasks > 0 ? Math.round((done / totalTasks) * 100) : 0;
  const doingPercentage =
    totalTasks > 0 ? Math.round((doing / totalTasks) * 100) : 0;
  const newPercentage =
    totalTasks > 0 ? Math.round((neu / totalTasks) * 100) : 0;

  return (
    <div className="p-2 grid grid-cols-3">
      <Card className="max-w-xs" x-chunk="charts-01-chunk-2">
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid auto-rows-min gap-2">
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {done}
              <span className="text-sm font-normal text-muted-foreground">
                Done ({donePercentage}%)
              </span>
            </div>
            <Progress value={donePercentage} />
          </div>
          <div className="grid auto-rows-min gap-2">
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {doing}
              <span className="text-sm font-normal text-muted-foreground">
                Doing ({doingPercentage}%)
              </span>
            </div>
            <Progress value={doingPercentage} />
          </div>
          <div className="grid auto-rows-min gap-2">
            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {neu}
              <span className="text-sm font-normal text-muted-foreground">
                New ({newPercentage}%)
              </span>
            </div>
            <Progress value={newPercentage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
