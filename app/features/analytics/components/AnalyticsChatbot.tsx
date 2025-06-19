"use client"

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Bot, X, Maximize2, Minimize2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: string;
}

export function AnalyticsChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: 'Hi! I can help you analyze your data. Try asking questions like:\n\n• Which content is currently going viral?\n• Which miniapp generates the most new user registrations?\n• What\'s the current user engagement trend?',
    type: 'bot',
    timestamp: new Date().toISOString()
  }]);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      type: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      let response = '';
      const lowercaseMessage = message.toLowerCase();

      if (lowercaseMessage.includes('viral') || lowercaseMessage.includes('trending')) {
        response = "Based on current metrics, the 'Lebanese Street Food Tour' video is going viral with 250K views in the last 24 hours, showing a 180% increase in engagement rate.";
      } else if (lowercaseMessage.includes('registrations') || lowercaseMessage.includes('sign ups')) {
        response = "The Deals app is currently leading in new user registrations with 2.5K sign-ups today, followed by Blood app with 1.8K. This represents a 25% increase from last week's average.";
      } else if (lowercaseMessage.includes('engagement')) {
        response = "User engagement is up 15% this week. The Pulse app shows the highest average session duration at 8.5 minutes, while the Weather app has the highest daily active user ratio at 65%.";
      } else {
        response = "I understand you're asking about analytics, but could you please be more specific? You can ask about content performance, user engagement, app usage, or revenue metrics.";
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        content: response,
        type: 'bot',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  }, [message]);

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-[#FF0000] hover:bg-[#CC0000] shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 flex flex-col bg-white shadow-xl transition-all duration-200",
      isExpanded ? "w-[600px] h-[600px]" : "w-[380px] h-[500px]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#FF0000]" />
          <h3 className="font-medium">Analytics Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.type === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[80%] rounded-lg p-3",
              msg.type === 'user'
                ? "bg-[#FF0000] text-white"
                : "bg-gray-100"
            )}>
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your analytics..."
            className="resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            className="bg-[#FF0000] hover:bg-[#CC0000]"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default AnalyticsChatbot;