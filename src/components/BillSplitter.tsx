
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AddParticipantsForm from './AddParticipantsForm';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import ResultsCalculator from './ResultsCalculator';
import ExpenseSummary from './ExpenseSummary';
import BillHeader from './bill/BillHeader';
import BillActions from './bill/BillActions';
import { useBillState } from '../hooks/useBillState';

const BillSplitter: React.FC = () => {
  const {
    billTitle,
    setBillTitle,
    participants,
    expenses,
    activeTab,
    setActiveTab,
    billDate,
    setBillDate,
    handleAddParticipant,
    handleRemoveParticipant,
    handleAddExpense,
    handleRemoveExpense,
    handleResetBill
  } = useBillState();

  return (
    <div className="max-w-3xl mx-auto">
      <BillHeader
        billTitle={billTitle}
        setBillTitle={setBillTitle}
        billDate={billDate}
        setBillDate={setBillDate}
        participants={participants}
        expenses={expenses}
      />
      
      <BillActions onReset={handleResetBill} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="participants" className="space-y-6">
          <AddParticipantsForm
            participants={participants}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
          />
          
          {participants.length > 0 && (
            <div className="flex justify-end">
              <Button 
                onClick={() => setActiveTab("expenses")}
                className="bill-btn-primary"
              >
                Next: Add Expenses
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-6">
          <AddExpenseForm
            participants={participants}
            onAddExpense={handleAddExpense}
          />
          <ExpenseList
            expenses={expenses}
            participants={participants}
            onRemoveExpense={handleRemoveExpense}
          />
          
          {expenses.length > 0 && (
            <div className="flex justify-end">
              <Button 
                onClick={() => setActiveTab("summary")}
                className="bill-btn-primary"
              >
                Next: View Summary
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="summary">
          <ExpenseSummary
            participants={participants}
            expenses={expenses}
          />
          
          {expenses.length > 0 && (
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setActiveTab("results")}
                className="bill-btn-primary"
              >
                Next: View Results
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="results">
          <ResultsCalculator
            participants={participants}
            expenses={expenses}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillSplitter;
