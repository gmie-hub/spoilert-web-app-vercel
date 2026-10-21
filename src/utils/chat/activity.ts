import {
  type Timestamp,
  deleteField,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { getChatDb } from "@spt/utils/firebase";

// "typing…" and "recording audio…": typingStatus/{conversationId} and
// recordingStatus/{conversationId} hold { [userId]: serverTimestamp } while a
// person is active. Same shape the mobile app reads and (for recording) writes.

export type ChatActivity = "typing" | "recording";

const COLLECTIONS: Record<ChatActivity, string> = {
  typing: "typingStatus",
  recording: "recordingStatus",
};

const activityRef = (activity: ChatActivity, conversationId: string) =>
  doc(getChatDb(), COLLECTIONS[activity], conversationId);

/** Say I'm typing/recording now, or that I've stopped. Best-effort. */
export function setActivity(
  activity: ChatActivity,
  conversationId: string,
  userId: string,
  active: boolean,
) {
  const write = active
    ? setDoc(activityRef(activity, conversationId), { [userId]: serverTimestamp() }, { merge: true })
    : updateDoc(activityRef(activity, conversationId), { [userId]: deleteField() });
  // A missing doc on "stopped", or no connection, just means nothing to show.
  return write.catch(() => undefined);
}

/** When each person last said they were active, live. */
export function subscribeToActivity(
  activity: ChatActivity,
  conversationId: string,
  onChange: (lastActive: Record<string, Date>) => void,
) {
  return onSnapshot(
    activityRef(activity, conversationId),
    (snapshot) => {
      const data = snapshot.data({ serverTimestamps: "estimate" }) ?? {};
      onChange(
        Object.fromEntries(
          Object.entries(data)
            .filter(([, value]) => typeof (value as Timestamp)?.toDate === "function")
            .map(([userId, value]) => [userId, (value as Timestamp).toDate()]),
        ),
      );
    },
    () => onChange({}),
  );
}
