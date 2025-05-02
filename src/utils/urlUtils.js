/**
 * Utilitários para manipulação de URLs
 */

/**
 * Formata a descrição do produto para uso em URLs
 * @param {string} description - A descrição do produto
 * @returns {string} - A descrição formatada para URL
 */
export const formatDescriptionForUrl = (description) => {
  if (!description) return '';

  // Limita a descrição a um tamanho razoável para URL (primeiras 100 caracteres)
  const limitedDescription = description.substring(0, 100);

  console.log('Formatando descrição para URL:', limitedDescription);

  // Remove caracteres especiais e substitui espaços por hífens
  return limitedDescription
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .toLowerCase();
};

/**
 * Gera uma URL para a página de detalhes do produto incluindo a descrição
 * @param {string} productId - O ID do produto
 * @param {string} description - A descrição do produto
 * @returns {string} - A URL formatada
 */
export const getProductUrlWithDescription = (productId, description) => {
  if (!productId) return '/';

  const formattedDescription = formatDescriptionForUrl(description);

  if (!formattedDescription) {
    return `/product/${productId}`;
  }

  return `/product/${productId}/${formattedDescription}`;
};
