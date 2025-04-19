<template>
  <div
    class="inline-block rounded-full border-2 transition-all duration-200"
    :style="{
      backgroundColor: normalizedColor,
      borderColor: isWhiteOrLight(normalizedColor) ? '#CCCCCC' : 'transparent',
      width: size + 'px',
      height: size + 'px'
    }"
    :class="[
      isWhiteOrLight(normalizedColor) ? 'ring-1 ring-gray-200' : ''
    ]"
  />
</template>

<script>
export default {
  name: 'ColorCircle',
  props: {
    color: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 20
    }
  },
  // No mounted hook needed
  computed: {
    normalizedColor() {
      if (!this.color) return 'transparent';

      // If the color is already a valid hexadecimal code, return as is
      if (/^#([0-9A-F]{3}){1,2}$/i.test(this.color)) {
        return this.color;
      }

      // If the color is a valid CSS color name, return as is
      const validColorNames = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'grey'];
      if (validColorNames.includes(this.color.toLowerCase())) {
        return this.color.toLowerCase();
      }

      // Try to convert common color names to hexadecimal
      const colorMap = {
        'black': '#000000',
        'white': '#FFFFFF',
        'red': '#FF0000',
        'green': '#008000',
        'blue': '#0000FF',
        'yellow': '#FFFF00',
        'purple': '#800080',
        'orange': '#FFA500',
        'pink': '#FFC0CB',
        'brown': '#A52A2A',
        'gray': '#808080'
      };

      const lowerColor = this.color.toLowerCase();
      if (colorMap[lowerColor]) {
        return colorMap[lowerColor];
      }

      // If conversion failed, try to use as is
      return this.color;
    }
  },
  methods: {
    isWhiteOrLight(color) {
      if (!color || color === 'transparent') return false;

      // Known light colors
      const lightColors = ['#ffffff', '#fff', 'white', '#f5f5f5', '#fafafa', '#f0f0f0', '#eeeeee', '#e0e0e0', 'lightgray', 'lightgrey'];
      if (lightColors.includes(color.toLowerCase())) {
        return true;
      }

      // Try to extract RGB components
      let r, g, b;

      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        if (hex.length === 3) {
          // Abbreviated format #RGB
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
          // Complete format #RRGGBB
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        }
      } else if (color.startsWith('rgb')) {
        // Format rgb(r,g,b) or rgba(r,g,b,a)
        const rgbValues = color.match(/\d+/g);
        if (rgbValues && rgbValues.length >= 3) {
          [r, g, b] = rgbValues.map(Number);
        }
      }

      // If RGB components were successfully extracted, calculate luminosity
      if (r !== undefined && g !== undefined && b !== undefined) {
        // YIQ formula to determine luminosity
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128; // Cutoff value for light colors
      }

      // If unable to determine, assume it's not light
      return false;
    }
  }
}
</script>
