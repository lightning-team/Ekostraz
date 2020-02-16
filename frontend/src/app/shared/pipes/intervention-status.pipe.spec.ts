import { InterventionStatusPipe } from './intervention-status.pipe';
import { InterventionStatus, InterventionStatusMap } from '@shared/domain/intervention.status';

describe('InterventionStatusPipe', () => {
  let pipe: InterventionStatusPipe;

  beforeEach(() => {
    pipe = new InterventionStatusPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  [
    {
      tested: InterventionStatus.ActionRequired,
      expected: InterventionStatusMap.get(InterventionStatus.ActionRequired),
    },
    {
      tested: InterventionStatus.ActionRequired,
      expected: InterventionStatusMap.get(InterventionStatus.ActionRequired),
    },
    {
      tested: InterventionStatus.ActionRequired,
      expected: InterventionStatusMap.get(InterventionStatus.ActionRequired),
    },
    {
      tested: InterventionStatus.ActionRequired,
      expected: InterventionStatusMap.get(InterventionStatus.ActionRequired),
    },
    { tested: 5, expected: String(5) },
  ].forEach(({ tested, expected }) => {
    it('should transform status value to proper display value', () => {
      expect(pipe.transform(tested)).toEqual(expected);
    });
  });
});
