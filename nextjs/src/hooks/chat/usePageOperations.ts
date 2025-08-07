import { useState, useCallback } from 'react';

interface UsePageOperationsProps {
  onPageCreated?: (pageData: any) => void;
  onError?: (error: string) => void;
}

export const usePageOperations = ({ 
  onPageCreated, 
  onError 
}: UsePageOperationsProps = {}) => {
  const [isCreatingPage, setIsCreatingPage] = useState(false);

  const createPageFromResponse = async (pageData: {
    originalMessageId: string;
    title: string;
    content: string;
    chatId: string;
    user: any;
    brain: any;
    model: any;
    tokens?: any;
    responseModel?: string;
    responseAPI?: string;
    companyId: string;
  }) => {
    try {
      setIsCreatingPage(true);
      
      const response = await fetch('/api/page/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create page');
      }

      const result = await response.json();
      
      if (onPageCreated) {
        onPageCreated(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Error creating page:', error);
      if (onError) {
        onError(error.message);
      }
      throw error;
    } finally {
      setIsCreatingPage(false);
    }
  };

  const getAllPages = async (query = {}, options = {}) => {
    try {
      const response = await fetch('/api/page/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, options })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to get pages');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting pages:', error);
      throw error;
    }
  };

  const getPageById = async (pageId: string) => {
    try {
      const response = await fetch(`/api/page/${pageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to get page');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting page:', error);
      throw error;
    }
  };

  const updatePage = async (pageId: string, updateData: { title?: string; content?: string }) => {
    try {
      const response = await fetch(`/api/page/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update page');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  };

  const deletePage = async (pageId: string) => {
    try {
      const response = await fetch(`/api/page/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete page');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  };

  return {
    createPageFromResponse,
    getAllPages,
    getPageById,
    updatePage,
    deletePage,
    isCreatingPage
  };
};

