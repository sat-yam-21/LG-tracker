import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import { 
  Phone, 
  Mail, 
  Search, 
  BookOpen, 
  Settings, 
  AlertCircle, 
  HelpCircle, 
  User, 
  Wrench,
  FileText
} from "lucide-react";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formValues, setFormValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormValues(prev => ({ ...prev, subject: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('Sending...');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form submitted:', formValues);
    setFormStatus('Your message has been sent successfully!');
    setFormValues({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setFormStatus(''), 5000);
  };

  const supportOptions = [
    {
      icon: Phone,
      title: "LG Official Support",
      description: "Get direct support from LG for product warranties, repairs, and technical issues.",
      actionHref: "tel:1-800-243-0000",
      actionText: "1-800-243-0000",
      detail: "Available 24/7",
      buttonText: "Visit LG Support →",
      buttonHref: "https://www.lg.com/support",
      color: "text-red-500",
      variant: "destructive"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue and we'll get back to you.",
      actionHref: "mailto:support@lgwarranty.com",
      actionText: "Send Email",
      detail: "Response within 24 hours",
      buttonText: "Send Email",
      buttonHref: "mailto:support@lgwarranty.com",
      color: "text-green-500",
      variant: "secondary"
    }
  ];

  const faqItems = [
    {
      question: "How do I register my LG product for warranty reminders?",
      answer: "Go to the Dashboard page and click 'Register Product'. Fill in your product details including name, model, purchase date, and warranty period. We'll automatically calculate your warranty expiry date and set up reminders."
    },
    {
      question: "What types of notifications will I receive?",
      answer: "You'll receive email and SMS alerts 30 days before your warranty expires. You can also view all your warranties and their status on your dashboard at any time."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <Navbar />
      
      <section className="py-16 bg-gradient-to-r from-primary to-lg-red-light text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Get support for your LG Warranty Manager account and LG products</p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input type="text" placeholder="Search for help articles, FAQs, or enter your question..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-14 text-lg bg-card text-foreground" />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {supportOptions.map((option, index) => (
              <Card key={index} className="text-center hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center ${option.color}`}>
                    <option.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{option.title}</h3>
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                  <div className="mb-4">
                    <a href={option.actionHref} className="font-medium text-foreground hover:underline">{option.actionText}</a>
                    <div className="text-sm text-muted-foreground">{option.detail}</div>
                  </div>
                  <a href={option.buttonHref} target="_blank" rel="noopener noreferrer">
                    <Button variant={option.variant as any} className="w-full">{option.buttonText}</Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Find quick answers to common questions about LG Warranty Manager</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pl-8">
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Still Need Help?</CardTitle>
                <p className="text-muted-foreground">Can't find what you're looking for? Send us a message and we'll get back to you.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" placeholder="Enter your name" value={formValues.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email" value={formValues.email} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select onValueChange={handleSubjectChange} value={formValues.subject} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="technical">Technical Problems</SelectItem>
                        <SelectItem value="warranty">Warranty Questions</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Please describe your issue or question in detail..." rows={5} value={formValues.message} onChange={handleInputChange} required />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={formStatus === 'Sending...' || formStatus.includes('successfully')}>
                    <Mail className="mr-2 h-5 w-5" />
                    {formStatus === 'Sending...' ? 'Sending...' : 'Send Message'}
                  </Button>
                  {formStatus && !formStatus.includes('Sending...') && <p className="text-center text-green-500">{formStatus}</p>}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-card py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">&copy; 2024 LG Warranty Manager. All rights reserved.</p>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
};

export default Support;
