import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const SellVehicle = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    setImages([...images, ...files]);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...urls]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Vehicle listing submitted successfully! We'll review it soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">List Your Vehicle</h1>
            <p className="text-muted-foreground">Fill in the details below to create your listing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand *</Label>
                    <Select required>
                      <SelectTrigger id="brand">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="honda">Honda</SelectItem>
                        <SelectItem value="yamaha">Yamaha</SelectItem>
                        <SelectItem value="suzuki">Suzuki</SelectItem>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="bajaj">Bajaj</SelectItem>
                        <SelectItem value="tvs">TVS</SelectItem>
                        <SelectItem value="ktm">KTM</SelectItem>
                        <SelectItem value="royal-enfield">Royal Enfield</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input id="model" placeholder="e.g., CB Shine" required />
                  </div>

                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Select required>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Price (NPR) *</Label>
                    <Input id="price" type="number" placeholder="e.g., 145000" required />
                  </div>

                  <div>
                    <Label htmlFor="kms">Kilometers Driven *</Label>
                    <Input id="kms" type="number" placeholder="e.g., 12000" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Ad Title *</Label>
                  <Input id="title" placeholder="e.g., Honda CB Shine 2020 - Excellent Condition" required />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your vehicle's condition, features, and any additional information..."
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="engine">Engine Capacity *</Label>
                    <Input id="engine" placeholder="e.g., 125 cc" required />
                  </div>

                  <div>
                    <Label htmlFor="fuel">Fuel Type *</Label>
                    <Select required>
                      <SelectTrigger id="fuel">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transmission">Transmission *</Label>
                    <Select required>
                      <SelectTrigger id="transmission">
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="owners">Number of Owners *</Label>
                    <Select required>
                      <SelectTrigger id="owners">
                        <SelectValue placeholder="Select owners" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Owner</SelectItem>
                        <SelectItem value="2">2nd Owner</SelectItem>
                        <SelectItem value="3">3rd Owner</SelectItem>
                        <SelectItem value="4+">4+ Owners</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color">Color *</Label>
                    <Input id="color" placeholder="e.g., Black" required />
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select required>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="negotiable" />
                    <Label htmlFor="negotiable" className="cursor-pointer">Price is negotiable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="urgent" />
                    <Label htmlFor="urgent" className="cursor-pointer">Mark as urgent sale</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Location & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Select required>
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pokhara">Pokhara</SelectItem>
                        <SelectItem value="kathmandu">Kathmandu</SelectItem>
                        <SelectItem value="lalitpur">Lalitpur</SelectItem>
                        <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
                        <SelectItem value="biratnagar">Biratnagar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="area">Area/Locality *</Label>
                    <Input id="area" placeholder="e.g., Lakeside" required />
                  </div>

                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input id="name" placeholder="Full name" required />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="+977 98XX-XXXXXX" required />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle>Photos (Up to 10 images)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-muted/30">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload clear photos from different angles. First photo will be the main image.
                </p>
              </CardContent>
            </Card>

            {/* Submit */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Review Before Submitting</p>
                    <p className="text-muted-foreground">
                      Your listing will be reviewed by our team before being published. This usually takes 1-2 hours.
                    </p>
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Submit Listing
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SellVehicle;
