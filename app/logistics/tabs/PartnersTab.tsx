import React, { useState } from 'react';
import { Search, Plus, Edit, Pause, Play, Trash2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import { LogisticsPartner } from '../types';
import AddPartnerModal from '../AddPartnerModal';
import EditPartnerModal from '../EditPartnerModal';
import DeleteConfirmModal from '../DeleteConfirmModal';

interface PartnersTabProps {
  onViewPartner?: (partner: LogisticsPartner) => void;
}

const PartnersTab: React.FC<PartnersTabProps> = ({ onViewPartner }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [partners, setPartners] = useState<LogisticsPartner[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<LogisticsPartner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<LogisticsPartner | null>(null);

  const filteredPartners = partners.filter((partner: LogisticsPartner) =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.services.some((service: string) => service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceBadgeColor = (service: string) => {
    switch (service) {
      case 'cash_pickup': return 'bg-blue-100 text-blue-800';
      case 'delivery': return 'bg-purple-100 text-purple-800';
      case 'both': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleStatus = (partnerId: string) => {
    setPartners(prev => prev.map((partner: LogisticsPartner) => {
      if (partner.id === partnerId) {
        const newStatus = partner.status === 'active' ? 'inactive' : 'active';
        return { ...partner, status: newStatus };
      }
      return partner;
    }));
  };

  const handleEditPartner = (partner: LogisticsPartner) => {
    setEditingPartner(partner);
  };

  const handleDeletePartner = (partner: LogisticsPartner) => {
    setDeletingPartner(partner);
  };

  const confirmDeletePartner = () => {
    if (deletingPartner) {
      setPartners(prev => prev.filter((p: LogisticsPartner) => p.id !== deletingPartner.id));
      setDeletingPartner(null);
    }
  };

  const handleAddPartner = (newPartner: Omit<LogisticsPartner, 'id' | 'joinedDate' | 'lastActive'>) => {
    const partner: LogisticsPartner = {
      ...newPartner,
      id: `partner_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      documents: [] // Add empty documents array if needed by UI
    };
    setPartners(prev => [...prev, partner]);
    setIsAddModalOpen(false);
  };

  const handleUpdatePartner = (updatedPartner: LogisticsPartner) => {
    setPartners(prev => prev.map((p: LogisticsPartner) => p.id === updatedPartner.id ? updatedPartner : p));
    setEditingPartner(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button 
          className="bg-red-600 hover:bg-red-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPartners.map((partner: LogisticsPartner) => (
          <Card key={partner.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusColor(partner.status)}>
                    {partner.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col h-full">
              {/* Services and Stats in same row */}
              <div className="flex items-center justify-between">
                {/* Services - only show for non-961 captains */}
                {partner.id !== '961_captains' ? (
                  <div className="flex flex-wrap gap-1">
                    {partner.services.map((service: string) => (
                      <Badge key={service} variant="outline" className={getServiceBadgeColor(service)}>
                        {service.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div></div>
                )}
                
                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">
                      {partner.id === '961_captains' ? 'Rating' : 'Rating'}
                    </p>
                    <p className="font-semibold">⭐ {partner.overallRating}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">
                      {partner.id === '961_captains' ? 'Trips' : 'Deliveries'}
                    </p>
                    <p className="font-semibold">{partner.totalDeliveries.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Zones</p>
                    <p className="font-semibold">{partner.zones.length}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewPartner?.(partner)}
                  className="hover:bg-gray-100"
                >
                  {partner.id === '961_captains' ? 'Manage →' : 'View →'}
                </Button>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditPartner(partner)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  {partner.id !== '961_captains' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(partner.id)}
                        className="hover:bg-gray-100"
                      >
                        {partner.status === 'active' ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePartner(partner)}
                        className="hover:bg-gray-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No partners found matching your search.</p>
        </div>
      )}

      {/* Add Partner Modal */}
      <AddPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPartner}
      />

      {/* Edit Partner Modal */}
      <EditPartnerModal
        isOpen={!!editingPartner}
        partner={editingPartner}
        onClose={() => setEditingPartner(null)}
        onUpdate={handleUpdatePartner}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingPartner}
        partner={deletingPartner}
        onClose={() => setDeletingPartner(null)}
        onDelete={confirmDeletePartner}
      />
    </div>
  );
};

export default PartnersTab;