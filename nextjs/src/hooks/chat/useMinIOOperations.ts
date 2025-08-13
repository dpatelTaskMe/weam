import { useState, useCallback } from 'react';

interface UseMinIOOperationsProps {
  onUploadSuccess?: (uploadData: any) => void;
  onError?: (error: string) => void;
}

export const useMinIOOperations = ({ 
  onUploadSuccess, 
  onError 
}: UseMinIOOperationsProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocumentToMinIO = async (documentData: {
    content: string;
    filename?: string;
    contentType?: string;
  }) => {
    try {
      setIsUploading(true);
      
      console.log('useMinIOOperations - Sending documentData:', JSON.stringify(documentData, null, 2));
      
      const response = await fetch('/api/minio/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData)
      });

      console.log('useMinIOOperations - Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('useMinIOOperations - Error data:', errorData);
        throw new Error(errorData.message || 'Failed to upload document to MinIO');
      }

      const result = await response.json();
      console.log('useMinIOOperations - Success result:', result);
      
      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Error uploading document to MinIO:', error);
      if (onError) {
        onError(error.message);
      }
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const listDocumentsFromMinIO = async (prefix?: string) => {
    try {
      const queryParams = prefix ? `?prefix=${encodeURIComponent(prefix)}` : '';
      const response = await fetch(`/api/minio/list${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to list documents from MinIO');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error listing documents from MinIO:', error);
      throw error;
    }
  };

  const deleteDocumentFromMinIO = async (objectName: string) => {
    try {
      const response = await fetch(`/api/minio/delete/${encodeURIComponent(objectName)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete document from MinIO');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting document from MinIO:', error);
      throw error;
    }
  };

  return {
    uploadDocumentToMinIO,
    listDocumentsFromMinIO,
    deleteDocumentFromMinIO,
    isUploading,
  };
};




