import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { newPasswordRequiredSchema, type NewPasswordRequiredInput } from "@/validation/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface NewPasswordFormProps {
  onSubmit: (data: NewPasswordRequiredInput) => void | Promise<void>
  onCancel: () => void
  needsGivenName: boolean
  needsFamilyName: boolean
  error: string | null
  defaultValues?: { given_name?: string; family_name?: string }
}

export function NewPasswordForm({
  onSubmit,
  onCancel,
  needsGivenName,
  needsFamilyName,
  error,
  defaultValues,
}: NewPasswordFormProps) {
  const form = useForm<NewPasswordRequiredInput>({
    resolver: zodResolver(newPasswordRequiredSchema),
    defaultValues: {
      given_name: defaultValues?.given_name ?? "",
      family_name: defaultValues?.family_name ?? "",
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Set new password
          </CardTitle>
          <CardDescription className="text-center">
            Your account requires a new password and the fields below before you can continue.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="At least 8 characters"
                {...form.register("newPassword")}
                className={
                  form.formState.errors.newPassword ? "border-red-500" : ""
                }
              />
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm new password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm new password"
                {...form.register("confirmNewPassword")}
                className={
                  form.formState.errors.confirmNewPassword
                    ? "border-red-500"
                    : ""
                }
              />
              {form.formState.errors.confirmNewPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.confirmNewPassword.message}
                </p>
              )}
            </div>
            {needsGivenName && (
              <div className="space-y-2">
                <Label htmlFor="given_name">Given name</Label>
                <Input
                  id="given_name"
                  type="text"
                  placeholder="Given name"
                  {...form.register("given_name")}
                  className={
                    form.formState.errors.given_name ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.given_name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.given_name.message}
                  </p>
                )}
              </div>
            )}
            {needsFamilyName && (
              <div className="space-y-2">
                <Label htmlFor="family_name">Family name</Label>
                <Input
                  id="family_name"
                  type="text"
                  placeholder="Family name"
                  {...form.register("family_name")}
                  className={
                    form.formState.errors.family_name ? "border-red-500" : ""
                  }
                />
                {form.formState.errors.family_name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.family_name.message}
                  </p>
                )}
              </div>
            )}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Setting password..."
                : "Set password and continue"}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>
              Back to sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
