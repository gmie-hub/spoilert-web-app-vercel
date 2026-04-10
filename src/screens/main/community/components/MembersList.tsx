"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Modal from "@spt/components/modal";
import useGetUserCommunityDetailQuery from "@spt/hooks/apiRequests/useGetUserCommunityDetailQuery";
import useUpdateCommunityUserMutation from "@spt/hooks/apiRequests/useUpdateCommunityUserMutation";
import { useAuthStore } from "@spt/store/authStore";

type MembersListProps = {
  communityId?: string;
  tutorId?: string | number | null;
  onClose?: () => void;
};

const MembersList = ({ communityId, tutorId, onClose }: MembersListProps) => {
  const router = useRouter();
  const authUserId = useAuthStore((s) => s.user?.id);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(searchTerm.trim() || undefined),
      300,
    );
    return () => clearTimeout(t);
  }, [searchTerm]);

  const { data, isLoading, isError, errorMessage } =
    useGetUserCommunityDetailQuery(communityId ?? "", debouncedSearch);
  const { updateAsync, isUpdating } = useUpdateCommunityUserMutation();

  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [confirmRestrictFor, setConfirmRestrictFor] = useState<any | null>(
    null,
  );
  const [confirmUnrestrictFor, setConfirmUnrestrictFor] = useState<any | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // normalize items so we can render list while a background fetch is happening
  const items: any[] = Array.isArray(data)
    ? data
    : (data?.data ?? data?.members ?? data?.users ?? data?.participants ?? []);

  return (
    <div className="space-y-3">
      <div className="mb-3">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          placeholder="Search for a member..."
          className="w-full rounded-lg border border-[#EEF1F4] px-4 py-2 text-sm"
        />
      </div>

      {isLoading && <p className="text-sm text-gray">Searching members...</p>}
      {isError && <p className="text-red-600">{errorMessage}</p>}

      <ul className="space-y-4">
        {items.length === 0 ? (
          <li className="text-gray">No members found</li>
        ) : (
          items.map((m: any) => (
            <li
              key={m.id || m.user_id || m.email}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div>
                  <div className="font-medium text-black">
                    {(() => {
                      const memberId =
                        m?.id ?? m?.user?.id ?? m?.user_id ?? null;
                      const isLoggedIn =
                        !!authUserId &&
                        !!memberId &&
                        Number(memberId) === Number(authUserId);
                      const isTutorMember =
                        !!tutorId &&
                        !!memberId &&
                        Number(tutorId) === Number(memberId);
                      if (isLoggedIn && isTutorMember) return "You (tutor)";
                      const first =
                        m?.user?.first_name || m?.first_name || m?.name || "";
                      const last = m?.user?.last_name || m?.last_name || "";
                      const full = `${first} ${last}`.trim();
                      return full || m?.email || m?.username || "Unknown";
                    })()}
                  </div>
                  <div className="text-xs text-gray">
                    {m.role || m.subtitle || ""}
                  </div>
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  aria-expanded={openMenuFor === (m.id || m.user_id || m.email)}
                  onClick={() =>
                    setOpenMenuFor(
                      openMenuFor === (m.id || m.user_id || m.email)
                        ? null
                        : m.id || m.user_id || m.email,
                    )
                  }
                  className="ml-3 rounded px-2 py-1 text-sm text-gray-600"
                >
                  •••
                </button>

                {openMenuFor === (m.id || m.user_id || m.email) ? (
                  <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border bg-white shadow-md">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuFor(null);
                        router.push(`/chat?user_id=${m.id || m.user_id}`);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuFor(null);
                        if (m?.restricted === 0) {
                          setConfirmRestrictFor(m);
                        } else {
                          setConfirmUnrestrictFor(m);
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      {m?.restricted === 0 ? "Restrict User" : "Unrestrict User"}
                    </button>
                  </div>
                ) : null}
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Simple pagination placeholder if backend provides pagination */}
      {data?.current_page ? (
        <div className="mt-4 flex items-center justify-between">
          <button className="rounded border px-3 py-1 text-sm">Previous</button>
          <div className="text-sm text-gray">
            Page {data.current_page} of {data.last_page}
          </div>
          <button className="rounded border px-3 py-1 text-sm">Next</button>
        </div>
      ) : null}

      {/* Restrict confirmation modal */}
      {confirmRestrictFor ? (
        <Modal
          open={Boolean(confirmRestrictFor)}
          title=""
          onClose={() => setConfirmRestrictFor(null)}
          showCloseButton={true}
        >
          <div className="flex flex-col items-center text-center py-4">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                  fill="#FEE2E2"
                />
                <path
                  d="M12 8v5"
                  stroke="#DC2626"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16h.01"
                  stroke="#DC2626"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black">
              Are You Sure You Want to Restrict{" "}
              {confirmRestrictFor.name ||
                `${confirmRestrictFor.first_name || ""} ${confirmRestrictFor.last_name || ""}`.trim()}{" "}
              from Posting and Commenting?
            </h3>
            <p className="mt-2 text-sm text-gray">
              This user will no longer be able to post or comment in the
              community. They&apos;ll still be able to view posts.
            </p>

            <div className="mt-6 w-full">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await updateAsync({
                        community_id: communityId || "",
                        user_id:
                          confirmRestrictFor.id || confirmRestrictFor.user_id,
                        action: "restrict",
                      });
                      setConfirmRestrictFor(null);
                      setSuccessTitle("Restriction Successful 🎉");
                      setSuccessMessage("The user has been restricted from posting and commenting in this community.");
                      setShowSuccessModal(true);
                    } catch (err: any) {
                      toast.error(
                        err?.response?.data?.message || err?.message || "Failed to restrict user",
                      );
                    }
                  }}
                  disabled={isUpdating}
                  className={`w-full rounded ${isUpdating ? "bg-gray-400" : "bg-red-600"} px-4 py-3 text-sm font-semibold text-white`}
                >
                  {isUpdating ? "Restricting..." : "Yes, Restrict User"}
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmRestrictFor(null)}
                  className="w-full rounded border px-4 py-3 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}

      {/* Unrestrict confirmation modal */}
      {confirmUnrestrictFor ? (
        <Modal
          open={Boolean(confirmUnrestrictFor)}
          title=""
          onClose={() => setConfirmUnrestrictFor(null)}
          showCloseButton={true}
        >
          <div className="flex flex-col items-center text-center py-4">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#E6FFFA" />
                <path d="M8 12h8" stroke="#0B5368" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8v8" stroke="#0B5368" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black">
              Are You Sure You Want to Lift the Posting and Commenting Restriction for {confirmUnrestrictFor.name || `${confirmUnrestrictFor.first_name || ""} ${confirmUnrestrictFor.last_name || ""}`.trim()}?
            </h3>
            <p className="mt-2 text-sm text-gray">This user will be able to post and comment again in the community.</p>

            <div className="mt-6 w-full">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await updateAsync({
                        community_id: communityId || "",
                        user_id: confirmUnrestrictFor.id || confirmUnrestrictFor.user_id,
                        action: "unrestrict",
                      });
                      setConfirmUnrestrictFor(null);
                      setSuccessTitle("Restriction Lifted 🎉");
                      setSuccessMessage("The user will be able to post and comment again in the community.");
                      setShowSuccessModal(true);
                    } catch (err: any) {
                      toast.error(err?.response?.data?.message || err?.message || "Failed to lift restriction");
                    }
                  }}
                  disabled={isUpdating}
                  className={`w-full rounded ${isUpdating ? "bg-gray-400" : "bg-teal-800"} px-4 py-3 text-sm font-semibold text-white`}
                >
                  {isUpdating ? "Processing..." : "Yes, Lift Restriction"}
                </button>

                <button type="button" onClick={() => setConfirmUnrestrictFor(null)} className="w-full rounded border px-4 py-3 text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}

      {/* Success modal shown after restrict/unrestrict */}
      {showSuccessModal ? (
        <Modal open={showSuccessModal} title="" onClose={() => setShowSuccessModal(false)} showCloseButton={false}>
          <div className="flex flex-col items-center text-center py-6 px-4">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#E6FFFA" />
                <path d="M9 12l2 2 4-4" stroke="#0B5368" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black">{successTitle}</h3>
            <p className="mt-2 text-sm text-gray">{successMessage}</p>

            <div className="mt-6 w-full">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onClose && onClose();
                }}
                className="w-full rounded bg-teal-800 px-4 py-3 text-sm font-semibold text-white"
              >
                Okay
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default MembersList;
