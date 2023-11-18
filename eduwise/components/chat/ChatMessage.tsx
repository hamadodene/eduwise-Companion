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
import { Alert, Box, Tooltip, Typography, useTheme } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import { Link } from "../util/Link"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Copy, Delete, Edit, MoreVerticalIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import { useSession } from "next-auth/react"



type Block = TextBlock | CodeBlock
type TextBlock = { type: 'text'; content: string }
type CodeBlock = { type: 'code'; content: string; language: string | null; complete: boolean; code: string }

const inferCodeLanguage = (markdownLanguage: string, code: string): string | null => {
    let detectedLanguage
    // we have an hint
    if (markdownLanguage) {
        // no dot: assume is the syntax-highlight name
        if (!markdownLanguage.includes('.'))
            return markdownLanguage

        // dot: there's probably a file extension
        const extension = markdownLanguage.split('.').pop()
        if (extension) {
            const languageMap: { [key: string]: string } = {
                cs: 'csharp', html: 'html', java: 'java', js: 'javascript', json: 'json', jsx: 'javascript',
                md: 'markdown', py: 'python', sh: 'bash', ts: 'typescript', tsx: 'typescript', xml: 'xml',
            }
            detectedLanguage = languageMap[extension]
            if (detectedLanguage)
                return detectedLanguage
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
    ]

    for (const codeStart of codeStarts) {
        if (codeStart.starts.some((start) => code.startsWith(start))) {
            return codeStart.language
        }
    }

    const languages = ['bash', 'css', 'java', 'javascript', 'json', 'markdown', 'python', 'typescript'] // matches Prism component imports
    let maxTokens = 0

    languages.forEach((language) => {
        const grammar = Prism.languages[language]
        const tokens = Prism.tokenize(code, grammar)
        const tokenCount = tokens.filter((token) => typeof token !== 'string').length

        if (tokenCount > maxTokens) {
            maxTokens = tokenCount
            detectedLanguage = language
        }
    })
    return detectedLanguage || null
}

const parseBlocks = (forceText: boolean, text: string): Block[] => {
    if (forceText)
        return [{ type: 'text', content: text }]

    const codeBlockRegex = /`{3,}([\w\\.+]+)?\n([\s\S]*?)(`{3,}|$)/g
    const result: Block[] = []

    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
        const markdownLanguage = (match[1] || '').trim()
        const code = match[2].trim()
        const blockEnd: string = match[3]

        const codeLanguage = inferCodeLanguage(markdownLanguage, code)
        const highlightLanguage = codeLanguage || 'typescript'
        const highlightedCode = Prism.highlight(
            code,
            Prism.languages[highlightLanguage] || Prism.languages.typescript,
            highlightLanguage,
        )

        result.push({ type: 'text', content: text.slice(lastIndex, match.index) })
        result.push({ type: 'code', content: highlightedCode, language: codeLanguage, complete: blockEnd.startsWith('```'), code })
        lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
        result.push({ type: 'text', content: text.slice(lastIndex) })
    }

    return result
}


/// Renderers for the different types of message blocks
function RenderCode(props: { codeBlock: CodeBlock, sx?: SxProps }) {
    const [showSVG, setShowSVG] = React.useState(true)

    const hasSVG = props.codeBlock.code.startsWith('<svg') && props.codeBlock.code.endsWith('</svg>')
    const renderSVG = hasSVG && showSVG

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
    )
}

const RenderMarkdown = ({ textBlock }: { textBlock: TextBlock }) => {
    const theme = useTheme()
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
    </Box>
}

const RenderText = ({ textBlock }: { textBlock: TextBlock }) =>
    <Typography
        sx={{
            lineHeight: 1.75,
            mx: 1.5,
            overflowWrap: 'anywhere',
            whiteSpace: 'break-spaces',
        }}>
        {textBlock.content}
    </Typography>



function explainErrorInMessage(text: string, isAssistant: boolean, modelId?: string) {
    let errorMessage: JSX.Element | null = null
    const isAssistantError = isAssistant && (text.startsWith('[Issue] ') || text.startsWith('[OpenAI Issue]'))
    if (isAssistantError) {
        if (text.startsWith('OpenAI API error: 429 Too Many Requests')) {
            // TODO: retry at the api/chat level a few times instead of showing this error
            errorMessage = <>
                The model appears to be occupied at the moment. Kindly select <b>GPT-3.5 Turbo</b>,
                or give it another go by selecting <b>Run again</b> from the message menu.
            </>
        } else if (text.includes('"model_not_found"')) {
            // note that "model_not_found" is different than "The model `gpt-xyz` does not exist" message
            errorMessage = <>
                The API key appears to be unauthorized for {modelId || 'this model'}. You can change to <b>GPT-3.5
                    Turbo</b> and simultaneously <Link noLinkStyle href='https://openai.com/waitlist/gpt-4-api' target='_blank'>request
                        access</Link> to the desired model.
            </>
        } else if (text.includes('"context_length_exceeded"')) {
            // TODO: propose to summarize or split the input?
            const pattern: RegExp = /maximum context length is (\d+) tokens.+you requested (\d+) tokens/
            const match = pattern.exec(text)
            const usedText = match ? <b>{parseInt(match[2] || '0').toLocaleString()} tokens greater than {parseInt(match[1] || '0').toLocaleString()}</b> : ''
            errorMessage = <>
                This thread <b>surpasses the maximum size</b> allowed for {modelId || 'this model'}. {usedText}.
                Please consider removing some earlier messages from the conversation, start a new conversation,
                choose a model with larger context, or submit a shorter new message.
            </>
        } else if (text.includes('"invalid_api_key"')) {
            errorMessage = <>
                The API key appears to not be correct or to have expired.
                Please <Link noLinkStyle href='https://openai.com/account/api-keys' target='_blank'>check your API key</Link> and
                update it in the <b>Settings</b> menu.
            </>
        } else if (text.includes('"insufficient_quota"')) {
            errorMessage = <>
                The API key appears to have <b>insufficient quota</b>. Please
                check <Link noLinkStyle href='https://platform.openai.com/account/usage' target='_blank'>your usage</Link> and
                make sure the usage is under <Link noLinkStyle href='https://platform.openai.com/account/billing/limits' target='_blank'>the limits</Link>.
            </>
        }
    }
    return { errorMessage, isAssistantError }
}

const ChatMessage = ({ text, isBot, model }) => {
    const alignmentClass = isBot ? 'justify-start mr-auto' : 'justify-end  ml-auto'
    const marginLeft = isBot ? 'mr-auto' : 'ml-auto'
    const messageBgColor = isBot ? '' : 'bg-[#f8f9fa]'
    const renderMarkdown = true
    const { isAssistantError, errorMessage } = explainErrorInMessage(text, isBot, model)
    const popoverSide = isBot ? 'right' : 'left'
    const { data: session } = useSession({
        required: true
    })
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
        <>
            <div className={`flex flex-col justify-center items-center mb-4 ${alignmentClass}`}>
                <div className={`group border w-10 h-10 rounded-lg bg-[#12b886] relative ${marginLeft}`}>
                    {isBot ? <img
                        src="/avatars/chatbot.png"
                        alt="eduwise"
                        className='rounded-lg group-hover:opacity-50 transition duration-300'
                    /> :
                        <div className="w-full h-full flex items-center justify-center font-semibold text-white text-opacity-90">
                            {session ? session.user.name.slice(0, 2) : ""}
                        </div>
                    }
                </div>
                <div className={`rounded-lg border mt-2 p-2 flex-grow ${messageBgColor}`}>
                    <Box sx={{ ...cssBlocks, flexGrow: 0 }}>
                        {
                            !errorMessage && parseBlocks(!isBot, text).map((block, index) =>
                                block.type === 'code'
                                    ? <RenderCode key={'code-' + index} codeBlock={block} sx={cssCode} />
                                    : renderMarkdown
                                        ? <RenderMarkdown key={'text-md-' + index} textBlock={block} />
                                        : <RenderText key={'text-' + index} textBlock={block} />,
                            )}

                        {errorMessage && (
                            <Tooltip title={<Typography sx={{ maxWidth: 800 }}>{text}</Typography>} variant='soft'>
                                <Alert variant='soft' color='warning' sx={{ mt: 1 }}><Typography>{errorMessage}</Typography></Alert>
                            </Tooltip>
                        )}
                    </Box>
                </div>
            </div>
        </>
    )
}

export default ChatMessage