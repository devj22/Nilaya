import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Database, 
  Play, 
  Download, 
  RefreshCw,
  Lock,
  LogOut,
  Home
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

function DatabaseLogin({ onLogin }: { onLogin: () => void }) {
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
        title: "Database access granted",
        description: "Welcome to database management",
      });
      onLogin();
    },
    onError: () => {
      toast({
        title: "Access denied",
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
            <Database className="h-6 w-6 text-ocean" />
          </div>
          <CardTitle className="text-2xl font-bold text-ocean">Database Manager</CardTitle>
          <p className="text-gray-600">Enter password to access SQL database management</p>
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
              {loginMutation.isPending ? "Authenticating..." : "Access Database"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DatabasePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('adminToken') === 'admin123';
  });
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM leads ORDER BY created_at DESC LIMIT 10;");
  const [queryResult, setQueryResult] = useState<any>(null);
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const executeSqlMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/database/execute", { query });
      return response.json();
    },
    onSuccess: (data) => {
      setQueryResult(data);
      toast({
        title: "Query executed",
        description: "Database query completed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Query failed",
        description: "Error executing database query",
        variant: "destructive",
      });
    },
  });

  if (!isLoggedIn) {
    return <DatabaseLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="font-playfair text-2xl font-bold text-ocean">SQL Database Manager</h1>
              <p className="text-sm text-gray-600">SQLite Database Administration</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/"}
                className="border-ocean text-ocean hover:bg-ocean hover:text-white"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/admin"}
                className="border-teal text-teal hover:bg-teal hover:text-white"
              >
                Admin Panel
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
        {/* phpMyAdmin Style Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Tables List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5" />
                Server: localhost
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b p-4 bg-blue-50">
                <p className="text-sm font-semibold text-blue-900">Database: nilaya_db</p>
                <p className="text-xs text-blue-700">Tables (2)</p>
              </div>
              <div className="space-y-1 p-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left font-mono text-sm hover:bg-blue-50"
                  onClick={() => setSqlQuery("SELECT * FROM leads ORDER BY created_at DESC LIMIT 20;")}
                >
                  📋 leads
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left font-mono text-sm hover:bg-blue-50"
                  onClick={() => setSqlQuery("SELECT * FROM users LIMIT 10;")}
                >
                  👤 users
                </Button>
              </div>
              <div className="border-t p-4 bg-gray-50">
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Engine:</span>
                    <span>SQLite</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File:</span>
                    <span>database.db</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Charset:</span>
                    <span>UTF-8</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setSqlQuery("SELECT * FROM leads ORDER BY created_at DESC LIMIT 10;")}
              >
                <Database className="h-6 w-6" />
                View Recent Leads
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setSqlQuery("SELECT COUNT(*) as total_leads FROM leads;")}
              >
                <RefreshCw className="h-6 w-6" />
                Count All Leads
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setSqlQuery("SELECT name, email, phone, created_at FROM leads WHERE created_at >= CURRENT_DATE;")}
              >
                <Download className="h-6 w-6" />
                Today's Leads
              </Button>
            </div>

            {/* SQL Query Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  SQL Query Console
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sqlQuery">SQL Query</Label>
                  <Textarea
                    id="sqlQuery"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Enter your SQL query here..."
                    className="font-mono text-sm min-h-24"
                  />
                </div>
                <Button 
                  onClick={() => executeSqlMutation.mutate(sqlQuery)}
                  disabled={executeSqlMutation.isPending}
                  className="bg-gradient-coastal text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {executeSqlMutation.isPending ? "Executing..." : "Go"}
                </Button>
              </CardContent>
            </Card>

            {/* Query Results */}
            {queryResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Query Results</CardTitle>
                  {queryResult.success && (
                    <Badge variant="outline" className="w-fit">
                      {queryResult.rowCount} rows returned
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {queryResult.success ? (
                    queryResult.rows && queryResult.rows.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(queryResult.rows[0]).map((key) => (
                                <TableHead key={key} className="bg-gray-50 font-semibold">{key}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {queryResult.rows.map((row: any, index: number) => (
                              <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                {Object.values(row).map((value: any, cellIndex: number) => (
                                  <TableCell key={cellIndex} className="font-mono text-sm">
                                    {value === null ? (
                                      <span className="text-gray-400 italic">NULL</span>
                                    ) : (
                                      String(value)
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-gray-600">Query executed successfully but returned no rows.</p>
                    )
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded p-4">
                      <p className="text-red-800 font-medium">Error executing query:</p>
                      <pre className="text-red-600 text-sm mt-2 whitespace-pre-wrap">
                        {queryResult.error}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Common Queries - phpMyAdmin Style */}
            <Card>
              <CardHeader>
                <CardTitle>Quick SQL Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Browse Data</h4>
                    <div className="space-y-1 text-sm">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start h-auto p-2 w-full text-left"
                        onClick={() => setSqlQuery("SELECT * FROM leads ORDER BY created_at DESC;")}
                      >
                        Browse leads table
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start h-auto p-2 w-full text-left"
                        onClick={() => setSqlQuery("SELECT * FROM users;")}
                      >
                        Browse users table
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Statistics</h4>
                    <div className="space-y-1 text-sm">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start h-auto p-2 w-full text-left"
                        onClick={() => setSqlQuery("SELECT DATE(created_at) as date, COUNT(*) as leads_count FROM leads GROUP BY DATE(created_at) ORDER BY date DESC;")}
                      >
                        Daily lead counts
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start h-auto p-2 w-full text-left"
                        onClick={() => setSqlQuery("SELECT plot_size, COUNT(*) as count FROM leads WHERE plot_size IS NOT NULL GROUP BY plot_size;")}
                      >
                        Plot size preferences
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}