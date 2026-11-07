import React, { useState } from 'react';
import { Button, message, Tag } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

interface MarkdownViewerProps {
  content: string;
}

interface ParsedSection {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'code' | 'blockquote' | 'alert' | 'table' | 'list' | 'paragraph';
  content: string;
  language?: string;
  alertType?: 'note' | 'tip' | 'warning' | 'important';
  id?: string;
  items?: string[];
  tableHeaders?: string[];
  tableRows?: string[][];
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    message.success('Código copiado para a área de transferência!');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const parseMarkdown = (raw: string): ParsedSection[] => {
    const lines = raw.split('\n');
    const sections: ParsedSection[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLanguage = '';
    let inTable = false;
    let tableBuffer: string[] = [];
    let inList = false;
    let listBuffer: string[] = [];

    const flushCode = () => {
      if (codeBuffer.length > 0) {
        sections.push({
          type: 'code',
          content: codeBuffer.join('\n'),
          language: codeLanguage || 'text',
        });
        codeBuffer = [];
        codeLanguage = '';
      }
    };

    const flushTable = () => {
      if (tableBuffer.length >= 2) {
        const headerLine = tableBuffer[0];
        const headers = headerLine
          .split('|')
          .map((h) => h.trim())
          .filter((h) => h.length > 0);
        const rows = tableBuffer
          .slice(2)
          .map((row) =>
            row
              .split('|')
              .map((c) => c.trim())
              .filter((c, i, arr) => i > 0 && i < arr.length - 1 || (arr.length <= 2 && c.length > 0))
          )
          .filter((r) => r.length > 0);

        sections.push({
          type: 'table',
          content: '',
          tableHeaders: headers,
          tableRows: rows,
        });
      }
      tableBuffer = [];
      inTable = false;
    };

    const flushList = () => {
      if (listBuffer.length > 0) {
        sections.push({
          type: 'list',
          content: '',
          items: [...listBuffer],
        });
        listBuffer = [];
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block Start/End
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCode();
          inCodeBlock = false;
        } else {
          flushList();
          flushTable();
          inCodeBlock = true;
          codeLanguage = line.trim().replace('```', '').trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        flushList();
        inTable = true;
        tableBuffer.push(line);
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\.\s/.test(line.trim())) {
        flushTable();
        inList = true;
        listBuffer.push(line.trim().replace(/^[-*]\s+|\d+\.\s+/, ''));
        continue;
      } else if (inList && line.trim() === '') {
        flushList();
      }

      // Alerts & Blockquotes
      if (line.trim().startsWith('>')) {
        flushList();
        flushTable();
        const blockText = line.trim().replace(/^>\s*/, '');
        if (blockText.startsWith('[!NOTE]')) {
          sections.push({ type: 'alert', content: blockText.replace('[!NOTE]', '').trim(), alertType: 'note' });
        } else if (blockText.startsWith('[!TIP]')) {
          sections.push({ type: 'alert', content: blockText.replace('[!TIP]', '').trim(), alertType: 'tip' });
        } else if (blockText.startsWith('[!WARNING]')) {
          sections.push({ type: 'alert', content: blockText.replace('[!WARNING]', '').trim(), alertType: 'warning' });
        } else if (blockText.startsWith('[!IMPORTANT]')) {
          sections.push({ type: 'alert', content: blockText.replace('[!IMPORTANT]', '').trim(), alertType: 'important' });
        } else {
          sections.push({ type: 'blockquote', content: blockText });
        }
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        flushList();
        flushTable();
        const text = line.replace('# ', '').trim();
        sections.push({ type: 'h1', content: text, id: slugify(text) });
      } else if (line.startsWith('## ')) {
        flushList();
        flushTable();
        const text = line.replace('## ', '').trim();
        sections.push({ type: 'h2', content: text, id: slugify(text) });
      } else if (line.startsWith('### ')) {
        flushList();
        flushTable();
        const text = line.replace('### ', '').trim();
        sections.push({ type: 'h3', content: text, id: slugify(text) });
      } else if (line.startsWith('#### ')) {
        flushList();
        flushTable();
        const text = line.replace('#### ', '').trim();
        sections.push({ type: 'h4', content: text, id: slugify(text) });
      } else if (line.trim().length > 0) {
        if (!inList) {
          sections.push({ type: 'paragraph', content: line.trim() });
        }
      }
    }

    flushCode();
    flushTable();
    flushList();

    return sections;
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const renderFormattedText = (text: string) => {
    // Replace bold **text**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            style={{
              backgroundColor: '#F1F5F9',
              color: '#0F172A',
              padding: '2px 6px',
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: '0.9em',
              border: '1px solid #E2E8F0',
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const sections = parseMarkdown(content);

  return (
    <div className="loft-markdown-pro" style={{ color: '#1E293B', lineHeight: 1.7, fontSize: 14 }}>
      {sections.map((section, idx) => {
        if (section.type === 'h1') {
          return (
            <h1
              key={idx}
              id={section.id}
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#0F172A',
                borderBottom: '2px solid #E2E8F0',
                paddingBottom: 8,
                marginTop: 24,
                marginBottom: 16,
                scrollMarginTop: 80,
              }}
            >
              {section.content}
            </h1>
          );
        }

        if (section.type === 'h2') {
          return (
            <h2
              key={idx}
              id={section.id}
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#1E293B',
                marginTop: 20,
                marginBottom: 12,
                scrollMarginTop: 80,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ display: 'inline-block', width: 4, height: 18, backgroundColor: '#FF774A', borderRadius: 2 }} />
              {section.content}
            </h2>
          );
        }

        if (section.type === 'h3') {
          return (
            <h3
              key={idx}
              id={section.id}
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#334155',
                marginTop: 16,
                marginBottom: 8,
                scrollMarginTop: 80,
              }}
            >
              {section.content}
            </h3>
          );
        }

        if (section.type === 'code') {
          return (
            <div
              key={idx}
              style={{
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                margin: '14px 0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #1E293B',
              }}
            >
              <div
                style={{
                  background: '#0F172A',
                  padding: '6px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #334155',
                }}
              >
                <Tag color="#1E293B" style={{ margin: 0, fontSize: 11, color: '#94A3B8', textTransform: 'uppercase' }}>
                  {section.language || 'code'}
                </Tag>
                <Button
                  size="small"
                  type="text"
                  icon={copiedIndex === idx ? <CheckOutlined style={{ color: '#10B981' }} /> : <CopyOutlined />}
                  onClick={() => handleCopyCode(section.content, idx)}
                  style={{ color: copiedIndex === idx ? '#10B981' : '#CBD5E1', fontSize: 12 }}
                >
                  {copiedIndex === idx ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: '14px 16px',
                  background: '#090D16',
                  color: '#E2E8F0',
                  fontSize: 12.5,
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  overflowX: 'auto',
                  lineHeight: 1.55,
                }}
              >
                <code>{section.content}</code>
              </pre>
            </div>
          );
        }

        if (section.type === 'alert') {
          const alertConfig = {
            note: { border: '#0066CC', bg: '#EFF6FF', text: '#1E40AF', title: 'NOTA' },
            tip: { border: '#10B981', bg: '#ECFDF5', text: '#065F46', title: 'DICA' },
            warning: { border: '#F59E0B', bg: '#FFFBEB', text: '#92400E', title: 'ATENÇÃO' },
            important: { border: '#FF774A', bg: '#FFF7ED', text: '#9A3412', title: 'IMPORTANTE' },
          }[section.alertType || 'note'];

          return (
            <div
              key={idx}
              style={{
                borderLeft: `4px solid ${alertConfig.border}`,
                background: alertConfig.bg,
                color: alertConfig.text,
                padding: '10px 14px',
                borderRadius: '0 6px 6px 0',
                margin: '12px 0',
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', marginBottom: 2 }}>
                {alertConfig.title}
              </div>
              <div>{renderFormattedText(section.content)}</div>
            </div>
          );
        }

        if (section.type === 'blockquote') {
          return (
            <blockquote
              key={idx}
              style={{
                borderLeft: '3px solid #CBD5E1',
                paddingLeft: 12,
                margin: '10px 0',
                color: '#64748B',
                fontStyle: 'italic',
              }}
            >
              {renderFormattedText(section.content)}
            </blockquote>
          );
        }

        if (section.type === 'list') {
          return (
            <ul key={idx} style={{ paddingLeft: 20, margin: '8px 0' }}>
              {section.items?.map((item, itemIdx) => (
                <li key={itemIdx} style={{ marginBottom: 4 }}>
                  {renderFormattedText(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (section.type === 'table') {
          return (
            <div key={idx} style={{ overflowX: 'auto', margin: '14px 0' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 13,
                  border: '1px solid #E2E8F0',
                }}
              >
                {section.tableHeaders && (
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {section.tableHeaders.map((h, hIdx) => (
                        <th
                          key={hIdx}
                          style={{
                            padding: '8px 12px',
                            borderBottom: '2px solid #CBD5E1',
                            textAlign: 'left',
                            fontWeight: 600,
                            color: '#1E293B',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {section.tableRows?.map((row, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: '1px solid #E2E8F0', background: rIdx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} style={{ padding: '8px 12px', color: '#334155' }}>
                          {renderFormattedText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={idx} style={{ margin: '8px 0', color: '#334155' }}>
            {renderFormattedText(section.content)}
          </p>
        );
      })}
    </div>
  );
};
