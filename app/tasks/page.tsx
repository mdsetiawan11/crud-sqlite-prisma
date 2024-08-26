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
import { DataTable } from "./data-table";
import { columns } from "./columns";

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
    <div className="p-4 flex flex-col gap-4">
      <TambahTask onTaskAdded={fetchTasks} />

      <DataTable
        columns={columns({
          onTaskEdited: fetchTasks,
          onTaskDeleted: fetchTasks,
        })}
        data={tasks}
      />
    </div>
  );
}
