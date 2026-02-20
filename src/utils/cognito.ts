import type { NewPasswordRequiredPayload } from "@/lib/auth"
import type { User } from "@/atoms/auth"

export function isNewPasswordRequired(
  r: User | NewPasswordRequiredPayload
): r is NewPasswordRequiredPayload {
  return "type" in r && r.type === "newPasswordRequired"
}

const USER_ATTR_PREFIX = "userAttributes."

export function stripUserAttrPrefix(key: string): string {
  return key.startsWith(USER_ATTR_PREFIX)
    ? key.slice(USER_ATTR_PREFIX.length)
    : key
}
