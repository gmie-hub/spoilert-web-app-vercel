interface MyLearningProgressBarProps {
  progress: number;
}

export const MyLearningProgressBar = ({
  progress,
}: MyLearningProgressBarProps) => (
  <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#DDECF2]">
    <div
      className="h-full rounded-full bg-[#01495F] transition-[width] duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default MyLearningProgressBar;

