import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, Maximize, Square
} from 'lucide-react';
import Hls from 'hls.js';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // 从localStorage加载频道数据
  useEffect(() => {
    const savedChannels = localStorage.getItem('channels');
    if (savedChannels) {
      const channels = JSON.parse(savedChannels);
      if (channels.length > 0) {
        setSelectedChannel(channels[0]);
      }
    }
  }, []);

  // 切换播放/暂停
  const togglePlay = async () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        try {
          await video.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('播放被阻止:', error);
        }
      }
    }
  };

  // 音量控制
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume / 100;
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      if (video?.requestFullscreen) {
        video.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // 全屏控制
  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    const video = videoRef.current;
    if (video) {
      video.currentTime = newTime;
    }
  };

  // 格式化时间
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return hrs > 0 
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // 初始化HLS播放器
  useEffect(() => {
    let hls = null;
    
    const initializePlayer = () => {
      if (videoRef.current && selectedChannel) {
        const video = videoRef.current;
        
        // 清理之前的播放器实例
        if (hls) {
          hls.destroy();
        }
        
        // 如果是MPEG-DASH流，使用Shaka Player，否则使用HLS.js
        if (selectedChannel.url && selectedChannel.url.includes('.m3u8')) {
          if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(selectedChannel.url);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              // 在初始加载时自动播放
              video.play().catch(error => {
                console.log('自动播放被阻止:', error);
              });
              setIsPlaying(true);
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari原生支持HLS
            video.src = selectedChannel.url;
            video.play().catch(error => {
              console.log('自动播放被阻止:', error);
            });
            setIsPlaying(true);
          }
        } else {
          // 对于非HLS流，直接使用src属性
          video.src = selectedChannel.url;
          video.play().catch(error => {
            console.log('自动播放被阻止:', error);
          });
          setIsPlaying(true);
        }
        
        // 音量控制
        video.volume = volume / 100;
      }
    };
    
    initializePlayer();
    
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [selectedChannel]);
  
  // 监听播放状态变化
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // 只有当视频时长有效且大于当前时长时才更新（避免直播流的无效时长）
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };
    const handleLoadedMetadata = () => {
      // 当元数据加载完成后更新时长，但仅当视频是点播而非直播时
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };
    const handleWaiting = () => {
      // 视频缓冲时的状态
    };
    const handleCanPlay = () => {
      // 视频准备好播放时
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);
  
  // 控制音量
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume / 100;
    }
  }, [volume]);
  
  // 接收外部传入的频道
  useEffect(() => {
    const handleChannelChange = (event) => {
      setSelectedChannel(event.detail);
      // 不再自动设置为播放状态，而是保持当前播放状态
    };
    
    window.addEventListener('channelChange', handleChannelChange);
    
    return () => {
      window.removeEventListener('channelChange', handleChannelChange);
    };
  }, []);

  return (
    <div className="hidden md:block w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">播放器</h2>
      </div>
      
      <div 
        className="flex-1 flex flex-col relative bg-black"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* 视频播放区域 */}
        <div className="flex-1 flex items-center justify-center relative bg-gray-900">
          {selectedChannel ? (
            <>
              <video 
                ref={videoRef}
                className="w-full h-full object-contain"
                poster=""
                playsInline
                preload="metadata"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                {selectedChannel.name}
              </div>
              
              {/* 播放控制按钮 */}
              {showControls && (
                <div className="absolute inset-0 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                  <button 
                    className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-75 transition-all"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500">
              <Square size={48} className="mx-auto mb-2" />
              <p>请选择频道开始播放</p>
            </div>
          )}
        </div>
        
        {/* 播放控制条 */}
        <div className={`bg-gray-800 bg-opacity-80 p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* 进度条 */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={duration || 100} // 当duration未确定时，使用100作为默认值
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* 控制按钮 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={togglePlay}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <div className="flex items-center space-x-2">
                <Volume2 size={20} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              

            </div>
            
            <div className="flex items-center space-x-2">

              <button onClick={toggleFullscreen}>
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;