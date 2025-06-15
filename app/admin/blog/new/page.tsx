"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ... resto de tus imports

// Definir tipos para mayor claridad
interface Author {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

export default function NewBlogPost() {
  const router = useRouter();
  // Especificar tipos explícitamente
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author_id: '',
    category_id: '',
    status: 'draft',
    featured: false,
    read_time: ''
  });

  // Cargar autores y categorías al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const [authorsRes, categoriesRes] = await Promise.all([
          fetch('/api/authors'),
          fetch('/api/categories')
        ]);
        
        const authorsData = await authorsRes.json();
        const categoriesData = await categoriesRes.json();
        
        setAuthors(authorsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  // Función para mapear nombre de autor a ID (dinámico)
  const mapAuthorNameToId = (authorName: string): number => {
    const author = authors.find((a) => a.name === authorName);
    return author ? author.id : 1; // ID por defecto si no se encuentra
  };

  // Función para mapear nombre de categoría a ID (dinámico)
  const mapCategoryNameToId = (categoryName: string): number => {
    const category = categories.find((c) => c.name === categoryName);
    return category ? category.id : 1; // ID por defecto si no se encuentra
  };

  // Función para convertir Markdown a HTML (si la necesitas)
  const convertMarkdownToHtml = (markdown: string): string => {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  // En tu función onSubmit o handleSubmit usa estas funciones para obtener los IDs

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: convertMarkdownToHtml(formData.content),
          featured_image: formData.featured_image || '/images/default-blog.jpg',
          author_id: parseInt(formData.author_id) || mapAuthorNameToId(formData.author_id),
          category_id: parseInt(formData.category_id) || mapCategoryNameToId(formData.category_id),
          status: formData.status,
          featured: formData.featured,
          read_time: formData.read_time
        }),
      });

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        const error = await response.json();
        console.error('Error creating post:', error);
        alert('Error al crear el post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Crear Nuevo Post</h1>
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Aquí va el resto de tu formulario igual */}
      </form>
    </div>
  );
}