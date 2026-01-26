import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Plus, Trash2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { alertsAPI } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Alert {
  _id: string;
  symbol: string;
  alertType: string;
  condition: string;
  targetPrice: number;
  currentPrice: number;
  triggered: boolean;
  triggeredAt?: string;
  triggeredPrice?: number;
  active: boolean;
  message?: string;
  createdAt: string;
}

export const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // New alert form state
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    alertType: 'TARGET',
    condition: 'ABOVE',
    targetPrice: '',
    message: ''
  });

  useEffect(() => {
    fetchAlerts();
  }, [showActive]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertsAPI.getAlerts(showActive ? true : undefined, showActive ? false : true);
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await alertsAPI.createAlert({
        symbol: newAlert.symbol.toUpperCase(),
        alertType: newAlert.alertType,
        condition: newAlert.condition,
        targetPrice: parseFloat(newAlert.targetPrice),
        message: newAlert.message || undefined
      });
      
      setNewAlert({ symbol: '', alertType: 'TARGET', condition: 'ABOVE', targetPrice: '', message: '' });
      setDialogOpen(false);
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await alertsAPI.deleteAlert(id);
      fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const handleCreateFromWatchlist = async () => {
    try {
      await alertsAPI.createFromWatchlist();
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alerts from watchlist:', error);
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'TARGET':
        return <TrendingUp className="h-4 w-4" />;
      case 'STOP_LOSS':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertBadge = (alert: Alert) => {
    if (alert.triggered) {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Bell className="h-3 w-3 mr-1" />
          Triggered
        </Badge>
      );
    }
    if (alert.active) {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Bell className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
        <BellOff className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/70">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-400" />
            <CardTitle className="text-white">Price Alerts</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActive(!showActive)}
              className="text-slate-300 hover:text-white"
            >
              {showActive ? 'Active' : 'Triggered'}
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-500/80 hover:bg-blue-600/80">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                <DialogHeader>
                  <DialogTitle>Create Price Alert</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Set up a price alert to be notified when conditions are met.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateAlert} className="space-y-4">
                  <div>
                    <Label htmlFor="symbol" className="text-slate-300">Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="AAPL, RELIANCE, etc."
                      value={newAlert.symbol}
                      onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="alertType" className="text-slate-300">Alert Type</Label>
                    <Select value={newAlert.alertType} onValueChange={(v) => setNewAlert({ ...newAlert, alertType: v })}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="TARGET">Target Price</SelectItem>
                        <SelectItem value="STOP_LOSS">Stop Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="condition" className="text-slate-300">Condition</Label>
                    <Select value={newAlert.condition} onValueChange={(v) => setNewAlert({ ...newAlert, condition: v })}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="ABOVE">Above</SelectItem>
                        <SelectItem value="BELOW">Below</SelectItem>
                        <SelectItem value="EQUALS">Equals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="targetPrice" className="text-slate-300">Target Price (₹)</Label>
                    <Input
                      id="targetPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newAlert.targetPrice}
                      onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-slate-300">Message (Optional)</Label>
                    <Input
                      id="message"
                      placeholder="Custom alert message"
                      value={newAlert.message}
                      onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1 bg-blue-500/80 hover:bg-blue-600/80">
                      Create Alert
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-700 text-slate-300">
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 bg-slate-800/50" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-slate-600 mb-2" />
            <p className="text-slate-400 mb-4">No {showActive ? 'active' : 'triggered'} alerts</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateFromWatchlist}
              className="border-slate-700 text-slate-300"
            >
              Create from Watchlist
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/70 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                      {getAlertIcon(alert.alertType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{alert.symbol}</span>
                        {getAlertBadge(alert)}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {alert.condition} ₹{alert.targetPrice.toFixed(2)}
                        {alert.currentPrice > 0 && ` (Current: ₹${alert.currentPrice.toFixed(2)})`}
                      </p>
                      {alert.triggered && alert.triggeredPrice && (
                        <p className="text-xs text-emerald-400 mt-1">
                          Triggered at ₹{alert.triggeredPrice.toFixed(2)} on {new Date(alert.triggeredAt!).toLocaleString()}
                        </p>
                      )}
                      {alert.message && (
                        <p className="text-xs text-slate-500 mt-1 italic">{alert.message}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert._id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
