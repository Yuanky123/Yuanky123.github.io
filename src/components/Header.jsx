import React from 'react';
import styled from 'styled-components';
import config from '../config';

const TopBar = styled.header`
  width: 100%;
  height: 76px;
  background: var(--primary);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-bottom: 1.5px solid var(--primary-light);
`;
const TopBarInner = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 32px 48px 0 48px;
  box-sizing: border-box;
`;
const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Name = styled.h1`
  font-size: 2.1rem;
  font-weight: 600;
  margin: 0;
  color: #fff;
`;
const NameCN = styled.span`
  font-size: 1.1rem;
  color: #fff;
  margin-top: 2px;
`;
const Nav = styled.nav`
  display: flex;
  gap: 36px;
  align-items: center;
`;
const NavItem = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => (active ? '#fff' : '#c7e3fa')};
  font-size: 1.25rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--transition);
  outline: none;
  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

export default function Header({ theme, setTheme, current, activeSection, onChange }) {
  // Home 也放到顶部导航栏
  const navs = [{ label: 'Home', key: 'home' }, ...config.topNav.map((item, i) => ({ ...item, key: item.label.toLowerCase() }))];

  // 新增：处理导航点击
  const handleNavClick = (key) => {
    // 所有导航都通过App.jsx的handleNavChange处理
    onChange(key);
  };

  return (
    <TopBar>
      <TopBarInner>
        <NameBlock>
          <Name>{config.name}</Name>
          {config.name_cn && <NameCN>{config.name_cn}</NameCN>}
        </NameBlock>
        <Nav>
          {navs.map((item) => {
            // 在Home页面时，使用activeSection来决定高亮；其他页面使用current
            const isActive = current === 'home' 
              ? (item.key === 'publications' ? activeSection === 'publications' : activeSection === 'home' && item.key === 'home')
              : current === item.key;
            
            return (
              <NavItem
                key={item.key}
                active={isActive}
                onClick={() => handleNavClick(item.key)}
              >
                {item.label}
              </NavItem>
            );
          })}
        </Nav>
      </TopBarInner>
    </TopBar>
  );
} 