"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Phone,
  Mail,
  Lock,
  Bell,
  MessageSquare,
  Globe,
  Map,
  Moon,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DriverSettingsPage() {
  const [name, setName] = useState("Adebayo Ogundimu");
  const [phone, setPhone] = useState("+2348012345678");
  const [email, setEmail] = useState("adebayo@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pushNewJob, setPushNewJob] = useState(true);
  const [pushJobUpdated, setPushJobUpdated] = useState(true);
  const [pushPayout, setPushPayout] = useState(true);
  const [smsNewJob, setSmsNewJob] = useState(false);
  const [smsJobUpdated, setSmsJobUpdated] = useState(true);
  const [smsPayout, setSmsPayout] = useState(false);

  const [language, setLanguage] = useState("English");
  const [mapProvider, setMapProvider] = useState<"google" | "apple">("google");
  const [darkMode, setDarkMode] = useState(false);

  function getPasswordStrength(pw: string): { label: string; pct: number; color: string } {
    if (!pw) return { label: "", pct: 0, color: "bg-gray-200" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", pct: 25, color: "bg-red-500" };
    if (score === 2) return { label: "Fair", pct: 50, color: "bg-amber-500" };
    if (score === 3) return { label: "Good", pct: 75, color: "bg-blue-500" };
    return { label: "Strong", pct: 100, color: "bg-emerald-500" };
  }

  const strength = getPasswordStrength(newPassword);

  function Toggle({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
  }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
          checked ? "bg-emerald-500" : "bg-gray-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-0"
          )}
        />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Personal Info
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-xs">
                    <User className="h-3.5 w-3.5" /> Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-xs">
                    <Phone className="h-3.5 w-3.5" /> Phone
                  </Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-xs">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <Button className="w-full" size="lg">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Change Password
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-xs">
                    <Lock className="h-3.5 w-3.5" /> Current Password
                  </Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-xs">
                    <Lock className="h-3.5 w-3.5" /> New Password
                  </Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11"
                  />
                  {newPassword && (
                    <div className="mt-1">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={cn("h-full rounded-full transition-all", strength.color)}
                          style={{ width: `${strength.pct}%` }}
                        />
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-xs">
                    <Lock className="h-3.5 w-3.5" /> Confirm Password
                  </Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11"
                  />
                </div>
                <Button className="w-full" size="lg">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-ink">Push Notifications</p>
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New job assigned</span>
                  <Toggle checked={pushNewJob} onChange={setPushNewJob} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Job updated</span>
                  <Toggle checked={pushJobUpdated} onChange={setPushJobUpdated} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payout processed</span>
                  <Toggle checked={pushPayout} onChange={setPushPayout} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-ink">SMS Notifications</p>
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New job assigned</span>
                  <Toggle checked={smsNewJob} onChange={setSmsNewJob} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Job updated</span>
                  <Toggle checked={smsJobUpdated} onChange={setSmsJobUpdated} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payout processed</span>
                  <Toggle checked={smsPayout} onChange={setSmsPayout} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-ink">Language</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option>English</option>
                  <option>French</option>
                  <option>Yoruba</option>
                  <option>Igbo</option>
                  <option>Hausa</option>
                </select>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-ink">Map Provider</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMapProvider("google")}
                    className={cn(
                      "flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors",
                      mapProvider === "google"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-transparent bg-muted text-muted-foreground"
                    )}
                  >
                    Google Maps
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapProvider("apple")}
                    className={cn(
                      "flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors",
                      mapProvider === "apple"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-transparent bg-muted text-muted-foreground"
                    )}
                  >
                    Apple Maps
                  </button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-ink">Dark Mode</span>
                </div>
                <Toggle checked={darkMode} onChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
