
import React from 'react';
import { Input } from "@/components/ui/input";
import { calculateTotalExpenses } from '../../utils/billSplitterUtils';
import type { Participant, Expense } from '../../utils/billSplitterUtils';

interface BillHeaderProps {
  billTitle: string;
  setBillTitle: (title: string) => void;
  billDate: string;
  setBillDate: (date: string) => void;
  participants: Participant[];
  expenses: Expense[];
}

const BillHeader: React.FC<BillHeaderProps> = ({
  billTitle,
  setBillTitle,
  billDate,
  setBillDate,
  participants,
  expenses
}) => {
  const totalExpenses = calculateTotalExpenses(expenses);

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <Input
          value={billTitle}
          onChange={(e) => setBillTitle(e.target.value)}
          className="text-2xl font-bold px-0 border-0 w-full focus-visible:ring-0 focus-visible:ring-offset-0 mb-1"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Date:</span>
          <Input
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            className="h-7 py-0 px-2 w-auto"
          />
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-bill-primary">
          ${totalExpenses.toFixed(2)}
        </div>
        <div className="text-sm text-muted-foreground">
          {participants.length} participants, {expenses.length} expenses
        </div>
      </div>
    </div>
  );
};

export default BillHeader;
