/**
 * getDarkerShade takes a color in hexadecimal format and adjusts it to a darker shade
 * by modifying the RGB components of the color. The adjustment is determined by the `amount` parameter.
 * The amount can be negative to darken the color and positive to lighten it.
 *
 * @param {string} color - The color in hexadecimal format (e.g., "#FFFFFF").
 * @param {number} [amount=-20] - The amount by which to darken the color. Default is -20.
 * @returns {string} The darker shade of the provided color in hexadecimal format.
 */
export const getDarkerShade = (color: string, amount: number = -20): string => {
    return '#' + color.replace(/^#/, '').replace(/../g, color =>
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
  };

/**
 * getLighterShade takes a color in hexadecimal format and adjusts it to a lighter shade
 * by modifying the RGB components of the color. The adjustment is determined by the `amount` parameter.
 * The amount can be negative to darken the color and positive to lighten it.
 *
 * @param {string} color - The color in hexadecimal format (e.g., "#FFFFFF").
 * @param {number} [amount=-50] - The amount by which to lighten the color. Default is -50.
 * @returns {string} The lighter shade of the provided color in hexadecimal format.
 */
export const getLighterShade = (color: string, amount: number = -50): string => {
    return '#' + color.replace(/^#/, '').replace(/../g, color =>
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) - amount)).toString(16)).substr(-2)
    );
  };