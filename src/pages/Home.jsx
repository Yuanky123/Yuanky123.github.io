import React from 'react';
import styled from 'styled-components';

const AboutTitle = styled.h3`
  margin-top: 32px;
  color: #3674B5;
  font-size: 1.25rem;
`;
const SectionTitle = styled.h3`
  margin-top: 20px;
  color: var(--primary);
  font-size: 1.25rem;
  margin-bottom: 12px;
`;
const List = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 20px;
`;
const PubList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 12px;
`;
const PubCard = styled.div`
  background: var(--card-bg);
  border-radius: 5px;
  box-shadow: 0 10px 12px rgba(54,116,181,0.10);
  border: 0px solid var(--border);
  display: flex;
  flex-direction: row;
  gap: 22px;
  padding: 15px 24px 15px 18px;
  align-items: flex-start;
  min-height: 120px;
`;
const PubImg = styled.img`
  width: 140px;
  height: 105px;
  object-fit: cover;
  border-radius: 8px;
  background: #eee;
  flex-shrink: 0;
`;
const PubInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const PubTitle = styled.a`
  font-size: 1.08rem;
  font-weight: bold;
  color: var(--title);
  text-decoration: none;
  &:hover { text-decoration: underline; }
  display: block;
`;
const PubAuthors = styled.div`
  color: #444;
  font-size: 0.98rem;
  margin: 4px 0 2px 0;
`;
const PubVenue = styled.div`
  color: #888;
  font-size: 0.95rem;
`;
const PubDesc = styled.div`
  color: #333;
  font-size: 0.97rem;
  margin-top: 4px;
`;

// 简单的markdown渲染：**加粗**、[链接](url)
function renderMarkdown(text) {
  if (!text) return null;
  // 链接
  let html = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#3674B5;text-decoration:underline;">$1</a>');
  // 加粗
  html = html.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  // 高亮（用==高亮==，可选）
  html = html.replace(/==([^=]+)==/g, '<span style="color:#3674B5;font-weight:bold;">$1</span>');
  return html;
}

function renderExperienceMarkdown(text) {
  if (!text) return null;
  // 链接
  let html = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#3674B5;text-decoration:underline;">$1</a>');
  // 加粗
  html = html.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  return html;
}

function renderPubMarkdown(text) {
  if (!text) return null;
  // 加粗
  let html = text.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  // 高亮
  html = html.replace(/==([^=]+)==/g, '<span style="color:#3674B5;font-weight:bold;">$1</span>');
  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#3674B5;text-decoration:underline;">$1</a>');
  return html;
}

export default function Home({ config, pubRef }) {
  return (
    <div style={{ background: 'none', boxShadow: 'none', border: 'none', padding: '0 24px' }}>
      <AboutTitle style={{marginTop: 10, marginBottom: 12}}>About Me</AboutTitle>
      <div style={{ fontSize: '1.1rem', marginBottom: 12 }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(config.bio) }}
      />
      {config.bioList && config.bioList.length > 0 && (
        <ul style={{ margin: '12px 0 12px 24px' }}>
          {config.bioList.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(item) }} />
          ))}
        </ul>
      )}
      {config.bioAfterList && (
        <div style={{ fontSize: '1.1rem', margin: '12px 0 24px 0' }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(config.bioAfterList) }}
        />
      )}
      <SectionTitle>Experience</SectionTitle>
      <List>
        {config.experience.map((w, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: renderExperienceMarkdown(`${w.company}, ${w.title} (${w.time})`) }} />
        ))}
      </List>

      <SectionTitle>Education</SectionTitle>
      <List>
        {config.education.map((e, i) => (
          <li key={i}>{e.school}, {e.degree} ({e.time})</li>
        ))}
      </List>

      <SectionTitle ref={pubRef} id="publications">Publications</SectionTitle>
      <PubList>
        {config.papers.map((p, i, arr) => {
          // 优先img字段，否则尝试public路径jpg/png
          let imgSrc = p.img || `/materials/publications/${arr.length - i}.jpg`;
          // onError兜底为png
          const handleImgError = (e) => {
            if (!e.target.src.endsWith('.png')) {
              e.target.src = `/materials/publications/${arr.length - i}.png`;
            }
          };
          return (
            <PubCard key={i}>
              <PubImg src={imgSrc} alt="pub" onError={handleImgError} />
              <PubInfo>
                <PubTitle href={p.link} target="_blank" rel="noopener noreferrer"
                  dangerouslySetInnerHTML={{ __html: renderPubMarkdown(p.title) }}
                />
                <PubAuthors dangerouslySetInnerHTML={{ __html: renderPubMarkdown(p.authors) }} />
                <PubVenue dangerouslySetInnerHTML={{ __html: renderPubMarkdown(p.venue + (p.year ? `, ${p.year}` : '')) }} />
                {p.desc && <PubDesc dangerouslySetInnerHTML={{ __html: renderPubMarkdown(p.desc) }} />}
              </PubInfo>
            </PubCard>
          );
        })}
      </PubList>
    </div>
  );
} 