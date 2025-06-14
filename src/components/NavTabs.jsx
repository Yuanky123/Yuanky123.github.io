import React from 'react';
import styled from 'styled-components';

const TopGap = styled.div`
  height: 60px;
`;
const TabsWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin: 0 auto 24px auto;
  padding-top: 0;
`;
const Tab = styled.button`
  background: none;
  border: none;
  font-size: 1.12rem;
  font-weight: 600;
  color: ${({ active }) => (active ? 'var(--primary)' : 'var(--text)')};
  border-bottom: 3px solid ${({ active }) => (active ? 'var(--primary)' : 'transparent')};
  padding: 8px 0 6px 0;
  cursor: pointer;
  transition: color var(--transition), border var(--transition);
  outline: none;
  &:hover {
    color: var(--primary);
    background: rgba(37,99,235,0.06);
  }
`;

export default function NavTabs({ pages, current, onChange }) {
  // 只保留 Home 选项
  const homePage = pages.find(p => p.key === 'home');
  return (
    <>
      <TopGap />
      <TabsWrap>
        <Tab
          key={homePage.key}
          active={current === homePage.key}
          onClick={() => onChange(homePage.key)}
        >
          {homePage.label}
        </Tab>
      </TabsWrap>
    </>
  );
} 