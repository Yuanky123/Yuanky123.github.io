import React from 'react';
import { FaGithub, FaGoogle, FaEnvelope, FaGraduationCap } from 'react-icons/fa';
import styled from 'styled-components';

const icons = {
  github: <FaGithub />,
  scholar: <FaGraduationCap />,
  email: <FaEnvelope />,
};

const SidebarWrap = styled.aside`
  width: var(--sidebar-width);
  min-height: calc(100vh - 76px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0 0 0;
  margin-left: 0;
  background: none;
  border: none;
`;
const Avatar = styled.img`
  width: 240px;
  height: 240px;
  /* border-radius: 50%; */
  object-fit: cover;
  margin-bottom: 10px;
  border: 0px solid var(--primary);
`;
const Name = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.7rem;
  font-weight: 700;
`;
const Title = styled.div`
  color: var(--primary);
  font-size: 1.1rem;
  margin-bottom: 8px;
`;
const School = styled.div`
  color: #222;
  font-size: 1rem;
  margin-bottom: 0px;
  text-align: center;
`;
const Contact = styled.div`
  margin: 18px 0 0 0;
  padding: 0 0 12px 0;
  display: flex;
  gap: 18px;
`;
const NewsSection = styled.div`
  width: 90%;
  margin-top: 0px;
`;
const NewsTitle = styled.div`
  color: var(--primary);
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 1.4rem;
`;
const NewsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3674B5 #e0e7ef; /* Firefox */
  &::-webkit-scrollbar {
    width: 8px;
    background: #e0e7ef;
  }
  &::-webkit-scrollbar-thumb {
    background: #3674B5;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #3674B5;
  }
`;
const NewsItem = styled.li`
  font-size: 0.98rem;
  color: var(--text);
  margin-bottom: 6px;
  border-left: 3px solid var(--primary);
  padding-left: 8px;
  line-height: 1.7;
`;
const NewsDate = styled.span`
  color: #000;
  font-size: 0.92rem;
  margin-right: 6px;
  font-weight: bold;
`;

function renderNewsMarkdown(text) {
  if (!text) return null;
  // 加粗
  let html = text.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">$1</a>');
  return html;
}

export default function Sidebar({ config }) {
  return (
    <SidebarWrap>
      <Avatar src={config.avatar} alt="avatar" />
      <Name>{config.name}</Name>
      <Title>{config.title}</Title>
      <School>The Hong Kong University of Science and Technology</School>
      <Contact>
        {config.social.map((s) => (
          <a
            key={s.type}
            href={s.type === 'email' ? `mailto:${config.email}` : s.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text)', fontSize: 22 }}
          >
            {icons[s.type] || <FaGoogle />}
          </a>
        ))}
      </Contact>
      <NewsSection>
        <NewsTitle>News</NewsTitle>
        <NewsList>
          {config.news.map((n, i) => (
            <NewsItem key={i}>
              <NewsDate>{n.date}</NewsDate>
              <span dangerouslySetInnerHTML={{ __html: renderNewsMarkdown(n.content) }} />
            </NewsItem>
          ))}
        </NewsList>
      </NewsSection>
    </SidebarWrap>
  );
} 