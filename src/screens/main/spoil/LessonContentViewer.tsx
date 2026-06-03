"use client";

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
    return (
      <iframe
        src={url}
        title={title}
        className="absolute inset-0 h-full w-full bg-white"
      />
    );
  }

  if (kind === "office") {
    const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      url,
    )}`;

    return (
      <iframe
        src={viewerUrl}
        title={title}
        className="absolute inset-0 h-full w-full bg-white"
      />
    );
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
