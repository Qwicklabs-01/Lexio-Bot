import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { verifyTelegramInitData } from '../src/server/utils/verifyTelegramInitData.js';

describe('verifyTelegramInitData', () => {
  const mockBotToken = '123456789:ABCdefGHIjklMNOpqrSTUvwxYZ';
  const mockUser = {
    id: 987654321,
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    language_code: 'en',
  };

  function generateValidInitData(authDateOffsetSeconds = 0): string {
    const authDate = Math.floor(Date.now() / 1000) + authDateOffsetSeconds;
    const params: Record<string, string> = {
      user: JSON.stringify(mockUser),
      auth_date: authDate.toString(),
      query_id: 'AAHdF6IQAAAAAN0XohABcDeF',
    };

    // Sort alphabetically
    const keys = Object.keys(params).sort();
    const dataCheckString = keys.map((key) => `${key}=${params[key]}`).join('\n');

    // Generate hash
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(mockBotToken).digest();
    const hash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    // Build URLSearchParams
    const urlParams = new URLSearchParams();
    for (const key of keys) {
      urlParams.append(key, params[key]);
    }
    urlParams.append('hash', hash);

    return urlParams.toString();
  }

  it('successfully validates authentic Telegram initData', () => {
    const initDataString = generateValidInitData();
    const result = verifyTelegramInitData(initDataString, mockBotToken);

    expect(result.user.id).toBe(987654321);
    expect(result.user.first_name).toBe('John');
    expect(result.user.username).toBe('johndoe');
    expect(result.queryId).toBe('AAHdF6IQAAAAAN0XohABcDeF');
  });

  it('rejects tampered user payload', () => {
    const validData = generateValidInitData();
    const tampered = validData.replace('John', 'Attacker');

    expect(() => {
      verifyTelegramInitData(tampered, mockBotToken);
    }).toThrow('Cryptographic signature verification failed');
  });

  it('rejects expired initData', () => {
    // Generate data from 2 days ago (-172800 seconds)
    const expiredData = generateValidInitData(-172800);

    expect(() => {
      verifyTelegramInitData(expiredData, mockBotToken, 86400);
    }).toThrow('initData signature has expired');
  });

  it('rejects incorrect bot token', () => {
    const validData = generateValidInitData();
    const wrongToken = '999999999:WrongTokenIncorrect';

    expect(() => {
      verifyTelegramInitData(validData, wrongToken);
    }).toThrow('Cryptographic signature verification failed');
  });
});
