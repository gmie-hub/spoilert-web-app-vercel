"use client";

import type { CommunityFeedItem, CommunityProfile } from "./communityTypes";

const communityFeed: CommunityFeedItem[] = [
  {
    id: "mary-post",
    type: "post",
    author: {
      id: "mary",
      name: "Mary Coker",
      avatarLabel: "MC",
      accentColor: "#B9D3E5",
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "You can use Ctrl + Shift + T to reopen a tab you accidentally closed in your browser! What’s a simple tech trick you swear by?",
    likes: 20,
    comments: 15,
  },
  {
    id: "admin-post",
    type: "post",
    author: {
      id: "admin",
      name: "Spoilert Admin",
      avatarLabel: "SA",
      accentColor: "#D9DDE8",
      verified: true,
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "Hello everyone! Just a quick reminder to be polite and respectful to each other in this community. Let’s create a positive space where we can learn and grow together.",
    likes: 20,
    comments: 15,
  },
  {
    id: "design-spoil",
    type: "spoil",
    author: {
      id: "mary",
      name: "Mary Coker",
      avatarLabel: "MC",
      accentColor: "#B9D3E5",
      subtitle: "University of Lagos",
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "Understanding Design Principles is a comprehensive Spoil that takes you through the foundational concepts of creating effective and visually appealing designs.",
    likes: 20,
    comments: 0,
    imageLabel: "Understanding Design Principles",
    promoted: true,
    tag: "UI/UX Design",
    title: "Understanding Design Principles",
    price: "N150,000",
    institution: "University of Lagos",
  },
  {
    id: "jade-post",
    type: "post",
    author: {
      id: "jade",
      name: "Jade Olasunmbo",
      avatarLabel: "JO",
      accentColor: "#D2E1F6",
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "Tech can be challenging, but every expert was once a beginner. What's one small win you've had recently? Whether it's writing your first line of code or debugging a tough error, share your progress below!",
    likes: 20,
    comments: 15,
    imageLabel: "Creative Workstation",
  },
  {
    id: "ifeoma-post",
    type: "post",
    author: {
      id: "ifeoma",
      name: "Ifeoma Chinaza",
      avatarLabel: "IC",
      accentColor: "#F5CAD8",
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "Share your funniest tech-related meme or experience in the comments. Here’s one to start: “Why do programmers prefer dark mode? Because light attracts bugs.”",
    likes: 20,
    comments: 15,
  },
  {
    id: "science-spoil",
    type: "spoil",
    author: {
      id: "adetola",
      name: "Adetola John",
      avatarLabel: "AJ",
      accentColor: "#E3E5F0",
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "Understanding Design Principles is a comprehensive Spoil that takes you through the foundational concepts of creating effective and visually appealing designs.",
    likes: 20,
    comments: 0,
    imageLabel: "Medical Lab Research",
    promoted: true,
    tag: "UI/UX Design",
    title: "Understanding Design Principles",
    price: "N150,000",
  },
];

const communityComments: CommunityFeedItem[] = [
  {
    id: "comment-sophie",
    type: "post",
    author: {
      id: "sophie",
      name: "Sophie Lee",
      avatarLabel: "SL",
      accentColor: "#D1E2F9",
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "You can use Ctrl + Shift + T to reopen a tab you accidentally closed in your browser! What’s a simple tech trick you swear by?",
    likes: 20,
    comments: 0,
  },
  {
    id: "comment-admin",
    type: "post",
    author: {
      id: "admin-comment",
      name: "Spoilert Admin",
      avatarLabel: "SA",
      accentColor: "#D9DDE8",
      verified: true,
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "Hello everyone! Just a quick reminder to be polite and respectful to each other in this community. Let’s create a positive space where we can learn and grow together.",
    likes: 20,
    comments: 0,
  },
  {
    id: "comment-ifeoma",
    type: "post",
    author: {
      id: "ifeoma-comment",
      name: "Ifeoma Chinaza",
      avatarLabel: "IC",
      accentColor: "#F5CAD8",
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "Share your funniest tech-related meme or experience in the comments. Here’s one to start: “Why do programmers prefer dark mode? Because light attracts bugs.”",
    likes: 20,
    comments: 0,
  },
  {
    id: "comment-jade",
    type: "post",
    author: {
      id: "jade-comment",
      name: "Jade Olasunmbo",
      avatarLabel: "JO",
      accentColor: "#D2E1F6",
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "Tech can be challenging, but every expert was once a beginner. What's one small win you've had recently? Whether it's writing your first line of code or debugging a tough error, share your progress below!",
    likes: 20,
    comments: 0,
    imageLabel: "Creative Workstation",
  },
  {
    id: "comment-tutor",
    type: "post",
    author: {
      id: "tutor-comment",
      name: "Ogunsola Omorinsola",
      avatarLabel: "OO",
      accentColor: "#D5EAE5",
      badge: "Tutor",
    },
    createdAt: "21/01/2025 • 10:02 PM",
    content:
      "How’s the course treating you so far? What’s been your biggest takeaway or challenge? Drop a comment and let’s help each other out!",
    likes: 20,
    comments: 0,
  },
];

export const detailCommunity: CommunityProfile = {
  id: "design-principles",
  name: "Design Principles",
  members: 80,
  description: "Design community for networking and for design enthusiasts.",
  spoilTitle: "Introduction To Design Principles",
  createdBy: "Omorinsola",
  createdDate: "12-01-2025",
  avatarLabel: "DP",
  accentColor: "#C8D4E3",
  feed: communityFeed,
  comments: communityComments,
};
