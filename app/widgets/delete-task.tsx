import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Trash } from "lucide-react";
import { useState } from "react";

export function HapusTask({
  id,
  onTaskDeleted,
}: {
  id: string;
  onTaskDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function deletetask() {
    setIsLoading(true);
    setTimeout(async () => {
      await fetch("/api", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      })
        .then((res) => {
          if (res.status == 200) {
            toast({
              title: "Task deleted!",
            });
            setOpen(false);
            onTaskDeleted();
          } else {
            toast({
              variant: "destructive",
              title: "Failed!",
              description: res.statusText,
            });
          }
        })
        .catch((e) => {
          toast({
            variant: "destructive",
            title: "Failed!",
            description: e,
          });
        });
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          children={<Trash className="w-4" />}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>Are you sure?</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            onClick={() => deletetask()}
          >
            {isLoading ? "Loading.." : "Yes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
