
import React from 'react';
import { Input } from '@/components/ui/input';

interface ExpenseBasicInfoProps {
  description: string;
  setDescription: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
}

const ExpenseBasicInfo: React.FC<ExpenseBasicInfoProps> = ({
  description,
  setDescription,
  amount,
  setAmount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-foreground/90">
          Description
        </label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Dinner, Movie tickets, etc."
          className="w-full bg-background border-input/50 hover:border-primary/50 transition-colors"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-medium text-foreground/90">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="pl-7 bg-background border-input/50 hover:border-primary/50 transition-colors"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseBasicInfo;
