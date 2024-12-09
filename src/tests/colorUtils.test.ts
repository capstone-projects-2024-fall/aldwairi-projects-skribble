import { getDarkerShade, getLighterShade } from '../app/utils/colorUtils';

describe('ColorUtils', () => {
  
    //testing getDarkerShade
    describe('getDarkerShade', () => {
    test('should make bright red (#ff000d) darker', () => {
      const result = getDarkerShade('#ff000d', -20);
      expect(result).toBe('#eb0000');  
    });
  });

  //testing getLighterShade
  describe('getLighterShade', () => {
    test('should make dark brown (#5C4033) lighter', () => {
      const result = getLighterShade('#5C4033', -50);
      expect(result).toBe('#8e7265');  
    });
  });

});
