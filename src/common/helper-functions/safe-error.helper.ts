export async function safeError<T>(
  promise: Promise<T>,
): Promise<[T, null] | [null, Error]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error];
  }
}
