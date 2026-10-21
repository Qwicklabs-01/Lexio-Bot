import crypto from 'crypto';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
}

export interface ValidatedInitData {
  user: TelegramUser;
  authDate: number;
  queryId?: string;
  chatType?: string;
  chatInstance?: string;
  rawParams: Record<string, string>;
}

/**
 * Validates Telegram Mini App initData server-side using HMAC-SHA256.
 * Adheres strictly to Telegram Bot API specifications.
 * 
 * @param initDataRaw The raw window.Telegram.WebApp.initData query string from the client
 * @param botToken The secret bot token from BotFather
 * @param maxAgeSeconds Maximum allowable age for auth_date to prevent replay attacks (default: 86400s / 24h)
 * @returns ValidatedInitData if valid, throws an Error if invalid or expired
 */
export function verifyTelegramInitData(
  initDataRaw: string,
  botToken: string,
  maxAgeSeconds = 86400
): ValidatedInitData {
  if (!initDataRaw) {
    throw new Error('initData string is empty');
  }

  const urlParams = new URLSearchParams(initDataRaw);
  const hash = urlParams.get('hash');

  if (!hash) {
    throw new Error('Missing hash parameter in initData');
  }

  // Remove hash and sort remaining parameters alphabetically
  urlParams.delete('hash');
  const params: [string, string][] = [];
  const rawParams: Record<string, string> = {};

  for (const [key, value] of urlParams.entries()) {
    params.push([key, value]);
    rawParams[key] = value;
  }

  params.sort(([a], [b]) => a.localeCompare(b));

  // Build the data_check_string
  const dataCheckString = params.map(([key, value]) => `${key}=${value}`).join('\n');

  // Compute secret_key = HMAC_SHA256("WebAppData", botToken)
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  // Compute calculated_hash = HMAC_SHA256(secretKey, dataCheckString)
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // Constant-time comparison to avoid timing attacks
  const hashBuffer = Buffer.from(hash, 'hex');
  const calculatedBuffer = Buffer.from(calculatedHash, 'hex');

  if (hashBuffer.length !== calculatedBuffer.length || !crypto.timingSafeEqual(hashBuffer, calculatedBuffer)) {
    throw new Error('Cryptographic signature verification failed: invalid hash');
  }

  // Verify auth_date freshness
  const authDateStr = rawParams['auth_date'];
  if (!authDateStr) {
    throw new Error('Missing auth_date in initData');
  }

  const authDate = parseInt(authDateStr, 10);
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime - authDate > maxAgeSeconds) {
    throw new Error('initData signature has expired');
  }

  // Parse user object
  const userJson = rawParams['user'];
  if (!userJson) {
    throw new Error('Missing user payload in initData');
  }

  let user: TelegramUser;
  try {
    user = JSON.parse(userJson);
  } catch {
    throw new Error('Malformed user JSON in initData');
  }

  return {
    user,
    authDate,
    queryId: rawParams['query_id'],
    chatType: rawParams['chat_type'],
    chatInstance: rawParams['chat_instance'],
    rawParams,
  };
}
