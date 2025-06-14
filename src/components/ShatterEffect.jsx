import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const shatterAnimation = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
    filter: blur(0px);
  }
  70% {
    opacity: 0.8;
    filter: blur(1px);
  }
  90% {
    transform: translate(calc(var(--random-x) * 0.9), calc(var(--random-y) * 0.9)) rotate(calc(var(--random-rotate) * 0.8)) scale(0.5);
    opacity: 0.3;
    filter: blur(3px);
  }
  100% {
    transform: translate(var(--random-x), var(--random-y)) rotate(var(--random-rotate)) scale(0.1);
    opacity: 0;
    filter: blur(5px);
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const ShatterContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
  animation: ${fadeOut} 0.3s ease-out 1.1s forwards;
`;

const ShatterPiece = styled.div`
  position: absolute;
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.2) 100%);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.4);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6);
  animation: ${shatterAnimation} 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${props => props.delay}ms;
  
  --random-x: ${props => props.randomX}px;
  --random-y: ${props => props.randomY}px;
  --random-rotate: ${props => props.randomRotate}deg;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.7) 50%, transparent 70%);
    opacity: 0.8;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%);
    border-radius: inherit;
  }
`;

const crackSpread = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
`;

const CrackOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at var(--crack-x) var(--crack-y), transparent 0%, transparent 15%, rgba(255,255,255,0.3) 16%, rgba(255,255,255,0.1) 18%, transparent 20%);
  opacity: ${props => props.show ? 1 : 0};
  animation: ${props => props.show ? crackSpread : 'none'} 0.6s ease-out;
  pointer-events: none;
  
  --crack-x: ${props => props.crackX}%;
  --crack-y: ${props => props.crackY}%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at var(--crack-x) var(--crack-y), transparent 0%, transparent 10%, rgba(255,255,255,0.6) 11%, transparent 12%);
    animation: ${props => props.show ? crackSpread : 'none'} 0.4s ease-out;
  }
`;

export default function ShatterEffect({ onComplete }) {
  const [pieces, setPieces] = useState([]);
  const [showCracks, setShowCracks] = useState(false);
  const [crackPoints, setCrackPoints] = useState([]);

  useEffect(() => {
    // 生成裂纹点
    const cracks = [];
    for (let i = 0; i < 15; i++) {
      cracks.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 50
      });
    }
    setCrackPoints(cracks);

    // 显示裂纹效果
    setTimeout(() => {
      setShowCracks(true);
    }, 100);

    // 生成破碎片段
    setTimeout(() => {
      const newPieces = [];
      const cols = 12;
      const rows = 8;
      const pieceWidth = window.innerWidth / cols;
      const pieceHeight = window.innerHeight / rows;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * pieceWidth;
          const y = row * pieceHeight;
          
          // 计算随机飞散方向
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const pieceX = x + pieceWidth / 2;
          const pieceY = y + pieceHeight / 2;
          
          const angle = Math.atan2(pieceY - centerY, pieceX - centerX);
          const distance = 800 + Math.random() * 400;
          
          const randomX = Math.cos(angle) * distance + (Math.random() - 0.5) * 200;
          const randomY = Math.sin(angle) * distance + (Math.random() - 0.5) * 200;
          const randomRotate = (Math.random() - 0.5) * 720;
          
          newPieces.push({
            id: `${row}-${col}`,
            x,
            y,
            width: pieceWidth,
            height: pieceHeight,
            randomX,
            randomY,
            randomRotate,
            delay: Math.random() * 300
          });
        }
      }
      
      setPieces(newPieces);
    }, 300);

    // 动画完成后清理 - 提前触发以实现更流畅的过渡
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1400); // 从1800ms减少到1400ms

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <ShatterContainer>
      {/* 背景过渡层 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        opacity: 0.1,
        animation: 'fadeIn 0.5s ease-out 1s forwards'
      }} />
      
      {/* 裂纹效果 */}
      {crackPoints.map((crack, index) => (
        <CrackOverlay
          key={`crack-${index}`}
          show={showCracks}
          crackX={crack.x}
          crackY={crack.y}
          style={{ animationDelay: `${crack.delay}ms` }}
        />
      ))}
      
      {/* 破碎片段 */}
      {pieces.map((piece) => (
        <ShatterPiece
          key={piece.id}
          delay={piece.delay}
          randomX={piece.randomX}
          randomY={piece.randomY}
          randomRotate={piece.randomRotate}
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.width,
            height: piece.height,
          }}
        />
      ))}
    </ShatterContainer>
  );
} 