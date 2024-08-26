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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  nama: z.string().min(1, {
    message: "Task cannot empty.",
  }),
});

export function TambahTask({ onTaskAdded }: { onTaskAdded: () => void }) {
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: values.nama,
          tglupdate: new Date(),
        }),
      })
        .then((res) => {
          if (res.status == 200) {
            toast({
              title: "Task created!",
            });
            form.reset();
            setIsOpen(false);
            onTaskAdded();
          }
        })
        .catch((e) => {
          console.log(e);
        });

      setIsLoading(false);
      console.log(values);
    }, 1000);
  }
  return (
    <Drawer
      open={isOpen}
      onClose={() => {
        form.reset();
        setIsOpen(false);
      }}
    >
      <DrawerTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="w-20">
          Add Task
        </Button>
      </DrawerTrigger>
      <DrawerContent>
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
              </div>
              <DrawerFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading.." : "Submit"}
                </Button>
                <DrawerClose asChild>
                  <Button onClick={() => setIsOpen(false)} variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
