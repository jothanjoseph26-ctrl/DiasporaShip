'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store'

export default function CustomerSettingsPage() {
  const { currentUser } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Profile and account preferences.</p>
      </div>

      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardContent className="space-y-3 p-5">
          <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium text-foreground">{currentUser?.firstName} {currentUser?.lastName}</p></div>
          <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium text-foreground">{currentUser?.email}</p></div>
          <div><p className="text-xs text-muted-foreground">Preferred Currency</p><p className="font-medium text-foreground">{currentUser?.preferredCurrency}</p></div>
          <div><p className="text-xs text-muted-foreground">Language</p><p className="font-medium text-foreground">{currentUser?.preferredLanguage}</p></div>
        </CardContent>
      </Card>
    </div>
  )
}
