import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSetAtom } from "jotai"
import { userAtom } from "@/atoms/auth"
import {
  signIn as cognitoSignIn,
  completeNewPasswordChallenge,
  AuthError,
  type NewPasswordRequiredPayload,
} from "@/lib/auth"
import type { CognitoUser } from "amazon-cognito-identity-js"
import { isNewPasswordRequired, stripUserAttrPrefix } from "@/utils/cognito"
import type { LoginInput } from "@/validation/schemas"
import type { NewPasswordRequiredInput } from "@/validation/schemas"
import { LoginForm } from "@/components/Login/components/LoginForm"
import { NewPasswordForm } from "@/components/Login/components/NewPasswordForm"

export default function Login() {
  const navigate = useNavigate()
  const setUser = useSetAtom(userAtom)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const cognitoUserRef = useRef<CognitoUser | null>(null)
  const [newPasswordChallenge, setNewPasswordChallenge] =
    useState<Omit<NewPasswordRequiredPayload, "cognitoUser"> | null>(null)

  const onLoginSubmit = async (data: LoginInput) => {
    setSubmitError(null)
    try {
      const result = await cognitoSignIn(data.email, data.password)
      if (isNewPasswordRequired(result)) {
        cognitoUserRef.current = result.cognitoUser
        setNewPasswordChallenge({
          type: "newPasswordRequired",
          requiredAttributes: result.requiredAttributes,
          userAttributes: result.userAttributes,
        })
        return
      }
      setUser(result)
      navigate("/home")
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : "Sign in failed. Please try again."
      setSubmitError(message)
    }
  }

  const onNewPasswordSubmit = async (data: NewPasswordRequiredInput) => {
    setSubmitError(null)
    const user = cognitoUserRef.current
    if (!user) {
      setSubmitError("Session expired. Please sign in again.")
      setNewPasswordChallenge(null)
      return
    }
    const requiredKeys = (newPasswordChallenge?.requiredAttributes ?? []).map(
      stripUserAttrPrefix
    )
    if (requiredKeys.includes("given_name") && !data.given_name?.trim()) {
      setSubmitError("Given name is required")
      return
    }
    if (requiredKeys.includes("family_name") && !data.family_name?.trim()) {
      setSubmitError("Family name is required")
      return
    }
    const userAttributes: Record<string, string> = {}
    if (requiredKeys.includes("given_name") && data.given_name)
      userAttributes.given_name = data.given_name.trim()
    if (requiredKeys.includes("family_name") && data.family_name)
      userAttributes.family_name = data.family_name.trim()
    try {
      const signedInUser = await completeNewPasswordChallenge(
        user,
        data.newPassword,
        userAttributes
      )
      cognitoUserRef.current = null
      setNewPasswordChallenge(null)
      setUser(signedInUser)
      navigate("/home")
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : "Failed to set new password. Please try again."
      setSubmitError(message)
    }
  }

  const onNewPasswordCancel = () => {
    cognitoUserRef.current = null
    setNewPasswordChallenge(null)
    setSubmitError(null)
  }

  const showNewPasswordForm = newPasswordChallenge !== null

  if (showNewPasswordForm) {
    const requiredKeys = (newPasswordChallenge?.requiredAttributes ?? []).map(
      stripUserAttrPrefix
    )
    const needsGivenName = requiredKeys.includes("given_name")
    const needsFamilyName = requiredKeys.includes("family_name")

    return (
      <NewPasswordForm
        onSubmit={onNewPasswordSubmit}
        onCancel={onNewPasswordCancel}
        needsGivenName={needsGivenName}
        needsFamilyName={needsFamilyName}
        error={submitError}
        defaultValues={{
          given_name: newPasswordChallenge.userAttributes.given_name ?? "",
          family_name: newPasswordChallenge.userAttributes.family_name ?? "",
        }}
      />
    )
  }

  return <LoginForm onSubmit={onLoginSubmit} error={submitError} />
}
