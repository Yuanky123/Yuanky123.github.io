import React from 'react';
import styled from 'styled-components';

const NewsCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(37,99,235,0.05);
  padding: 24px 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border);
  transition: box-shadow var(--transition), background var(--transition);
`;
const Date = styled.div`
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 6px;
`;

export default function News({ config }) {
  return (
    <div>
      {config.news.slice().reverse().map((n, i) => (
        <NewsCard key={i}>
          <Date>{n.date}</Date>
          <div>{n.content}</div>
        </NewsCard>
      ))}
    </div>
  );
} 