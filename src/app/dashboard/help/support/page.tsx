"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Mail,
  Phone,
  HelpCircle,
  Search,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessagesSquare,
  ArrowRight,
  Plus
} from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  lastUpdate: string;
  category: string;
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const tickets: SupportTicket[] = [
    {
      id: "T-1234",
      subject: "Issue with reward claiming",
      status: "in-progress",
      priority: "high",
      lastUpdate: "2 hours ago",
      category: "Rewards"
    },
    {
      id: "T-1235",
      subject: "Workout not syncing",
      status: "open",
      priority: "medium",
      lastUpdate: "1 day ago",
      category: "Sync"
    }
  ];

  const faqs = [
    {
      question: "How do I connect my fitness tracker?",
      answer: "Go to Settings > Connections and follow the device setup wizard.",
      category: "Devices"
    },
    {
      question: "When do I receive my rewards?",
      answer: "Rewards are distributed daily at 00:00 UTC.",
      category: "Rewards"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Center</h1>
          <p className="text-sm text-muted-foreground">Get help and support for your Web3 Fitness journey</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Contact Support",
              description: "Get help from our team",
              icon: <MessageSquare className="h-6 w-6 text-primary" />,
              action: "Start Chat"
            },
            {
              title: "Submit Ticket",
              description: "Create a support ticket",
              icon: <Plus className="h-6 w-6 text-green-500" />,
              action: "New Ticket"
            },
            {
              title: "Help Guides",
              description: "Browse tutorials",
              icon: <HelpCircle className="h-6 w-6 text-blue-500" />,
              action: "View Guides"
            }
          ].map((action, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                {action.icon}
              </div>
              <Button className="w-full mt-4 gap-2">
                {action.action}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Support Tickets */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Your Support Tickets</h2>
              <p className="text-sm text-muted-foreground">Track and manage your support requests</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Ticket
            </Button>
          </div>

          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">#{ticket.id}</span>
                      <Badge variant="outline">{ticket.category}</Badge>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="font-medium">{ticket.subject}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Last updated {ticket.lastUpdate}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* FAQ Section */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
                <p className="text-sm text-muted-foreground">Quick answers to common questions</p>
              </div>
              <div className="relative w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">{faq.question}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-7">{faq.answer}</p>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">View All FAQs</Button>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Additional Support Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Email Support</h3>
                </div>
                <p className="text-sm text-muted-foreground">support@web3fitness.com</p>
                <p className="text-xs text-muted-foreground">Response within 24 hours</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessagesSquare className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Live Chat</h3>
                </div>
                <p className="text-sm text-muted-foreground">Available 24/7</p>
                <p className="text-xs text-muted-foreground">Typical response in 5 minutes</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Phone Support</h3>
                </div>
                <p className="text-sm text-muted-foreground">+1 (800) 123-4567</p>
                <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-5PM EST</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper component for status badges
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "open":
      return (
        <Badge variant="secondary" className="text-xs">
          Open
        </Badge>
      );
    case "in-progress":
      return (
        <Badge variant="default" className="text-xs bg-blue-500">
          In Progress
        </Badge>
      );
    case "resolved":
      return (
        <Badge variant="default" className="text-xs bg-green-500">
          Resolved
        </Badge>
      );
    case "closed":
      return (
        <Badge variant="outline" className="text-xs">
          Closed
        </Badge>
      );
    default:
      return null;
  }
} 