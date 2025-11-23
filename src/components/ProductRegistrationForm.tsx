import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";

export const ProductRegistrationForm = () => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    model: "",
    purchaseDate: "",
    warrantyPeriod: "",
    serialNumber: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const lgCategories = [
    "Refrigerators",
    "Washing Machines",
    "Air Conditioners",
    "TVs & Audio",
    "Mobile Phones",
    "Laptops & Monitors",
    "Home Appliances",
    "Kitchen Appliances",
  ];

  const warrantyOptions = [
    { value: "12", label: "1 Year" },
    { value: "24", label: "2 Years" },
    { value: "36", label: "3 Years" },
    { value: "60", label: "5 Years" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // get user info
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (!storedUser.id) {
      toast({
        title: "Not Logged In",
        description: "Please login before registering a product.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.productName ||
      !formData.category ||
      !formData.purchaseDate ||
      !formData.warrantyPeriod ||
      !formData.email
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const payload = {
      user_id: storedUser.id,
      product_name: formData.productName,
      category: formData.category,
      model_number: formData.model,
      serial_number: formData.serialNumber,
      purchase_date: formData.purchaseDate,
      warranty_period: formData.warrantyPeriod,
      email: formData.email,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to register product.");
      }

      toast({
        title: "Product Registered",
        description: "Your LG product has been successfully registered.",
      });

      setFormData({
        productName: "",
        category: "",
        model: "",
        purchaseDate: "",
        warrantyPeriod: "",
        serialNumber: "",
        email: "",
      });

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not save your product.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader className="bg-gradient-to-r from-primary to-lg-red-light text-primary-foreground">
        <CardTitle className="text-2xl">Register Your LG Product</CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Add your LG product to track warranty expiration
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Product Name */}
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                placeholder="e.g., LG ThinQ Refrigerator"
                disabled={isLoading}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {lgCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model Number */}
            <div className="space-y-2">
              <Label>Model Number</Label>
              <Input
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="e.g., GR-X247CSAV"
                disabled={isLoading}
              />
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <Label>Serial Number</Label>
              <Input
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                placeholder="e.g., 123ABC456DEF"
                disabled={isLoading}
              />
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <Label>Purchase Date *</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                  disabled={isLoading}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Warranty */}
            <div className="space-y-2">
              <Label>Warranty Period *</Label>
              <Select
                value={formData.warrantyPeriod}
                onValueChange={(value) =>
                  setFormData({ ...formData, warrantyPeriod: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {warrantyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="e.g., john.doe@example.com"
                disabled={isLoading}
              />
            </div>

          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-lg-red-light hover:from-lg-red-light hover:to-primary"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Product"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
};
