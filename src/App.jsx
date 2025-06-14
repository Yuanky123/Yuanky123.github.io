import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Papers from './pages/Papers';
import Projects from './pages/Projects';
import Life from './pages/Life';
import config from './config';
import { AnimatePresence, motion } from 'framer-motion';

const pages = [
  { key: 'home', label: 'Home', component: <Home config={config} /> },
  { key: 'publications', label: 'Publications', component: <div style={{padding:'32px'}}>Publications content here.</div> },
  { key: 'courses', label: 'Courses', component: <div style={{padding:'32px'}}>Courses content here.</div> },
  { key: 'students', label: 'Students', component: <div style={{padding:'32px'}}>Students content here.</div> },
];

export default function App() {
  const [theme, setTheme] = useState('light');
  const [page, setPage] = useState('home');
  const pubRef = useRef(null);
  const [pendingScrollToPub, setPendingScrollToPub] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 滚动监听，检测当前活跃的部分
  useEffect(() => {
    if (page !== 'home') return;

    const handleScroll = () => {
      const pubElement = pubRef.current || document.getElementById('publications');
      if (pubElement) {
        const rect = pubElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // 当Publications部分滚动到屏幕一半以上时高亮
        if (rect.top <= windowHeight / 2 && rect.bottom >= 0) {
          setActiveSection('publications');
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);

  useEffect(() => {
    if (pendingScrollToPub && page === 'home') {
      // 增加延迟时间，确保页面动画完成后再滚动
      setTimeout(() => {
        if (pubRef.current) {
          pubRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // 备用方案：通过ID查找元素
          const pubElement = document.getElementById('publications');
          if (pubElement) {
            pubElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        setPendingScrollToPub(false);
      }, 500); // 从100ms增加到500ms
    }
    if (page !== 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page, pendingScrollToPub]);

  const handleNavChange = (key) => {
    if (key === 'publications') {
      if (page !== 'home') {
        setPage('home');
        setPendingScrollToPub(true);
      } else if (pubRef.current) {
        pubRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (key === 'home') {
      if (page === 'home') {
        // 如果已经在Home页面，滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('home');
      } else {
        setPage('home');
        setPendingScrollToPub(false);
      }
    } else if (key === 'life') {
      setPage('life');
      setPendingScrollToPub(false);
    } else {
      setPage(key);
      setPendingScrollToPub(false);
    }
  };

  const handleLifeClose = () => {
    setPage('home');
  };

  return (
    <>
      {page === 'life' ? (
        <Life onClose={handleLifeClose} />
      ) : (
        <>
          <Header theme={theme} setTheme={setTheme} current={page} activeSection={activeSection} onChange={handleNavChange} />
          <div style={{ width: '100%', paddingTop: 76, paddingLeft: 100, paddingRight: 48, boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', width: '100%', maxWidth: 1200, margin: '0 auto' }}>
              <Sidebar config={config} />
              <div style={{ flex: 1, minHeight: '100vh', background: 'var(--bg)', transition: 'background var(--transition)' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={page}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}
                  >
                    {page === 'home' ? <Home config={config} pubRef={pubRef} /> : (pages.find(p => p.key === page)?.component || null)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
} 