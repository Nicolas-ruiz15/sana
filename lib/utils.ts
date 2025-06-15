// lib/utils.ts

export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  
  // Remover tags HTML y contar palabras
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.trim().split(/\s+/).length;
  
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres especiales
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones múltiples
    .trim();
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}