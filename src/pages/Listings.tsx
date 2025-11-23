import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, Grid3x3, List, MapPin, Calendar, Gauge } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Listings = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 5000000]);

  const listings = [
    {
      id: 1,
      title: "Honda CB Shine 2020",
      price: "NPR 1,45,000",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
      year: "2020",
      kms: "12,000 km",
      location: "Pokhara",
      condition: "Excellent",
      category: "Bike",
      brand: "Honda"
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
      category: "Bike",
      brand: "Yamaha"
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
      category: "Bike",
      brand: "Suzuki"
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
      category: "Bike",
      brand: "Hero"
    },
    {
      id: 5,
      title: "TVS Apache RTR 160 2020",
      price: "NPR 1,85,000",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
      year: "2020",
      kms: "15,000 km",
      location: "Lalitpur",
      condition: "Good",
      category: "Bike",
      brand: "TVS"
    },
    {
      id: 6,
      title: "Bajaj Pulsar NS200 2021",
      price: "NPR 2,45,000",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80",
      year: "2021",
      kms: "10,500 km",
      location: "Pokhara",
      condition: "Excellent",
      category: "Bike",
      brand: "Bajaj"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Vehicles</h1>
          <p className="text-muted-foreground">Find your perfect ride from {listings.length} listings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h3>
                </div>

                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Model, brand..." className="pl-9" />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Brand</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="yamaha">Yamaha</SelectItem>
                      <SelectItem value="suzuki">Suzuki</SelectItem>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="bajaj">Bajaj</SelectItem>
                      <SelectItem value="tvs">TVS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: NPR {priceRange[0].toLocaleString()} - NPR {priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    min={0}
                    max={5000000}
                    step={50000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-4"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Year</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="pokhara">Pokhara</SelectItem>
                      <SelectItem value="kathmandu">Kathmandu</SelectItem>
                      <SelectItem value="lalitpur">Lalitpur</SelectItem>
                      <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Condition</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Apply Filters</Button>
                <Button variant="outline" className="w-full">Clear All</Button>
              </CardContent>
            </Card>
          </aside>

          {/* Listings */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {listings.length} results
              </p>
              <div className="flex items-center gap-3">
                <Select defaultValue="recent">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="year-new">Year: Newest First</SelectItem>
                    <SelectItem value="kms-low">Mileage: Low to High</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Grid/List View */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {listings.map((listing) => (
                <Card key={listing.id} className={`overflow-hidden group hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex flex-col sm:flex-row" : ""}`}>
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "sm:w-64 aspect-video sm:aspect-[4/3]" : "aspect-[4/3]"}`}>
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-background/90 text-foreground border-0">
                      {listing.condition}
                    </Badge>
                  </div>
                  <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <h3 className="font-semibold text-lg mb-2 truncate">{listing.title}</h3>
                    <p className="text-2xl font-bold text-primary mb-3">{listing.price}</p>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
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
                    <Button asChild className="w-full" variant="outline">
                      <Link to={`/listings/${listing.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Listings;
