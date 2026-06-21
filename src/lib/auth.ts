import bcrypt from "bcryptjs";

// Maliyet faktörü 12 (2026 önerisi). Eski 10 ile üretilmiş hash'ler bcrypt maliyeti
// kendi içinde sakladığı için doğrulamada sorunsuz çalışmaya devam eder.
const BCRYPT_COST = 12;

export function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_COST);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
