import { useState, useRef, useCallback } from 'react';
import { Send, Search, Users, Store, Building2, Paperclip, Image, X, Check, ChevronDown, ChevronUp, Loader as Loader2, Mail, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Type, SquareCheck as CheckSquare, Square } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'pharmacy' | 'supplier';
  status: string;
  details?: {
    pharmacy_name?: string;
    company_name?: string;
    wilaya?: string;
  };
}

interface AdminEmailPageProps {
  allUsers: User[];
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  base64: string;
}

type FilterType = 'all' | 'pharmacy' | 'supplier';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminEmailPage({ allUsers }: AdminEmailPageProps) {
  const { showToast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [sending, setSending] = useState(false);
  const [showUserTable, setShowUserTable] = useState(true);
  const [fontSize, setFontSize] = useState('14px');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const filteredUsers = allUsers.filter((u) => {
    const matchesFilter = filter === 'all' || u.role === filter;
    const matchesSearch =
      !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.details?.pharmacy_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.details?.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.details?.wilaya?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const allSelected = filteredUsers.length > 0 && filteredUsers.every((u) => selectedIds.has(u.id));
  const someSelected = filteredUsers.some((u) => selectedIds.has(u.id));

  const toggleUser = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredUsers.forEach((u) => next.delete(u.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredUsers.forEach((u) => next.add(u.id));
        return next;
      });
    }
  };

  const execFormat = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }, []);

  const handleFontSize = (size: string) => {
    setFontSize(size);
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        span.style.fontSize = size;
        try {
          range.surroundContents(span);
        } catch {
          document.execCommand('fontSize', false, '7');
          const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
          fontElements?.forEach((el) => {
            const s = document.createElement('span');
            s.style.fontSize = size;
            s.innerHTML = (el as HTMLElement).innerHTML;
            el.parentNode?.replaceChild(s, el);
          });
        }
      }
    }
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    execFormat('createLink', linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`);
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isImage = false) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        showToast({ type: 'error', title: 'Fichier trop grand', message: `${file.name} dépasse 10 MB` });
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = (ev.target?.result as string).split(',')[1];
        if (isImage && editorRef.current) {
          const img = document.createElement('img');
          img.src = ev.target?.result as string;
          img.style.maxWidth = '100%';
          img.style.borderRadius = '4px';
          img.style.margin = '8px 0';
          editorRef.current.focus();
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            sel.getRangeAt(0).insertNode(img);
          } else {
            editorRef.current.appendChild(img);
          }
        } else {
          setAttachments((prev) => [
            ...prev,
            { id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type, base64 },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const getEditorHtml = () => {
    if (!editorRef.current) return '';
    return editorRef.current.innerHTML;
  };

  const handleSend = async () => {
    const recipients = allUsers.filter((u) => selectedIds.has(u.id));
    if (recipients.length === 0) {
      showToast({ type: 'error', title: 'Aucun destinataire', message: 'Sélectionnez au moins un utilisateur' });
      return;
    }
    if (!subject.trim()) {
      showToast({ type: 'error', title: 'Objet manquant', message: "Veuillez saisir l'objet de l'email" });
      return;
    }
    const htmlContent = getEditorHtml();
    if (!htmlContent.trim() || htmlContent === '<br>') {
      showToast({ type: 'error', title: 'Message vide', message: 'Veuillez écrire un message' });
      return;
    }

    setSending(true);
    try {
      const toEmails = recipients.map((u) => u.email);
      const payload: any = {
        to: toEmails,
        subject: subject.trim(),
        html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937;line-height:1.6;margin:0;padding:0;background:#f9fafb}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)}.header{background:linear-gradient(135deg,#009689,#00786F);padding:24px 32px}.header h1{color:#fff;margin:0;font-size:20px;font-weight:600}.body{padding:32px}.footer{padding:16px 32px;background:#f3f4f6;text-align:center;font-size:12px;color:#6b7280}a{color:#009689}</style></head><body><div class="container"><div class="header"><h1>DawaDzLink</h1></div><div class="body">${htmlContent}</div><div class="footer">DawaDzLink &mdash; Plateforme de gestion pharmaceutique</div></div></body></html>`,
      };

      if (attachments.length > 0) {
        payload.attachments = attachments.map((a) => ({
          filename: a.name,
          content: a.base64,
          type: a.type,
        }));
      }

      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Erreur lors de l'envoi");
      }

      showToast({
        type: 'success',
        title: 'Emails envoyés',
        message: `${data.sent_count ?? data.results?.length ?? '?'} email(s) envoyé(s) avec succès`,
      });

      setSubject('');
      setAttachments([]);
      setSelectedIds(new Set());
      if (editorRef.current) editorRef.current.innerHTML = '';
    } catch (err: any) {
      showToast({ type: 'error', title: "Erreur d'envoi", message: err.message });
    } finally {
      setSending(false);
    }
  };

  const selectedCount = selectedIds.size;
  const selectedUsers = allUsers.filter((u) => selectedIds.has(u.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Envoyer des Emails</h2>
          <p className="text-sm text-gray-500 mt-1">
            Composez et envoyez des emails directement aux pharmacies et fournisseurs
          </p>
        </div>
        <button
          onClick={handleSend}
          disabled={sending || selectedCount === 0 || !subject.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#009689] text-white rounded-lg hover:bg-[#00786F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Envoyer{selectedCount > 0 ? ` (${selectedCount})` : ''}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Recipient Selector */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
          <button
            onClick={() => setShowUserTable((v) => !v)}
            className="flex items-center justify-between px-5 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#009689]" />
              <span className="font-semibold text-gray-900">Destinataires</span>
              {selectedCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-[#009689] text-white rounded-full">
                  {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {showUserTable ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showUserTable && (
            <>
              {/* Filters & Search */}
              <div className="p-4 border-b border-gray-100 space-y-3">
                <div className="flex gap-2">
                  {(['all', 'pharmacy', 'supplier'] as FilterType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filter === f
                          ? 'bg-[#E0F7F4] text-[#009689]'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {f === 'all' && <Users className="w-3.5 h-3.5" />}
                      {f === 'pharmacy' && <Store className="w-3.5 h-3.5" />}
                      {f === 'supplier' && <Building2 className="w-3.5 h-3.5" />}
                      {f === 'all' ? 'Tous' : f === 'pharmacy' ? 'Pharmacies' : 'Fournisseurs'}
                      <span className="text-xs opacity-70">
                        ({allUsers.filter((u) => f === 'all' || u.role === f).length})
                      </span>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email, wilaya..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-auto max-h-80">
                <table className="w-full min-w-[480px] text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left w-10">
                        <button onClick={toggleAll} className="text-gray-400 hover:text-[#009689] transition-colors">
                          {allSelected ? (
                            <CheckSquare className="w-4.5 h-4.5 text-[#009689]" />
                          ) : someSelected ? (
                            <div className="w-4 h-4 border-2 border-[#009689] rounded flex items-center justify-center bg-white">
                              <div className="w-2 h-0.5 bg-[#009689]" />
                            </div>
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wilaya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isSelected = selectedIds.has(u.id);
                        return (
                          <tr
                            key={u.id}
                            onClick={() => toggleUser(u.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#E0F7F4]' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="px-4 py-3">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#009689]" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-300" />
                              )}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {u.details?.pharmacy_name || u.details?.company_name || u.full_name}
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{u.email}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                  u.role === 'pharmacy'
                                    ? 'bg-teal-100 text-teal-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {u.role === 'pharmacy' ? 'Pharmacie' : 'Fournisseur'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{u.details?.wilaya || '—'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Selected Summary */}
              {selectedCount > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 bg-[#E0F7F4] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#009689]">
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">
                      {selectedCount} destinataire{selectedCount > 1 ? 's' : ''} sélectionné
                      {selectedCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="text-xs text-[#009689] hover:text-[#00786F] font-medium"
                  >
                    Tout désélectionner
                  </button>
                </div>
              )}
            </>
          )}

          {/* Collapsed selected preview */}
          {!showUserTable && selectedCount > 0 && (
            <div className="px-4 py-3 flex flex-wrap gap-2">
              {selectedUsers.slice(0, 6).map((u) => (
                <span
                  key={u.id}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#E0F7F4] text-[#009689] rounded-full text-xs"
                >
                  {u.details?.pharmacy_name || u.details?.company_name || u.full_name}
                  <button onClick={() => toggleUser(u.id)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedCount > 6 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                  +{selectedCount - 6} autres
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Email Composer */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
            <Mail className="w-5 h-5 text-[#009689]" />
            <span className="font-semibold text-gray-900">Composer l'Email</span>
          </div>

          {/* Subject */}
          <div className="px-5 py-3 border-b border-gray-100">
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Objet</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Objet de l'email..."
              className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
            />
          </div>

          {/* Toolbar */}
          <div className="px-4 py-2 border-b border-gray-100 flex flex-wrap items-center gap-1 bg-gray-50">
            <select
              value={fontSize}
              onChange={(e) => handleFontSize(e.target.value)}
              className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#009689]"
            >
              {FONT_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <ToolbarBtn onClick={() => execFormat('bold')} title="Gras">
              <Bold className="w-4 h-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execFormat('italic')} title="Italique">
              <Italic className="w-4 h-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execFormat('underline')} title="Souligné">
              <Underline className="w-4 h-4" />
            </ToolbarBtn>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <ToolbarBtn onClick={() => execFormat('insertUnorderedList')} title="Liste">
              <List className="w-4 h-4" />
            </ToolbarBtn>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <ToolbarBtn onClick={() => execFormat('justifyLeft')} title="Gauche">
              <AlignLeft className="w-4 h-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execFormat('justifyCenter')} title="Centre">
              <AlignCenter className="w-4 h-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execFormat('justifyRight')} title="Droite">
              <AlignRight className="w-4 h-4" />
            </ToolbarBtn>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <ToolbarBtn onClick={() => setShowLinkInput((v) => !v)} title="Insérer un lien">
              <Link className="w-4 h-4" />
            </ToolbarBtn>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <ToolbarBtn onClick={() => imageInputRef.current?.click()} title="Insérer une image">
              <Image className="w-4 h-4" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => fileInputRef.current?.click()} title="Joindre un fichier">
              <Paperclip className="w-4 h-4" />
            </ToolbarBtn>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, true)}
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip"
              className="hidden"
              onChange={(e) => handleFileSelect(e, false)}
            />
          </div>

          {/* Link input */}
          {showLinkInput && (
            <div className="px-4 py-2 border-b border-gray-100 bg-blue-50 flex items-center gap-2">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInsertLink()}
                placeholder="https://..."
                className="flex-1 text-sm border border-blue-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                onClick={handleInsertLink}
                className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setShowLinkInput(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}

          {/* Editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="flex-1 min-h-64 px-5 py-4 text-sm text-gray-800 focus:outline-none overflow-auto"
            style={{ fontSize }}
            data-placeholder="Rédigez votre message ici..."
            onInput={() => {}}
          />

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Pièces jointes ({attachments.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {attachments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-700"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                    <span className="max-w-[120px] truncate">{a.name}</span>
                    <span className="text-gray-400">{formatFileSize(a.size)}</span>
                    <button onClick={() => removeAttachment(a.id)} className="text-gray-400 hover:text-red-500 ml-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-400">
              Envoi via <span className="font-medium text-gray-600">admin@dawadzlink.com</span>
            </p>
            <button
              onClick={handleSend}
              disabled={sending || selectedCount === 0 || !subject.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-[#009689] text-white rounded-lg hover:bg-[#00786F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </div>
      </div>

      {/* CSS for placeholder */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

function ToolbarBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
    >
      {children}
    </button>
  );
}
