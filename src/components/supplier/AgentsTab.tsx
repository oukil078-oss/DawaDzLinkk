import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { AddAgentModal } from './AddAgentModal';
import { EditAgentModal } from './EditAgentModal';
import { useAuth } from '../../contexts/AuthContext';
import { agentsApi } from '../../lib/api';

interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  whatsapp?: string;
  facebook?: string;
  linkedin?: string;
  region: string;
}

export function AgentsTab() {
  const { details } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await agentsApi.getMy();
      setAgents(data);
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) return;
    try {
      await agentsApi.delete(id);
      setAgents(agents.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Échec de la suppression de l\'agent');
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowEditModal(true);
  };

  const handleUpdateAgent = async (updatedAgent: Agent) => {
    try {
      await agentsApi.update(updatedAgent.id, {
        name: updatedAgent.name,
        phone: updatedAgent.phone,
        email: updatedAgent.email,
        whatsapp: updatedAgent.whatsapp,
        facebook: updatedAgent.facebook,
        linkedin: updatedAgent.linkedin,
        region: updatedAgent.region,
      });
      setAgents(agents.map(a =>
        a.id === updatedAgent.id ? updatedAgent : a
      ));
      setShowEditModal(false);
      setEditingAgent(null);
    } catch (error) {
      console.error('Error updating agent:', error);
      alert('Échec de la mise à jour de l\'agent');
    }
  };

  const handleAddAgent = async (agent: Omit<Agent, 'id'>) => {
    try {
      const newAgent = await agentsApi.create(agent);
      setAgents([newAgent, ...agents]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding agent:', error);
      alert('Échec de l\'ajout de l\'agent');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl text-gray-900 mb-2">Agents Commerciaux</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Gérez vos agents commerciaux et leurs coordonnées
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base whitespace-nowrap"
          data-testid="add-agent-btn"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Ajouter un agent
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6" data-testid={`agent-card-${agent.id}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm sm:text-base text-teal-700 font-medium">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditAgent(agent)}
                  className="p-1.5 sm:p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  title="Modifier"
                  data-testid={`edit-agent-${agent.id}`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAgent(agent.id)}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                  data-testid={`delete-agent-${agent.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h4 className="text-base sm:text-lg mb-1 text-gray-900">{agent.name}</h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">{agent.region}</p>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{agent.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{agent.email}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Réseaux sociaux</p>
              <div className="flex gap-2">
                {agent.whatsapp && (
                  <a
                    href={`https://wa.me/${agent.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                )}
                {agent.facebook && (
                  <a
                    href={`https://facebook.com/${agent.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                )}
                {agent.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${agent.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddAgentModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAgent}
        />
      )}

      {showEditModal && editingAgent && (
        <EditAgentModal
          agent={editingAgent}
          onClose={() => {
            setShowEditModal(false);
            setEditingAgent(null);
          }}
          onUpdate={handleUpdateAgent}
        />
      )}
    </div>
  );
}
