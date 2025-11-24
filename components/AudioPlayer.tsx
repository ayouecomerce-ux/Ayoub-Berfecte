import React, { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  isPlaying: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Attempt to play. Browsers might block if no interaction occurred yet.
        // The parent component should set isPlaying=true only after a user click.
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Audio autoplay blocked until interaction:", error);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <audio
      ref={audioRef}
      src="https://files.catbox.moe/7hz6oi.mp3"
      loop
      className="hidden"
      preload="auto"
    />
  );
};

export default AudioPlayer;