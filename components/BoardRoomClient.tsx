'use client';

import { useState, useMemo } from 'react';
import { HabboRoom } from '@/components/HabboRoom';
import { HabboNavigator } from '@/components/HabboNavigator';
import { HabboTopBar } from '@/components/HabboTopBar';
import { HabboChatBar } from '@/components/HabboChatBar';
import { ConvocationPanel } from '@/components/ConvocationPanel';
import { useConvocation } from '@/hooks/useConvocation';
import { useSessionMemory } from '@/hooks/useSessionMemory';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { rooms, specialists } from '@/data/specialists';
import { RoomId, SpecialistId, SpecialistStatus, Message } from '@/types';

export default function BoardRoomClient() {
  const [currentRoomId, setCurrentRoomId] = useState<RoomId>('director');

  const { state: convocationState, toggleSpecialist, openGroupConvocation, closeConvocation } = useConvocation();
  const { getMessages, addMessage, updateLastMessage } = useSessionMemory();
  const [specialistStatuses, setSpecialistStatuses] = useState<Record<SpecialistId, SpecialistStatus>>({} as Record<SpecialistId, SpecialistStatus>);

  const sessionKey = useMemo(
    () => [...convocationState.selectedIds].sort().join('-'),
    [convocationState.selectedIds]
  );
  const currentMessages = getMessages(sessionKey);

  const handleMessageStart = (role: 'assistant', specialistId?: SpecialistId) => {
    addMessage(sessionKey, { id: Date.now().toString(), role, content: '', specialistId });
    if (specialistId) {
      setSpecialistStatuses(prev => ({ ...prev, [specialistId]: 'responding' }));
    } else if (convocationState.selectedIds.length === 1) {
      setSpecialistStatuses(prev => ({ ...prev, [convocationState.selectedIds[0]]: 'responding' }));
    }
  };

  const handleMessageUpdate = (content: string) => updateLastMessage(sessionKey, content);

  const handleSpecialistDone = (specialistId?: SpecialistId) => {
    if (specialistId) setSpecialistStatuses(prev => ({ ...prev, [specialistId]: 'available' }));
  };

  const handleMessageComplete = () => {
    setSpecialistStatuses(prev => {
      const next = { ...prev };
      convocationState.selectedIds.forEach(id => { next[id] = 'available'; });
      return next;
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
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
    addMessage(sessionKey, userMsg);
    setSpecialistStatuses(prev => {
      const next = { ...prev };
      convocationState.selectedIds.forEach(id => { next[id] = 'thinking'; });
      return next;
    });
    if (convocationState.isGroup) {
      await sendMessage('group', { specialistIds: convocationState.selectedIds, userMessage: content }, sessionKey);
    } else {
      await sendMessage('single', { specialistId: convocationState.selectedIds[0], messages: [...currentMessages, userMsg] }, sessionKey);
    }
  };

  const handleRoomChange = (id: RoomId) => {
    setCurrentRoomId(id);
    closeConvocation();
  };

  const handleMeetingRoom = () => {
    setCurrentRoomId('meeting');
    closeConvocation();
  };

  // Determine which specialists appear in the current room
  const roomSpecialists = useMemo(() => {
    if (currentRoomId === 'meeting') {
      // All specialists in meeting room, use meeting positions
      return specialists.map(s => ({
        ...s,
        col: s.meetingCol,
        row: s.meetingRow,
      }));
    }
    return specialists
      .filter(s => s.homeRoomId === currentRoomId)
      .map(s => ({ ...s }));
  }, [currentRoomId]);

  const currentRoom = rooms.find(r => r.id === currentRoomId)!;
  const showBruno = currentRoomId === 'director' || currentRoomId === 'meeting';

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden font-sans" style={{ background: '#060D16' }}>
      {/* Top bar */}
      <HabboTopBar currentRoomId={currentRoomId} />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigator */}
        <HabboNavigator currentRoom={currentRoomId} onRoomChange={handleRoomChange} />

        {/* Room view */}
        <div
          className="flex-1 relative overflow-auto flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at center, #0D1B2A 0%, #060D16 100%)',
          }}
        >
          {/* Room name label */}
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 font-pixel text-[8px] px-3 py-1 rounded z-10 pointer-events-none"
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#93C5FD',
              backdropFilter: 'blur(4px)',
            }}
          >
            {currentRoom?.name}
          </div>

          <HabboRoom
            room={currentRoom}
            specialists={roomSpecialists}
            showBruno={showBruno}
            selectedSpecialists={convocationState.selectedIds}
            onSpecialistClick={toggleSpecialist}
            specialistStatuses={specialistStatuses}
          />
        </div>

        {/* Chat panel */}
        <ConvocationPanel
          isOpen={convocationState.isOpen}
          onClose={closeConvocation}
          selectedIds={convocationState.selectedIds}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          streamStatus={streamStatus}
          stopStreaming={stopStreaming}
        />
      </div>

      {/* Bottom bar */}
      <HabboChatBar
        selectedIds={convocationState.selectedIds}
        onGroupConvoke={openGroupConvocation}
        onClearSelection={closeConvocation}
        onMeetingRoom={handleMeetingRoom}
      />
    </div>
  );
}
