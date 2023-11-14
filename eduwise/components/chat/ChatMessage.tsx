'use client'

import React from "react"
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Box, Typography, useTheme } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types'



type Block = TextBlock | CodeBlock;
type TextBlock = { type: 'text'; content: string; };
type CodeBlock = { type: 'code'; content: string; language: string | null; complete: boolean; code: string; };

const inferCodeLanguage = (markdownLanguage: string, code: string): string | null => {
    let detectedLanguage;
    // we have an hint
    if (markdownLanguage) {
        // no dot: assume is the syntax-highlight name
        if (!markdownLanguage.includes('.'))
            return markdownLanguage;

        // dot: there's probably a file extension
        const extension = markdownLanguage.split('.').pop();
        if (extension) {
            const languageMap: { [key: string]: string } = {
                cs: 'csharp', html: 'html', java: 'java', js: 'javascript', json: 'json', jsx: 'javascript',
                md: 'markdown', py: 'python', sh: 'bash', ts: 'typescript', tsx: 'typescript', xml: 'xml',
            };
            detectedLanguage = languageMap[extension];
            if (detectedLanguage)
                return detectedLanguage;
        }
    }

    // based on how the code starts, return the language
    const codeStarts = [
        { starts: ['<!DOCTYPE html', '<html'], language: 'html' },
        { starts: ['<'], language: 'xml' },
        { starts: ['from '], language: 'python' },
        { starts: ['import ', 'export '], language: 'typescript' }, // or python
        { starts: ['interface ', 'function '], language: 'typescript' }, // ambiguous
        { starts: ['package '], language: 'java' },
        { starts: ['using '], language: 'csharp' },
    ];

    for (const codeStart of codeStarts) {
        if (codeStart.starts.some((start) => code.startsWith(start))) {
            return codeStart.language;
        }
    }

    const languages = ['bash', 'css', 'java', 'javascript', 'json', 'markdown', 'python', 'typescript']; // matches Prism component imports
    let maxTokens = 0;

    languages.forEach((language) => {
        const grammar = Prism.languages[language];
        const tokens = Prism.tokenize(code, grammar);
        const tokenCount = tokens.filter((token) => typeof token !== 'string').length;

        if (tokenCount > maxTokens) {
            maxTokens = tokenCount;
            detectedLanguage = language;
        }
    });
    return detectedLanguage || null;
};

const parseBlocks = (forceText: boolean, text: string): Block[] => {
    if (forceText)
        return [{ type: 'text', content: text }];

    const codeBlockRegex = /`{3,}([\w\\.+]+)?\n([\s\S]*?)(`{3,}|$)/g;
    const result: Block[] = [];

    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
        const markdownLanguage = (match[1] || '').trim();
        const code = match[2].trim();
        const blockEnd: string = match[3];

        const codeLanguage = inferCodeLanguage(markdownLanguage, code);
        const highlightLanguage = codeLanguage || 'typescript';
        const highlightedCode = Prism.highlight(
            code,
            Prism.languages[highlightLanguage] || Prism.languages.typescript,
            highlightLanguage,
        );

        result.push({ type: 'text', content: text.slice(lastIndex, match.index) });
        result.push({ type: 'code', content: highlightedCode, language: codeLanguage, complete: blockEnd.startsWith('```'), code });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        result.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return result;
};


/// Renderers for the different types of message blocks
function RenderCode(props: { codeBlock: CodeBlock, sx?: SxProps }) {
    const [showSVG, setShowSVG] = React.useState(true);

    const hasSVG = props.codeBlock.code.startsWith('<svg') && props.codeBlock.code.endsWith('</svg>');
    const renderSVG = hasSVG && showSVG;

    const languagesCodepen = ['html', 'css', 'javascript', 'json', 'typescript'];
    const hasCodepenLanguage = hasSVG || (props.codeBlock.language && languagesCodepen.includes(props.codeBlock.language));

    const languagesReplit = ['python', 'java', 'csharp'];
    const hasReplitLanguage = props.codeBlock.language && languagesReplit.includes(props.codeBlock.language);

    return (
        <Box
            component='code'
            sx={{
                position: 'relative', mx: 0, p: 1.5, // this block gets a thicker border
                display: 'block', fontWeight: 500,
                whiteSpace: 'break-spaces',
                '&:hover > .code-buttons': { opacity: 1 },
                ...(props.sx || {}),
            }}>

            <Box
                className='code-buttons'
                sx={{
                    backdropFilter: 'blur(6px) grayscale(0.8)',
                    position: 'absolute', top: 0, right: 0, zIndex: 10, pt: 0.5, pr: 0.5,
                    display: 'flex', flexDirection: 'row', gap: 1,
                    opacity: 0, transition: 'opacity 0.3s',
                }}>
            </Box>

            <Box
                dangerouslySetInnerHTML={{ __html: renderSVG ? props.codeBlock.code : props.codeBlock.content }}
                sx={renderSVG ? { lineHeight: 0 } : {}}
            />
        </Box>
    );
}

const RenderMarkdown = ({ textBlock }: { textBlock: TextBlock }) => {
    const theme = useTheme();
    return <Box
        className={`markdown-body ${theme.palette.mode === 'dark' ? 'markdown-body-dark' : 'markdown-body-light'}`}
        sx={{
            mx: '12px !important',
            '& table': { width: 'inherit !important' },
            '--color-canvas-default': 'transparent !important',
            fontFamily: `inherit !important`,
            lineHeight: '1.75 !important',
        }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{textBlock.content}</ReactMarkdown>
    </Box>;
};

const RenderText = ({ textBlock }: { textBlock: TextBlock }) =>
    <Typography
        sx={{
            lineHeight: 1.75,
            mx: 1.5,
            overflowWrap: 'anywhere',
            whiteSpace: 'break-spaces',
        }}>
        {textBlock.content}
    </Typography>;



const ChatMessage = ({ text, isBot }) => {
    const alignmentClass = isBot ? 'justify-start mr-auto' : 'justify-end  ml-auto'
    const marginLeft = isBot ? 'mr-auto' : 'ml-auto'
    const messageBgColor = isBot ? '' : 'bg-[#f8f9fa]'
    const renderMarkdown = true

    const cssBlocks = {
        my: 'auto',
    }

    const cssCode = {
        background: 'bg-[#e9ecef]',
        fontFamily: '',
        fontSize: '14px',
        fontVariantLigatures: 'none',
        lineHeight: 1.75,
    }

    return (
        <div className={`flex flex-col justify-center mb-4 ${alignmentClass}`}>
            <div className={`w-10 h-10 rounded-full ${marginLeft}`}>
                <img
                    src={`${isBot ? '/avatars/chatbot.png' : '/avatars/01.png'}`}
                    alt={`Image ${isBot ? 'Bot' : 'User'}`}
                    className='rounded-lg'
                />
            </div>
            <div className={`rounded-lg border mt-2 p-2 flex-grow ${messageBgColor}`}>
                <Box sx={{ ...cssBlocks, flexGrow: 0 }}>
                    {
                        parseBlocks(!isBot, text).map((block, index) =>
                            block.type === 'code'
                                ? <RenderCode key={'code-' + index} codeBlock={block} sx={cssCode} />
                                : renderMarkdown
                                    ? <RenderMarkdown key={'text-md-' + index} textBlock={block} />
                                    : <RenderText key={'text-' + index} textBlock={block} />,
                        )}
                </Box>
            </div>
        </div>
    )
}

export default ChatMessage