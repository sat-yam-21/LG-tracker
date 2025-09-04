import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";

interface Product {
  id: string;
  productName: string;
  category: string;
  model: string;
  purchaseDate: string;
  warrantyPeriod: number;
  serialNumber: string;
  email: string;
}

interface ProductRegistrationFormProps {
  onProductAdded: (product: Product) => void;
}

const lgCategories = [
  "Refrigerators",
  "Washing Machines", 
  "Air Conditioners",
  "TVs & Audio",
  "Mobile Phones",
  "Laptops & Monitors",
  "Home Appliances",
  "Kitchen Appliances"
];

const warrantyOptions = [
  { value: 12, label: "1 Year" },
  { value: 24, label: "2 Years" },
  { value: 36, label: "3 Years" },
  { value: 60, label: "5 Years" },
];

export const ProductRegistrationForm = ({ onProductAdded }: ProductRegistrationFormProps) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.category || !formData.purchaseDate || !formData.warrantyPeriod || !formData.email) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const newProduct: Product = {
      id: Date.now().toString(),
      productName: formData.productName,
      category: formData.category,
      model: formData.model,
      purchaseDate: formData.purchaseDate,
      warrantyPeriod: parseInt(formData.warrantyPeriod),
      serialNumber: formData.serialNumber,
      email: formData.email,
    };

    try {
      const response = await fetch("/api/register-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register product.");
      }

      onProductAdded(newProduct);
      
      setFormData({
        productName: "",
        category: "",
        model: "",
        purchaseDate: "",
        warrantyPeriod: "",
        serialNumber: "",
        email: "",
      });

      toast({
        title: "Product Registered",
        description: "Your LG product has been successfully registered for warranty tracking.",
      });

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not save your product. Please try again.",
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
          Add your LG product details to track warranty expiration
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g., LG ThinQ Refrigerator"
                className="transition-all duration-300 focus:shadow-[var(--shadow-elegant)]"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })} 
                disabled={isLoading}
              >
                <SelectTrigger className="transition-all duration-300 focus:shadow-[var(--shadow-elegant)]">
                  <SelectValue placeholder="Select product category" />
                </SelectTrigger>
                <SelectContent>
                  {lgCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model Number</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., GR-X247CSAV"
                className="transition-all duration-300 focus:shadow-[var(--shadow-elegant)]"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="e.g., 123ABC456DEF"
                className="transition-all duration-300 focus:shadow-[var(--shadow-elegant)]"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <div className="relative">
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="transition-all duration-300 focus:shadow-[var(--shadow-elegant)]"
                  disabled={isLoading}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyPeriod">Warranty Period *</Label>
              <Select 
                value={formData.warrantyPeriod} 
                onValueChange={(value) => setFormData({ ...formData, warrantyPeriod: value })} 
                disabled={isLoading}
              >
                <SelectTrigger className="transition-all duration-300 focus:shadow-[var(--shadow-elegant)]">
                  <SelectValue placeholder="Select warranty period" />
                </SelectTrigger>
                <SelectContent>
                  {warrantyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., john.doe@example.com"
                className="transition-all duration-300 focus:shadow-[var(--shadow-elegant)]"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-lg-red-light hover:from-lg-red-light hover:to-primary transition-all duration-300 shadow-[var(--shadow-elegant)] hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};