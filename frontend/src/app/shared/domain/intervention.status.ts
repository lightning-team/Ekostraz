import { Options } from '@shared/utils/option';

export enum InterventionStatus {
  ToVerify,
  ActionRequired,
  InProgress,
  Closed,
}

export const InterventionStatusMap = new Map([
  [InterventionStatus.ToVerify, 'Do weryfikacji'],
  [InterventionStatus.ActionRequired, 'Do podjęcia'],
  [InterventionStatus.InProgress, 'W toku'],
  [InterventionStatus.Closed, 'Zamknięta'],
]);

export const InterventionStatusOptions = Options.fromMap(InterventionStatusMap);
