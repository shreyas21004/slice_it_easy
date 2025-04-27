
import React from 'react';
import { Participant } from '../../utils/billSplitterUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpensePayerProps {
  paidBy: string;
  setPaidBy: (value: string) => void;
  participants: Participant[];
}

const ExpensePayer: React.FC<ExpensePayerProps> = ({
  paidBy,
  setPaidBy,
  participants
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="paidBy" className="block text-sm font-medium text-foreground/90">
        Paid By
      </label>
      <Select 
        value={paidBy} 
        onValueChange={(value) => setPaidBy(value)}
      >
        <SelectTrigger className="w-full bg-background border-input/50 hover:border-primary/50 transition-colors">
          <SelectValue placeholder="Select who paid (optional)" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <SelectItem value="none">No one yet</SelectItem>
          {participants.map(participant => (
            <SelectItem 
              key={participant.id} 
              value={participant.id}
              className="hover:bg-primary/5 cursor-pointer transition-colors"
            >
              {participant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        You can add expenses now and decide who paid later
      </p>
    </div>
  );
};

export default ExpensePayer;
