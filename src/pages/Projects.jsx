import React from 'react';
import styled from 'styled-components';

const ProjectCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(37,99,235,0.05);
  padding: 24px 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border);
  transition: box-shadow var(--transition), background var(--transition);
`;
const Name = styled.a`
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;
const Desc = styled.div`
  color: var(--text);
  font-size: 1rem;
  margin: 6px 0;
`;

export default function Projects({ config }) {
  return (
    <div>
      <h2 style={{color: 'var(--primary)', marginBottom: 24}}>Projects</h2>
      {config.projects.map((p, i) => (
        <ProjectCard key={i}>
          <Name href={p.link} target="_blank" rel="noopener noreferrer">{p.name}</Name>
          <Desc>{p.desc}</Desc>
        </ProjectCard>
      ))}
    </div>
  );
} 