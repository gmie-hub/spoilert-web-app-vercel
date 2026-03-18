import MyLearningCard from "./MyLearningCard";

import type { LearningItem, MyLearningTabKey } from "../types";

interface MyLearningListProps {
  items: LearningItem[];
  tab: MyLearningTabKey;
  onAction: (item: LearningItem) => void;
  onCertificate?: (item: LearningItem) => void;
}

export const MyLearningList = ({
  items,
  tab,
  onAction,
  onCertificate,
}: MyLearningListProps) => (
  <div className="space-y-4 p-4 sm:p-6">
    {items.map((item) => (
      <MyLearningCard
        key={item.id}
        item={item}
        tab={tab}
        onAction={onAction}
        onCertificate={onCertificate}
      />
    ))}
  </div>
);

export default MyLearningList;

