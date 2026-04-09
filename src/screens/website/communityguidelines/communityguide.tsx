import React from 'react';

const guidelines = [
  {
    title: 'Be respectful',
    description: 'No harassment, hate speech, or abusive behavior.'
  },
  {
    title: 'Content rules',
    description: '',
    subrules: [
      'No illegal or explicit content',
      'No misinformation',
      'Respect intellectual property',
    ]
  },
  {
    title: 'Tutor conduct',
    description: '',
    subrules: [
      'Deliver value',
      'Be professional',
      'Avoid scams',
    ]
  },
  {
    title: 'Violations',
    description: 'Accounts may be suspended or banned.'
  }
];

export default function CommunityGuidelines() {
  return (
    <main style={{ maxWidth: 600, margin: '40px auto', padding: '24px', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Community Guidelines</h1>
      <p style={{ color: '#555', marginBottom: 32 }}>
        Please follow these guidelines to help keep our community safe, respectful, and valuable for everyone.
      </p>
      <div>
        {guidelines.map((rule, idx) => (
          <section key={idx} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{rule.title}</h2>
            {rule.description && <p style={{ color: '#444', marginBottom: rule.subrules ? 8 : 0 }}>{rule.description}</p>}
            {rule.subrules && (
              <ul style={{ paddingLeft: 20, color: '#333', margin: 0 }}>
                {rule.subrules.map((sub, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{sub}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
