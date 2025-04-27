
import React from 'react';
import { Participant } from '../../utils/billSplitterUtils';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface ParticipantsListProps {
  participants: Participant[];
  selectedParticipants: string[];
  splitEqually: boolean;
  customAmounts: Record<string, string>;
  onToggleParticipant: (id: string) => void;
  onCustomAmountChange: (id: string, amount: string) => void;
  onSelectAll: () => void;
  remaining: number;
  amount: string;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  selectedParticipants,
  splitEqually,
  customAmounts,
  onToggleParticipant,
  onCustomAmountChange,
  onSelectAll,
  remaining,
  amount
}) => {
  const allSelected = participants.length > 0 && selectedParticipants.length === participants.length;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="block text-sm font-medium">
          Split with
        </label>
        <button 
          type="button" 
          onClick={onSelectAll}
          className="text-xs text-bill-primary hover:underline"
        >
          {allSelected ? "Unselect all" : "Select all"}
        </button>
      </div>
      
      <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md">
        {participants.map(participant => (
          <div key={participant.id} className="flex justify-between items-center">
            <div className="flex items-center">
              <Checkbox 
                id={`participant-${participant.id}`} 
                checked={selectedParticipants.includes(participant.id)}
                onCheckedChange={() => onToggleParticipant(participant.id)}
              />
              <label 
                htmlFor={`participant-${participant.id}`} 
                className="ml-2 text-sm"
              >
                {participant.name}
              </label>
            </div>
            
            {!splitEqually && selectedParticipants.includes(participant.id) && (
              <div className="relative w-24">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  value={customAmounts[participant.id] || ''}
                  onChange={(e) => onCustomAmountChange(participant.id, e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="pl-7 py-1 h-8 text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!splitEqually && amount && (
        <div className={`text-sm mt-2 ${remaining === 0 ? 'text-bill-success' : 'text-bill-danger'}`}>
          {remaining === 0 
            ? "✓ Amounts match the total" 
            : `Remaining: $${remaining}`}
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;
