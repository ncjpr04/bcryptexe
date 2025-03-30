"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Send,
  MapPin,
  Globe,
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      // Reset after 3 seconds
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <Card className="lg:col-span-2 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Send us a message</h2>
                <p className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input placeholder="Enter your first name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input placeholder="Enter your last name" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Enter your email address" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Describe your issue or question..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {formStatus === 'sending' && 'Sending message...'}
                  {formStatus === 'success' && (
                    <span className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                      Message sent successfully!
                    </span>
                  )}
                  {formStatus === 'error' && (
                    <span className="flex items-center gap-2 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      Error sending message. Please try again.
                    </span>
                  )}
                </p>
                <Button 
                  type="submit" 
                  disabled={formStatus === 'sending'}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact Options */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@web3fitness.com</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available 24/7</p>
                    <p className="text-xs text-muted-foreground">Typical response in 5 minutes</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">+1 (800) 123-4567</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Office Hours */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Hours of Operation</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Monday - Friday</p>
                    <p className="text-sm font-medium">9:00 AM - 5:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">Saturday - Sunday</p>
                    <p className="text-sm font-medium">Online Support Only</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Location</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm">123 Fitness Street</p>
                    <p className="text-sm">New York, NY 10001</p>
                    <p className="text-sm">United States</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium">Global Support</p>
                    <p className="text-sm text-muted-foreground">Available in multiple languages</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage; 