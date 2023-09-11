export const deliverytypes = [
  'standard',
  'next_day',
  'express',
  'four_days',
  'five_days',
  'two_days',
  'three_days',
  'six_days',
  'same_day',
] as const;

export type DeliveryTypesType = (typeof deliverytypes)[number];
