import { hasMultipleUnits } from '@/utils/unitUtils'

/**
 * Serviço para verificar e gerenciar características de produtos
 */
export const productCharacteristicsService = {
  /**
   * Verifica se um produto tem características que precisam ser selecionadas
   * @param {Object} product - O objeto do produto a ser verificado
   * @returns {Boolean} - Retorna true se o produto tem características, false caso contrário
   */
  hasCharacteristics(product) {
    if (!product) {
      return false;
    }

    // Verifica se o produto tem pelo menos uma característica com valores
    const hasProductCharacteristics = product.characteristics && (
      (product.characteristics.COLOR && product.characteristics.COLOR.length > 0) ||
      (product.characteristics.SIZE && product.characteristics.SIZE.length > 0) ||
      (product.characteristics.WEIGHT && product.characteristics.WEIGHT.length > 0)
    );

    // Verifica se o produto tem múltiplas unidades de medida
    const hasMultipleUnitsOfMeasure = hasMultipleUnits(product.unit_of_measure);

    return hasProductCharacteristics || hasMultipleUnitsOfMeasure;
  },

  /**
   * Verifica se todas as características obrigatórias foram selecionadas
   * @param {Object} product - O objeto do produto
   * @param {Object} selectedCharacteristics - Objeto com as características selecionadas
   * @returns {Boolean} - Retorna true se todas as características obrigatórias foram selecionadas
   */
  allCharacteristicsSelected(product, selectedCharacteristics) {
    if (!product) {
      return true;
    }

    const { color, size, weight, unit } = selectedCharacteristics;

    // Verifica se todas as características disponíveis foram selecionadas
    if (product.characteristics?.COLOR?.length > 0 && !color) {
      return false;
    }

    if (product.characteristics?.SIZE?.length > 0 && !size) {
      return false;
    }

    if (product.characteristics?.WEIGHT?.length > 0 && !weight) {
      return false;
    }

    // Verifica se há múltiplas unidades de medida e se uma foi selecionada
    if (hasMultipleUnits(product.unit_of_measure) && !unit) {
      return false;
    }

    return true;
  }
};
