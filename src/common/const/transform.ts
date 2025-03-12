import { Transform } from 'class-transformer';

export const TO_BOOLEAN: Parameters<typeof Transform> = [
  ({ value }) => value === 'true',
  { toClassOnly: true },
];
