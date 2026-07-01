import { z } from "zod";
import validator from "validator";

/**
 * =========================
 * CONFIG LIMITS
 * =========================
 */
const LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 64,
  MAX_TOTAL_LENGTH: 200,
};

/**
 * =========================
 * TYPE RESULT (FIX UTAMA ERROR TS KAMU)
 * =========================
 */
export type RegisterResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      data: {
        username: string;
        password: string;
      };
    };

/**
 * =========================
 * ZOD SCHEMA
 * =========================
 */
export const RegisterSchema = z.object({
  username: z
    .string()
    .trim()
    .min(LIMITS.USERNAME_MIN, "Username Invalid")
    .max(LIMITS.USERNAME_MAX, "Username Invalid")
    .regex(/^[a-z0-9_]+$/, "Username Tidak Valid"),

  password: z
    .string()
    .min(LIMITS.PASSWORD_MIN, "Password Invalid")
    .max(LIMITS.PASSWORD_MAX, "Password Invalid"),
});

/**
 * =========================
 * SANITIZER
 * =========================
 */
export function sanitize(value: string): string {
  if (!value) return "";

  return validator
    .stripLow(value.normalize("NFKC"), true)
    .replace(/\0/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * =========================
 * PATTERN DETECTOR (soft filter)
 * =========================
 */
const SUSPICIOUS_PATTERN =
  /<|>|script|javascript:|onerror=|onload=|onclick=|union|select|insert|update|delete|drop|--|;|\/\*/i;

export function looksSuspicious(value: string): boolean {
  return SUSPICIOUS_PATTERN.test(value);
}

/**
 * =========================
 * HARD GUARD (ANTI DOs ringan)
 * =========================
 */
function hardGuard(
  username: string,
  password: string
): RegisterResult | null {
  const total = username.length + password.length;

  if (total > LIMITS.MAX_TOTAL_LENGTH) {
    return {
      success: false,
      message: "Invalid",
    };
  }

  if (/(.)\1{50,}/.test(username + password)) {
    return {
      success: false,
      message: "Input tidak valid",
    };
  }

  return null;
}

/**
 * =========================
 * MAIN VALIDATOR
 * =========================
 */
export function validateRegister(
  username: string,
  password: string
): RegisterResult {
  const cleanUsername = sanitize(username).toLowerCase();
  const cleanPassword = sanitize(password);

  // 1. HARD GUARD
  const guard = hardGuard(cleanUsername, cleanPassword);
  if (guard) return guard;

  // 2. SUSPICIOUS CHECK
  if (
    looksSuspicious(cleanUsername) ||
    looksSuspicious(cleanPassword)
  ) {
    return {
      success: false,
      message: "Invalid request",
    };
  }

  // 3. ZOD VALIDATION
  const parsed = RegisterSchema.safeParse({
    username: cleanUsername,
    password: cleanPassword,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  // 4. SUCCESS
  return {
    success: true,
    data: parsed.data,
  };
}