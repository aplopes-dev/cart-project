/**
 * Serviço para manipulação de imagens de produtos
 */
import { PLACEHOLDER_IMAGE_PATH } from './imageConstants'

export const imageService = {
  /**
   * Obtém o caminho completo da imagem do produto com base no foxpro_code
   * @param {string} imagePath - Caminho da imagem retornado pelo backend
   * @param {Object} product - Objeto do produto (opcional)
   * @returns {string} - Caminho completo da imagem
   */
  getProductImageUrl(imagePath, product = null) {
    if (!imagePath) {
      console.log('[ImageService] Usando imagem padrão para caminho vazio');
      return PLACEHOLDER_IMAGE_PATH; // Imagem padrão se não houver caminho
    }

    // Se o caminho já for completo (começa com http ou https), retorna o caminho original
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log(`[ImageService] Usando URL completa: ${imagePath}`);
      return imagePath;
    }

    // Se o caminho já começar com /, retorna o caminho como está
    // Isso é importante para as imagens retornadas pelo endpoint /products/images/:foxproCode
    if (imagePath.startsWith('/')) {
      console.log(`[ImageService] Usando caminho relativo: ${imagePath}`);
      return imagePath;
    }

    // Se tiver o produto e o foxpro_code, usa o caminho com o foxpro_code
    if (product && product.foxpro_code) {
      const fullPath = `/images/products/${product.foxpro_code}/${imagePath}`;
      console.log(`[ImageService] Construindo caminho com foxpro_code: ${fullPath}`);
      return fullPath;
    }

    // Caso contrário, adiciona o prefixo /images/products/
    const fullPath = `/images/products/${imagePath}`;
    console.log(`[ImageService] Construindo caminho sem foxpro_code: ${fullPath}`);
    return fullPath;
  },

  /**
   * Obtém todas as imagens de um produto com base no foxpro_code
   * @param {Object} product - Objeto do produto
   * @returns {Array} - Array com os caminhos das imagens
   */
  getProductImages(product) {
    if (!product) {
      console.log('[ImageService] Produto inválido, retornando array vazio');
      return [];
    }

    console.log('[ImageService] Processando imagens para produto:', product.id, product.name);
    console.log('[ImageService] Dados do produto:', {
      id: product.id,
      name: product.name,
      image: product.image,
      foxpro_code: product.foxpro_code,
      images: product.images
    });

    const mainImage = this.getProductImageUrl(product.image, product);
    console.log(`[ImageService] Imagem principal: ${mainImage}`);

    // Se o produto não tiver imagens adicionais, retorna apenas a imagem principal
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
      console.log('[ImageService] Sem imagens adicionais, retornando apenas a principal');
      return [mainImage];
    }

    // Processa todas as imagens adicionais
    console.log(`[ImageService] Processando ${product.images.length} imagens adicionais`);
    const additionalImages = product.images.map(img => {
      const processedImg = this.getProductImageUrl(img, product);
      console.log(`[ImageService] Imagem adicional processada: ${processedImg}`);
      return processedImg;
    });

    // Retorna um array com a imagem principal e as imagens adicionais, removendo duplicatas
    const allImages = [...new Set([mainImage, ...additionalImages])];
    console.log(`[ImageService] Total de imagens únicas: ${allImages.length}`);
    console.log('[ImageService] Todas as imagens:', allImages);
    return allImages;
  },

  /**
   * Obtém o caminho da pasta de imagens de um produto com base no foxpro_code
   * @param {string} foxproCode - Código FoxPro do produto
   * @returns {string} - Caminho da pasta de imagens
   */
  getProductImagesFolder(foxproCode) {
    if (!foxproCode) {
      console.log('[ImageService] Sem código FoxPro, retornando pasta base de produtos');
      return '/images/products';
    }

    const folderPath = `/images/products/${foxproCode}`;
    console.log(`[ImageService] Pasta de imagens para código FoxPro ${foxproCode}: ${folderPath}`);
    return folderPath;
  },

  /**
   * Função utilitária para lidar com erros de carregamento de imagem
   * @param {Event} event - Evento de erro de carregamento de imagem
   * @returns {void}
   */
  handleImageError(event) {
    // Tenta usar o caminho absoluto para a imagem de fallback
    const baseUrl = window.location.origin;
    const fallbackUrl = `${baseUrl}${PLACEHOLDER_IMAGE_PATH}`;

    // Verifica se a imagem que falhou já é a imagem de fallback
    const isAlreadyFallback = (
      event.target.src === fallbackUrl ||
      event.target.src.includes(PLACEHOLDER_IMAGE_PATH)
    );

    if (isAlreadyFallback) {
      console.error('Fallback image not found:', event.target.src);
      // Imagem base64 mínima transparente como último recurso
      event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      event.target.onerror = null; // Previne loop infinito
      return;
    }

    // Tenta usar a imagem de fallback
    console.log(`[ImageService] Usando imagem de fallback: ${fallbackUrl}`);
    event.target.src = fallbackUrl;

    // Se mesmo a imagem de fallback falhar, use uma imagem base64 mínima
    event.target.onerror = () => {
      console.error('Imagem de fallback falhou');
      // Imagem base64 mínima transparente como último recurso
      event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      event.target.onerror = null; // Previne loop infinito
    };
  }
}
