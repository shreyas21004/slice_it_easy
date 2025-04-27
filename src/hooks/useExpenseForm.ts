
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Participant, 
  Expense, 
  ExpenseSplit, 
  generateId, 
  calculateEqualSplits 
} from '../utils/billSplitterUtils';

export interface UseExpenseFormProps {
  participants: Participant[];
  onAddExpense: (expense: Expense) => void;
}

export const useExpenseForm = ({ participants, onAddExpense }: UseExpenseFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitEqually, setSplitEqually] = useState(true);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setPaidBy(participants[0]?.id || '');
    setSplitEqually(true);
    setSelectedParticipants([]);
    setCustomAmounts({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (selectedParticipants.length === 0) {
      toast.error("Please select at least one participant to split with");
      return;
    }

    let splits: ExpenseSplit[] = [];
    
    if (splitEqually) {
      splits = calculateEqualSplits(amountValue, participants, selectedParticipants);
    } else {
      let totalCustom = 0;
      const customSplits: ExpenseSplit[] = [];
      
      for (const participantId of selectedParticipants) {
        const customAmount = parseFloat(customAmounts[participantId] || '0');
        
        if (isNaN(customAmount) || customAmount < 0) {
          toast.error(`Invalid amount for ${participants.find(p => p.id === participantId)?.name}`);
          return;
        }
        
        totalCustom += customAmount;
        customSplits.push({
          participantId,
          amount: parseFloat(customAmount.toFixed(2)),
          isEqual: false
        });
      }
      
      const roundedTotal = parseFloat(totalCustom.toFixed(2));
      const roundedAmount = parseFloat(amountValue.toFixed(2));
      
      if (roundedTotal !== roundedAmount) {
        toast.error(`The sum of custom amounts (${roundedTotal}) doesn't match the expense total (${roundedAmount})`);
        return;
      }
      
      splits = customSplits;
    }
    
    const expense: Expense = {
      id: generateId(),
      description: description.trim(),
      amount: amountValue,
      paidBy: paidBy || '',
      splits
    };
    
    onAddExpense(expense);
    resetForm();
  };

  const toggleParticipantSelection = (participantId: string) => {
    if (selectedParticipants.includes(participantId)) {
      setSelectedParticipants(selectedParticipants.filter(id => id !== participantId));
      const newCustomAmounts = { ...customAmounts };
      delete newCustomAmounts[participantId];
      setCustomAmounts(newCustomAmounts);
    } else {
      setSelectedParticipants([...selectedParticipants, participantId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === participants.length) {
      setSelectedParticipants([]);
      setCustomAmounts({});
    } else {
      setSelectedParticipants(participants.map(p => p.id));
    }
  };

  const calculateRemainingAmount = () => {
    if (splitEqually) return 0;
    const totalAmount = parseFloat(amount || '0');
    if (isNaN(totalAmount)) return 0;
    const allocatedAmount = Object.values(customAmounts)
      .reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
    return parseFloat((totalAmount - allocatedAmount).toFixed(2));
  };

  return {
    description,
    setDescription,
    amount,
    setAmount,
    paidBy,
    setPaidBy,
    splitEqually,
    setSplitEqually,
    selectedParticipants,
    customAmounts,
    setCustomAmounts,
    handleSubmit,
    toggleParticipantSelection,
    handleSelectAll,
    calculateRemainingAmount
  };
};
