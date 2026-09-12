import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Phone, Mail, Calendar, CheckCircle2, 
  Clock, Download, Trash2, Edit3, Sparkles, Search, Filter 
} from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';

export default function AdminLeads() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNotes, setTempNotes] = useState('');
  const { showToast, refreshSiteData } = useSite();

  const loadEnquiries = async () => {
    try {
      const data = await api.getEnquiries();
      setEnquiries(data || []);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateEnquiry(id, { status: newStatus });
      showToast(`Lead status updated to ${newStatus.toUpperCase()}`);
      await loadEnquiries();
      refreshSiteData();
    } catch (err) {
      showToast('Failed to update lead status', 'error');
    }
  };

  const handleSaveNotes = async (id) => {
    try {
      await api.updateEnquiry(id, { notes: tempNotes });
      showToast('Internal follow-up notes saved!');
      setEditingNotesId(null);
      await loadEnquiries();
    } catch (err) {
      showToast('Failed to save notes', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete enquiry from ${name}?`)) {
      try {
        await api.deleteEnquiry(id);
        showToast('Enquiry removed');
        await loadEnquiries();
        refreshSiteData();
      } catch (err) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  const handleExportCSV = () => {
    if (!enquiries.length) return;
    const headers = ['ID', 'Customer Name', 'Phone', 'Email', 'Project', 'Property Type', 'Budget', 'Visit Date', 'Status', 'Notes', 'Created At'];
    const rows = enquiries.map(e => [
      e.id,
      `"${e.name || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.email || ''}"`,
      `"${e.projectName || ''}"`,
      `"${e.propertyType || ''}"`,
      `"${e.budget || ''}"`,
      `"${e.preferredVisitDate || ''}"`,
      `"${e.status || ''}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
      `"${e.createdAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join(String.fromCharCode(10));
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Aadya_Homes_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CRM Leads exported to CSV successfully!');
  };

  const filtered = enquiries.filter(e => {
    const matchQuery = (e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (e.phone || '').includes(searchTerm) ||
                       (e.projectName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatusFilter === 'all' || e.status === selectedStatusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Customer Enquiry & CRM Manager (लीड्स व पूछताछ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track inquiries, schedule site visits, maintain CRM follow-up remarks & dispatch WhatsApp templates
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export All Leads (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-7 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="sm:col-span-5">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Stages (सभी लीड्स)</option>
            <option value="new">New Enquiry</option>
            <option value="contacted">Contacted</option>
            <option value="site_visit">Site Visit Scheduled</option>
            <option value="follow_up">Follow-Up In Progress</option>
            <option value="converted">Converted / Booked 🎉</option>
            <option value="closed">Closed / Not Interested</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-800/70 rounded-3xl overflow-hidden border border-slate-700 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Project & BHK Interest</th>
                <th className="px-6 py-4">Site Visit Date</th>
                <th className="px-6 py-4">Customer Message</th>
                <th className="px-6 py-4">Pipeline Status</th>
                <th className="px-6 py-4">Internal Remarks</th>
                <th className="px-6 py-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {filtered.map((enq) => {
                const phoneClean = (enq.phone || '').replace(/[^0-9+]/g, '');
                const waText = encodeURIComponent(`Hello ${enq.name}, Thank you for your interest in ${enq.projectName || 'Kumawat Homes'}. When can we arrange your project site visit?`);
                return (
                  <tr key={enq.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4">
                      <h4 className="font-bold text-white text-sm">{enq.name}</h4>
                      <p className="text-amber-300 font-semibold">{enq.phone}</p>
                      {enq.email && <p className="text-[11px] text-slate-400">{enq.email}</p>}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-white block">{enq.projectName}</span>
                      <span className="text-[11px] text-amber-400">{enq.propertyType} • {enq.budget}</span>
                    </td>

                    <td className="px-6 py-4">
                      {enq.preferredVisitDate ? (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-semibold block w-max">
                          📅 {enq.preferredVisitDate}
                        </span>
                      ) : (
                        <span className="text-slate-500">Not specified</span>
                      )}
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                        "{enq.message || 'Interested in property details.'}"
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={enq.status || 'new'}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                          enq.status === 'converted' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50' :
                          enq.status === 'site_visit' ? 'bg-blue-950 text-blue-300 border-blue-500/50' :
                          enq.status === 'contacted' ? 'bg-amber-950 text-amber-300 border-amber-500/50' :
                          enq.status === 'closed' ? 'bg-slate-900 text-slate-500 border-slate-700' :
                          'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="new">New Enquiry</option>
                        <option value="contacted">Contacted (Call Done)</option>
                        <option value="site_visit">Site Visit Scheduled</option>
                        <option value="follow_up">Follow-Up In Progress</option>
                        <option value="converted">Converted / Booked 🎉</option>
                        <option value="closed">Closed / Cold</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      {editingNotesId === enq.id ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleSaveNotes(enq.id)}
                              className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => { setEditingNotesId(enq.id); setTempNotes(enq.notes || ''); }}
                          className="cursor-pointer hover:text-amber-400 text-[11px] text-slate-400 flex items-center gap-1 group"
                          title="Click to edit notes"
                        >
                          <span className="truncate">{enq.notes || 'Add internal remarks...'}</span>
                          <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0" />
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${phoneClean.replace('+', '')}?text=${waText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={`tel:${phoneClean}`}
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleDelete(enq.id, enq.name)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
