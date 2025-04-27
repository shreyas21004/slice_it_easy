
import React, { useState } from 'react';
import { generateId, Participant } from '../utils/billSplitterUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface AddParticipantsFormProps {
  participants: Participant[];
  onAddParticipant: (participant: Participant) => void;
  onRemoveParticipant: (id: string) => void;
}

const AddParticipantsForm: React.FC<AddParticipantsFormProps> = ({
  participants,
  onAddParticipant,
  onRemoveParticipant
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Participant name cannot be empty");
      return;
    }
    
    if (participants.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      toast.error("A participant with this name already exists");
      return;
    }
    
    const newParticipant: Participant = {
      id: generateId(),
      name: name.trim()
    };
    
    onAddParticipant(newParticipant);
    setName('');
  };

  return (
    <div className="bill-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Add Participants</h3>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="flex-grow"
          maxLength={50}
        />
        <Button type="submit" className="bill-btn-primary">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </form>
      
      <div className="mt-4">
        {participants.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center bg-bill-primary/10 text-bill-primary px-3 py-1 rounded-full"
              >
                {participant.name}
                <button
                  type="button"
                  onClick={() => onRemoveParticipant(participant.id)}
                  className="ml-2 text-bill-primary/70 hover:text-bill-primary"
                  aria-label={`Remove ${participant.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">No participants added yet</div>
        )}
      </div>
    </div>
  );
};

export default AddParticipantsForm;
