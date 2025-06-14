import React from 'react';
import styled from 'styled-components';

const PaperCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(37,99,235,0.05);
  padding: 24px 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border);
  transition: box-shadow var(--transition), background var(--transition);
`;
const Title = styled.a`
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;
const Authors = styled.div`
  color: var(--text);
  font-size: 1rem;
  margin: 6px 0;
`;
const Venue = styled.div`
  color: #888;
  font-size: 0.95rem;
`;

export default function Papers({ config }) {
  return (
    <div>
      <h2 style={{color: 'var(--primary)', marginBottom: 24}}>Papers</h2>
      {config.papers.map((p, i) => (
        <PaperCard key={i}>
          <Title href={p.link} target="_blank" rel="noopener noreferrer">{p.title}</Title>
          <Authors>{p.authors}</Authors>
          <Venue>{p.venue}, {p.year}</Venue>
        </PaperCard>
      ))}
    </div>
  );
} 