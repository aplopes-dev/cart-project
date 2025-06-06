/**
 * Utilitários para trabalhar com unidades de medida
 */

/**
 * Processa a string de unidades de medida do produto
 * @param {string} unitOfMeasure - String de unidades (ex: "kg" ou "{kg,un,cx}")
 * @returns {string[]} Array de unidades
 */
export function parseUnitsOfMeasure(unitOfMeasure) {
  if (!unitOfMeasure || typeof unitOfMeasure !== 'string') {
    return []
  }

  // Remove espaços em branco
  const cleaned = unitOfMeasure.trim()

  // Se começar e terminar com chaves, é múltiplas unidades
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
    // Remove as chaves e divide por vírgula
    const unitsString = cleaned.slice(1, -1)
    return unitsString.split(',').map(unit => unit.trim()).filter(unit => unit.length > 0)
  }

  // Se não tem chaves, é uma única unidade
  return cleaned.length > 0 ? [cleaned] : []
}

/**
 * Verifica se o produto tem múltiplas unidades de medida
 * @param {string} unitOfMeasure - String de unidades
 * @returns {boolean} True se tem múltiplas unidades
 */
export function hasMultipleUnits(unitOfMeasure) {
  const units = parseUnitsOfMeasure(unitOfMeasure)
  return units.length > 1
}

/**
 * Verifica se o produto tem pelo menos uma unidade de medida
 * @param {string} unitOfMeasure - String de unidades
 * @returns {boolean} True se tem pelo menos uma unidade
 */
export function hasUnits(unitOfMeasure) {
  const units = parseUnitsOfMeasure(unitOfMeasure)
  return units.length > 0
}

/**
 * Formata as unidades para exibição
 * @param {string[]} units - Array de unidades
 * @returns {string} String formatada para exibição
 */
export function formatUnitsForDisplay(units) {
  if (!units || units.length === 0) {
    return ''
  }

  if (units.length === 1) {
    return units[0]
  }

  return units.join(', ')
}

/**
 * Obtém a primeira unidade (padrão) do produto
 * @param {string} unitOfMeasure - String de unidades
 * @returns {string|null} Primeira unidade ou null se não houver
 */
export function getDefaultUnit(unitOfMeasure) {
  const units = parseUnitsOfMeasure(unitOfMeasure)
  return units.length > 0 ? units[0] : null
}
