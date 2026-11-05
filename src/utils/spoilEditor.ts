import { useAuthStore } from "@spt/store/authStore";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

interface EditableSpoil {
  id: number | string;
  type?: string | null;
}

/** URL of the editor for an existing spoil (simple or advanced). */
export const getSpoilEditHref = ({ id, type }: EditableSpoil) =>
  type === "simple"
    ? `/create-spoils/simple-spoil?spoilId=${id}`
    : `/create-spoils/advance-spoil?spoilId=${id}`;

/**
 * Call right before opening the editor from an "Edit" button. It drops any draft
 * this tab still holds, so the editor fills its fields from the saved spoil.
 *
 * Without this, a leftover draft already tagged with the same spoil id (from an
 * earlier visit) is treated as in-progress edits and kept, so the fields come up
 * stale or empty. The certificate flow returns to the editor without passing
 * through here, so edits made before that trip are still preserved.
 */
export const resetSpoilEditorDraft = () => {
  useCreateSpoilStore.getState().resetDraft();
  useAuthStore.getState().setCreatedSpoilId?.(null);

  try {
    sessionStorage.removeItem("advanced-spoil-step");
    sessionStorage.removeItem("simple-spoil-step");
  } catch {
    // ignore if sessionStorage is unavailable
  }
};
