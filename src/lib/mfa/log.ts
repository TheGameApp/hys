type LogLevel = "info" | "warn" | "error";

interface MfaLogPayload {
  event: string;
  user_id?: string;
  factor_id?: string;
  challenge_id?: string;
  error?: string;
  [key: string]: unknown;
}

export function mfaLog(level: LogLevel, payload: MfaLogPayload) {
  const line = JSON.stringify({
    scope: "mfa",
    level,
    ts: new Date().toISOString(),
    ...payload,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
