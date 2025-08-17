import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger
} from "@/components/ui/dialog";

function InquiryPage() {

    
  const [name, setName] = useState("");

  return (
    <div className="min-h-svh bg-background text-foreground p-6">
      <div className="mx-auto max-w-md space-y-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Hello shadcn/ui</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="block text-sm space-y-1">
              <span>Your name</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Taro Yamada"
              />
            </label>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Greet</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Greeting</DialogTitle>
                  <DialogDescription>
                    Nice to meet you{ name ? `, ${name}` : "" }!
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InquiryPage
