import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const SellVehicle = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    category: "",
    brandName: "",
    modelName: "",
    year: "",
    price: "",
    mileage: "",
    title: "",
    description: "",
    engineCapacity: "",
    condition: "",
    city: "",
    contactPhone: "",
    isNegotiable: true,
    isUrgent: false
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to list a vehicle");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to list a vehicle");
      navigate("/auth");
      return;
    }

    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setLoading(true);

    try {
      // Convert images to base64 for JSON storage (simplified approach)
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      const { error } = await supabase
        .from('vehicles')
        .insert({
          seller_id: user.id,
          category: formData.category as any,
          brand_name: formData.brandName,
          model_name: formData.modelName,
          year: parseInt(formData.year),
          price: parseFloat(formData.price),
          mileage: parseInt(formData.mileage),
          description: formData.description,
          engine_capacity: formData.engineCapacity ? parseInt(formData.engineCapacity) : null,
          condition: formData.condition as any,
          city: formData.city,
          contact_phone: formData.contactPhone,
          is_negotiable: formData.isNegotiable,
          is_urgent: formData.isUrgent,
          images: imageUrls,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Vehicle listing submitted successfully! We'll review it soon.");
      navigate("/listings");
    } catch (error: any) {
      console.error("Error submitting listing:", error);
      toast.error(error.message || "Failed to submit listing");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">List Your Vehicle</h1>
            <p className="text-muted-foreground">Fill in the details below to create your listing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select required value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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
                    <Input 
                      id="brand" 
                      placeholder="e.g., Honda" 
                      required 
                      value={formData.brandName}
                      onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input 
                      id="model" 
                      placeholder="e.g., CB Shine" 
                      required 
                      value={formData.modelName}
                      onChange={(e) => setFormData({...formData, modelName: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Select required value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
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
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="e.g., 145000" 
                      required 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="kms">Kilometers Driven *</Label>
                    <Input 
                      id="kms" 
                      type="number" 
                      placeholder="e.g., 12000" 
                      required 
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="engine">Engine Capacity (cc)</Label>
                    <Input 
                      id="engine" 
                      type="number"
                      placeholder="e.g., 125" 
                      value={formData.engineCapacity}
                      onChange={(e) => setFormData({...formData, engineCapacity: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select required value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your vehicle's condition, features, and any additional information..."
                    rows={6}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="negotiable" 
                      checked={formData.isNegotiable}
                      onCheckedChange={(checked) => setFormData({...formData, isNegotiable: checked as boolean})}
                    />
                    <Label htmlFor="negotiable" className="cursor-pointer">Price is negotiable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="urgent" 
                      checked={formData.isUrgent}
                      onCheckedChange={(checked) => setFormData({...formData, isUrgent: checked as boolean})}
                    />
                    <Label htmlFor="urgent" className="cursor-pointer">Mark as urgent sale</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      placeholder="e.g., Pokhara" 
                      required 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Contact Phone *</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+977 98XX-XXXXXX" 
                      required 
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photos (Up to 10 images) *</CardTitle>
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
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Listing"
                  )}
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
