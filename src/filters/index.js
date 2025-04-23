/**
 * Filtro para remover os números e o hífen do início dos nomes das categorias
 * Exemplo: "01 - ABS" -> "ABS"
 * @param {string} categoryName - Nome da categoria
 * @returns {string} - Nome da categoria formatado
 */
export function formatCategoryName(categoryName) {
  if (!categoryName) return '';
  
  // Regex para remover números e hífen do início do nome
  // Exemplo: "01 - ABS" -> "ABS"
  return categoryName.replace(/^\d+\s*-\s*/, '').trim();
}

// Exporta todos os filtros para uso global
export default {
  formatCategoryName
};
