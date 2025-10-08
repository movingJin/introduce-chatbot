import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '../components/ChatMessage';
import FloatingInput from '../components/FloatingInput';
import ProfileMenu from '../components/ProfileMenu';
import { getAnswer } from '../services/api';
import type { ChatMessage as ChatMessageType } from '../types';
import { Loader2 } from 'lucide-react';

const MainFrame: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // 사용자 메시지 추가
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // API 호출
      const response = await getAnswer(content);

      // 어시스턴트 메시지 추가
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // 에러 메시지 추가
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 응답을 받아오는 중 오류가 발생했습니다.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-background border-b border-border px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">인물소개 챗봇</h1>
          <ProfileMenu />
        </div>
      </header>

      {/* 메시지 영역 */}
      <main className="flex-1 overflow-y-auto pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  안녕하세요! 👋
                </h2>
                <p className="text-muted-foreground">
                  궁금한 점을 물어보세요. 등록된 인물에 대한 정보를 알려드리겠습니다.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {loading && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground">응답 생성 중...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      {/* 입력창 */}
      <FloatingInput onSubmit={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default MainFrame;

