// Time limits from the mobile app's notifiers, so both platforms allow the same.

/** Own text messages can be edited for 90 minutes (MessageEditNotifier). */
export const EDIT_WINDOW_MS = 90 * 60_000;

/** Own messages can be deleted for everyone for an hour (MessageDeleteNotifier). */
export const DELETE_FOR_EVERYONE_WINDOW_MS = 60 * 60_000;
