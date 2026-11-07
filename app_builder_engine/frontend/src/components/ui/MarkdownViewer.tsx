import React, { useState, useMemo } from 'react';
import { Button, message, Tooltip } from 'antd';
import {
  CopyOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BulbOutlined,
} from '@ant-design/icons';

interface MarkdownViewerProps {
  content: string;
  className?: string;
  maxHeight?: string | number;
}

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    message.success('Código copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-[#2B3544] bg-[#0F172A] shadow-md font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1E293B] border-b border-[#334155] text-[#94A3B8]">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-[#CBD5E1]">
          {language || 'code'}
        </span>
        <Tooltip title={copied ? 'Copiado!' : 'Copiar código'}>
          <Button
            type="text"
            size="small"
            icon={copied ? <CheckOutlined className="text-emerald-400" /> : <CopyOutlined className="text-[#94A3B8]" />}
            className="text-xs hover:text-white flex items-center gap-1"
            onClick={handleCopy}
          >
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
        </Tooltip>
      </div>
      <div className="p-4 overflow-x-auto text-[#E2E8F0] leading-relaxed">
        <pre className="font-mono whitespace-pre">{code}</pre>
      </div>
    </div>
  );
};

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  className = '',
  maxHeight,
}) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    const parseInline = (text: string): React.ReactNode => {
      // Inline parser for bold, italics, code, links
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      // Regex for `code`, **bold**, *italic*, [link](url)
      const inlineRegex = /(`([^`]+)`)|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
      let match: RegExpExecArray | null;

      while ((match = inlineRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }

        if (match[1]) {
          // Inline code `code`
          parts.push(
            <code
              key={`code-${match.index}`}
              className="px-1.5 py-0.5 mx-0.5 rounded-sm text-[11px] font-mono bg-[#FFF2EB] text-loft-orange border border-[#FFD9C7]"
            >
              {match[2]}
            </code>
          );
        } else if (match[3]) {
          // Bold **text**
          parts.push(
            <strong key={`bold-${match.index}`} className="font-semibold text-loft-dark">
              {match[4]}
            </strong>
          );
        } else if (match[5]) {
          // Italic *text*
          parts.push(
            <em key={`italic-${match.index}`} className="italic text-[#486581]">
              {match[6]}
            </em>
          );
        } else if (match[7]) {
          // Link [label](url)
          parts.push(
            <a
              key={`link-${match.index}`}
              href={match[9]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-loft-orange hover:underline font-medium inline-flex items-center gap-0.5"
            >
              {match[8]}
            </a>
          );
        }
        lastIndex = inlineRegex.lastIndex;
      }

      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts.length > 0 ? parts : text;
    };

    while (i < lines.length) {
      const line = lines[i];

      // Code Block: ```lang
      if (line.trim().startsWith('```')) {
        const lang = line.trim().replace(/^```/, '').trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <CodeBlock
            key={`code-block-${i}`}
            language={lang}
            code={codeLines.join('\n')}
          />
        );
        i++;
        continue;
      }

      // GitHub Callout / Alert: > [!NOTE], > [!WARNING], > [!TIP], > [!IMPORTANT], > [!CAUTION]
      const alertMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      if (alertMatch) {
        const alertType = alertMatch[1].toUpperCase();
        const alertLines: string[] = [];
        i++;
        while (i < lines.length && lines[i].startsWith('>')) {
          alertLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }

        const alertStyles = {
          NOTE: {
            bg: 'bg-blue-50/70 border-blue-200 text-blue-900',
            icon: <InfoCircleOutlined className="text-blue-600 text-base" />,
            title: 'Nota / Contexto',
          },
          TIP: {
            bg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
            icon: <BulbOutlined className="text-emerald-600 text-base" />,
            title: 'Dica de Arquitetura',
          },
          IMPORTANT: {
            bg: 'bg-purple-50/70 border-purple-200 text-purple-900',
            icon: <CheckCircleOutlined className="text-purple-600 text-base" />,
            title: 'Requisito Mandatório',
          },
          WARNING: {
            bg: 'bg-amber-50/70 border-amber-200 text-amber-900',
            icon: <WarningOutlined className="text-amber-600 text-base" />,
            title: 'Atenção / Restrição',
          },
          CAUTION: {
            bg: 'bg-rose-50/70 border-rose-200 text-rose-900',
            icon: <ExclamationCircleOutlined className="text-rose-600 text-base" />,
            title: 'Crítico / Segurança',
          },
        }[alertType] || {
          bg: 'bg-gray-50 border-gray-200 text-gray-900',
          icon: <InfoCircleOutlined className="text-gray-600" />,
          title: alertType,
        };

        elements.push(
          <div
            key={`alert-${i}`}
            className={`my-3 p-3.5 rounded-xl border ${alertStyles.bg} flex items-start gap-3 shadow-2xs`}
          >
            <div className="mt-0.5 shrink-0">{alertStyles.icon}</div>
            <div className="flex-1 text-xs leading-relaxed">
              <div className="font-bold text-[13px] mb-1">{alertStyles.title}</div>
              {alertLines.map((al, idx) => (
                <p key={idx} className="my-1">{parseInline(al)}</p>
              ))}
            </div>
          </div>
        );
        continue;
      }

      // Standard Blockquote: > line
      if (line.startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-3 pl-4 py-1.5 border-l-4 border-loft-orange bg-[#FFF8F5] text-xs text-[#486581] italic rounded-r-lg"
          >
            {quoteLines.map((ql, idx) => (
              <p key={idx} className="my-1">{parseInline(ql)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Markdown Table: | col 1 | col 2 |
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const headerRow = tableLines[0]
            .split('|')
            .slice(1, -1)
            .map((cell) => cell.trim());
          
          const bodyRows = tableLines
            .slice(2)
            .map((row) => row.split('|').slice(1, -1).map((cell) => cell.trim()));

          elements.push(
            <div key={`table-${i}`} className="my-4 overflow-x-auto rounded-xl border border-loft-border shadow-2xs">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-[#FAFBFD] border-b border-loft-border text-loft-dark font-bold">
                  <tr>
                    {headerRow.map((th, thIdx) => (
                      <th key={thIdx} className="px-3.5 py-2.5 font-semibold text-loft-dark">
                        {parseInline(th)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-loft-border bg-white">
                  {bodyRows.map((tr, trIdx) => (
                    <tr key={trIdx} className="hover:bg-[#F8FAFC] transition">
                      {tr.map((td, tdIdx) => (
                        <td key={tdIdx} className="px-3.5 py-2.5 text-[#334E68]">
                          {parseInline(td)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-xl font-bold text-loft-dark mt-6 mb-3 pb-2 border-b border-loft-border flex items-center gap-2">
            <span className="w-2 h-6 bg-loft-orange rounded-full inline-block"></span>
            {parseInline(line.replace(/^#\s+/, ''))}
          </h1>
        );
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-base font-bold text-loft-dark mt-5 mb-2 pb-1 border-b border-loft-border/60">
            {parseInline(line.replace(/^##\s+/, ''))}
          </h2>
        );
        i++;
        continue;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-sm font-bold text-[#243B53] mt-4 mb-2">
            {parseInline(line.replace(/^###\s+/, ''))}
          </h3>
        );
        i++;
        continue;
      }

      if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4-${i}`} className="text-xs font-bold text-[#334E68] uppercase tracking-wider mt-3 mb-1.5">
            {parseInline(line.replace(/^####\s+/, ''))}
          </h4>
        );
        i++;
        continue;
      }

      // Horizontal Rule
      if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
        elements.push(<hr key={`hr-${i}`} className="my-5 border-t border-loft-border" />);
        i++;
        continue;
      }

      // Unordered Lists (*, -, +)
      const listMatch = line.match(/^(\s*)([-*+])\s+(.+)$/);
      if (listMatch) {
        const indent = listMatch[1].length;
        const itemText = listMatch[3];

        // Check if task list item: [ ] or [x]
        const taskMatch = itemText.match(/^\[([ xX])\]\s+(.+)$/);
        if (taskMatch) {
          const checked = taskMatch[1].toLowerCase() === 'x';
          elements.push(
            <div
              key={`task-${i}`}
              className="flex items-center gap-2 text-xs text-[#334E68] my-1"
              style={{ marginLeft: `${indent * 8 + 8}px` }}
            >
              <input type="checkbox" checked={checked} readOnly className="rounded-sm text-loft-orange focus:ring-0" />
              <span className={checked ? 'line-through text-[#829AB1]' : ''}>
                {parseInline(taskMatch[2])}
              </span>
            </div>
          );
        } else {
          elements.push(
            <div
              key={`li-${i}`}
              className="flex items-start gap-2 text-xs text-[#334E68] my-1 leading-relaxed"
              style={{ marginLeft: `${indent * 8 + 8}px` }}
            >
              <span className="w-1.5 h-1.5 bg-loft-orange rounded-full mt-1.5 shrink-0"></span>
              <span>{parseInline(itemText)}</span>
            </div>
          );
        }
        i++;
        continue;
      }

      // Numbered List
      const numMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
      if (numMatch) {
        const indent = numMatch[1].length;
        const num = numMatch[2];
        const itemText = numMatch[3];

        elements.push(
          <div
            key={`num-${i}`}
            className="flex items-start gap-2 text-xs text-[#334E68] my-1.5 leading-relaxed"
            style={{ marginLeft: `${indent * 8 + 8}px` }}
          >
            <span className="font-bold text-loft-orange text-xs shrink-0 w-4">{num}.</span>
            <span>{parseInline(itemText)}</span>
          </div>
        );
        i++;
        continue;
      }

      // Empty Line
      if (!line.trim()) {
        i++;
        continue;
      }

      // Paragraph
      elements.push(
        <p key={`p-${i}`} className="text-xs text-[#334E68] my-2 leading-relaxed">
          {parseInline(line)}
        </p>
      );
      i++;
    }

    return elements;
  }, [content]);

  return (
    <div
      className={`loft-markdown-viewer text-xs text-loft-dark leading-relaxed select-text ${className}`}
      style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
    >
      {renderedElements}
    </div>
  );
};
