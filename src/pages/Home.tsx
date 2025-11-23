import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Gauge, Tag, CheckCircle2, TrendingUp, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  const popularBrands = [
    "Honda", "Yamaha", "Suzuki", "Hero", "Bajaj", "TVS", "KTM", "Royal Enfield",
    "Pulsar", "Splendor", "Apache", "FZ", "Activa", "Dio"
  ];

  const featuredListings = [
    {
      id: 1,
      title: "Honda CB Shine 2020",
      price: "NPR 1,45,000",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
      year: "2020",
      kms: "12,000 km",
      location: "Pokhara",
      condition: "Excellent",
      urgent: false
    },
    {
      id: 2,
      title: "Yamaha FZ 2019",
      price: "NPR 2,75,000",
      image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
      year: "2019",
      kms: "18,500 km",
      location: "Kathmandu",
      condition: "Good",
      urgent: true
    },
    {
      id: 3,
      title: "Suzuki Gixxer SF 2021",
      price: "NPR 3,25,000",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80",
      year: "2021",
      kms: "8,200 km",
      location: "Pokhara",
      condition: "Excellent",
      urgent: false
    },
    {
      id: 4,
      title: "Hero Splendor Plus 2022",
      price: "NPR 1,15,000",
      image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
      year: "2022",
      kms: "5,000 km",
      location: "Pokhara",
      condition: "Excellent",
      urgent: false
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "All vehicles are verified for authenticity"
    },
    {
      icon: CheckCircle2,
      title: "Quality Assured",
      description: "Only well-maintained vehicles listed"
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description: "Competitive pricing across Nepal"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find Your Perfect Ride in Nepal
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              Buy or sell bikes, scooters, and cars with confidence
            </p>

            {/* Search Bar */}
            <div className="bg-background rounded-xl p-4 shadow-lg">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search by brand, model, or keyword..."
                    className="pl-10 h-12 border-0 bg-muted focus-visible:ring-primary"
                  />
                </div>
                <div className="relative md:w-48">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Location"
                    className="pl-10 h-12 border-0 bg-muted focus-visible:ring-primary"
                  />
                </div>
                <Button size="lg" className="h-12 px-8 bg-accent hover:bg-accent/90">
                  Search
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-primary-foreground/80">Popular:</span>
              {popularBrands.slice(0, 6).map((brand) => (
                <Link
                  key={brand}
                  to={`/listings?brand=${brand}`}
                  className="text-sm text-primary-foreground/90 hover:text-primary-foreground underline"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
              <p className="text-muted-foreground">Handpicked vehicles for you</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/listings">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {listing.urgent && (
                    <Badge className="absolute top-3 left-3 bg-accent">
                      Urgent Sale
                    </Badge>
                  )}
                  <Badge className="absolute top-3 right-3 bg-background/90 text-foreground border-0">
                    {listing.condition}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">{listing.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-3">{listing.price}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{listing.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      <span>{listing.kms}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-4" variant="outline">
                    <Link to={`/listings/${listing.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Browse by Brand</h2>
            <p className="text-muted-foreground">Find vehicles from your favorite brands</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {popularBrands.map((brand) => (
              <Link
                key={brand}
                to={`/listings?brand=${brand}`}
                className="bg-background rounded-lg p-6 text-center hover:shadow-md transition-shadow hover:border-primary border border-transparent"
              >
                <p className="font-semibold">{brand}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Sell Your Vehicle?
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            List your bike, scooter, or car in minutes and reach thousands of potential buyers across Nepal
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/sell">
              <Tag className="mr-2 h-5 w-5" />
              Start Selling Now
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
