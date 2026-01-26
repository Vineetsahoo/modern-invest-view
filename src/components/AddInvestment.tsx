import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { investmentAPI } from '@/services/api';
import { Plus, X } from 'lucide-react';

export const AddInvestment: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    amount: '',
    currentValue: '',
    units: '',
    interestRate: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await investmentAPI.create({
        type: formData.type,
        name: formData.name,
        amount: parseFloat(formData.amount),
        currentValue: parseFloat(formData.currentValue),
        units: formData.units ? parseFloat(formData.units) : 0,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : 0,
        notes: formData.notes
      });

      toast({
        title: "Success!",
        description: "Investment added successfully",
      });

      // Reset form
      setFormData({
        type: '',
        name: '',
        amount: '',
        currentValue: '',
        units: '',
        interestRate: '',
        notes: ''
      });

      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to add investment",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Investment
      </Button>
    );
  }

  return (
    <Card className="glass-card border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Add New Investment
            </CardTitle>
            <CardDescription>Fill in the details of your new investment</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="hover:bg-slate-700/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Investment Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger className="glass-card border-slate-600/50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REIT">REIT</SelectItem>
                  <SelectItem value="NPS">NPS</SelectItem>
                  <SelectItem value="FD">Fixed Deposit</SelectItem>
                  <SelectItem value="SGB">Sovereign Gold Bond</SelectItem>
                  <SelectItem value="DEMAT">Stocks (DEMAT)</SelectItem>
                  <SelectItem value="MUTUAL_FUND">Mutual Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Investment Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Reliance Industries"
                className="glass-card border-slate-600/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Initial Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="10000"
                className="glass-card border-slate-600/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value (₹) *</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                placeholder="12000"
                className="glass-card border-slate-600/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="units">Units/Quantity</Label>
              <Input
                id="units"
                type="number"
                step="0.01"
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                placeholder="100"
                className="glass-card border-slate-600/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="7.5"
                className="glass-card border-slate-600/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional information..."
              className="glass-card border-slate-600/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            >
              {loading ? 'Adding...' : 'Add Investment'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600/50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
