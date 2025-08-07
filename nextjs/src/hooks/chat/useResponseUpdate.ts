import { useState, useCallback } from 'react';

interface UseResponseUpdateProps {
  onUpdateResponse?: (messageId: string, updatedResponse: string) => void;
  onUpdateConversation?: (updatedConversations: any[]) => void;
}

export const useResponseUpdate = ({ 
  onUpdateResponse, 
  onUpdateConversation 
}: UseResponseUpdateProps = {}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateResponseInDatabase = async (messageId: string, updatedResponse: string) => {
    try {
      const response = await fetch(`/api/message/update/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ai: updatedResponse
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error('Failed to update response in database');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating response in database:', error);
      throw error;
    }
  };

  const handleResponseUpdate = useCallback(async (messageId: string, updatedResponse: string) => {
    try {
      setIsUpdating(true);
      
      // Update in database first
      await updateResponseInDatabase(messageId, updatedResponse);
      
      // Then update the UI
      if (onUpdateResponse) {
        await onUpdateResponse(messageId, updatedResponse);
      }
      
    } catch (error) {
      console.error('Error updating response:', error);
      throw error; // Re-throw to let the component handle the error
    } finally {
      setIsUpdating(false);
    }
  }, [onUpdateResponse]);

  const updateConversationResponse = useCallback((conversations: any[], messageId: string, updatedResponse: string) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === messageId) {
        return {
          ...conv,
          response: updatedResponse
        };
      }
      return conv;
    });

    if (onUpdateConversation) {
      onUpdateConversation(updatedConversations);
    }

    return updatedConversations;
  }, [onUpdateConversation]);

  return {
    handleResponseUpdate,
    updateConversationResponse,
    isUpdating
  };
}; 