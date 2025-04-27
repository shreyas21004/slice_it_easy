
export interface Participant {
  id: string;
  name: string;
}

export interface ExpenseSplit {
  participantId: string;
  amount: number;
  isEqual: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // participantId
  splits: ExpenseSplit[];
}

export interface Settlement {
  from: string;  // participant ID
  to: string;    // participant ID 
  amount: number;
}

export interface BillData {
  title: string;
  date: string;
  participants: Participant[];
  expenses: Expense[];
}

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Calculate the amount each person owes or is owed
export const calculateBalances = (participants: Participant[], expenses: Expense[]): Record<string, number> => {
  const balances: Record<string, number> = {};
  
  // Initialize all balances to 0
  participants.forEach(participant => {
    balances[participant.id] = 0;
  });
  
  // Calculate balances from expenses
  expenses.forEach(expense => {
    // Add the total paid amount to payer's balance
    balances[expense.paidBy] += expense.amount;
    
    // Subtract each person's share
    expense.splits.forEach(split => {
      balances[split.participantId] -= split.amount;
    });
  });
  
  return balances;
};

// Calculate the simplified transactions required to settle all debts
export const calculateSettlements = (participants: Participant[], expenses: Expense[]): Settlement[] => {
  const balances = calculateBalances(participants, expenses);
  const settlements: Settlement[] = [];
  
  // Create separate arrays for creditors (people who are owed money) and debtors (people who owe money)
  const creditors = Object.entries(balances)
    .filter(([_, balance]) => balance > 0)
    .sort((a, b) => b[1] - a[1]);  // Sort by balance descending
  
  const debtors = Object.entries(balances)
    .filter(([_, balance]) => balance < 0)
    .sort((a, b) => a[1] - b[1]);  // Sort by balance ascending (more negative first)
  
  // Match debtors with creditors to settle balances
  while (creditors.length > 0 && debtors.length > 0) {
    const [creditorId, creditAmount] = creditors[0];
    const [debtorId, debtAmount] = debtors[0];
    
    // Amount to settle is the minimum of what's owed and what's due
    const settlementAmount = Math.min(creditAmount, Math.abs(debtAmount));
    
    // Create the settlement
    if (settlementAmount > 0) {
      settlements.push({
        from: debtorId,
        to: creditorId,
        amount: parseFloat(settlementAmount.toFixed(2))
      });
    }
    
    // Update balances
    const newCreditAmount = creditAmount - settlementAmount;
    const newDebtAmount = debtAmount + settlementAmount;
    
    // Remove fully settled parties, update partially settled ones
    if (Math.abs(newCreditAmount) < 0.01) {
      creditors.shift();
    } else {
      creditors[0][1] = newCreditAmount;
    }
    
    if (Math.abs(newDebtAmount) < 0.01) {
      debtors.shift();
    } else {
      debtors[0][1] = newDebtAmount;
    }
  }
  
  return settlements;
};

// Calculate equal splits for an expense
export const calculateEqualSplits = (
  amount: number,
  participants: Participant[],
  selectedParticipantIds: string[]
): ExpenseSplit[] => {
  if (!selectedParticipantIds.length) return [];
  
  const equalAmount = parseFloat((amount / selectedParticipantIds.length).toFixed(2));
  let remainingCents = Math.round((amount - equalAmount * selectedParticipantIds.length) * 100);
  
  return selectedParticipantIds.map((participantId, index) => {
    let adjustedAmount = equalAmount;
    
    // Distribute remaining cents
    if (remainingCents > 0) {
      adjustedAmount = parseFloat((adjustedAmount + 0.01).toFixed(2));
      remainingCents--;
    }
    
    return {
      participantId,
      amount: adjustedAmount,
      isEqual: true
    };
  });
};

// Save bill data to localStorage
export const saveBillData = (data: BillData): void => {
  localStorage.setItem('billData', JSON.stringify(data));
};

// Load bill data from localStorage
export const loadBillData = (): BillData | null => {
  const data = localStorage.getItem('billData');
  return data ? JSON.parse(data) : null;
};

// Calculate total expenses
export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};
