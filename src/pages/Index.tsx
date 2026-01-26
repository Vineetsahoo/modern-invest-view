
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, TrendingUp, BarChart3, PieChart, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPan, setRegisterPan] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (registerPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Passwords do not match",
      });
      setLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Password must be at least 6 characters",
      });
      setLoading(false);
      return;
    }

    // Validate PAN format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(registerPan)) {
      toast({
        variant: "destructive",
        title: "Invalid PAN Format",
        description: "PAN must be in format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)",
      });
      setLoading(false);
      return;
    }

    try {
      await register(registerName, registerEmail, registerPan, registerPassword);
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${registerName}!`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Unable to register. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-8 animate-slideIn">
              <div className="space-y-4">
                <div className="inline-block">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-blue-500/30 w-fit shadow-lg shadow-blue-500/10">
                    <Zap className="h-4 w-4 text-blue-400 animate-glow" />
                    <span className="text-sm font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      Smart Portfolio Management
                    </span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent animate-shimmer">
                    Invest Smart,
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Grow Faster
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Comprehensive portfolio management platform to track, analyze, and optimize your investments across multiple asset classes in real-time.
                </p>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 group animate-slideIn" style={{ animationDelay: '0.1s' }}>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 group-hover:border-green-500/50 transition-all">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors">Real-time Analytics</h3>
                    <p className="text-sm text-gray-400">Live performance tracking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group animate-slideIn" style={{ animationDelay: '0.2s' }}>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 group-hover:border-blue-500/50 transition-all">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">Advanced Charts</h3>
                    <p className="text-sm text-gray-400">Detailed insights</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group animate-slideIn" style={{ animationDelay: '0.3s' }}>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 group-hover:border-purple-500/50 transition-all">
                    <PieChart className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">Diversification</h3>
                    <p className="text-sm text-gray-400">Risk analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group animate-slideIn" style={{ animationDelay: '0.4s' }}>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 group-hover:border-yellow-500/50 transition-all">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-yellow-300 transition-colors">Fast Performance</h3>
                    <p className="text-sm text-gray-400">Instant updates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="relative animate-slideIn" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative space-y-8">
                {/* Logo */}
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="relative h-20 w-20">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-75 animate-glow"></div>
                      <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                        <TrendingUp className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Portfolio Manager</h2>
                  <p className="text-gray-400 text-lg">Access your investment portfolio</p>
                </div>

                {/* Auth Forms with Tabs */}
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="glass-card grid w-full grid-cols-2 p-1 gap-1 mb-6">
                    <TabsTrigger 
                      value="login"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 rounded-lg"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Form */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="glass-card rounded-3xl p-8 space-y-6 border border-slate-700/50 shadow-2xl">
                      <div className="space-y-3">
                        <Label htmlFor="loginEmail" className="text-white font-semibold text-base">Email</Label>
                        <Input
                          id="loginEmail"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="glass-card border-slate-600/50 focus:border-blue-500/50 text-white placeholder:text-gray-500 h-14 rounded-xl text-base transition-all duration-300"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="loginPassword" className="text-white font-semibold text-base">Password</Label>
                        <Input
                          id="loginPassword"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="glass-card border-slate-600/50 focus:border-blue-500/50 text-white placeholder:text-gray-500 h-14 rounded-xl text-base transition-all duration-300"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-base rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] flex items-center justify-center gap-2 group" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>Signing In...</>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="glass-card rounded-3xl p-8 space-y-5 border border-slate-700/50 shadow-2xl">
                      <div className="space-y-3">
                        <Label htmlFor="registerName" className="text-white font-semibold text-base">Full Name</Label>
                        <Input
                          id="registerName"
                          type="text"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="glass-card border-slate-600/50 focus:border-blue-500/50 text-white placeholder:text-gray-500 h-14 rounded-xl text-base transition-all duration-300"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="registerEmail" className="text-white font-semibold text-base">Email</Label>
                        <Input
                          id="registerEmail"
                          type="email"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="glass-card border-slate-600/50 focus:border-blue-500/50 text-white placeholder:text-gray-500 h-14 rounded-xl text-base transition-all duration-300"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="registerPan" className="text-white font-semibold text-base">
                          PAN Number
                          <span className="text-gray-400 font-normal text-sm ml-2">(Format: ABCDE1234F)</span>
                        </Label>
                        <Input
                          id="registerPan"
                          type="text"
                          value={registerPan}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                            setRegisterPan(value);
                          }}
                          className="glass-card border-slate-600/50 focus:border-blue-500/50 text-white placeholder:text-gray-500 h-14 rounded-xl text-base transition-all duration-300"
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                          title="PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)"
                          required
                        />
                        <p className="text-xs text-gray-500">5 letters + 4 digits + 1 letter</p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="registerPassword" className="text-white font-semibold text-base">Password</Label>
                        <Input
                          id="registerPassword"
                          type="password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="glass-card border-slate-600/50 focus:border-blue-500/50 text-white placeholder:text-gray-500 h-14 rounded-xl text-base transition-all duration-300"
                          placeholder="Minimum 6 characters"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="confirmPassword" className="text-white font-semibold text-base">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="glass-card border-slate-600/50 focus:border-blue-500/50 text-white placeholder:text-gray-500 h-14 rounded-xl text-base transition-all duration-300"
                          placeholder="Re-enter password"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-base rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] flex items-center justify-center gap-2 group" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>Creating Account...</>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Info Text */}
                <div className="text-center space-y-2">
                  <p className="text-gray-400 text-sm">Securely manage your investments</p>
                  <p className="text-gray-500 text-xs">Your data is encrypted and protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
