import { useEffect, useRef } from "react";

import {
  CertificateCustomization,
  CertificateEditableField,
} from "@spt/store/createSpoilStore";

interface CertificateEditableFieldsOverlayProps {
  fields: CertificateCustomization["fields"];
  selectedField: CertificateEditableField;
  onSelectField: (field: CertificateEditableField) => void;
  onFieldTextChange: (field: CertificateEditableField, text: string) => void;
}

interface EditableFieldConfig {
  field: CertificateEditableField;
  className: string;
  multiline?: boolean;
  normalizeText?: (text: string) => string;
}

const EDITABLE_FIELD_CONFIGS: EditableFieldConfig[] = [
  {
    field: "title",
    className:
      "absolute left-[194px] top-[86px] w-[174px] whitespace-pre-wrap break-words bg-transparent outline-none",
    multiline: true,
    normalizeText: (text) => text.replace(/\n{2,}/g, "\n"),
  },
  {
    field: "recipientName",
    className:
      "absolute left-[168px] top-[165px] w-[220px] bg-transparent outline-none",
  },
  {
    field: "body",
    className:
      "absolute left-[152px] top-[228px] w-[255px] whitespace-pre-wrap break-words bg-transparent outline-none",
    multiline: true,
  },
];

export default function CertificateEditableFieldsOverlay({
  fields,
  selectedField,
  onSelectField,
  onFieldTextChange,
}: CertificateEditableFieldsOverlayProps) {
  const fieldRefs = useRef<
    Partial<Record<CertificateEditableField, HTMLDivElement | null>>
  >({});

  useEffect(() => {
    EDITABLE_FIELD_CONFIGS.forEach(({ field }) => {
      const element = fieldRefs.current[field];

      if (!element) {
        return;
      }

      const currentText = element.innerText.replace(/\r/g, "");
      const nextText = fields[field].text;

      if (currentText !== nextText) {
        element.innerText = nextText;
      }
    });
  }, [fields]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {EDITABLE_FIELD_CONFIGS.map(
        ({ field, className, multiline = false, normalizeText }) => {
          const fieldStyle = fields[field];

          return (
            <div
              key={field}
              ref={(element) => {
                fieldRefs.current[field] = element;
              }}
              role="textbox"
              tabIndex={0}
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              onFocus={() => onSelectField(field)}
              onClick={() => onSelectField(field)}
              onKeyDown={(event) => {
                if (!multiline && event.key === "Enter") {
                  event.preventDefault();
                }
              }}
              onPaste={(event) => {
                event.preventDefault();

                const pastedText = event.clipboardData.getData("text/plain");
                document.execCommand("insertText", false, pastedText);
              }}
              onInput={(event) =>
                onFieldTextChange(
                  field,
                  normalizeText
                    ? normalizeText(event.currentTarget.innerText)
                    : event.currentTarget.innerText,
                )
              }
              className={`${className} ${
                selectedField === field
                  ? "pointer-events-auto cursor-text rounded-[2px] outline outline-1 outline-[#0B5368]/40"
                  : "pointer-events-auto cursor-text"
              }`}
              style={{
                color: fieldStyle.color,
                fontFamily: fieldStyle.fontFamily,
                fontSize: `${fieldStyle.fontSize}px`,
                fontWeight: fieldStyle.fontWeight,
                fontStyle: fieldStyle.fontStyle,
                textDecoration: fieldStyle.textDecoration,
                textAlign: fieldStyle.textAlign,
                lineHeight: fieldStyle.lineHeight,
              }}
            />
          );
        },
      )}
    </div>
  );
}
