import ForkIcon from '@/icons/ForkIcon';
import MessagingIcon from '@/icons/MessagingIcon';
import PromptIcon from '@/icons/Prompt';
import React, { useCallback, useState } from 'react';
import useModal from '@/hooks/common/useModal';
import ForkChatModal from './ForkChatModal';
import AddNewPromptModal from '@/components/Prompts/AddNewPromptModal';
import CopyIcon from '@/icons/CopyIcon';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { AgentChatPayloadType, ConversationType, DocumentChatPayloadType, NormalChatPayloadType, ProAgentDataType } from '@/types/chat';
import { Socket } from 'socket.io-client';

type HoverActionIconProps = {
    content: string,
    proAgentData: ProAgentDataType,
    conversation: ConversationType[],
    sequence: string | number,
    onOpenThread: () => void,
    copyToClipboard: (content: string) => void,
    index?: number,
    chatId?: string,
    socket?: Socket,
    getAINormatChatResponse?: (payload: NormalChatPayloadType, socket: Socket) => void,
    getAICustomGPTResponse?: (payload: AgentChatPayloadType, socket: Socket) => void,
    getPerplexityResponse?: (socket: Socket, payload: unknown) => void,
    getAIDocResponse?: (payload: DocumentChatPayloadType, socket: Socket) => void,
    setConversations: (payload: ConversationType[]) => void,
    custom_gpt_id?: string,
    getAgentContent: (proAgentData: ProAgentDataType) => string,
    onAddToPages?: () => void,
    hasBeenEdited?: boolean
}

type HoverActionTooltipProps = {
    children: React.ReactNode,
    content: string,
    onClick: () => void,
    className?: string
}

const HoverActionTooltip = ({ children, content, onClick, className }: HoverActionTooltipProps) => {
    return (
        <span
            onClick={onClick}
            className={className}
        >
            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                <Tooltip>
                    <TooltipTrigger>
                        {children}
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p className="text-font-14">{content}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </span>
    )
}

const HoverActionIcon = React.memo(({ content, proAgentData, conversation, sequence, onOpenThread, copyToClipboard, getAgentContent, index, chatId, socket, getAINormatChatResponse, getAICustomGPTResponse, getPerplexityResponse, getAIDocResponse, setConversations, custom_gpt_id, onAddToPages, hasBeenEdited }: HoverActionIconProps) => {
    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isForkOpen, openModal: openForkModal, closeModal: closeForkModal } = useModal();
    const { isOpen: isDownloadOpen, openModal: openDownloadModal, closeModal: closeDownloadModal } = useModal();
    const [forkData, setForkData] = useState([]);

    let copyContent = content;
    if(proAgentData?.code){
        copyContent = getAgentContent(proAgentData);
    }
    
    const handleForkChanges = useCallback(() => {
        const data = conversation.filter((c: ConversationType) => {
            let seqValue = c.seq;
            if (typeof seqValue === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(seqValue)) {
                seqValue = new Date(seqValue).getTime(); // Convert ISO date to timestamp
            }
            if (typeof sequence === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(sequence)) {
                sequence = new Date(sequence).getTime();
            }
            if (seqValue <= sequence) {
                return {
                    message: c.message,
                    response: c.response,
                    responseModel: c.responseModel,
                    responseAddKeywords: c?.responseAddKeywords,
                    cloneMedia: c?.cloneMedia,
                    customGptId: c?.customGptId,
                    customGptTitle: c?.customGptTitle,
                    coverImage: c?.coverImage,
                    id: c?.id
                };
            }
        });
        setForkData(data);
    }, [conversation]);

    return (
        <div
      className={`${conversation.length - 1 === index ? '' : 'xl:invisible'} xl:group-hover:visible z-[1] absolute xl:right-[30px] top-auto xl:top-auto bottom-1 max-md:bottom-0 right-auto xl:left-auto left-[40px] flex items-center rounded-custom xl:bg-transparent transition ease-in-out duration-150`}
    >
            {/* Fork start */}
            <HoverActionTooltip 
                content='Fork this chat'
                onClick={() => {
                    openForkModal();
                    handleForkChanges();
                }}
                className="cursor-pointer flex items-center justify-center xl:w-8 w-6 h-8 xl:min-w-8 rounded-custom p-1 transition ease-in-out duration-150 hover:bg-b12"
            >
                <ForkIcon className='lg:h-[15px] h-[12px] w-auto fill-b6 object-contain'/>
            </HoverActionTooltip>
            {isForkOpen && (
                <ForkChatModal
                    open={openForkModal}
                    closeModal={closeForkModal}
                    forkData={forkData}
                />
            )}
            {/* Fork End */}

            {/* Chat start */}
            <HoverActionTooltip
                content='Reply in thread'
                onClick={onOpenThread}
                className="cursor-pointer flex items-center justify-center lg:w-8 w-6 h-8 lg:min-w-8 rounded-custom p-1 transition ease-in-out duration-150 [&>svg]:h-[18px] [&>svg]:w-auto [&>svg]:max-w-full [&>svg]:fill-b6 hover:bg-b12"
            >
                <MessagingIcon className="lg:h-[15px] h-[14px] w-auto fill-b6 object-contain" />
            </HoverActionTooltip>
            {/* Chat End */}

            {/* Prompts start */}
            <HoverActionTooltip
                content='Save this Prompt'
                onClick={() => openModal()}
                className="cursor-pointer flex items-center justify-center lg:w-8 w-6 h-8 lg:min-w-8 rounded-custom p-1 transition ease-in-out duration-150 [&>svg]:h-[16px] [&>svg]:w-auto [&>svg]:max-w-full [&>svg]:fill-b6 hover:bg-b12"
            >
                <PromptIcon
                    open={isOpen}
                    closeModal={closeModal}
                    className="lg:h-[13px] h-[12px] w-auto fill-b6 object-contain"
                />
            </HoverActionTooltip>
            {isOpen && (
                <AddNewPromptModal
                    open={isOpen}
                    closeModal={closeModal}
                    mycontent={content}
                    chatprompt={true}
                />
            )}
            {/* Prompts End */}

            {/* Copy start */}
            <HoverActionTooltip
                content='Copy Text'
                onClick={() => copyToClipboard(copyContent)}
                className="cursor-pointer flex items-center justify-center lg:w-8 w-5 h-8 md:min-w-8 rounded-custom p-1 transition ease-in-out duration-150 [&>svg]:h-[18px] [&>svg]:w-auto [&>svg]:max-w-full [&>svg]:fill-b6 hover:bg-b12"
            >
                <CopyIcon className="lg:h-[15px] h-[14px] w-auto fill-b6 object-contain" />
            </HoverActionTooltip>
            {/* Copy End */}

            {/* Download start */}
            <HoverActionTooltip
                content='Download Response'
                onClick={openDownloadModal}
                className="cursor-pointer flex items-center justify-center lg:w-8 w-5 h-8 md:min-w-8 rounded-custom p-1 transition ease-in-out duration-150 [&>svg]:h-[18px] [&>svg]:w-auto [&>svg]:max-w-full [&>svg]:fill-b6 hover:bg-b12"
            >
                <img 
                    src="/File-download-01.jpg" 
                    alt="Download" 
                    className="lg:h-[15px] h-[14px] w-auto object-contain"
                />
            </HoverActionTooltip>
            {isDownloadOpen && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px]">
                    <div className="py-1">
                        <button
                            onClick={() => {
                                const { downloadResponse } = require('@/utils/downloadUtils');
                                downloadResponse(copyContent, 'pdf', {
                                    title: 'AI Response',
                                    filename: 'weam-ai-response',
                                    includeTimestamp: true
                                });
                                closeDownloadModal();
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            PDF
                        </button>
                        
                        <button
                            onClick={() => {
                                const { downloadResponse } = require('@/utils/downloadUtils');
                                downloadResponse(copyContent, 'html', {
                                    title: 'AI Response',
                                    filename: 'weam-ai-response',
                                    includeTimestamp: true
                                });
                                closeDownloadModal();
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            HTML
                        </button>
                        
                        <button
                            onClick={() => {
                                const { downloadResponse } = require('@/utils/downloadUtils');
                                downloadResponse(copyContent, 'txt', {
                                    title: 'AI Response',
                                    filename: 'weam-ai-response',
                                    includeTimestamp: true
                                });
                                closeDownloadModal();
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            TXT
                        </button>
                    </div>
                </div>
            )}
            {/* Download End */}

            {/* Add to Pages - Always show for testing */}
            {onAddToPages && (
                <HoverActionTooltip
                    content='Add to Pages'
                    onClick={onAddToPages}
                    className="cursor-pointer flex items-center justify-center lg:w-8 w-5 h-8 md:min-w-8 rounded-custom p-1 transition ease-in-out duration-150 [&>svg]:h-[18px] [&>svg]:w-auto [&>svg]:max-w-full [&>svg]:fill-b6 hover:bg-b12"
                >
                    <svg className="lg:h-[15px] h-[14px] w-auto fill-b6 object-contain" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </HoverActionTooltip>
            )}
            {/* Debug info */}
            {(() => { console.log('HoverActionIcon Debug:', { hasBeenEdited, hasOnAddToPages: !!onAddToPages }); return null; })()}

            {/* {
                conversation.length - 1 === index && (
                    <RegenerateResponse 
                        conversation={conversation} 
                        chatId={chatId} 
                        socket={socket} 
                        getAINormatChatResponse={getAINormatChatResponse}
                        getAICustomGPTResponse={getAICustomGPTResponse}
                        getPerplexityResponse={getPerplexityResponse}
                        getAIDocResponse={getAIDocResponse}
                        setConversations={setConversations}
                        custom_gpt_id={custom_gpt_id}
                    />
                )
            } */}
        </div>
    );
});

export default HoverActionIcon;
