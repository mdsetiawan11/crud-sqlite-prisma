import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const task = await prisma.task.findUnique({
      where: { id: id },
    });

    if (task) {
      return NextResponse.json({ task });
    } else {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
  } else {
    const tasks = await prisma.task.findMany({});
    return NextResponse.json({ tasks });
  }
};

export const POST = async (req: NextRequest) => {
  const { nama, tglupdate } = await req.json();
  console.log(nama, tglupdate);

  const task = await prisma.task.create({
    data: {
      nama,
      tglupdate,
    },
  });

  return NextResponse.json({
    task,
  });
};

export const PUT = async (req: NextRequest) => {
  const { id, nama, tglupdate, status } = await req.json();
  console.log(id, nama, tglupdate);

  const task = await prisma.task.update({
    where: { id: id },
    data: {
      nama,
      tglupdate,
      status,
    },
  });

  return NextResponse.json({ task });
};

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();
  console.log(id);

  const task = await prisma.task.delete({ where: { id: id } });

  return NextResponse.json({
    task,
  });
};
