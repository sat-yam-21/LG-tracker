
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReminderSettings {
  daysBeforeExpiry: number;
  emailEnabled: boolean;
  smsEnabled: boolean;
  email: string;
  phoneNumber: string;
}

const ReminderSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ReminderSettings>({
    daysBeforeExpiry: 30,
    emailEnabled: true,
    smsEnabled: false,
    email: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);


  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('warrantyReminderSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    // Validation
    if (settings.emailEnabled && !settings.email) {
      toast({
        title: "Error",
        description: "Please enter an email address for email reminders.",
        variant: "destructive",
      });
      return;
    }

    if (settings.smsEnabled && !settings.phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number for SMS reminders.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Hardcoded for now, you would get this from your auth system
    const userId = "user123";

    try {
      const response = await fetch(`/api/reminder-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email: settings.email,
          phoneNumber: settings.smsEnabled ? settings.phoneNumber : null,
          reminderDays: settings.daysBeforeExpiry,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings.');
      }
      
      // Save to localStorage as a fallback or for optimistic UI
      localStorage.setItem('warrantyReminderSettings', JSON.stringify(settings));
      
      toast({
        title: "Settings Saved",
        description: "Your reminder preferences have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save reminder settings. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (key: keyof ReminderSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          Warranty Reminders
        </h2>
        <p className="text-muted-foreground mt-1">
          Set up custom reminders to receive notifications before your warranty expires
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Settings</CardTitle>
          <CardDescription>
            Configure when and how you want to be reminded about warranty expiration
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Days before expiry */}
          <div className="space-y-2">
            <Label htmlFor="days-before">Remind me before warranty expires</Label>
            <Select 
              value={settings.daysBeforeExpiry.toString()} 
              onValueChange={(value) => updateSettings('daysBeforeExpiry', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days before</SelectItem>
                <SelectItem value="14">14 days before</SelectItem>
                <SelectItem value="30">30 days before</SelectItem>
                <SelectItem value="60">60 days before</SelectItem>
                <SelectItem value="90">90 days before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email notifications */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="email-notifications"
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => updateSettings('emailEnabled', checked)}
              />
              <Label htmlFor="email-notifications" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
            </div>
            
            {settings.emailEnabled && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={settings.email}
                  onChange={(e) => updateSettings('email', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* SMS notifications */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="sms-notifications"
                checked={settings.smsEnabled}
                onCheckedChange={(checked) => updateSettings('smsEnabled', checked)}
              />
              <Label htmlFor="sms-notifications" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS Notifications
              </Label>
            </div>
            
            {settings.smsEnabled && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={settings.phoneNumber}
                  onChange={(e) => updateSettings('phoneNumber', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Reminder Preview</h4>
            <p className="text-sm text-muted-foreground">
              You will receive {settings.emailEnabled && settings.smsEnabled 
                ? "email and SMS notifications" 
                : settings.emailEnabled 
                ? "email notifications" 
                : settings.smsEnabled 
                ? "SMS notifications" 
                : "no notifications"}{" "}
              {settings.daysBeforeExpiry} days before your warranty expires.
            </p>
          </div>

          <Button onClick={handleSave} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Reminder Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Reminders are based on the purchase date and warranty period of your registered products</li>
            <li>• You'll receive notifications for each product separately</li>
            <li>• Email notifications include product details and warranty information</li>
            <li>• SMS notifications provide quick alerts with essential information</li>
            <li>• You can update these settings anytime</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReminderSettings;
