'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Message } from '@/app/features/chat/types';
import { simulateAIResponse } from '@/app/features/chat/services/chatService';
import { formatMessageContent } from '@/app/features/chat/utils/chat';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I can help you with analytics, user management, revenue optimization, and administrative tasks. What would you like to know or do today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = simulateAIResponse(content);
      const responseMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => prev.slice(0, -1).concat(responseMessage));
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="relative h-full flex flex-col bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-100' 
                  : 'bg-red-100'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bot className="w-4 h-4 text-red-600" />
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                <Card className={`${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <CardContent className="p-4">
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        <span className="text-gray-500">Thinking...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-900'} break-words whitespace-pre-line`}>
                          {formatMessageContent(message.content)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Timestamp */}
                <p className="text-xs text-gray-400 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 p-4">
        <form className="flex w-full space-x-3" onSubmit={e => { e.preventDefault(); handleSendMessage(inputValue); }}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about analytics, user management, or platform optimization..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            disabled={isLoading}
            className="text-sm flex-1"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        <div className="mt-3 text-xs text-gray-500 w-full text-center">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default Chat; 