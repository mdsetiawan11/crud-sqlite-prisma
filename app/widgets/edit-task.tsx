"use client";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { revalidatePath } from "next/cache";
import { Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  nama: z.string().min(1, {
    message: "Task cannot empty.",
  }),
  status: z.enum(["new", "doing", "done"], {
    required_error: "You need to select a status",
  }),
});

export interface ITask {
  id: string;
  nama: string;
  status: string;
  tglinput: Date;
  tglupdate: Date;
}

export function EditTask({
  onTaskEdited,
  id,
}: {
  onTaskEdited: () => void;
  id: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTimeout(async () => {
      await fetch("/api", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          nama: values.nama,
          tglupdate: new Date(),
          status: values.status,
        }),
      })
        .then((res) => {
          if (res.status == 200) {
            toast({
              title: "Task Edited!",
            });
            form.reset();
            setIsOpen(false);
            onTaskEdited();
          }
        })
        .catch((e) => {
          console.log(e);
        });

      setIsLoading(false);
      console.log(values);
    }, 1000);
  }

  const [task, setTask] = useState<ITask>();
  const fetchTaskById = async () => {
    const response = await fetch(`/api?id=${id}`);
    const data = await response.json();
    if (data.task) {
      setTask(data.task);
      form.setValue("nama", data.task.nama);
      form.setValue("status", data.task.status);
    } else {
      console.error("Task not found");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTaskById();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          children={<Edit className="w-4" />}
        />
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="mx-auto w-full max-w-sm">
              <div className="p-0 pb-0">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task</FormLabel>
                      <FormControl>
                        <Input placeholder="task to do" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-row space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="new" />
                            </FormControl>
                            <FormLabel className="font-normal">New</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="doing" />
                            </FormControl>
                            <FormLabel className="font-normal">Doing</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="done" />
                            </FormControl>
                            <FormLabel className="font-normal">Done</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="pt-5">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading.." : "Submit"}
                </Button>
                <DialogClose asChild>
                  <Button onClick={() => setIsOpen(false)} variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
