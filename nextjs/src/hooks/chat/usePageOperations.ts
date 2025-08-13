import { useState, useCallback } from 'react';

interface UsePageOperationsProps {
  onPageCreated?: (pageData: any, isUpdate?: boolean) => void;
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
      
      console.log('usePageOperations - Sending pageData:', JSON.stringify(pageData, null, 2));
      
      const response = await fetch('/api/page/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData)
      });

      console.log('usePageOperations - Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('usePageOperations - Error data:', errorData);
        throw new Error(errorData.message || 'Failed to create page');
      }

      const result = await response.json();
      console.log('usePageOperations - Success result:', result);
      
      if (onPageCreated) {
        onPageCreated(result.data, result.isUpdate);
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
      console.log('usePageOperations - getAllPages called with:', { query, options });
      
      const response = await fetch('/api/page/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, options })
      });

      console.log('usePageOperations - Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('usePageOperations - Error response:', errorData);
        throw new Error(errorData.message || 'Failed to get pages');
      }

      const result = await response.json();
      console.log('usePageOperations - Success result:', result);
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
        },
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

  const updatePage = async (pageId: string, updateData: any) => {
    try {
      const response = await fetch(`/api/page/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
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
        },
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
    isCreatingPage,
  };
};
