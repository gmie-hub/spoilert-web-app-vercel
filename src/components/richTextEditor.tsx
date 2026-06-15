"use client";

import type { FC } from "react";
import { useEffect, useRef } from "react";

import { useField } from "formik";
import {
  FiBold,
  FiItalic,
  FiLink,
  FiList,
  FiUnderline,
} from "react-icons/fi";
import { LuListOrdered } from "react-icons/lu";

interface RichTextEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  hasAsterisk?: boolean;
  helperText?: string;
  /** Minimum editing height. */
  minHeight?: number;
}

type Command = {
  icon: FC<{ size?: number }>;
  title: string;
  run: () => void;
};

// A lightweight rich-text editor that stores HTML and plugs into Formik exactly
// like the Textarea component. Built on a contentEditable surface so it needs no
// extra dependency and works under React 19. Formatting uses document.execCommand
// — deprecated on paper but still supported across every current browser.
const RichTextEditor: FC<RichTextEditorProps> = ({
  name,
  label,
  placeholder = "Type in content",
  hasAsterisk,
  helperText,
  minHeight = 180,
}) => {
  const [field, meta, helpers] = useField(name);
  const editorRef = useRef<HTMLDivElement>(null);
  const hasError = meta.touched && Boolean(meta.error);

  // Seed the editor from Formik on mount, and re-sync only when the external
  // value diverges from the DOM (e.g. a form reset / loading a draft). We avoid
  // rewriting innerHTML on every keystroke so the caret never jumps.
  useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerHTML !== (field.value ?? "")) {
      el.innerHTML = field.value ?? "";
    }
     
  }, [field.value]);

  const syncToFormik = () => {
    const html = editorRef.current?.innerHTML ?? "";
    // Treat an empty editor (browsers leave a stray <br>) as a blank string so
    // "required" validation behaves like the old textarea.
    const normalized = html === "<br>" || html === "<div><br></div>" ? "" : html;
    helpers.setValue(normalized);
  };

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncToFormik();
  };

  const commands: Command[] = [
    { icon: FiBold, title: "Bold", run: () => exec("bold") },
    { icon: FiItalic, title: "Italic", run: () => exec("italic") },
    { icon: FiUnderline, title: "Underline", run: () => exec("underline") },
    {
      icon: FiList,
      title: "Bulleted list",
      run: () => exec("insertUnorderedList"),
    },
    {
      icon: LuListOrdered,
      title: "Numbered list",
      run: () => exec("insertOrderedList"),
    },
    {
      icon: FiLink,
      title: "Insert link",
      run: () => {
        const url = window.prompt("Enter a URL");
        if (url) exec("createLink", url);
      },
    },
  ];

  const isEmpty = !field.value;

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {hasAsterisk && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div
        className={`overflow-hidden rounded-2xl border bg-[#FBFBFB] ${
          hasError
            ? "border-red-500"
            : "border-gray-200 focus-within:border-[var(--color-blue)]"
        }`}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-2 py-1.5">
          {commands.map(({ icon: Icon, title, run }) => (
            <button
              key={title}
              type="button"
              title={title}
              aria-label={title}
              // onMouseDown + preventDefault keeps the editor's text selection
              // intact while the toolbar button is pressed.
              onMouseDown={(e) => {
                e.preventDefault();
                run();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-200"
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

        {/* Editable surface */}
        <div className="relative">
          {isEmpty && (
            <span className="pointer-events-none absolute left-4 top-3 text-sm text-gray-400">
              {placeholder}
            </span>
          )}
          <div
            ref={editorRef}
            id={name}
            contentEditable
            role="textbox"
            aria-multiline="true"
            suppressContentEditableWarning
            onInput={syncToFormik}
            onBlur={() => helpers.setTouched(true)}
            style={{ minHeight }}
            className="prose prose-sm max-w-none px-4 py-3 text-sm leading-relaxed text-gray-800 focus:outline-none [&_a]:text-[var(--color-blue)] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
          />
        </div>
      </div>

      {hasError && <p className="text-xs text-red-500">{meta.error}</p>}
      {helperText && !hasError && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default RichTextEditor;
