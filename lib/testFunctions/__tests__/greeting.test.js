import { getGreeting } from '../greeting';

test('returns a greeting message', () => {
  const result = getGreeting('World');
  expect(result).toBe('Hello, World!');
});
