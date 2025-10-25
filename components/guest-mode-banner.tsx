"use client"

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { AuthForm } from './auth-form'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function GuestModeBanner() {
  const { currentUser } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  if (!currentUser?.isAnonymous) {
    return null
  }

  return (
    <>
      <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
        <User className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            You're using guest mode. Your progress won't be saved permanently.
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAuth(true)}
            className="ml-4"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Create Account
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md">
          <AuthForm onSuccess={() => setShowAuth(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}