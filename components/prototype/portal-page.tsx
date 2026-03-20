import Link from "next/link";
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PortalAction = {
  href: string;
  label: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "success" | "warning";
};

type PortalStat = {
  label: string;
  value: string;
  hint?: string;
};

export function PortalPage({
  title,
  description,
  badge,
  actions = [],
  stats = [],
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  actions?: PortalAction[];
  stats?: PortalStat[];
  children?: ReactNode;
}) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            {badge ? <Badge variant="info">{badge}</Badge> : null}
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
        </div>
        {actions.length ? (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button key={action.href} asChild variant={action.variant ?? "default"}>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        ) : null}
      </div>

      {stats.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
              {stat.hint ? (
                <CardContent className="pt-0 text-xs text-muted-foreground">{stat.hint}</CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      ) : null}

      {children}
    </div>
  );
}

export function PortalSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
