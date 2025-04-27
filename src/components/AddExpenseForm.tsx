
import React from 'react';
import { Participant, Expense } from '../utils/billSplitterUtils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import ExpenseBasicInfo from './expense/ExpenseBasicInfo';
import ExpensePayer from './expense/ExpensePayer';
import ParticipantsList from './expense/ParticipantsList';
import { useExpenseForm } from '@/hooks/useExpenseForm';

interface AddExpenseFormProps {
  participants: Participant[];
  onAddExpense: (expense: Expense) => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ participants, onAddExpense }) => {
  const {
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
  } = useExpenseForm({ participants, onAddExpense });

  if (participants.length === 0) {
    return (
      <div className="bill-card text-center py-10">
        <p className="text-muted-foreground">Please add participants first</p>
      </div>
    );
  }

  return (
    <div className="bill-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <ExpenseBasicInfo
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
          />
          
          <ExpensePayer
            paidBy={paidBy}
            setPaidBy={setPaidBy}
            participants={participants}
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="splitEqually" 
              checked={splitEqually} 
              onCheckedChange={() => setSplitEqually(!splitEqually)} 
            />
            <label htmlFor="splitEqually" className="text-sm font-medium">
              Split equally
            </label>
          </div>
          
          <ParticipantsList
            participants={participants}
            selectedParticipants={selectedParticipants}
            splitEqually={splitEqually}
            customAmounts={customAmounts}
            onToggleParticipant={toggleParticipantSelection}
            onCustomAmountChange={(id, value) => {
              setCustomAmounts({
                ...customAmounts,
                [id]: value
              });
            }}
            onSelectAll={handleSelectAll}
            remaining={calculateRemainingAmount()}
            amount={amount}
          />
          
          <Button type="submit" className="w-full bill-btn-primary">
            <Plus className="h-4 w-4 mr-1" /> Add Expense
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseForm;
