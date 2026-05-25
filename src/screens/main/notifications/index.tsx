

"use client";

import { type FC, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import BackIcon from "@spt/assets/icons/arrow-left.svg";
import TrashIcon from "@spt/assets/icons/trash.svg";
import Button from "@spt/components/button";
import Card from "@spt/components/card";
import DeleteConfirmationModal from "@spt/components/deleteConfirmationModal";
import Modal from "@spt/components/modal";
import NoData from "@spt/components/noData";
import useClearNotificationsMutation from "@spt/hooks/apiRequests/useClearNotificationsMutation";
import useGetNotificationsQuery, {
  type UserNotification,
} from "@spt/hooks/apiRequests/useGetNotificationsQuery";
import useReadNotificationsMutation from "@spt/hooks/apiRequests/useReadNotificationsMutation";
import { getErrorMessage } from "@spt/utils/error";

import { ErrorState } from "../home/spoilDetails/spoilDetails";
import { LoadingState } from "../spoil/preSpoilQuiz/components/LoadingState";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) + " | " + date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const isRejectionNotification = (n: UserNotification) =>
  n.title.toLowerCase().includes("reject") ||
  n.title.toLowerCase().includes("failed");

const isSuccessNotification = (n: UserNotification) =>
  n.title.toLowerCase().includes("approv") ||
  n.title.toLowerCase().includes("verified") ||
  n.title.toLowerCase().includes("success");

const RejectionIcon = () => (
  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const SuccessIcon = () => (
  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const InfoIcon = () => (
  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#013B4D]">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 16v-4m0-4h.01"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

interface NotificationDetailModalProps {
  notification: UserNotification | null;
  onClose: () => void;
}

const NotificationDetailModal: FC<NotificationDetailModalProps> = ({
  notification,
  onClose,
}) => {
  const router = useRouter();

  if (!notification) return null;

  const isRejection = isRejectionNotification(notification);
  const isSuccess = isSuccessNotification(notification);

  const icon = isRejection ? (
    <RejectionIcon />
  ) : isSuccess ? (
    <SuccessIcon />
  ) : (
    <InfoIcon />
  );

  return (
    <Modal open={!!notification} onClose={onClose} size="sm">
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        {icon}

        <p className="text-xl font-semibold text-black">{notification.title}</p>

        <p className="text-sm text-gray-500">{notification.body}</p>

        <div className="w-full space-y-3 pt-2">
          {isRejection && notification.type === "spoil_status" && (
            <Button
              type="button"
              onClick={onClose}
              className="w-full bg-[#013B4D] text-white hover:bg-[#013B4D]/90"
            >
              Edit and Resubmit
            </Button>
          )}

          {notification.route && (
            <Button
              type="button"
              onClick={() => {
                router.push(notification.route);
                onClose();
              }}
              className="w-full bg-[#013B4D] text-white hover:bg-[#013B4D]/90"
            >
              View Details
            </Button>
          )}

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full text-sm font-medium text-[#013B4D]"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </Modal>
  );
};

const NotificationsPage: FC = () => {
  const router = useRouter();

  const [selectedNotification, setSelectedNotification] =
    useState<UserNotification | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [page, setPage] = useState(1);

  const { data: notifications, pagination, isLoading, isError, error } = useGetNotificationsQuery({ page, per_page: 10 });
  const { readNotificationsHandler, markAllAsRead } = useReadNotificationsMutation();
  const { clearNotificationsHandler, isLoading: isClearing } =
    useClearNotificationsMutation();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message={getErrorMessage(error)} />;
  }

  const handleNotificationClick = (n: UserNotification) => {
    setSelectedNotification(n);
    if (!n.is_read) {
      readNotificationsHandler([n.id]);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearConfirm = async () => {
    await clearNotificationsHandler();
    setShowClearModal(false);
  };

  return (
    <div className="min-h-[80vh] px-4 sm:px-6 md:px-[100px] py-6">
      <div className="mb-4 md:mb-10 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#013B4D] hover:opacity-90"
        >
          <Image src={BackIcon} alt="Back" width={18} height={18} />
          <span>Back</span>
        </button>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <Card className="rounded-3xl bg-white">
            <div className="space-y-2">
              <h1 className="text-lg font-semibold text-black">
                Notifications
              </h1>

              {notifications.length > 0 && (
                <div className="flex w-full items-center justify-between">
                  <button
                    className="text-sm text-red-500"
                    onClick={() => setShowClearModal(true)}
                  >
                    Clear All Notifications
                  </button>
                  <button
                    className="text-sm text-[#E08A4B]"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark All As Read
                  </button>
                </div>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="mt-6">
                <NoData heading="No Notifications Yet!" description="" />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`cursor-pointer rounded-2xl border ${
                      !n.is_read
                        ? "bg-[#EAF6F9] border-transparent"
                        : "bg-white border-[#EFEFEF]"
                    } p-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#F0FAFB]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 22c1.1046 0 2-.8954 2-2h-4c0 1.1046.8954 2 2 2z"
                              fill="#9BBFD0"
                            />
                            <path
                              d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                              fill="#9BBFD0"
                            />
                          </svg>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-black">
                            {n.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatDate(n.created_at)}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm text-[#9AA6AA]">›</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pagination && pagination.last_page > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={!pagination.prev_page_url}
                  className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                >
                  Prev
                </button>

                <span className="text-sm text-gray-500">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.next_page_url}
                  className="rounded border px-3 py-1 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />

      <DeleteConfirmationModal
        open={showClearModal}
        title="Are You Sure You Want To Clear All Notifications?"
        description="You won't be able to recover it once it is deleted"
        confirmLabel="Yes, Clear Notifications"
        isLoading={isClearing}
        loadingLabel="Clearing..."
        onConfirm={handleClearConfirm}
        onCancel={() => setShowClearModal(false)}
        icon={<Image src={TrashIcon} alt="trash" width={75} height={87} />}
      />
    </div>
  );
};

export default NotificationsPage;
