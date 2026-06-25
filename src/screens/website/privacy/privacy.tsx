"use client";

import React from "react";

const PrivacyPage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <article className="bg-white shadow-sm rounded-lg border border-gray-100">
        <header className="px-8 py-10 border-b border-gray-100">
          <h1 className="text-3xl font-semibold text-gray-900">Privacy Policy</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            SPOILERT values your privacy. This policy explains how we collect,
            use, and protect your data.
          </p>
        </header>

        <section className="px-8 py-8 space-y-6">
          <section>
            <h2 className="text-xl font-medium text-gray-800">1. Introduction</h2>
            <p className="mt-2 text-gray-600">
              SPOILERT is committed to protecting your privacy and personal
              information. This Privacy Policy describes what information we
              collect and how we use and share it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">2. Information We Collect</h2>
            <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Personal Information:</strong> name, email, phone number.</li>
              <li><strong>Account Information:</strong> username, profile details.</li>
              <li><strong>Payment Information:</strong> when you make purchases.</li>
              <li><strong>Usage Data:</strong> logs, analytics and activity on the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">3. How We Use Your Information</h2>
            <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
              <li>To provide and improve our services.</li>
              <li>To process transactions and manage billing.</li>
              <li>To communicate updates, notifications, and support messages.</li>
              <li>To ensure platform security and detect abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">4. Sharing of Information</h2>
            <p className="mt-2 text-gray-600">We do <strong>NOT</strong> sell your data. We may share information with:</p>
            <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
              <li>Payment processors for handling transactions.</li>
              <li>Legal authorities if required by law.</li>
              <li>Service providers that help us operate the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">5. Data Security</h2>
            <p className="mt-2 text-gray-600">We implement industry-standard technical and organizational measures to protect your data from unauthorized access, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">6. Cookies &amp; Tracking</h2>
            <p className="mt-2 text-gray-600">We use cookies and similar technologies to improve user experience and for analytics. You can control cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">7. User Rights</h2>
            <p className="mt-2 text-gray-600">You have the right to:</p>
            <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
              <li>Access your data.</li>
              <li>Request corrections to inaccurate information.</li>
              <li>Request deletion of your personal data, subject to legal and contractual obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">8. Data Retention</h2>
            <p className="mt-2 text-gray-600">We retain personal data only as long as necessary to provide services and meet legal obligations. Retention periods vary by data type and purpose.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">9. Children’s Privacy</h2>
            <p className="mt-2 text-gray-600">We do not knowingly collect information from children under the age of 13. If we become aware of such data, we will take steps to delete it.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">10. Updates</h2>
            <p className="mt-2 text-gray-600">We may update this policy periodically. When we do, we will publish the revised policy here and update the effective date.</p>
          </section>

          <footer className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">If you have questions about this Privacy Policy, contact us at thespoilert@gmail.com.</p>
          </footer>
        </section>
      </article>
    </main>
  );
};

export default PrivacyPage;
