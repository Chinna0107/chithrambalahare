import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Youtube } from '@tiptap/extension-youtube';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { CharacterCount } from '@tiptap/extension-character-count';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, Unlink,
  Image as ImageIcon, Video as YoutubeIcon, Table as TableIcon, Quote, Minus,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Undo, Redo,
  Highlighter, Palette, Type, CheckSquare, Plus, Trash2, CornerDownLeft,
  CornerDownRight, Columns, RowsIcon, FileCode, Maximize2
} from 'lucide-react';

const lowlight = createLowlight(common);

const MenuButton = ({ onClick, isActive, disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
        : 'text-gray-400 hover:text-white hover:bg-white/10'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => <div className="w-px h-6 bg-gray-700 mx-1" />;

const TipTapEditor = ({ content = '', onChange, placeholder = 'Start writing your content...', autoSaveKey = null }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showEmbedInput, setShowEmbedInput] = useState(false);
  const [embedHtml, setEmbedHtml] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState({ words: 0, characters: 0 });
  const autoSaveTimer = useRef(null);
  const editorContainerRef = useRef(null);

  const exts = [
    StarterKit, Underline, TextStyle, Color, Highlight, TextAlign, Link, Image,
    Table, TableRow, TableCell, TableHeader, Youtube, Placeholder, TaskList, TaskItem,
    CharacterCount, CodeBlockLowlight
  ];
  exts.forEach((ext, i) => { if (!ext) console.error('Extension is undefined at index:', i); });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-brand-red underline hover:text-red-400' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto my-4' } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Youtube.configure({ width: 640, height: 360, HTMLAttributes: { class: 'rounded-lg overflow-hidden my-4' } }),
      Placeholder.configure({ placeholder }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[300px] px-6 py-4 focus:outline-none text-gray-200 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      setWordCount({
        words: editor.storage.characterCount.words(),
        characters: editor.storage.characterCount.characters(),
      });
      // Auto-save
      if (autoSaveKey) {
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => {
          try { localStorage.setItem(`autosave_${autoSaveKey}`, html); } catch(e) {}
        }, 5000);
      }
    },
  });

  // Restore auto-saved content
  useEffect(() => {
    if (autoSaveKey && editor && !content) {
      try {
        const saved = localStorage.getItem(`autosave_${autoSaveKey}`);
        if (saved) editor.commands.setContent(saved);
      } catch(e) {}
    }
  }, [autoSaveKey, editor]);

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!linkUrl) { editor?.chain().focus().unsetLink().run(); }
    else { editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run(); }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl, alt: imageAlt || '' }).run();
    }
    setShowImageInput(false);
    setImageUrl('');
    setImageAlt('');
  }, [editor, imageUrl, imageAlt]);

  const addYoutube = useCallback(() => {
    if (youtubeUrl) {
      editor?.commands.setYoutubeVideo({ src: youtubeUrl });
    }
    setShowYoutubeInput(false);
    setYoutubeUrl('');
  }, [editor, youtubeUrl]);

  const addEmbed = useCallback(() => {
    if (embedHtml) {
      editor?.chain().focus().insertContent(embedHtml).run();
    }
    setShowEmbedInput(false);
    setEmbedHtml('');
  }, [editor, embedHtml]);

  if (!editor) return null;

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-[100] bg-[#09090b] flex flex-col'
    : 'bg-[#18181B] rounded-2xl border border-gray-800 overflow-hidden';

  return (
    <div ref={editorContainerRef} className={containerClass}>
      {/* Toolbar */}
      <div className="border-b border-gray-800 bg-[#121214] px-3 py-2 flex flex-wrap items-center gap-0.5 sticky top-0 z-10">
        {/* History */}
        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className="w-4 h-4" />
        </MenuButton>

        <ToolbarDivider />

        {/* Headings */}
        {[1, 2, 3, 4, 5, 6].map(level => {
          const HeadingIcon = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading6][level - 1];
          return (
            <MenuButton
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              isActive={editor.isActive('heading', { level })}
              title={`Heading ${level}`}
            >
              <HeadingIcon className="w-4 h-4" />
            </MenuButton>
          );
        })}

        <ToolbarDivider />

        {/* Text Formatting */}
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
          <Highlighter className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline Code">
          <Code className="w-4 h-4" />
        </MenuButton>

        <ToolbarDivider />

        {/* Text Color */}
        <div className="relative group">
          <MenuButton title="Text Color">
            <Palette className="w-4 h-4" />
          </MenuButton>
          <div className="absolute top-full left-0 mt-1 bg-[#18181B] border border-gray-800 rounded-xl p-2 hidden group-hover:grid grid-cols-5 gap-1 z-50 shadow-xl">
            {['#D42B2B', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4', '#FFFFFF', '#9CA3AF'].map(color => (
              <button
                key={color}
                onClick={() => editor.chain().focus().setColor(color).run()}
                className="w-6 h-6 rounded-full border border-gray-700 hover:scale-125 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            <button
              onClick={() => editor.chain().focus().unsetColor().run()}
              className="w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:scale-125 transition-transform text-xs"
              title="Remove color"
            >×</button>
          </div>
        </div>

        <ToolbarDivider />

        {/* Alignment */}
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <AlignLeft className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <AlignCenter className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <AlignRight className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
          <AlignJustify className="w-4 h-4" />
        </MenuButton>

        <ToolbarDivider />

        {/* Lists */}
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task List">
          <CheckSquare className="w-4 h-4" />
        </MenuButton>

        <ToolbarDivider />

        {/* Blocks */}
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
          <Quote className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
          <FileCode className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus className="w-4 h-4" />
        </MenuButton>

        <ToolbarDivider />

        {/* Table */}
        <MenuButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
          <TableIcon className="w-4 h-4" />
        </MenuButton>
        {editor.isActive('table') && (
          <>
            <MenuButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column">
              <Columns className="w-4 h-4" />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row">
              <RowsIcon className="w-4 h-4" />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table">
              <Trash2 className="w-4 h-4" />
            </MenuButton>
          </>
        )}

        <ToolbarDivider />

        {/* Media */}
        <MenuButton onClick={() => { setShowLinkInput(!showLinkInput); setShowImageInput(false); setShowYoutubeInput(false); }} isActive={editor.isActive('link')} title="Link">
          <LinkIcon className="w-4 h-4" />
        </MenuButton>
        {editor.isActive('link') && (
          <MenuButton onClick={() => editor.chain().focus().unsetLink().run()} title="Remove Link">
            <Unlink className="w-4 h-4" />
          </MenuButton>
        )}
        <MenuButton onClick={() => { setShowImageInput(!showImageInput); setShowLinkInput(false); setShowYoutubeInput(false); }} title="Insert Image">
          <ImageIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => { setShowYoutubeInput(!showYoutubeInput); setShowLinkInput(false); setShowImageInput(false); }} title="YouTube Video">
          <YoutubeIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => { setShowEmbedInput(!showEmbedInput); }} title="Custom HTML Embed">
          <FileCode className="w-4 h-4" />
        </MenuButton>

        <ToolbarDivider />

        <MenuButton onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
          <Maximize2 className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Input Panels */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#121214] border-b border-gray-800">
          <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://example.com" className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-red" autoFocus />
          <button onClick={setLink} className="px-3 py-1.5 bg-brand-red text-white text-sm font-bold rounded-lg hover:bg-red-600">Apply</button>
          <button onClick={() => { setShowLinkInput(false); setLinkUrl(''); }} className="px-3 py-1.5 text-gray-400 text-sm hover:text-white">Cancel</button>
        </div>
      )}

      {showImageInput && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#121214] border-b border-gray-800">
          <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-red" autoFocus />
          <input type="text" value={imageAlt} onChange={e => setImageAlt(e.target.value)} placeholder="Alt text" className="w-40 bg-black/50 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-red" />
          <button onClick={addImage} className="px-3 py-1.5 bg-brand-red text-white text-sm font-bold rounded-lg hover:bg-red-600">Insert</button>
          <button onClick={() => { setShowImageInput(false); setImageUrl(''); setImageAlt(''); }} className="px-3 py-1.5 text-gray-400 text-sm hover:text-white">Cancel</button>
        </div>
      )}

      {showYoutubeInput && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#121214] border-b border-gray-800">
          <input type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="YouTube video URL" className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-red" autoFocus />
          <button onClick={addYoutube} className="px-3 py-1.5 bg-brand-red text-white text-sm font-bold rounded-lg hover:bg-red-600">Embed</button>
          <button onClick={() => { setShowYoutubeInput(false); setYoutubeUrl(''); }} className="px-3 py-1.5 text-gray-400 text-sm hover:text-white">Cancel</button>
        </div>
      )}

      {showEmbedInput && (
        <div className="flex flex-col gap-2 px-4 py-2 bg-[#121214] border-b border-gray-800">
          <textarea value={embedHtml} onChange={e => setEmbedHtml(e.target.value)} placeholder="Paste HTML embed code (Twitter, Instagram, Facebook, etc.)" rows={3} className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand-red" autoFocus />
          <div className="flex items-center gap-2">
            <button onClick={addEmbed} className="px-3 py-1.5 bg-brand-red text-white text-sm font-bold rounded-lg hover:bg-red-600">Insert HTML</button>
            <button onClick={() => { setShowEmbedInput(false); setEmbedHtml(''); }} className="px-3 py-1.5 text-gray-400 text-sm hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className={`${isFullscreen ? 'flex-1 overflow-y-auto' : ''}`}>
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121214] border-t border-gray-800 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>{wordCount.words} words</span>
          <span>{wordCount.characters} characters</span>
        </div>
        {autoSaveKey && (
          <span className="text-green-500/60">Auto-save enabled</span>
        )}
      </div>
    </div>
  );
};

export default TipTapEditor;
