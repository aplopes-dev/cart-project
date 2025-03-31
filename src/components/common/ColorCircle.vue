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
  mounted() {
    console.log('ColorCircle mounted with color:', this.color, 'type:', typeof this.color, 'normalized:', this.normalizedColor);
  },
  computed: {
    normalizedColor() {
      if (!this.color) return 'transparent';

      // Se a cor já é um código hexadecimal válido, retorna como está
      if (/^#([0-9A-F]{3}){1,2}$/i.test(this.color)) {
        return this.color;
      }

      // Se a cor é um nome de cor CSS válido, retorna como está
      const validColorNames = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'grey'];
      if (validColorNames.includes(this.color.toLowerCase())) {
        return this.color.toLowerCase();
      }

      // Tenta converter nomes de cores comuns para hexadecimal
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

      // Se não conseguiu converter, tenta usar como está
      return this.color;
    }
  },
  methods: {
    isWhiteOrLight(color) {
      if (!color || color === 'transparent') return false;

      // Cores claras conhecidas
      const lightColors = ['#ffffff', '#fff', 'white', 'branco', '#f5f5f5', '#fafafa', '#f0f0f0', '#eeeeee', '#e0e0e0', 'lightgray', 'lightgrey'];
      if (lightColors.includes(color.toLowerCase())) {
        return true;
      }

      // Tenta extrair os componentes RGB
      let r, g, b;

      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        if (hex.length === 3) {
          // Formato abreviado #RGB
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
          // Formato completo #RRGGBB
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        }
      } else if (color.startsWith('rgb')) {
        // Formato rgb(r,g,b) ou rgba(r,g,b,a)
        const rgbValues = color.match(/\d+/g);
        if (rgbValues && rgbValues.length >= 3) {
          [r, g, b] = rgbValues.map(Number);
        }
      }

      // Se conseguiu extrair os componentes RGB, calcula a luminosidade
      if (r !== undefined && g !== undefined && b !== undefined) {
        // Fórmula YIQ para determinar a luminosidade
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128; // Valor de corte para cores claras
      }

      // Se não conseguiu determinar, assume que não é clara
      return false;
    }
  }
}
</script>
