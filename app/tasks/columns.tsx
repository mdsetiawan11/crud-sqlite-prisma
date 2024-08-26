"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import Moment from "moment";
import { EditTask } from "../widgets/edit-task";
import { HapusTask } from "../widgets/delete-task";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ITask = {
  id: string;
  nama: string;
  status: string;
  tglinput: Date;
  tglupdate: Date;
};

export const columns: (props: {
  onTaskEdited: () => void;
  onTaskDeleted: () => void;
}) => ColumnDef<ITask>[] = ({ onTaskEdited, onTaskDeleted }) => [
  {
    accessorKey: "nama",
    header: "Task",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const task = row.original;

      return (
        <Badge
          className={clsx(
            "inline-flex items-center rounded-md px-2 py-1 text-xs",
            {
              "bg-gray-800 dark:text-white": task.status === "new",
              "bg-yellow-800 text-white": task.status === "doing",
              "bg-green-800  text-white ": task.status === "done",
            }
          )}
        >
          {task.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "tglinput",
    header: "Created At",
    cell: ({ row }) => {
      Moment.locale("en");
      const { tglinput } = row.original;
      return Moment(tglinput).format("Do MMMM YYYY, h:mm:ss");
    },
  },
  {
    accessorKey: "tglupdate",
    header: "Updated At",
    cell: ({ row }) => {
      Moment.locale("en");
      const { tglupdate } = row.original;
      return Moment(tglupdate).format("Do MMMM YYYY, h:mm:ss");
    },
  },
  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;

      return (
        <div className="flex flex-row justify-start gap-2">
          <EditTask
            id={task.id}
            onTaskEdited={onTaskEdited} // Panggil fetchTasks setelah edit
          />
          <HapusTask
            id={task.id}
            onTaskDeleted={onTaskDeleted} // Panggil fetchTasks setelah delete
          />
        </div>
      );
    },
  },
];
