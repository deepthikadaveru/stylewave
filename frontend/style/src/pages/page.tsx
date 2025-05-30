// app/page.tsx
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar isToggled={isToggled} setIsToggled={setIsToggled} />
      <main className="p-6">
        <Card className="max-w-md mx-auto shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Toggle State</h2>
            <p>The toggle is <strong>{isToggled ? "ON" : "OFF"}</strong>.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
