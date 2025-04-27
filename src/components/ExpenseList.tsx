
import React from 'react';
import { Expense, Participant } from '../utils/billSplitterUtils';
import { X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

interface ExpenseListProps {
  expenses: Expense[];
  participants: Participant[];
  onRemoveExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, participants, onRemoveExpense }) => {
  if (expenses.length === 0) {
    return (
      <div className="bill-card text-center py-8">
        <p className="text-muted-foreground">No expenses added yet</p>
      </div>
    );
  }

  const getParticipantName = (id: string): string => {
    if (!id) return 'To be determined';
    return participants.find(p => p.id === id)?.name || 'Unknown';
  };
  
  const formatSplitDetails = (expense: Expense): string => {
    if (expense.splits.every(split => split.isEqual)) {
      return `Equal split between ${expense.splits.length} people`;
    }
    
    // For custom splits, just indicate it's custom
    return "Custom split";
  };

  return (
    <div className="bill-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Expenses</h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid By</TableHead>
              <TableHead>Split</TableHead>
              <TableHead className="w-16 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map(expense => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>${expense.amount.toFixed(2)}</TableCell>
                <TableCell>{getParticipantName(expense.paidBy)}</TableCell>
                <TableCell>{formatSplitDetails(expense)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveExpense(expense.id)}
                    className="h-8 w-8 text-bill-danger"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExpenseList;
