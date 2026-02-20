import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js"
import { cognitoConfig } from "@/config/cognito"
import type { User } from "@/atoms/auth"

/** localStorage key for the Cognito access token (set on sign-in, cleared on sign-out). */
export const AUTH_TOKEN_STORAGE_KEY = "token"

/**
 * Decode the stored JWT and return a display name (name, given_name, or cognito:username).
 * Returns null if no token or payload has no name claim.
 */
export function getDisplayNameFromToken(): string | null {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : null
    if (!token) return null
    const payload = token.split(".")[1]
    if (!payload) return null
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as Record<string, unknown>
    const name = (decoded.name ?? decoded.given_name ?? decoded["cognito:username"]) as string | undefined
    return name && typeof name === "string" ? name : null
  } catch {
    return null
  }
}

function saveTokenFromSession(session: { getAccessToken: () => { getJwtToken: () => string } }) {
  try {
    const token = session.getAccessToken().getJwtToken()
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
  } catch {
    // ignore
  }
}

/** Result when Cognito requires the user to set a new password (e.g. first login after admin create). */
export interface NewPasswordRequiredPayload {
  type: "newPasswordRequired"
  cognitoUser: CognitoUser
  /** e.g. ["userAttributes.given_name", "userAttributes.family_name"] */
  requiredAttributes: string[]
  /** Parsed user attributes from the challenge (e.g. email, given_name, family_name). */
  userAttributes: Record<string, string>
}

export type AuthErrorCode =
  | "NotAuthorizedException"
  | "UserNotFoundException"
  | "UserNotConfirmedException"
  | "InvalidParameterException"
  | "NetworkError"
  | "Unknown"

export class AuthError extends Error {
  constructor(
    message: string,
    public code: AuthErrorCode = "Unknown"
  ) {
    super(message)
    this.name = "AuthError"
  }
}

function getMessageFromCognitoError(err: unknown): string {
  if (err && typeof err === "object" && "name" in err) {
    const name = (err as { name: string }).name
    const message = (err as { message?: string }).message ?? String(err)
    if (name === "NotAuthorizedException") return "Incorrect email or password."
    if (name === "UserNotFoundException") return "No account found with this email."
    if (name === "UserNotConfirmedException")
      return "Please confirm your email before signing in."
    if (name === "InvalidParameterException") return message
    if (name === "NetworkError") return "Network error. Please try again."
    return message
  }
  return err instanceof Error ? err.message : "Something went wrong. Please try again."
}

function getCodeFromCognitoError(err: unknown): AuthErrorCode {
  if (err && typeof err === "object" && "name" in err) {
    const name = (err as { name: string }).name
    if (
      name === "NotAuthorizedException" ||
      name === "UserNotFoundException" ||
      name === "UserNotConfirmedException" ||
      name === "InvalidParameterException" ||
      name === "NetworkError"
    )
      return name as AuthErrorCode
  }
  return "Unknown"
}

function getPool(): CognitoUserPool {
  const { userPoolId, clientId } = cognitoConfig
  if (!userPoolId || !clientId) {
    throw new AuthError(
      "Cognito not configured. Set VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID in .env.",
      "InvalidParameterException"
    )
  }
  return new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId,
  })
}

function userFromIdTokenPayload(payload: Record<string, unknown>, username: string): User {
  const sub = (payload.sub as string) ?? ""
  const email =
    (payload.email as string) ?? (payload["cognito:username"] as string) ?? username
  const name =
    (payload.name as string) ??
    (payload.given_name as string) ??
    (payload.preferred_username as string) ??
    email.split("@")[0]
  return { id: sub, email, name }
}

/**
 * Sign in with email (username) and password using Cognito.
 * Resolves with the user, or with NewPasswordRequiredPayload when the user must set a new password and/or required attributes.
 */
export function signIn(
  email: string,
  password: string
): Promise<User | NewPasswordRequiredPayload> {
  return new Promise((resolve, reject) => {
    const pool = getPool()
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: pool,
    })
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    })
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        try {
          saveTokenFromSession(session)
          const idToken = session.getIdToken()
          const payload = (idToken as { payload: Record<string, unknown> }).payload
          const user = userFromIdTokenPayload(payload ?? {}, email)
          resolve(user)
        } catch (e) {
          reject(new AuthError("Failed to read user after sign-in.", "Unknown"))
        }
      },
      onFailure: (err) => {
        reject(
          new AuthError(getMessageFromCognitoError(err), getCodeFromCognitoError(err))
        )
      },
      newPasswordRequired: (userAttributes: unknown, requiredAttributes: unknown) => {
        const attrs: Record<string, string> =
          typeof userAttributes === "string"
            ? (() => {
                try {
                  return JSON.parse(userAttributes) as Record<string, string>
                } catch {
                  return {}
                }
              })()
            : typeof userAttributes === "object" && userAttributes !== null
              ? { ...(userAttributes as Record<string, string>) }
              : {}
        delete attrs.email_verified
        const required =
          typeof requiredAttributes === "string"
            ? (() => {
                try {
                  return JSON.parse(requiredAttributes) as string[]
                } catch {
                  return []
                }
              })()
            : Array.isArray(requiredAttributes)
              ? requiredAttributes
              : []
        resolve({
          type: "newPasswordRequired",
          cognitoUser,
          requiredAttributes: required,
          userAttributes: attrs,
        })
      },
    })
  })
}

/**
 * Complete the NEW_PASSWORD_REQUIRED challenge (new password + required attributes).
 * Call this with the cognitoUser and form values from the new-password form.
 */
export function completeNewPasswordChallenge(
  cognitoUser: CognitoUser,
  newPassword: string,
  userAttributes: Record<string, string>
): Promise<User> {
  return new Promise((resolve, reject) => {
    cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
      onSuccess: (session) => {
        try {
          saveTokenFromSession(session)
          const idToken = session.getIdToken()
          const payload = (idToken as { payload: Record<string, unknown> }).payload
          const username = cognitoUser.getUsername()
          const user = userFromIdTokenPayload(payload ?? {}, username)
          resolve(user)
        } catch (e) {
          reject(new AuthError("Failed to read user after password change.", "Unknown"))
        }
      },
      onFailure: (err) => {
        reject(
          new AuthError(getMessageFromCognitoError(err), getCodeFromCognitoError(err))
        )
      },
    })
  })
}

/**
 * Sign out the current user (clears Cognito session from storage).
 */
export function signOut(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
      const pool = getPool()
      const cognitoUser = pool.getCurrentUser()
      if (cognitoUser) {
        cognitoUser.signOut()
      }
      resolve()
    } catch (err) {
      reject(
        new AuthError(getMessageFromCognitoError(err), getCodeFromCognitoError(err))
      )
    }
  })
}

/**
 * Get the currently signed-in user from Cognito session, or null if not authenticated.
 */
export function getCurrentUserFromCognito(): Promise<User | null> {
  return new Promise((resolve) => {
    let pool: CognitoUserPool
    try {
      pool = getPool()
    } catch {
      return resolve(null)
    }
    try {
      const cognitoUser = pool.getCurrentUser()
      if (!cognitoUser) {
        return resolve(null)
      }
      cognitoUser.getSession((err: Error | null, session: { getIdToken: () => { payload: Record<string, unknown> }; getAccessToken: () => { getJwtToken: () => string } } | null) => {
        if (err || !session) {
          return resolve(null)
        }
        try {
          saveTokenFromSession(session)
          const idToken = session.getIdToken()
          const payload = idToken?.payload ?? {}
          const user = userFromIdTokenPayload(payload, cognitoUser.getUsername())
          resolve(user)
        } catch {
          resolve(null)
        }
      })
    } catch {
      resolve(null)
    }
  })
}
