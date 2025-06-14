import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { sendMessageToDb, getAllMessages } from '../services/chatService';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0px);
  }
`;

const LifeContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  z-index: 1000;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
  
  /* 背景图片层 - 使用绝对定位确保完全覆盖 */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: -2;
    transform: scale(1.1);
    transform-origin: center center;
  }
  
  /* 动态背景图片层 */
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: inherit;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: -1;
    transform: scale(1.1);
    transform-origin: center center;
    transition: background-image 2s ease-in-out;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  width: 90%;
  max-width: 1200px;
  height: 80%;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 60px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  
  .dynamic-clock {
    width: 60px;
    height: 60px;
    border: 3px solid white;
    border-radius: 50%;
    margin-right: 15px;
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    
    /* 12点刻度 */
    .hour-mark {
      position: absolute;
      width: 1.5px;
      height: 6px;
      background: rgba(255, 255, 255, 0.8);
      top: 3px;
      left: 50%;
      transform-origin: 50% 27px;
      transform: translateX(-50%);
      border-radius: 1px;
      
      &:nth-child(1) { transform: translateX(-50%) rotate(0deg); }
      &:nth-child(2) { transform: translateX(-50%) rotate(30deg); }
      &:nth-child(3) { transform: translateX(-50%) rotate(60deg); }
      &:nth-child(4) { transform: translateX(-50%) rotate(90deg); }
      &:nth-child(5) { transform: translateX(-50%) rotate(120deg); }
      &:nth-child(6) { transform: translateX(-50%) rotate(150deg); }
      &:nth-child(7) { transform: translateX(-50%) rotate(180deg); }
      &:nth-child(8) { transform: translateX(-50%) rotate(210deg); }
      &:nth-child(9) { transform: translateX(-50%) rotate(240deg); }
      &:nth-child(10) { transform: translateX(-50%) rotate(270deg); }
      &:nth-child(11) { transform: translateX(-50%) rotate(300deg); }
      &:nth-child(12) { transform: translateX(-50%) rotate(330deg); }
      
      /* 主要时间点（12, 3, 6, 9点）更粗更长 */
      &:nth-child(1), &:nth-child(4), &:nth-child(7), &:nth-child(10) {
        width: 2.5px;
        height: 10px;
        background: white;
        top: 2px;
      }
    }
    
    /* 中心点 */
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      background: white;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
    }
    
    .hour-hand {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 16px;
      background: white;
      transform-origin: bottom center;
      transform: translate(-50%, -100%);
      border-radius: 1px;
      z-index: 2;
    }
    
    .minute-hand {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 22px;
      background: white;
      transform-origin: bottom center;
      transform: translate(-50%, -100%);
      border-radius: 0.5px;
      z-index: 2;
    }
    
    .second-hand {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0.5px;
      height: 24px;
      background: #ff4444;
      transform-origin: bottom center;
      transform: translate(-50%, -100%);
      border-radius: 0.25px;
      z-index: 3;
      transition: transform 0.1s ease-out;
    }
  }
  
  .logo-text {
    font-size: 2.5rem;
    font-weight: 300;
    font-style: italic;
  }
`;

const Quote = styled.div`
  background: rgba(0, 0, 0, 0.4);
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  width: 500px;
  
  .quote-text {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 10px;
  }
  
  .quote-author {
    font-size: 0.9rem;
    opacity: 0.8;
    text-align: right;
  }
`;

const TimeWeatherCard = styled.div`
  background: rgba(0, 0, 0, 0.4);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  margin-bottom: 30px;
  width: 400px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(-2px);
  }
  
  .date {
    font-size: 1rem;
    opacity: 0.8;
    margin-bottom: 10px;
  }
  
  .time {
    font-size: 3rem;
    font-weight: 300;
    margin-bottom: 15px;
    font-family: 'Courier New', monospace;
  }
  
  .weather {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const FunctionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 350px;
`;

const FunctionCard = styled.div`
  background: rgba(0, 0, 0, 0.4);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
  
  .label {
    font-size: 0.9rem;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  z-index: 3;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.6);
    transform: translateX(-2px);
  }
`;

const NetworkStatus = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.4);
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  z-index: 3;
  
  .status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #4CAF50;
    border-radius: 50%;
    margin-right: 8px;
  }
`;

const Footer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  opacity: 0.7;
  z-index: 3;
`;

const MusicPlayer = styled.div`
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 12px 16px;
  margin-top: 0px;
  width: 525px;
  
  .music-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;
    
    .nav-btn {
      width: 26px;
      height: 26px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 0.7rem;
      flex-shrink: 0;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }
    }
    
    .music-info {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      min-width: 0;
      flex: 1;
      
      .song-title {
        font-size: 0.9rem;
        font-weight: 500;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 140px;
      }
      
      .separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.8rem;
        flex-shrink: 0;
      }
      
      .song-artist {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.7);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 80px;
      }
      
      .time-separator {
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.7rem;
        flex-shrink: 0;
        margin: 0 4px;
      }
      
      .time-display {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.6);
        font-family: 'Courier New', monospace;
        flex-shrink: 0;
      }
    }
  }
  
  .music-controls-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    
    .play-controls {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
      
      .control-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        font-size: 0.75rem;
        
        &:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
        
        &.play-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          
          &:hover {
            background: linear-gradient(135deg, #5a6fd8, #6a4190);
          }
        }
      }
    }
    
    .progress-wrapper {
      flex: 1;
      min-width: 0;
    }
  }
  
  .progress-container {
    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
      
      &:hover {
        height: 6px;
        background: rgba(255, 255, 255, 0.3);
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 2px;
        transition: width 0.1s ease;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          right: -1px;
          top: 50%;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: translateY(-50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      }
      
      &:hover .progress-fill::after {
        opacity: 1;
      }
    }
  }
`;

// 留言板样式
const MessageBoard = styled.div`
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 16px;
  margin-top: 20px;
  width: 525px;
  
  .message-input-container {
    display: flex;
    gap: 8px;
    align-items: center;
    
    .message-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 8px 16px;
      color: white;
      font-size: 0.9rem;
      outline: none;
      transition: all 0.3s ease;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      
      &:focus {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.4);
      }
    }
    
    .send-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      
      &:hover {
        background: linear-gradient(135deg, #5a6fd8, #6a4190);
        transform: scale(1.1);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
    }
  }
  
  .message-stats {
    margin-top: 8px;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
  }
`;

const DanmakuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
`;

const DanmakuItem = styled.div`
  position: absolute;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 400;
  white-space: nowrap;
  animation: danmaku-move 30s linear infinite;
  background: ${props => props.color || 'rgba(0, 0, 0, 0.4)'};
  padding: 8px 16px;
  border-radius: 18px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  top: ${props => props.top}%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.7;
  
  @keyframes danmaku-move {
    from {
      transform: translateX(100vw);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;

// 背景图片列表
const backgroundImages = [
  '/Life/Background/1.png',
  '/Life/Background/2.png',
  '/Life/Background/3.png',
  '/Life/Background/4.png',
  '/Life/Background/5.png',
  '/Life/Background/6.png',
  '/Life/Background/7.png',
  '/Life/Background/8.png',
  '/Life/Background/9.png',
  '/Life/Background/10.png',
  '/Life/Background/11.png',
];

// 音乐列表
const musicList = [
  {
    title: "Pachelbel's Canon",
    artist: "Classical",
    file: "pachelbelx27s-canon-canon-in-d-307320.mp3"
  },
  {
    title: "Pure Theta Piano",
    artist: "Meditation",
    file: "pure-theta-4-7hz-with-emotional-piano-music-351393.mp3"
  },
  {
    title: "Relaxing Birds & Piano",
    artist: "Nature Sounds",
    file: "relaxing-birds-and-piano-music-137153.mp3"
  },
  {
    title: "Celestial Prayer",
    artist: "Meditation",
    file: "celestial-prayer-heavenly-meditation-peaceful-music-353893.mp3"
  },
  {
    title: "Forest Melody",
    artist: "Nature Sounds",
    file: "forest-melody-background-music-for-meditation-and-yoga-314446.mp3"
  },
  {
    title: "Path to Harmony",
    artist: "Peaceful",
    file: "path-to-harmony-313385.mp3"
  },
  {
    title: "Inner Peace",
    artist: "Meditation",
    file: "inner-peace-339640.mp3"
  }
];

export default function Life({ onClose }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentBackground, setCurrentBackground] = useState(0);
  const [weather, setWeather] = useState({
    temperature: '--',
    condition: 'Loading',
    windDirection: '--',
    windSpeed: '--',
    loading: true,
    location: 'Hong Kong'
  });

  // 音乐播放器状态
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTimeAudio, setCurrentTimeAudio] = useState(0);

  // 留言板状态
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [danmakuList, setDanmakuList] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [allFirebaseMessages, setAllFirebaseMessages] = useState([]);
  const [danmakuPool, setDanmakuPool] = useState([]); // Danmaku pool, max 20 messages

  // 获取真实天气数据的函数
  const getRealWeather = async () => {
    try {
      console.log('🌤️ 尝试获取真实天气数据...');
      
      // 使用免费的wttr.in API
      const response = await fetch('https://wttr.in/Hong%20Kong?format=j1', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ 真实天气数据:', data);
        
        const current = data.current_condition[0];
        return {
          temperature: current.temp_C,
          condition: getWeatherConditionFromDesc(current.weatherDesc[0].value),
          windDirection: current.winddir16Point,
          windSpeed: current.windspeedKmph,
          loading: false,
          location: 'Hong Kong',
          description: current.weatherDesc[0].value + ' (真实数据)',
          humidity: current.humidity,
          pressure: current.pressure,
          realTime: true
        };
      }
      
      throw new Error('API响应失败');
    } catch (error) {
      console.log('❌ 真实天气API不可用:', error.message);
      return null;
    }
  };

  // 获取天气数据的函数 - 使用免费API和智能生成
  const fetchWeather = async () => {
    try {
      setWeather(prev => ({ ...prev, loading: true }));
      console.log('🌤️ 正在获取天气数据...');
      
      // 首先尝试获取真实天气数据
      const realWeatherData = await getRealWeather();
      if (realWeatherData) {
        setWeather(realWeatherData);
        return;
      }
      
      // 如果真实API失败，使用智能估算
      console.log('🔄 使用智能估算天气数据...');
      const now = new Date();
      const hour = now.getHours();
      const month = now.getMonth() + 1;
      
      // 基于香港真实气候数据的智能估算
      let baseTemp, conditions;
      
      if (month >= 12 || month <= 2) {
        baseTemp = 18 + Math.sin((hour - 6) * Math.PI / 12) * 4; // 14-22°C
        conditions = ['Clear', 'Partly Cloudy'];
      } else if (month >= 3 && month <= 5) {
        baseTemp = 24 + Math.sin((hour - 6) * Math.PI / 12) * 5; // 19-29°C
        conditions = ['Partly Cloudy', 'Cloudy'];
      } else if (month >= 6 && month <= 8) {
        baseTemp = 30 + Math.sin((hour - 6) * Math.PI / 12) * 4; // 26-34°C
        conditions = ['Sunny', 'Partly Cloudy'];
      } else {
        baseTemp = 26 + Math.sin((hour - 6) * Math.PI / 12) * 4; // 22-30°C
        conditions = ['Clear', 'Sunny'];
      }
      
      const smartWeather = {
        temperature: Math.round(baseTemp).toString(),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        windDirection: ['SE', 'E', 'NE'][Math.floor(Math.random() * 3)],
        windSpeed: (8 + Math.floor(Math.random() * 8)).toString(),
        loading: false,
        location: 'Hong Kong',
        description: '基于气候数据的智能估算',
        realTime: false
      };
      
      setWeather(smartWeather);
      console.log('✅ 智能估算天气数据:', smartWeather);
      
    } catch (error) {
      console.error('❌ 获取天气数据失败:', error);
      setWeather({
        temperature: '25',
        condition: 'Partly Cloudy',
        windDirection: 'SE',
        windSpeed: '10',
        loading: false,
        location: 'Hong Kong',
        description: '默认天气数据',
        realTime: false
      });
    }
  };

  // 将天气描述转换为我们的天气状态
  const getWeatherConditionFromDesc = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('sunny') || desc.includes('clear')) return 'Sunny';
    if (desc.includes('partly cloudy') || desc.includes('few clouds')) return 'Partly Cloudy';
    if (desc.includes('cloud') || desc.includes('overcast')) return 'Cloudy';
    if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) return 'Rain';
    if (desc.includes('snow') || desc.includes('blizzard')) return 'Snow';
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return 'Fog';
    return 'Partly Cloudy';
  };

  // 将天气代码转换为天气状态 (OpenMeteo)
  const getWeatherConditionFromCode = (code) => {
    if (code === 0) return 'Clear';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Fog';
    if (code >= 51 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain';
    if (code >= 85 && code <= 86) return 'Snow';
    if (code >= 95 && code <= 99) return 'Rain';
    return 'Partly Cloudy';
  };

  // 将风向角度转换为方向
  const getWindDirectionFromDegree = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  // 发送留言的函数 - 修改为使用Firebase
  const sendMessage = async () => {
    const messageText = messageInput.trim();
    console.log('🚀 开始发送消息:', messageText);
    
    if (!messageText) {
      console.log('❌ 消息为空，取消发送');
      return;
    }
    
    // 立即清空输入框，提供即时反馈
    setMessageInput('');
    
    // 立即创建弹幕，提供即时反馈
    createDanmaku(messageText);
    
    try {
      console.log('📤 尝试发送到Firebase数据库...');
      
      // 尝试发送到Firebase数据库
      const messageId = await sendMessageToDb(messageText);
      console.log('✅ 消息已发送到Firebase，ID:', messageId);
      
      // 重新获取所有消息以更新计数
      const updatedMessages = await getAllMessages();
      setAllFirebaseMessages(updatedMessages);
      setMessageCount(updatedMessages.length);
      
      console.log('✅ 消息计数已更新:', updatedMessages.length);
      
    } catch (error) {
      console.error('❌ 发送消息失败，使用离线模式:', error);
      
      // 离线模式：更新本地消息计数
      setMessageCount(prev => {
        const newCount = prev + 1;
        console.log('📊 离线模式消息计数更新:', newCount);
        return newCount;
      });
      
      // 添加到本地弹幕池
      const newMessage = {
        id: 'local_' + Date.now(),
        text: messageText,
        anonymousName: generateAnonymousName(),
        offline: true
      };
      
      setDanmakuPool(prev => {
        const newPool = [...prev, newMessage].slice(-20);
        console.log('📝 本地弹幕池已更新，当前数量:', newPool.length);
        return newPool;
      });
      
      console.log('✅ 消息已保存到本地模式');
    }
  };

  // 生成匿名用户名
  const generateAnonymousName = () => {
    const adjectives = ['Mysterious', 'Happy', 'Wise', 'Brave', 'Gentle', 'Lively', 'Quiet', 'Friendly'];
    const nouns = ['Traveler', 'Explorer', 'Dreamer', 'Thinker', 'Creator', 'Observer', 'Learner', 'Adventurer'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 999) + 1;
    return `${adj} ${noun} ${num}`;
  };

  // 获取随机颜色
  const getRandomColor = () => {
    const colors = [
      'rgba(102, 126, 234, 0.9)',
      'rgba(118, 75, 162, 0.9)',
      'rgba(255, 107, 107, 0.9)',
      'rgba(78, 205, 196, 0.9)',
      'rgba(255, 195, 113, 0.9)',
      'rgba(199, 121, 208, 0.9)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 获取随机图标
  const getRandomIcons = () => {
    const prefixIcons = ['✨', '🌟', '💫', '⭐', '🎈', '🎉', '🎊', '💝', '🌸', '🌺', '🌻', '🌷', '🦋', '🐝', '🌈', '☀️', '🌙', '⚡', '💎', '🔮'];
    const suffixIcons = ['💕', '💖', '💗', '💘', '💙', '💚', '💛', '🧡', '💜', '🤍', '🖤', '❤️', '💯', '✅', '🎯', '🏆', '🎪', '🎭', '🎨', '🎵'];
    
    const prefixIcon = Math.random() < 0.7 ? prefixIcons[Math.floor(Math.random() * prefixIcons.length)] : '';
    const suffixIcon = Math.random() < 0.7 ? suffixIcons[Math.floor(Math.random() * suffixIcons.length)] : '';
    
    return { prefixIcon, suffixIcon };
  };

  // 创建弹幕
  const createDanmaku = (text) => {
    const { prefixIcon, suffixIcon } = getRandomIcons();
    const decoratedText = `${prefixIcon} ${text} ${suffixIcon}`.trim();
    
    const newDanmaku = {
      id: Date.now() + Math.random(), // 确保唯一ID
      text: decoratedText,
      top: Math.random() * 60 + 10, // 10-70% 的位置
      color: getRandomColor()
    };
    
    setDanmakuList(prev => [...prev, newDanmaku]);
    
    // 30秒后移除弹幕
    setTimeout(() => {
      setDanmakuList(prev => prev.filter(d => d.id !== newDanmaku.id));
    }, 30000);
  };

  // 处理留言输入
  const handleMessageKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    console.log('✅ Life组件已成功挂载');
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 初始获取天气数据
    fetchWeather();
    
    // 每10分钟更新一次天气数据
    const weatherTimer = setInterval(fetchWeather, 10 * 60 * 1000);

    // 加载Firebase消息
    const loadFirebaseMessages = async () => {
      try {
        const firebaseMessages = await getAllMessages();
        setAllFirebaseMessages(firebaseMessages);
        setMessageCount(firebaseMessages.length);
        
        // 从数据库消息中取最多20条作为弹幕池
        const validMessages = firebaseMessages
          .filter(msg => (msg.text || msg.message || '').trim())
          .slice(0, 20);
        setDanmakuPool(validMessages);
        
        console.log('✅ Firebase消息加载成功:', firebaseMessages.length, '条消息，弹幕池:', validMessages.length, '条');
      } catch (error) {
        console.error('❌ Firebase消息加载失败:', error);
      }
    };

    loadFirebaseMessages();

    // 弹幕生成逻辑：每秒生成2条，屏幕超过20条时暂停生成
    let danmakuTimer;

    return () => {
      console.log('Life组件卸载');
      clearInterval(timer);
      clearInterval(weatherTimer);
      if (danmakuTimer) clearInterval(danmakuTimer);
    };
  }, []);

  // 弹幕生成逻辑：每秒生成2条，屏幕超过50条时暂停生成
  useEffect(() => {
    if (danmakuPool.length === 0) return;
    
    const generateDanmaku = () => {
      if (danmakuList.length < 20 && danmakuPool.length > 0) {
        // 屏幕上少于20条时，每次生成1条
        for (let i = 0; i < 1; i++) {
          const randomMessage = danmakuPool[Math.floor(Math.random() * danmakuPool.length)];
          const messageText = randomMessage.text || randomMessage.message || '';
          if (messageText.trim()) {
            createDanmaku(messageText);
          }
        }
      }
    };

    // 每500毫秒检查一次（每秒2次）
    const danmakuTimer = setInterval(generateDanmaku, 1000);
    
    return () => clearInterval(danmakuTimer);
  }, [danmakuPool, danmakuList]);

  // 背景图片自动变换
  useEffect(() => {
    const initialBackground = Math.floor(Math.random() * backgroundImages.length);
    setCurrentBackground(initialBackground);

    const backgroundTimer = setInterval(() => {
      setCurrentBackground(prev => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * backgroundImages.length);
        } while (newIndex === prev && backgroundImages.length > 1);
        return newIndex;
      });
    }, 60000);

    return () => clearInterval(backgroundTimer);
  }, []);

  // 音乐播放器相关函数
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTimeAudio(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      // 歌曲结束时自动播放下一首随机歌曲
      const randomIndex = Math.floor(Math.random() * musicList.length);
      setCurrentSong(randomIndex);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  // 当歌曲切换时，如果正在播放状态，自动播放新歌曲
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.load();
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log('切换歌曲播放失败:', error);
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  // 进入页面时自动播放
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const randomIndex = Math.floor(Math.random() * musicList.length);
      setCurrentSong(randomIndex);
      
      setTimeout(() => {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('自动播放被浏览器阻止:', error);
        });
      }, 500);
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    const randomIndex = Math.floor(Math.random() * musicList.length);
    setCurrentSong(randomIndex);
  };

  const playNext = () => {
    const nextIndex = (currentSong + 1) % musicList.length;
    setCurrentSong(nextIndex);
  };

  const playPrevious = () => {
    const prevIndex = currentSong === 0 ? musicList.length - 1 : currentSong - 1;
    setCurrentSong(prevIndex);
  };

  const toggleShuffle = () => {
    nextSong();
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
  };

  const formatAudioTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date) => {
    try {
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('时间格式化错误:', error);
      return '00:00:00';
    }
  };

  const formatDate = () => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return currentTime.toLocaleDateString('en-US', options);
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Sunny': '☀️',
      'Clear': '🌙',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Fog': '🌫️'
    };
    return iconMap[condition] || '🌤️';
  };

  const getClockAngles = (time) => {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    
    const secondAngle = seconds * 6;
    const minuteAngle = minutes * 6 + seconds * 0.1;
    const hourAngle = hours * 30 + minutes * 0.5;
    
    return { hourAngle, minuteAngle, secondAngle };
  };

  const handleBackClick = () => {
    console.log('返回按钮被点击');
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <LifeContainer style={{ backgroundImage: `url(${backgroundImages[currentBackground]})` }}>
      <Overlay />
      
      <BackButton onClick={handleBackClick}>
        ← Leave
      </BackButton>
      
      <NetworkStatus>
        <span className="status-dot"></span>
        Status: Live
      </NetworkStatus>

      <Content>
        <LeftSection>
          <Logo>
            <div className="dynamic-clock">
              {/* 12个小时刻度 */}
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="hour-mark" />
              ))}
              
              <div 
                className="hour-hand" 
                style={{ transform: `translate(-50%, -100%) rotate(${getClockAngles(currentTime).hourAngle}deg)` }}
              />
              <div 
                className="minute-hand" 
                style={{ transform: `translate(-50%, -100%) rotate(${getClockAngles(currentTime).minuteAngle}deg)` }}
              />
              <div 
                className="second-hand" 
                style={{ transform: `translate(-50%, -100%) rotate(${getClockAngles(currentTime).secondAngle}deg)` }}
              />
            </div>
            <div className="logo-text">Kangyu.Space</div>
          </Logo>

          <Quote>
            <div className="quote-text">
              "To see the world, things dangerous to come to, to see behind walls, to draw closer, to find each other, and to feel. That is the purpose of life."
            </div>
            <div className="quote-author">- The Secret Life of Walter Mitty</div>
          </Quote>

          <MusicPlayer>
            <audio 
              ref={audioRef}
              src={`/Life/Musics/${musicList[currentSong].file}`}
              preload="metadata"
            />
            
            <div className="music-controls-row">
              <div className="play-controls">
                <button className="control-btn play-btn" onClick={togglePlay}>
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button className="control-btn" onClick={toggleShuffle} title="Shuffle">
                  🔀
                </button>
              </div>
              
              <div className="progress-wrapper">
                <div className="progress-container">
                  <div className="progress-bar" onClick={handleProgressClick}>
                    <div 
                      className="progress-fill" 
                      style={{ width: `${duration ? (currentTimeAudio / duration) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="music-footer">
              <button className="nav-btn" onClick={playPrevious} title="Previous Song">
                ⏮️
              </button>
              
              <div className="music-info">
                <div className="song-title">{musicList[currentSong].title}</div>
                <div className="separator">-</div>
                <div className="song-artist">{musicList[currentSong].artist}</div>
                <div className="time-separator">•</div>
                <div className="time-display">
                  {formatAudioTime(currentTimeAudio)} / {formatAudioTime(duration)}
                </div>
              </div>
              
              <button className="nav-btn" onClick={playNext} title="Next Song">
                ⏭️
              </button>
            </div>
          </MusicPlayer>

          <MessageBoard>
            <div className="message-input-container">
              <input
                type="text"
                className="message-input"
                placeholder="Leave your footprint..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleMessageKeyPress}
                maxLength={100}
              />
              <button 
                className="send-btn" 
                onClick={sendMessage}
                disabled={!messageInput.trim()}
                title="Send Message"
              >
                📤
              </button>
            </div>
            <div className="message-stats">
              {messageCount} messages in database • Random danmaku stream
            </div>
          </MessageBoard>
        </LeftSection>

        <RightSection>
          <TimeWeatherCard title="Weather info">
            <div className="date">{formatDate()}</div>
            <div className="time">{formatTime(currentTime)}</div>
            <div className="weather">
              {weather.loading ? (
                '🔄 Loading weather data...'
              ) : weather.temperature === '--' ? (
                '❌ Failed to get weather data'
              ) : (
                `${getWeatherIcon(weather.condition)} ${weather.location} ${weather.condition} ${weather.temperature}℃ 💨 ${weather.windDirection} ${weather.windSpeed}km/h`
              )}
            </div>
          </TimeWeatherCard>

          <FunctionGrid>
            <FunctionCard>
              <div className="icon">📝</div>
              <div className="label">Research Notes</div>
            </FunctionCard>
            <FunctionCard>
              <div className="icon">💬</div>
              <div className="label">Message Board</div>
            </FunctionCard>
            <FunctionCard>
              <div className="icon">🎵</div>
              <div className="label">Music</div>
            </FunctionCard>
            <FunctionCard>
              <div className="icon">📷</div>
              <div className="label">Photo</div>
            </FunctionCard>
            <FunctionCard>
              <div className="icon">🏠</div>
              <div className="label">Homepage</div>
            </FunctionCard>
            <FunctionCard>
              <div className="icon">📊</div>
              <div className="label">Data Viz</div>
            </FunctionCard>
          </FunctionGrid>
        </RightSection>
      </Content>

      <Footer>
        Made by Kangyu YUAN & with the help of @cursor
      </Footer>

      {/* 弹幕容器 */}
      <DanmakuContainer>
        {danmakuList.map(danmaku => (
          <DanmakuItem
            key={danmaku.id}
            top={danmaku.top}
            color={danmaku.color}
          >
            {danmaku.text}
          </DanmakuItem>
        ))}
      </DanmakuContainer>
    </LifeContainer>
  );
} 