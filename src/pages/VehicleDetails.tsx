import { useState } from "react";
import { Link } from "react-router-dom";
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
  Fuel,
  Settings,
  User,
  Shield
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VehicleDetails = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const vehicle = {
    id: 1,
    title: "Honda CB Shine 2020",
    price: "NPR 1,45,000",
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200&q=80"
    ],
    year: "2020",
    kms: "12,000 km",
    location: "Lakeside, Pokhara",
    condition: "Excellent",
    category: "Bike",
    brand: "Honda",
    model: "CB Shine",
    description: "Well-maintained Honda CB Shine in excellent condition. Single owner, all papers up to date. Regular servicing done at authorized dealer. No accident history. Bike runs smoothly with no mechanical issues. Price slightly negotiable for serious buyers.",
    specs: {
      engineCapacity: "125 cc",
      fuelType: "Petrol",
      transmission: "Manual",
      owners: "1st Owner",
      color: "Black",
      insuranceValid: "Till Dec 2025",
      taxPaid: "Paid"
    },
    seller: {
      name: "Rajesh Kumar",
      phone: "+977 98XX-XXXXXX",
      memberSince: "2023"
    },
    urgent: false,
    negotiable: true
  };

  const similarVehicles = [
    {
      id: 2,
      title: "Yamaha FZ 2019",
      price: "NPR 2,75,000",
      image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
      location: "Kathmandu"
    },
    {
      id: 3,
      title: "Suzuki Gixxer SF 2021",
      price: "NPR 3,25,000",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80",
      location: "Pokhara"
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

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
          <span className="text-foreground">{vehicle.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <img
                  src={vehicle.images[currentImageIndex]}
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                />
                {vehicle.images.length > 1 && (
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
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {vehicle.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-primary" : "bg-background/60"
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="secondary" className="bg-background/80 hover:bg-background">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-background/80 hover:bg-background">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="p-4 grid grid-cols-3 gap-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={image} alt={`${vehicle.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Vehicle Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{vehicle.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{vehicle.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary mb-1">{vehicle.price}</p>
                    {vehicle.negotiable && (
                      <Badge variant="secondary" className="text-xs">Negotiable</Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {vehicle.condition}
                  </Badge>
                  {vehicle.urgent && (
                    <Badge className="bg-accent">Urgent Sale</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                      <p className="font-semibold">{vehicle.kms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel</p>
                      <p className="font-semibold">{vehicle.specs.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Engine</p>
                      <p className="font-semibold">{vehicle.specs.engineCapacity}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{vehicle.description}</p>
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Brand</span>
                      <span className="font-medium">{vehicle.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{vehicle.model}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Engine Capacity</span>
                      <span className="font-medium">{vehicle.specs.engineCapacity}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Transmission</span>
                      <span className="font-medium">{vehicle.specs.transmission}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Ownership</span>
                      <span className="font-medium">{vehicle.specs.owners}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Color</span>
                      <span className="font-medium">{vehicle.specs.color}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Insurance</span>
                      <span className="font-medium">{vehicle.specs.insuranceValid}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Tax Status</span>
                      <span className="font-medium text-green-600">{vehicle.specs.taxPaid}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Card */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{vehicle.seller.name}</h3>
                    <p className="text-sm text-muted-foreground">Member since {vehicle.seller.memberSince}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    {vehicle.seller.phone}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Verified Seller</span>
                  </div>
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

        {/* Similar Vehicles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 truncate">{vehicle.title}</h3>
                  <p className="text-xl font-bold text-primary mb-2">{vehicle.price}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{vehicle.location}</span>
                  </div>
                  <Button asChild className="w-full mt-3" variant="outline" size="sm">
                    <Link to={`/listings/${vehicle.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VehicleDetails;
