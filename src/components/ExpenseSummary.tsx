
import React from 'react';
import { Expense, Participant } from '../utils/billSplitterUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ExpenseSummaryProps {
  participants: Participant[];
  expenses: Expense[];
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ participants, expenses }) => {
  if (participants.length === 0 || expenses.length === 0) {
    return (
      <div className="bill-card text-center py-8">
        <p className="text-muted-foreground">
          Add participants and expenses to see summary
        </p>
      </div>
    );
  }

  // Calculate total amount
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate amount paid by each participant
  const paidByData = expenses.reduce((acc, expense) => {
    const participantId = expense.paidBy;
    if (!acc[participantId]) {
      acc[participantId] = 0;
    }
    acc[participantId] += expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate amount owed by each participant
  const owedByData = expenses.reduce((acc, expense) => {
    expense.splits.forEach(split => {
      const participantId = split.participantId;
      if (!acc[participantId]) {
        acc[participantId] = 0;
      }
      acc[participantId] += split.amount;
    });
    return acc;
  }, {} as Record<string, number>);
  
  // Format data for charts
  const paidByChartData = participants
    .filter(p => paidByData[p.id] > 0)
    .map(participant => ({
      name: participant.name,
      value: paidByData[participant.id] || 0,
    }));
    
  const owedByChartData = participants
    .filter(p => owedByData[p.id] > 0)
    .map(participant => ({
      name: participant.name,
      value: owedByData[participant.id] || 0,
    }));
  
  // Color palette for charts
  const COLORS = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899'];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-bill-primary">${payload[0].value.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            {((payload[0].value / totalAmount) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="bill-card animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Expense Summary</h3>
      
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">Total Amount</p>
        <p className="text-3xl font-bold text-bill-primary">${totalAmount.toFixed(2)}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Who Paid Chart */}
        <div>
          <h4 className="text-center font-medium mb-2">Who Paid</h4>
          <div className="h-64">
            {paidByChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paidByChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#6366F1', strokeWidth: 1 }}
                  >
                    {paidByChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data to display</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Who Owes Chart */}
        <div>
          <h4 className="text-center font-medium mb-2">Who Owes</h4>
          <div className="h-64">
            {owedByChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={owedByChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#6366F1', strokeWidth: 1 }}
                  >
                    {owedByChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;
