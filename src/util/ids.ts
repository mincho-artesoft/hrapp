import { randomBytes, createHash } from 'node:crypto';

// Look-alike characters are left out so an id survives being read aloud,
// retyped, or dictated over the phone.
const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * A feed id is a bearer credential: anyone holding the URL can read that feed,
 * because a subscribed calendar sends no authentication. So it is sized like a
 * password, not like a database key. 22 characters of this alphabet is ~128
 * bits - beyond brute force, and short enough to fit a URL comfortably.
 */
export function randomId(length = 22): string {
  const bytes = randomBytes(length * 2);
  let out = '';
  for (let i = 0; out.length < length; i++) {
    // Rejection sampling: taking bytes modulo the alphabet length would bias
    // the early characters, which is exactly what you do not want in a secret.
    const b = bytes[i % bytes.length];
    if (b < 256 - (256 % ALPHABET.length)) out += ALPHABET[b % ALPHABET.length];
  }
  return out;
}

/** Index keys are hashed so a stolen bucket listing does not hand over tokens. */
export function hashKey(value: unknown): string {
  return createHash('sha256').update(String(value)).digest('hex');
}
