"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import type { SpoilLesson } from "./startSpoilUtils";

type FileKind = "image" | "pdf" | "video" | "office" | "other";

const getExtension = (url: string): string => {
  const fileName = url.split("?")[0].split("/").pop() ?? "";
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex > 0 ? fileName.slice(dotIndex + 1).toLowerCase() : "";
};

const getFileKind = (lesson: SpoilLesson): FileKind => {
  if (lesson.type?.toLowerCase() === "video") return "video";

  const ext = getExtension(lesson.content_url ?? "");

  if (["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp", "avif"].includes(ext)) {
    return "image";
  }
  if (ext === "pdf") return "pdf";
  if (["mp4", "webm", "ogg", "mov", "m4v"].includes(ext)) return "video";
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "office";

  return "other";
};

// How long to wait for a document before offering a retry.
const LOAD_TIMEOUT_MS = 20000;

/**
 * Shows a "please wait" state until the embedded viewer loads, and a retry if
 * it hasn't loaded after LOAD_TIMEOUT_MS. The frame stays mounted meanwhile,
 * so a slow document still appears as soon as it arrives.
 */
const DocumentFrame = ({ src, title }: { src: string; title: string }) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "slow">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => setStatus("slow"), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [status, attempt]);

  const handleRetry = () => {
    setAttempt((value) => value + 1);
    setStatus("loading");
  };

  return (
    <>
      <iframe
        key={attempt}
        src={src}
        title={title}
        onLoad={() => setStatus("loaded")}
        className="absolute inset-0 h-full w-full bg-white"
      />

      {status !== "loaded" && (
        <div
          role="status"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white px-6 text-center"
        >
          {status === "loading" ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0B5368] border-t-transparent" />
              <p className="text-sm font-semibold text-[#212529]">
                Please wait, your document is loading&hellip;
              </p>
              <p className="text-xs text-[#6B7280]">This may take a few seconds.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-[#212529]">
                This document is taking longer than usual to load.
              </p>
              <p className="text-xs text-[#6B7280]">
                Please check your internet connection and try again.
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-1 rounded-full bg-[#013B4D] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Try again
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

interface LessonContentViewerProps {
  lesson: SpoilLesson;
}

/**
 * Renders a lesson's content inline based on its file type:
 * images, video and PDFs render natively; Office documents (doc/ppt/xls)
 * render through the Microsoft Office online viewer; anything else falls
 * back to a link to open the file directly.
 */
const LessonContentViewer = ({ lesson }: LessonContentViewerProps) => {
  const url = lesson.content_url ?? "";
  const title = lesson.title || "Lesson content";
  const kind = getFileKind(lesson);

  if (kind === "image") {
    return (
      <Image
        src={url}
        alt={title}
        fill
        sizes="(max-width: 1024px) 100vw, 70vw"
        className="bg-black object-contain"
      />
    );
  }

  if (kind === "video") {
    return (
      <video
        src={url}
        controls
        controlsList="nodownload"
        className="absolute inset-0 h-full w-full bg-black"
      >
        Your browser does not support embedded video.
      </video>
    );
  }

  if (kind === "pdf") {
    // Hides the browser PDF viewer's toolbar (download, print) and thumbnail
    // pane. Chrome and Edge honour these; Firefox's viewer ignores them.
    const viewerUrl = `${url.split("#")[0]}#toolbar=0&navpanes=0`;

    // Keyed by URL so switching lessons starts the loading state afresh.
    return <DocumentFrame key={viewerUrl} src={viewerUrl} title={title} />;
  }

  if (kind === "office") {
    const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      url,
    )}`;

    return <DocumentFrame key={viewerUrl} src={viewerUrl} title={title} />;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0B2C3D] px-6 text-center text-white">
      <p className="text-sm">This file can&apos;t be previewed here.</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0B2C3D]"
      >
        Open file
      </a>
    </div>
  );
};

export default LessonContentViewer;
