import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, DollarSign, Home, Car, Plane, PiggyBank, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const LifeCalculator = () => {
  // State for all financial inputs
  const [income, setIncome] = useState({
    gross: 0,
    taxRate: 25,
    deductions: 0
  });

  const [expenses, setExpenses] = useState({
    housing: 0,
    transportation: 0,
    food: 0,
    utilities: 0,
    insurance: 0,
    entertainment: 0
  });

  const [assets, setAssets] = useState({
    cash: 0,
    investments: 0,
    realEstate: 0
  });

  const [liabilities, setLiabilities] = useState({
    mortgage: 0,
    carLoan: 0,
    studentLoans: 0,
    creditCard: 0
  });

  const [retirement, setRetirement] = useState({
    currentAge: 30,
    retirementAge: 65,
    savingsRate: 15,
    expectedReturn: 7
  });

  // Calculate net income
  const calculateNetIncome = () => {
    const taxAmount = (income.gross * income.taxRate) / 100;
    return income.gross - taxAmount - income.deductions;
  };

  // Calculate monthly take-home pay
  const calculateMonthlyPay = () => {
    return calculateNetIncome() / 12;
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return Object.values(expenses).reduce((a, b) => a + Number(b), 0);
  };

  // Calculate net worth
  const calculateNetWorth = () => {
    const totalAssets = Object.values(assets).reduce((a, b) => a + Number(b), 0);
    const totalLiabilities = Object.values(liabilities).reduce((a, b) => a + Number(b), 0);
    return totalAssets - totalLiabilities;
  };

  // Generate retirement projection data
  const generateRetirementData = () => {
    const years = retirement.retirementAge - retirement.currentAge;
    const monthlyIncome = calculateMonthlyPay();
    const monthlySavings = (monthlyIncome * retirement.savingsRate) / 100;
    
    let projectionData = [];
    let currentSavings = Number(assets.investments);
    
    for (let i = 0; i <= years; i++) {
      currentSavings = currentSavings * (1 + retirement.expectedReturn / 100) + 
                      monthlySavings * 12;
      projectionData.push({
        year: retirement.currentAge + i,
        savings: Math.round(currentSavings)
      });
    }
    
    return projectionData;
  };

  // Generate expense breakdown data for pie chart
  const generateExpenseData = () => {
    return Object.entries(expenses).map(([category, amount]) => ({
      name: category,
      value: Number(amount)
    })).filter(item => item.value > 0);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
          <TabsTrigger value="networth">Net Worth</TabsTrigger>
          <TabsTrigger value="budget">Budgeting</TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Income Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gross Annual Income</Label>
                  <Input 
                    type="number" 
                    value={income.gross}
                    onChange={(e) => setIncome({...income, gross: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input 
                    type="number" 
                    value={income.taxRate}
                    onChange={(e) => setIncome({...income, taxRate: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Monthly Take-Home Pay: ${calculateMonthlyPay().toFixed(2)}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(expenses).map(([category, amount]) => (
                  <div key={category} className="space-y-2">
                    <Label>{category.charAt(0).toUpperCase() + category.slice(1)}</Label>
                    <Input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setExpenses({...expenses, [category]: Number(e.target.value)})}
                    />
                  </div>
                ))}
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateExpenseData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: $${value}`}
                    >
                      {generateExpenseData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retirement">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5" />
                Retirement Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Age</Label>
                  <Input 
                    type="number" 
                    value={retirement.currentAge}
                    onChange={(e) => setRetirement({...retirement, currentAge: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Retirement Age</Label>
                  <Input 
                    type="number" 
                    value={retirement.retirementAge}
                    onChange={(e) => setRetirement({...retirement, retirementAge: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Savings Rate (%)</Label>
                  <Input 
                    type="number" 
                    value={retirement.savingsRate}
                    onChange={(e) => setRetirement({...retirement, savingsRate: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected Return (%)</Label>
                  <Input 
                    type="number" 
                    value={retirement.expectedReturn}
                    onChange={(e) => setRetirement({...retirement, expectedReturn: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateRetirementData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="savings" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networth">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Net Worth Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold">Assets</h3>
                  {Object.entries(assets).map(([category, amount]) => (
                    <div key={category} className="space-y-2">
                      <Label>{category.charAt(0).toUpperCase() + category.slice(1)}</Label>
                      <Input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAssets({...assets, [category]: Number(e.target.value)})}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Liabilities</h3>
                  {Object.entries(liabilities).map(([category, amount]) => (
                    <div key={category} className="space-y-2">
                      <Label>{category.charAt(0).toUpperCase() + category.slice(1)}</Label>
                      <Input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setLiabilities({...liabilities, [category]: Number(e.target.value)})}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Total Net Worth: ${calculateNetWorth().toFixed(2)}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LifeCalculator;
