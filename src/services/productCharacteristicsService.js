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
    if (!product || !product.characteristics) {
      return false;
    }

    // Verifica se o produto tem pelo menos uma característica com valores
    return (
      (product.characteristics.COLOR && product.characteristics.COLOR.length > 0) ||
      (product.characteristics.SIZE && product.characteristics.SIZE.length > 0) ||
      (product.characteristics.WEIGHT && product.characteristics.WEIGHT.length > 0)
    );
  },

  /**
   * Verifica se todas as características obrigatórias foram selecionadas
   * @param {Object} product - O objeto do produto
   * @param {Object} selectedCharacteristics - Objeto com as características selecionadas
   * @returns {Boolean} - Retorna true se todas as características obrigatórias foram selecionadas
   */
  allCharacteristicsSelected(product, selectedCharacteristics) {
    if (!product || !product.characteristics) {
      return true;
    }

    const { color, size, weight } = selectedCharacteristics;

    // Verifica se todas as características disponíveis foram selecionadas
    if (product.characteristics.COLOR?.length > 0 && !color) {
      return false;
    }

    if (product.characteristics.SIZE?.length > 0 && !size) {
      return false;
    }

    if (product.characteristics.WEIGHT?.length > 0 && !weight) {
      return false;
    }

    return true;
  }
};
