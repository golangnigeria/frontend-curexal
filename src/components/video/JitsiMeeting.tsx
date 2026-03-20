import React, { useRef, useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface JitsiMeetingRoomProps {
  roomName: string;
  displayName: string;
  email: string;
  onReadyToClose?: () => void;
}

interface JitsiExternalApi {
  addEventListener: (event: string, callback: () => void) => void;
}

export const JitsiMeetingRoom: React.FC<JitsiMeetingRoomProps> = ({ 
  roomName, 
  displayName, 
  email,
  onReadyToClose
}) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiRef = useRef<JitsiExternalApi | null>(null);

  const handleAPI = (jitsiApi: JitsiExternalApi) => {
    setLoading(false);
    apiRef.current = jitsiApi;
    jitsiApi.addEventListener('videoConferenceLeft', () => {
      if (onReadyToClose) {
        onReadyToClose();
      } else {
        navigate(-1);
      }
    });
  };

  return (
    <div className="relative w-full h-[80vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900 z-10 transition-opacity">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
          <p className="text-lg font-medium">Connecting to secure meeting...</p>
          <p className="text-sm text-slate-400 mt-2">End-to-end encrypted link</p>
        </div>
      )}
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false,
        }}
        userInfo={{
          displayName: displayName,
          email: email,
        }}
        onApiReady={(externalApi) => handleAPI(externalApi)}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
          iframeRef.style.border = 'none';
        }}
      />
    </div>
  );
};

export default JitsiMeetingRoom;
