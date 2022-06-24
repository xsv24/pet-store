import { compare, sameDay } from '../src/validator';

describe('validator', () => {
  it('compare (string)', () => {
    expect(compare('hello', 'hello')).toBe(true);
    expect(compare('Hello', 'hello')).toBe(true);
    expect(compare('HELLO', 'hello')).toBe(true);
    expect(compare('hello', 'bye')).toBe(false);
  });

  it('sameDay', () => {
    const now = new Date();
    const yesterday = new Date(Date.now() - 3600 * 1000 * 24);
    const tomorrow = new Date(Date.now() + 3600 * 1000 * 24);

    expect(sameDay(now.toISOString(), now.toISOString())).toBe(true);

    expect(sameDay(tomorrow.toISOString(), now.toISOString())).toBe(false);

    expect(sameDay(now.toISOString(), yesterday.toISOString())).toBe(false);

    expect(sameDay(tomorrow.toISOString(), yesterday.toISOString())).toBe(
      false,
    );
  });
});
