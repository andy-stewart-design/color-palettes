"use client";

import { Trigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ds";

export default function ExportTrigger() {
  return (
    <Trigger asChild>
      <Button>Export Colors</Button>
    </Trigger>
  );
}
