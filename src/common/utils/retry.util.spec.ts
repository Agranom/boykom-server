import { retry, RetryOptions } from './retry.util';

describe('retry utility', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the result when function succeeds on first attempt', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const options: RetryOptions = { maxAttempts: 3 };

    const promise = retry(fn, options);
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry until success', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValue('success');

    const options: RetryOptions = { maxAttempts: 3, delayMs: 100 };

    const promise = retry(fn, options);
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw last error after all attempts fail', async () => {
    const expectedError = new Error('Test error');
    const fn = jest.fn().mockRejectedValue(expectedError);
    const options: RetryOptions = { maxAttempts: 3, delayMs: 100 };

    const promise = retry(fn, options);
    jest.runAllTimers();

    await expect(promise).rejects.toThrow(expectedError);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should use exponential backoff when configured', async () => {
    jest.spyOn(global, 'setTimeout');

    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValue('success');

    const options: RetryOptions = {
      maxAttempts: 3,
      delayMs: 100,
      useExponentialBackoff: true,
    };

    const promise = retry(fn, options);
    jest.runAllTimers();
    await promise;

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 100);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 200);
  });

  it('should call onRetry handler on each retry', async () => {
    const onRetry = jest.fn();
    const error1 = new Error('First failure');
    const error2 = new Error('Second failure');

    const fn = jest
      .fn()
      .mockRejectedValueOnce(error1)
      .mockRejectedValueOnce(error2)
      .mockResolvedValue('success');

    const options: RetryOptions = {
      maxAttempts: 3,
      delayMs: 100,
      onRetry,
    };

    const promise = retry(fn, options);
    jest.runAllTimers();
    await promise;

    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(1, error1, 1);
    expect(onRetry).toHaveBeenNthCalledWith(2, error2, 2);
  });
});
