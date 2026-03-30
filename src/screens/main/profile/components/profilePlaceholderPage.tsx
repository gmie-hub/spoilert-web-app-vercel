import Image from "next/image";

import EmptyLearningImage from "@spt/assets/icons/Empty Image.svg";

interface ProfilePlaceholderPageProps {
  title: string;
  description: string;
  actionLabel?: string;
}

const ProfilePlaceholderPage = ({
  title,
  description,
  actionLabel,
}: ProfilePlaceholderPageProps) => {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-4 py-10 text-center sm:px-8 sm:py-14">
      <Image
        src={EmptyLearningImage}
        alt=""
        width={133}
        height={158}
        className="h-auto w-[110px] sm:w-[133px]"
      />

      <h2 className="mt-8 text-[24px] font-semibold tracking-[-0.02em] text-[#20262D]">
        {title}
      </h2>

      <p className="mt-4 max-w-[500px] leading-7 text-[#656565]">{description}</p>

      {actionLabel ? (
        <button
          type="button"
          className="mt-8 inline-flex w-full max-w-[420px] items-center justify-center rounded-[12px] bg-[#0B5368] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(11,83,104,0.18)] transition hover:bg-[#09485A]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default ProfilePlaceholderPage;
