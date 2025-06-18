import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, 
  FileText, 
  Construction, 
  Shield, 
  Award, 
  Star,
  TrendingUp,
  Percent,
  Home,
  Umbrella,
  Ship,
  TrafficCone,
  Plane,
  TrainFront,
  Video,
  Box,
  Download,
  CheckCircle,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  ChevronDown,
  X,
  TriangleAlert
} from "lucide-react";

export default function HomePage() {
  const [showAlert, setShowAlert] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    plotSize: "",
    message: ""
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/leads", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for your interest! We will contact you shortly.",
      });
      setFormData({
        name: "",
        phone: "",
        email: "",
        plotSize: "",
        message: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLeadMutation.mutate(formData);
  };

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        if (window.scrollY > 100) {
          nav.classList.add('shadow-lg');
        } else {
          nav.classList.remove('shadow-lg');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-inter bg-white">
      {/* Sticky Limited Plots Alert */}
      {showAlert && (
        <div className="bg-red-600 text-white text-center py-2 px-4 fixed top-0 w-full z-50 shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <TriangleAlert className="h-4 w-4 text-yellow-300" />
            <span className="font-medium">⚠️ Only a few plots left in Phase 1 – Book now before prices increase!</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-4 text-white hover:text-gray-200 p-1"
              onClick={() => setShowAlert(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm fixed w-full z-40 transition-shadow duration-300" style={{ top: showAlert ? '40px' : '0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="font-playfair text-2xl font-bold text-ocean">Nilaya</h1>
              <span className="ml-2 text-sm text-gray-600">Premium Coastal Plots</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-ocean transition-colors">About</button>
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-ocean transition-colors">Features</button>
              <button onClick={() => scrollToSection('investment')} className="text-gray-700 hover:text-ocean transition-colors">Investment</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-ocean transition-colors">Contact</button>
              <Button className="bg-gradient-coastal text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                Book Site Visit
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" style={{ marginTop: showAlert ? '40px' : '0' }}>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to <span className="text-sunset">Nilaya</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">Premium NA Plots in Nagaon, Alibaug</p>
          <p className="text-lg md:text-xl mb-8 opacity-80">Build Your Dream Bungalow in the Heart of Coastal Luxury</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="bg-gradient-coastal hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-full text-lg font-semibold"
              onClick={() => scrollToSection('contact')}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Book Site Visit
            </Button>
            <Button 
              variant="outline"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/50 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              <Download className="mr-3 h-5 w-5" />
              Download Brochure
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* About the Project */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Nilaya</h2>
            <div className="w-24 h-1 bg-gradient-coastal mx-auto mb-8"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Nestled in the serene neighborhood of Nagaon, Alibaug, <strong>Nilaya</strong> offers premium Non-Agricultural (NA) plots ideal for luxury bungalow construction or future investment.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                With essential infrastructure in place and located in a gated community surrounded by nature and high-profile neighbors, Nilaya is your opportunity to invest in one of Maharashtra's fastest-growing coastal destinations.
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <Card className="text-center p-4 bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-ocean">1453+</div>
                    <div className="text-gray-600">Sq.ft Plots</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-4 bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-teal">₹51L+</div>
                    <div className="text-gray-600">Starting Price</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Luxury coastal property development" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-semibold text-gray-700">Ready for Construction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Nilaya */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Nilaya?</h2>
            <div className="w-24 h-1 bg-gradient-coastal mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-ocean/10 rounded-lg flex items-center justify-center">
                  <MapPin className="text-ocean h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Prime Location</h3>
                  <p className="text-gray-600">Just 5 minutes from Nagaon Beach</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center">
                  <FileText className="text-teal h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Title Clear NA Plots</h3>
                  <p className="text-gray-600">Fully approved Non-Agricultural plots</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-sunset/10 rounded-lg flex items-center justify-center">
                  <Construction className="text-sunset h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Essential Infrastructure Ready</h3>
                  <p className="text-gray-600">Roads, water, electricity, and drainage in place</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-green-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Gated Community</h3>
                  <p className="text-gray-600">Secured and exclusive residential environment</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="text-purple-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Developer: Stheera</h3>
                  <p className="text-gray-600">Reputable developer with proven track record</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Star className="text-indigo-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Elite Neighbors Nearby</h3>
                  <p className="text-gray-600">Surrounded by high-profile residents</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Nagaon beach coastal area" 
                className="rounded-2xl shadow-2xl w-full"
              />
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-ocean mr-2" />
                  <span className="font-medium">View on Map</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment & ROI Highlights */}
      <section id="investment" className="py-20 bg-gradient-to-br from-ocean/5 to-teal/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">Investment & ROI Highlights</h2>
            <div className="w-24 h-1 bg-gradient-coastal mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">Exceptional returns in Maharashtra's premium coastal destination</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="text-center p-0">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-green-600 h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">2x</h3>
                <p className="text-gray-700 font-semibold mb-2">Land Price Growth</p>
                <p className="text-sm text-gray-600">in 5 Years</p>
              </CardContent>
            </Card>
            
            <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="text-center p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Percent className="text-blue-600 h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">30-35%</h3>
                <p className="text-gray-700 font-semibold mb-2">Price Appreciation</p>
                <p className="text-sm text-gray-600">Forecast</p>
              </CardContent>
            </Card>
            
            <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="text-center p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="text-purple-600 h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-purple-600 mb-2">5-8%</h3>
                <p className="text-gray-700 font-semibold mb-2">Airbnb Rental</p>
                <p className="text-sm text-gray-600">Yields</p>
              </CardContent>
            </Card>
            
            <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="text-center p-0">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Umbrella className="text-orange-600 h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-orange-600 mb-2">Ideal For</h3>
                <p className="text-gray-700 font-semibold mb-2">Second Homes</p>
                <p className="text-sm text-gray-600">& Retirement Villas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Connectivity Advantages */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">Connectivity Advantages</h2>
            <div className="w-24 h-1 bg-gradient-coastal mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">Seamless connectivity to Mumbai and major transport hubs</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ship className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ro-Ro Ferry</h3>
              <p className="text-gray-600 text-sm">Ferry Wharf to Mandwa</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrafficCone className="text-green-600 h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">MTHL</h3>
              <p className="text-gray-600 text-sm">Mumbai Trans Harbour Link</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="text-purple-600 h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Airport</h3>
              <p className="text-gray-600 text-sm">Navi Mumbai Intl (1 Hr)</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrainFront className="text-orange-600 h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Corridor</h3>
              <p className="text-gray-600 text-sm">12-Lane Multi-Modal (Upcoming)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Snapshot */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">Project Snapshot</h2>
            <div className="w-24 h-1 bg-gradient-coastal mx-auto"></div>
          </div>
          
          <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Developer</span>
                  <span className="text-gray-900 font-semibold">Stheera</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Plot Sizes</span>
                  <span className="text-gray-900 font-semibold">From 1453 sq.ft</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Price</span>
                  <span className="text-green-600 font-bold text-lg">₹51 Lakhs+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Location</span>
                  <span className="text-gray-900 font-semibold">Nagaon, Alibaug</span>
                </div>
              </CardContent>
              
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Title</span>
                  <span className="text-green-600 font-semibold">NA Sanctioned, Clear</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Infrastructure</span>
                  <span className="text-gray-900 font-semibold">Complete</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">RERA Status</span>
                  <span className="text-blue-600 font-semibold">To be Confirmed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Amenities</span>
                  <span className="text-gray-900 font-semibold">Roads, Water, Power</span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Digital Experience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">Digital Experience</h2>
            <div className="w-24 h-1 bg-gradient-coastal mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">Experience Nilaya virtually from anywhere in the world</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="text-white h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">HD Drone Shoot</h3>
                <p className="text-gray-600 mb-4">Aerial footage showcasing the entire project and surrounding beauty</p>
                <Button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
                  Watch Video
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Box className="text-white h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Virtual Site Tour</h3>
                <p className="text-gray-600 mb-4">360° virtual tour specially designed for outstation buyers</p>
                <Button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors">
                  Take Tour
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="text-white h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Download Brochure</h3>
                <p className="text-gray-600 mb-4">Detailed brochure with layout plans and project information</p>
                <Button className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition-colors">
                  Get Brochure
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Legal Assurance Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">Legal Assurance</h2>
            <div className="w-24 h-1 bg-gradient-coastal mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">Complete legal compliance and documentation transparency</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white p-8 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="text-green-600 h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">NA Order Available</h3>
                </div>
                <p className="text-gray-600">Official Non-Agricultural order documentation ready for verification</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <FileText className="text-green-600 h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Individual 7/12 Extract</h3>
                </div>
                <p className="text-gray-600">Individual property records and revenue documentation available</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="text-green-600 h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Ready for Registration</h3>
                </div>
                <p className="text-gray-600">All documents prepared and ready for property registration process</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="text-green-600 h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Mutation Entry Done</h3>
                </div>
                <p className="text-gray-600">Property mutation entries completed in government records</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Parallax Lifestyle Section */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h2 className="font-playfair text-4xl md:text-6xl font-bold mb-8">Discover Life at Nilaya</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl leading-relaxed italic">
            "Wake up to birdsong, sea breeze, and the peace of nature.<br />
            Nilaya is more than land – it's a lifestyle investment."
          </p>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
            <div className="w-24 h-1 bg-gradient-coastal mx-auto mb-8"></div>
            <p className="text-xl text-gray-300">Book your site visit or get detailed information about Nilaya</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-ocean rounded-lg flex items-center justify-center">
                  <Phone className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Call Us</h3>
                  <p className="text-gray-300">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal rounded-lg flex items-center justify-center">
                  <MessageCircle className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">WhatsApp</h3>
                  <p className="text-gray-300">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-sunset rounded-lg flex items-center justify-center">
                  <Mail className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <p className="text-gray-300">info@nilayaplots.com</p>
                </div>
              </div>
              
              {/* Google Maps Embed */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5977!2d72.8777!3d18.9647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU3JzUzLjAiTiA3MsKwNTInNDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890" 
                    width="100%" 
                    height="200" 
                    style={{ border: 0, borderRadius: '8px' }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <Card className="bg-white p-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Free Site Visit</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</Label>
                    <Input 
                      id="name"
                      type="text" 
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</Label>
                    <Input 
                      id="phone"
                      type="tel" 
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</Label>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="plotSize" className="block text-sm font-medium text-gray-700 mb-2">Plot Size Interest</Label>
                    <Select value={formData.plotSize} onValueChange={(value) => setFormData({ ...formData, plotSize: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plot size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1453">1453 sq.ft</SelectItem>
                        <SelectItem value="2000">2000 sq.ft</SelectItem>
                        <SelectItem value="2500">2500 sq.ft</SelectItem>
                        <SelectItem value="3000+">3000+ sq.ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</Label>
                    <Textarea 
                      id="message"
                      rows={3}
                      placeholder="Any specific requirements or questions?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={createLeadMutation.isPending}
                    className="w-full bg-gradient-coastal text-white py-4 font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    {createLeadMutation.isPending ? 'Booking...' : 'Book Site Visit Now'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-playfair text-2xl font-bold mb-4">Nilaya</h3>
              <p className="text-gray-400 mb-4">Premium NA plots in the heart of coastal luxury at Nagaon, Alibaug.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About Project</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('investment')} className="hover:text-white transition-colors">Investment</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p><MapPin className="inline h-4 w-4 mr-2" />Nagaon, Alibaug, Maharashtra</p>
                <p><Phone className="inline h-4 w-4 mr-2" />+91 98765 43210</p>
                <p><Mail className="inline h-4 w-4 mr-2" />info@nilayaplots.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nilaya by Stheera. All rights reserved. | RERA Registration: To be confirmed</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://wa.me/919876543210" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
}
