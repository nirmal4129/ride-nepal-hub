import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Vehicle = {
  id: string;
  brand_name: string;
  model_name: string;
  year: number;
  price: number;
  city: string;
  category: string;
  condition: string;
  status: string;
  images: any;
  description: string | null;
  mileage: number | null;
  engine_capacity: number | null;
  contact_phone: string;
  created_at: string;
  seller_id: string;
  profiles: {
    full_name: string;
    phone_number: string;
  };
};

const VehicleApproval = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    fetchPendingVehicles();
  }, []);

  const fetchPendingVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select(`
          *,
          profiles (
            full_name,
            phone_number
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch vehicles: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vehicleId: string) => {
    setActionLoading(vehicleId);
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({ status: "approved" })
        .eq("id", vehicleId);

      if (error) throw error;

      toast.success("Vehicle approved successfully!");
      fetchPendingVehicles();
    } catch (error: any) {
      toast.error("Failed to approve vehicle: " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (vehicleId: string) => {
    setActionLoading(vehicleId);
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({ status: "rejected" })
        .eq("id", vehicleId);

      if (error) throw error;

      toast.success("Vehicle rejected successfully!");
      fetchPendingVehicles();
    } catch (error: any) {
      toast.error("Failed to reject vehicle: " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Vehicle Approval</h1>
        <p className="text-muted-foreground">Review and approve pending vehicle listings</p>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No pending vehicles to review</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {vehicle.brand_name} {vehicle.model_name} ({vehicle.year})
                    </CardTitle>
                    <CardDescription>
                      Posted by: {vehicle.profiles?.full_name} | {new Date(vehicle.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{vehicle.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-semibold">NPR {vehicle.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{vehicle.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-semibold capitalize">{vehicle.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-semibold capitalize">{vehicle.condition}</p>
                  </div>
                  {vehicle.mileage && (
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-semibold">{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-semibold">{vehicle.contact_phone}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApprove(vehicle.id)}
                    disabled={actionLoading === vehicle.id}
                  >
                    {actionLoading === vehicle.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(vehicle.id)}
                    disabled={actionLoading === vehicle.id}
                  >
                    {actionLoading === vehicle.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedVehicle?.brand_name} {selectedVehicle?.model_name}
            </DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              {selectedVehicle.images && selectedVehicle.images[0] && (
                <img
                  src={selectedVehicle.images[0]}
                  alt="Vehicle"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedVehicle.description || "No description provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <p className="font-semibold">{selectedVehicle.profiles?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{selectedVehicle.profiles?.phone_number}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleApproval;
