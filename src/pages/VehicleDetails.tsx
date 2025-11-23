import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Gauge,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Shield,
  Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type VehicleData = {
  id: string;
  brand_name: string;
  model_name: string;
  price: number;
  year: number;
  mileage: number;
  city: string;
  condition: string;
  category: string;
  description: string;
  engine_capacity: number | null;
  contact_phone: string;
  is_negotiable: boolean;
  is_urgent: boolean;
  images: any;
  seller_id: string;
};

const VehicleDetails = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (error) throw error;

      setVehicle(data);
    } catch (error: any) {
      console.error("Error fetching vehicle:", error);
      toast.error("Failed to load vehicle details");
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (vehicle && Array.isArray(vehicle.images)) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
    }
  };

  const prevImage = () => {
    if (vehicle && Array.isArray(vehicle.images)) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
          <Button asChild>
            <Link to="/listings">Browse Listings</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = Array.isArray(vehicle.images) ? vehicle.images : [];
  const title = `${vehicle.brand_name} ${vehicle.model_name} ${vehicle.year}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/listings" className="hover:text-primary">Listings</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <img
                  src={images[currentImageIndex] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&q=80"}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                {images.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-primary" : "bg-background/60"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="secondary" className="bg-background/80 hover:bg-background">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-background/80 hover:bg-background">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {images.length > 1 && (
                <div className="p-4 grid grid-cols-3 gap-2">
                  {images.slice(0, 3).map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={image} alt={`${title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Vehicle Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{vehicle.city}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary mb-1">NPR {vehicle.price.toLocaleString()}</p>
                    {vehicle.is_negotiable && (
                      <Badge variant="secondary" className="text-xs">Negotiable</Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {vehicle.condition}
                  </Badge>
                  {vehicle.is_urgent && (
                    <Badge className="bg-accent">Urgent Sale</Badge>
                  )}
                  <Badge variant="outline">{vehicle.category}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-semibold">{vehicle.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-semibold">{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                  {vehicle.engine_capacity && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Engine</p>
                        <p className="font-semibold">{vehicle.engine_capacity} cc</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{vehicle.description}</p>
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Brand</span>
                      <span className="font-medium">{vehicle.brand_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{vehicle.model_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium capitalize">{vehicle.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="font-medium capitalize">{vehicle.condition}</span>
                    </div>
                    {vehicle.engine_capacity && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Engine Capacity</span>
                        <span className="font-medium">{vehicle.engine_capacity} cc</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Contact Seller</h3>
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    {vehicle.contact_phone}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Safety Tips
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Meet the seller in a safe public location</li>
                  <li>• Check the vehicle and documents thoroughly</li>
                  <li>• Never pay in advance before seeing the vehicle</li>
                  <li>• Test ride before finalizing the deal</li>
                  <li>• Verify ownership documents</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VehicleDetails;
