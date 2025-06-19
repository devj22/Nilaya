import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  MessageSquare,
  FileText,
  TrendingUp,
  Lock,
  LogOut
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import type { Lead } from "@shared/schema";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/admin/login", { password });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('adminToken', data.token);
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
      onLogin();
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-ocean" />
          </div>
          <CardTitle className="text-2xl font-bold text-ocean">Admin Access</CardTitle>
          <p className="text-gray-600">Enter password to access the admin panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-coastal text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('adminToken') === 'admin123';
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const { data: leadsData, isLoading, error } = useQuery({
    queryKey: ["/api/leads"],
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: isLoggedIn, // Only fetch if logged in
  });

  const leads: Lead[] = (leadsData as any)?.leads || [];
  
  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    (lead.plotSize && lead.plotSize.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Statistics
  const totalLeads = leads.length;
  const todayLeads = leads.filter(lead => {
    if (!lead.createdAt) return false;
    const today = new Date();
    const leadDate = new Date(lead.createdAt);
    return leadDate.toDateString() === today.toDateString();
  }).length;

  const thisWeekLeads = leads.filter(lead => {
    if (!lead.createdAt) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(lead.createdAt) >= weekAgo;
  }).length;

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
                <p>Unable to fetch leads data. Please check your connection and try again.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="font-playfair text-2xl font-bold text-ocean">Nilaya Admin</h1>
              <p className="text-sm text-gray-600">Lead Management Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/"}
                className="border-ocean text-ocean hover:bg-ocean hover:text-white"
              >
                View Website
              </Button>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ocean">{totalLeads}</div>
              <p className="text-xs text-muted-foreground">All time inquiries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal">{todayLeads}</div>
              <p className="text-xs text-muted-foreground">New inquiries today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sunset">{thisWeekLeads}</div>
              <p className="text-xs text-muted-foreground">Past 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalLeads > 0 ? Math.round((thisWeekLeads / totalLeads) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Weekly activity</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or plot size..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lead Inquiries ({filteredLeads.length})</span>
              <Badge variant="secondary">{filteredLeads.length} results</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try adjusting your search terms" : "No inquiries have been submitted yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Plot Interest</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-ocean/10 rounded-full flex items-center justify-center">
                              <span className="text-ocean font-semibold text-sm">
                                {lead.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            {lead.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{lead.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.plotSize ? (
                            <Badge variant="outline" className="bg-teal/10 text-teal border-teal/20">
                              {lead.plotSize}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">Not specified</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lead.message ? (
                            <div className="max-w-xs">
                              <div className="flex items-start gap-2">
                                <MessageSquare className="h-3 w-3 text-gray-400 mt-1 flex-shrink-0" />
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {lead.message}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No message</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lead.createdAt ? (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-gray-500">
                                {format(new Date(lead.createdAt), 'hh:mm a')}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Unknown</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}