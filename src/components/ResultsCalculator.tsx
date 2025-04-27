
import React from 'react';
import {
  Participant,
  Expense,
  calculateBalances,
  calculateSettlements,
  Settlement
} from '../utils/billSplitterUtils';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResultsCalculatorProps {
  participants: Participant[];
  expenses: Expense[];
}

const ResultsCalculator: React.FC<ResultsCalculatorProps> = ({ participants, expenses }) => {
  if (participants.length === 0 || expenses.length === 0) {
    return (
      <div className="bill-card text-center py-8">
        <p className="text-muted-foreground">
          Add participants and expenses to see results
        </p>
      </div>
    );
  }

  const balances = calculateBalances(participants, expenses);
  const settlements = calculateSettlements(participants, expenses);

  const getParticipantName = (id: string): string => {
    return participants.find(p => p.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Individual Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {participants.map(participant => {
              const balance = balances[participant.id] || 0;
              const formattedBalance = Math.abs(balance).toFixed(2);
              
              return (
                <div 
                  key={participant.id} 
                  className="flex justify-between items-center p-3 rounded-lg border"
                >
                  <span className="font-medium">{participant.name}</span>
                  <span 
                    className={cn(
                      "font-semibold",
                      balance > 0 ? "text-bill-success" : 
                      balance < 0 ? "text-bill-danger" : "text-gray-500"
                    )}
                  >
                    {balance > 0 
                      ? `Gets back $${formattedBalance}` 
                      : balance < 0 
                        ? `Owes $${formattedBalance}` 
                        : `$0.00 (settled)`}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settlement Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {settlements.length > 0 ? (
            <div className="space-y-3">
              {settlements.map((settlement, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-medium">{getParticipantName(settlement.from)}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{getParticipantName(settlement.to)}</span>
                  </div>
                  <span className="font-semibold">${settlement.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Everything is settled! No payments needed.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsCalculator;
