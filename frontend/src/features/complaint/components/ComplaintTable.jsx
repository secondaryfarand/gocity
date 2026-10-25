import React from 'react';

export default function ComplaintTable({ complaints, onUpdateStatus }) {
  const tableStyle = { padding: '14px 16px', fontSize: '13px', color: '#334155' };

  // Helper untuk warna badge status
  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    let bg = '#f1f5f9', color = '#475569', icon = 'fa-clock';
    
    if (s === 'RESOLVED') { bg = '#dcfce7'; color = '#16a34a'; icon = 'fa-circle-check'; }
    else if (s === 'IN_PROGRESS') { bg = '#e0f2fe'; color = '#0284c7'; icon = 'fa-spinner fa-spin'; }
    else if (s === 'REJECTED') { bg = '#fee2e2'; color = '#dc2626'; icon = 'fa-circle-xmark'; }
    else if (s === 'PENDING') { bg = '#fef9c3'; color = '#ca8a04'; icon = 'fa-triangle-exclamation'; }

    return (
      <span style={{ 
        padding: '6px 12px', 
        borderRadius: '20px', 
        background: bg, 
        color: color, 
        fontSize: '11px', 
        fontWeight: '700',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <i className={`fa-solid ${icon}`}></i> {s}
      </span>
    );
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
            <th style={tableStyle}><i className="fa-solid fa-ticket"></i> Tiket</th>
            <th style={tableStyle}><i className="fa-solid fa-tag"></i> Kategori</th>
            <th style={tableStyle}><i className="fa-solid fa-comment-dots"></i> Isi Aduan</th>
            <th style={tableStyle}><i className="fa-solid fa-chart-line"></i> Status</th>
            <th style={tableStyle}><i className="fa-solid fa-gears"></i> Aksi Ubah Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <i className="fa-solid fa-folder-open" style={{ fontSize: '32px', marginBottom: '10px', display: 'block', color: '#cbd5e1' }}></i>
                Tidak ada data pengaduan yang ditemukan.
              </td>
            </tr>
          ) : (
            complaints.map((c) => {
              const identifier = c.ticketNumber || c._id;
              const contentText = c.content || c.description || '-';
              return (
                <tr key={identifier} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td style={tableStyle}>
                    <strong style={{ color: '#0f172a' }}>{c.ticketNumber || 'LPR-' + c._id?.substring(0, 6)}</strong>
                  </td>
                  <td style={tableStyle}>
                    <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>
                      {c.category || 'Umum'}
                    </span>
                  </td>
                  <td style={{ ...tableStyle, maxWidth: '280px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={contentText}>
                      {contentText}
                    </div>
                  </td>
                  <td style={tableStyle}>
                    {getStatusBadge(c.status)}
                  </td>
                  <td style={tableStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select 
                        value={c.status || 'PENDING'} 
                        onChange={(e) => onUpdateStatus(identifier, e.target.value)}
                        style={{ 
                          padding: '8px 12px', 
                          borderRadius: '8px', 
                          border: '1px solid #cbd5e1', 
                          background: '#fff', 
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#334155',
                          outline: 'none'
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}