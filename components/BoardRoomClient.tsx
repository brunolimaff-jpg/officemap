'use client';

import { useState, useMemo } from 'react';
import { Office } from '@/components/Office';
import { GroupSelector } from '@/components/GroupSelector';
import { ConvocationPanel } from '@/components/ConvocationPanel';
import { useConvocation } from '@/hooks/useConvocation';
import { useSessionMemory } from '@/hooks/useSessionMemory';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { SpecialistId, SpecialistStatus, Message } from '@/types';

export default function BoardRoomClient() {
  const { state: convocationState, toggleSpecialist, openGroupConvocation, closeConvocation } = useConvocation();
  const { getMessages, addMessage, updateLastMessage } = useSessionMemory();
  
  const [specialistStatuses, setSpecialistStatuses] = useState<Record<SpecialistId, SpecialistStatus>>({} as any);

  const sessionKey = useMemo(() => {
    return convocationState.selectedIds.sort().join('-');
  }, [convocationState.selectedIds]);

  const currentMessages = getMessages(sessionKey);

  const handleMessageStart = (role: 'assistant', specialistId?: SpecialistId) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      role,
      content: '',
      specialistId,
    };
    addMessage(sessionKey, newMsg);

    if (specialistId) {
      setSpecialistStatuses((prev) => ({ ...prev, [specialistId]: 'responding' }));
    } else if (convocationState.selectedIds.length === 1) {
      setSpecialistStatuses((prev) => ({ ...prev, [convocationState.selectedIds[0]]: 'responding' }));
    }
  };

  const handleMessageUpdate = (content: string) => {
    updateLastMessage(sessionKey, content);
  };

  const handleSpecialistDone = (specialistId?: SpecialistId) => {
    if (specialistId) {
      setSpecialistStatuses((prev) => ({ ...prev, [specialistId]: 'available' }));
    }
  };

  const handleMessageComplete = () => {
    // Ensure all are reset
    setSpecialistStatuses((prev) => {
      const newStatuses = { ...prev };
      convocationState.selectedIds.forEach((id) => {
        newStatuses[id] = 'available';
      });
      return newStatuses;
    });
  };

  const { sendMessage, stopStreaming, status: streamStatus } = useStreamingChat({
    onMessageStart: handleMessageStart,
    onMessageUpdate: handleMessageUpdate,
    onSpecialistDone: handleSpecialistDone,
    onMessageComplete: handleMessageComplete,
    onError: handleMessageComplete,
  });

  const handleSendMessage = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    addMessage(sessionKey, userMsg);

    // Set thinking status
    setSpecialistStatuses((prev) => {
      const newStatuses = { ...prev };
      convocationState.selectedIds.forEach((id) => {
        newStatuses[id] = 'thinking';
      });
      return newStatuses;
    });

    if (convocationState.isGroup) {
      await sendMessage(
        'group',
        {
          specialistIds: convocationState.selectedIds,
          userMessage: content,
        },
        sessionKey
      );
    } else {
      await sendMessage(
        'single',
        {
          specialistId: convocationState.selectedIds[0],
          messages: [...currentMessages, userMsg],
        },
        sessionKey
      );
    }
  };

  return (
    <main className="w-full h-screen bg-[#0F172A] overflow-hidden font-sans">
      <Office
        selectedSpecialists={convocationState.selectedIds}
        onSpecialistClick={toggleSpecialist}
        specialistStatuses={specialistStatuses}
      />

      <GroupSelector
        selectedIds={convocationState.selectedIds}
        onConvoke={openGroupConvocation}
        onClear={closeConvocation}
      />

      <ConvocationPanel
        isOpen={convocationState.isOpen}
        onClose={closeConvocation}
        selectedIds={convocationState.selectedIds}
        messages={currentMessages}
        onSendMessage={handleSendMessage}
        streamStatus={streamStatus}
        stopStreaming={stopStreaming}
      />
    </main>
  );
}
