import React, { useState } from 'react';
import useModal from '@/hooks/common/useModal';

interface AddPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string) => void;
    defaultTitle?: string;
}

const AddPageModal: React.FC<AddPageModalProps> = ({ isOpen, onClose, onSave, defaultTitle = '' }) => {
    const [title, setTitle] = useState(defaultTitle);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Please enter a page title');
            return;
        }

        setIsLoading(true);
        try {
            await onSave(title.trim());
            setTitle('');
            onClose();
        } catch (error) {
            console.error('Error saving page:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add to Pages</h3>
                    <input
                        id="page-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter page title..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleSave}
                        disabled={isLoading || !title.trim()}
                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPageModal;
