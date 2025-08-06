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

  const handleResponseUpdate = useCallback(async (messageId: string, updatedResponse: string) => {
    try {
      setIsUpdating(true);
      
      // Call the provided update function
      if (onUpdateResponse) {
        await onUpdateResponse(messageId, updatedResponse);
      }
      
      // You can also make an API call here to persist the changes
      // await updateResponseInDatabase(messageId, updatedResponse);
      
    } catch (error) {
      console.error('Error updating response:', error);
      // You might want to show a toast notification here
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