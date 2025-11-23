import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, Grid3x3, List, MapPin, Calendar, Gauge, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Vehicle = {
  id: string;
  brand_name: string;
  model_name: string;
  price: number;
  year: number;
  mileage: number;
  city: string;
  condition: string;
  category: string;
  images: any;
};

const Listings = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [listings, setListings] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      let query = supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setListings(data || []);
    } catch (error: any) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm === "" || 
      listing.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.model_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;
    const matchesCity = cityFilter === "all" || listing.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesCity && matchesPrice;
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Vehicles</h1>
          <p className="text-muted-foreground">Find your perfect ride from {filteredListings.length} listings</p>
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

                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Model, brand..." 
                      className="pl-9" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={cityFilter} onValueChange={setCityFilter}>
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

                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setCityFilter("all");
                    setPriceRange([0, 5000000]);
                  }}
                  variant="outline"
                >
                  Clear All
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Listings */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredListings.length} results
              </p>
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

            {filteredListings.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No vehicles found matching your criteria</p>
              </Card>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className={`overflow-hidden group hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex flex-col sm:flex-row" : ""}`}>
                    <div className={`relative overflow-hidden ${viewMode === "list" ? "sm:w-64 aspect-video sm:aspect-[4/3]" : "aspect-[4/3]"}`}>
                      <img
                        src={(Array.isArray(listing.images) && listing.images[0]) ? listing.images[0] : "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80"}
                        alt={`${listing.brand_name} ${listing.model_name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-background/90 text-foreground border-0">
                        {listing.condition}
                      </Badge>
                    </div>
                    <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <h3 className="font-semibold text-lg mb-2 truncate">
                        {listing.brand_name} {listing.model_name}
                      </h3>
                      <p className="text-2xl font-bold text-primary mb-3">
                        NPR {listing.price.toLocaleString()}
                      </p>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{listing.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4" />
                          <span>{listing.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{listing.city}</span>
                        </div>
                      </div>
                      <Button asChild className="w-full" variant="outline">
                        <Link to={`/listings/${listing.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Listings;
