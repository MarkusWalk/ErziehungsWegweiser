import React from 'react';

/**
 * Table — the sessions-schedule table style: a coral first column, thin
 * dark row rules, generous cell padding, no zebra striping.
 */
export function Table({ columns, rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--ink-900)' : 'none' }}>
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: '18px 20px',
                  verticalAlign: 'top',
                  fontSize: 'var(--text-small)',
                  fontWeight: j === 0 ? 700 : 400,
                  color: j === 0 ? 'var(--accent-primary)' : 'var(--text-primary)',
                  whiteSpace: j === 0 ? 'nowrap' : 'normal',
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
