export type InviteStatus = "Accepted" | "Pending" | "Declined";

export interface Lecturer {
  id: string;
  // The lecturer's user account; their spoils, earnings and payments are keyed by it.
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  faculty: string;
  department: string;
  position: string;
  totalCourses: number;
  // null while the API doesn't say; shown as "-" rather than guessed.
  inviteStatus: InviteStatus | null;
  dateSent: string;
  lastLogin: string;
  bio: string | null;
}
