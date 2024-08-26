"use client";
import { Button } from "@/components/ui/button";
import { TambahTask } from "../widgets/tambah-task";
import { useEffect, useState } from "react";
import { Delete, Edit, Edit2, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HapusTask } from "../widgets/delete-task";
import ThemeToggle from "../widgets/toggle-theme";
import { EditTask } from "../widgets/edit-task";
import clsx from "clsx";

export interface ITask {
  id: string;
  nama: string;
  status: string;
  tglinput: Date;
  tglupdate: Date;
}

export default function Task() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const fetchTasks = async () => {
    const response = await fetch("/api");
    const data = await response.json();
    setTasks(data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-w-screen p-3 flex flex-col items-center gap-4 mx-auto">
      <ThemeToggle />
      <div className="min-h-10 md:w-full sm:w-[425px] flex justify-center items-center mx-auto">
        <TambahTask onTaskAdded={fetchTasks} />
      </div>

      <ul className="flex flex-col gap-y-2 items-center w-full">
        {tasks.map((task) => (
          <li key={task.id} className="w-[75vh] p-2 border rounded shadow">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col">
                <div className="flex justify-start gap-2">
                  <span className="font-bold">{task.nama}</span>
                </div>

                <div className="text-sm text-gray-600">
                  <Badge
                    variant={
                      task.status == "new"
                        ? "secondary"
                        : task.status == "doing"
                        ? "default"
                        : "success"
                    }
                  >
                    {task.status}
                  </Badge>
                  <p>
                    Created At: {new Date(task.tglinput).toLocaleDateString()}
                  </p>
                  <p>
                    Updated At: {new Date(task.tglupdate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-1">
                <EditTask id={task.id} onTaskEdited={fetchTasks} />
                <HapusTask id={task.id} onTaskDeleted={fetchTasks} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
