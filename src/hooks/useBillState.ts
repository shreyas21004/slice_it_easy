
import { useState, useEffect } from 'react';
import { Participant, Expense, BillData, saveBillData, loadBillData } from '../utils/billSplitterUtils';
import { toast } from 'sonner';

export const useBillState = () => {
  const [billTitle, setBillTitle] = useState('New Bill');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState("participants");
  const [billDate, setBillDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Load saved bill data on init
  useEffect(() => {
    const savedData = loadBillData();
    if (savedData) {
      setBillTitle(savedData.title);
      setParticipants(savedData.participants);
      setExpenses(savedData.expenses);
      setBillDate(savedData.date);
    }
  }, []);

  // Autosave bill data when changes occur
  useEffect(() => {
    const billData: BillData = {
      title: billTitle,
      date: billDate,
      participants,
      expenses
    };
    saveBillData(billData);
  }, [billTitle, billDate, participants, expenses]);

  const handleAddParticipant = (participant: Participant) => {
    setParticipants([...participants, participant]);
    toast.success(`Added ${participant.name}`);
  };

  const handleRemoveParticipant = (id: string) => {
    const isUsedInExpenses = expenses.some(
      expense => expense.paidBy === id || expense.splits.some(split => split.participantId === id)
    );

    if (isUsedInExpenses) {
      toast.error("Can't remove participant who is part of an expense");
      return;
    }

    setParticipants(participants.filter(p => p.id !== id));
    toast.success("Participant removed");
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
    toast.success("Expense added");
    setActiveTab("expenses");
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success("Expense removed");
  };

  const handleResetBill = () => {
    if (participants.length > 0 || expenses.length > 0) {
      if (confirm("Are you sure you want to reset the bill? This will delete all data.")) {
        setParticipants([]);
        setExpenses([]);
        setBillTitle("New Bill");
        setBillDate(new Date().toISOString().split('T')[0]);
        setActiveTab("participants");
        toast.success("Bill reset successfully");
      }
    } else {
      toast.info("Nothing to reset");
    }
  };

  return {
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
  };
};
