"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Plus, Trash2, Calendar, Info, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { challengeService, ChallengeFormData } from '@/lib/challengeService';
import { solanaClient } from '@/lib/solanaClient';
import { PublicKey } from '@solana/web3.js';

// Input validation schema using Zod
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(500),
  type: z.string().min(1, { message: "Please select a challenge type" }),
  difficulty: z.string().min(1, { message: "Please select a difficulty level" }),
  duration: z.coerce.number().min(1, { message: "Duration must be at least 1 day" }).max(90),
  entryFee: z.coerce.number().min(0),
  prizePool: z.coerce.number().min(0),
  maxParticipants: z.coerce.number().min(2, { message: "At least 2 participants required" }).max(10000),
  deadline: z.string().min(1, { message: "Registration deadline is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  goal: z.object({
    type: z.string().min(1, { message: "Goal type is required" }),
    target: z.coerce.number().min(1, { message: "Target must be at least 1" }),
    unit: z.string().min(1, { message: "Unit is required" }),
  }),
  tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
  prizes: z.array(z.object({
    position: z.string().min(1),
    amount: z.coerce.number().min(1),
    percentage: z.coerce.number().min(1).max(100),
  })).min(1, { message: "At least one prize position is required" }),
});

// Challenge types and difficulties
const challengeTypes = [
  "Running", "Walking", "Cycling", "Swimming", "Weight Loss", 
  "HIIT", "Strength", "Yoga", "Meditation", "Steps", "Other"
];

const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

const goalTypes = [
  "Distance", "Weight", "Sessions", "Steps", "Time", "Calories", "Workouts", "Repetitions"
];

const unitsByGoalType: Record<string, string[]> = {
  Distance: ["km", "miles", "m"],
  Weight: ["kg", "lbs"],
  Sessions: ["sessions", "classes", "days"],
  Steps: ["steps"],
  Time: ["minutes", "hours", "days"],
  Calories: ["calories", "kcal"],
  Workouts: ["workouts", "sessions"],
  Repetitions: ["reps", "sets"]
};

export default function CreateChallengePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isConnected, publicKey } = useWallet();
  const [tagInput, setTagInput] = useState("");
  
  // Initialize form with defaults
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      difficulty: "",
      duration: 7,
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 100,
      deadline: new Date().toISOString().split('T')[0],
      startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      goal: {
        type: "",
        target: 0,
        unit: "",
      },
      tags: [],
      prizes: [
        { position: "1st", amount: 0, percentage: 50 },
        { position: "2nd", amount: 0, percentage: 30 },
        { position: "3rd", amount: 0, percentage: 20 },
      ],
    },
  });
  
  const watchGoalType = form.watch("goal.type");
  const watchPrizePool = form.watch("prizePool");
  const watchTags = form.watch("tags");
  const watchPrizes = form.watch("prizes");
  
  // Function to add a tag
  const addTag = () => {
    if (tagInput.trim() && !watchTags.includes(tagInput.trim())) {
      form.setValue("tags", [...watchTags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  // Function to remove a tag
  const removeTag = (index: number) => {
    const newTags = [...watchTags];
    newTags.splice(index, 1);
    form.setValue("tags", newTags);
  };
  
  // Function to add a prize position
  const addPrize = () => {
    if (watchPrizes.length < 10) {
      form.setValue("prizes", [
        ...watchPrizes, 
        { 
          position: `${watchPrizes.length + 1}${getOrdinal(watchPrizes.length + 1)}`, 
          amount: 0, 
          percentage: 10 
        }
      ]);
      
      // Recalculate prize amounts based on percentages
      updatePrizeAmounts();
    }
  };
  
  // Function to remove a prize position
  const removePrize = (index: number) => {
    if (watchPrizes.length > 1) {
      const newPrizes = [...watchPrizes];
      newPrizes.splice(index, 1);
      
      // Update position names
      const updatedPrizes = newPrizes.map((prize, i) => ({
        ...prize,
        position: `${i + 1}${getOrdinal(i + 1)}`
      }));
      
      form.setValue("prizes", updatedPrizes);
      
      // Recalculate prize amounts based on percentages
      updatePrizeAmounts();
    }
  };
  
  // Helper to get ordinal suffix
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };
  
  // Function to update prize amounts based on percentages
  const updatePrizeAmounts = () => {
    const prizes = form.getValues("prizes");
    const prizePool = form.getValues("prizePool");
    
    prizes.forEach((prize, index) => {
      const amount = (prize.percentage / 100) * prizePool;
      form.setValue(`prizes.${index}.amount`, Math.round(amount * 100) / 100);
    });
  };
  
  // Update prize amounts when prize pool changes
  const handlePrizePoolChange = (value: number) => {
    form.setValue("prizePool", value);
    updatePrizeAmounts();
  };
  
  // Update prize percentages when an amount changes
  const handlePrizeAmountChange = (index: number, value: number) => {
    const prizes = form.getValues("prizes");
    const prizePool = form.getValues("prizePool");
    
    if (prizePool > 0) {
      const percentage = (value / prizePool) * 100;
      form.setValue(`prizes.${index}.percentage`, Math.round(percentage * 100) / 100);
    }
    
    form.setValue(`prizes.${index}.amount`, value);
  };
  
  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to create a challenge");
      return;
    }
    
    if (!isConnected || !publicKey) {
      toast.error("You must connect your Solana wallet to create a challenge");
      return;
    }
    
    try {
      // Initialize the Solana program with the wallet
      const provider = window.phantom?.solana;
      if (!provider) {
        toast.error("Phantom wallet not found");
        return;
      }
      
      // Initialize the Solana program
      await solanaClient.initializeProgram({
        publicKey: new PublicKey(publicKey),
        signTransaction: async (tx) => provider.signTransaction(tx),
        signAllTransactions: async (txs) => provider.signAllTransactions(txs),
      });
      
      // Format the data for Firebase
      const challengeData: ChallengeFormData = {
        ...values,
        createdBy: user.id,
        creatorWallet: publicKey
      };
      
      // Save to Firebase
      const challengeId = await challengeService.createChallenge(challengeData);
      
      toast.success("Challenge created successfully!");
      router.push(`/dashboard/challenges/available`);
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast.error("Failed to create challenge. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/challenges')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create a Challenge</h1>
      </div>
      
      <p className="text-muted-foreground">
        Design your own fitness challenge and invite others to participate
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Define your challenge's core details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 30-Day Running Challenge" {...field} />
                    </FormControl>
                    <FormDescription>Create a catchy and descriptive title</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe what your challenge is about, how it works, and what participants can expect..." 
                        rows={4} {...field} />
                    </FormControl>
                    <FormDescription>Provide clear details about your challenge</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select challenge type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {challengeTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>What kind of activity is this challenge about?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>How challenging will this be for participants?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (days)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={90} {...field} />
                      </FormControl>
                      <FormDescription>How long will the challenge run?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Deadline</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 opacity-70" />
                          <Input type="date" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Last day to join</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 opacity-70" />
                          <Input type="date" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>When does the challenge begin?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Participants</FormLabel>
                      <FormControl>
                        <Input type="number" min={2} max={10000} {...field} />
                      </FormControl>
                      <FormDescription>How many people can join?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tags (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTag(index)}
                          className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  {form.formState.errors.tags && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.tags.message}
                    </p>
                  )}
                  <FormDescription>Add relevant tags to help others discover your challenge</FormDescription>
                </FormItem>
              </div>
            </CardContent>
          </Card>
          
          {/* Goal Section */}
          <Card>
            <CardHeader>
              <CardTitle>Challenge Goal</CardTitle>
              <CardDescription>Define what participants need to achieve</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="goal.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Type</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Reset the unit when goal type changes
                          form.setValue("goal.unit", "");
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {goalTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>What will participants track?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="goal.target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Amount</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormDescription>How much to achieve?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="goal.unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!watchGoalType}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {watchGoalType && unitsByGoalType[watchGoalType]?.map((unit) => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Unit of measurement</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Rewards Section */}
          <Card>
            <CardHeader>
              <CardTitle>Challenge Rewards</CardTitle>
              <CardDescription>Set the entry fee and prize distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="entryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Fee (SOL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          step={0.1} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Amount each participant must pay to join (0 for free)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prizePool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prize Pool (SOL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          step={0.1} 
                          {...field} 
                          onChange={(e) => {
                            handlePrizePoolChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Total amount distributed as prizes</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Prize Distribution</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addPrize}
                    disabled={watchPrizes.length >= 10}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Position
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {watchPrizes.map((prize, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-1/4">
                        <Input value={prize.position} disabled />
                      </div>
                      <div className="w-1/4">
                        <div className="flex items-center">
                          <Input 
                            type="number" 
                            min={0} 
                            step={0.1} 
                            value={prize.amount} 
                            onChange={(e) => {
                              handlePrizeAmountChange(index, parseFloat(e.target.value) || 0);
                            }}
                            className="rounded-r-none"
                          />
                          <div className="bg-muted h-10 px-3 flex items-center rounded-r-md text-sm">
                            SOL
                          </div>
                        </div>
                      </div>
                      <div className="w-1/4">
                        <div className="flex items-center">
                          <Input 
                            type="number" 
                            min={1} 
                            max={100} 
                            value={prize.percentage} 
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              form.setValue(`prizes.${index}.percentage`, val);
                              if (watchPrizePool > 0) {
                                const amount = (val / 100) * watchPrizePool;
                                form.setValue(`prizes.${index}.amount`, Math.round(amount * 100) / 100);
                              }
                            }}
                            className="rounded-r-none"
                          />
                          <div className="bg-muted h-10 px-3 flex items-center rounded-r-md text-sm">
                            %
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex justify-end">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removePrize(index)}
                          disabled={watchPrizes.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {form.formState.errors.prizes && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.prizes.message}
                  </p>
                )}
                
                <div className="flex items-center bg-muted p-2 rounded gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  <span>Make sure percentages add up to 100% for proper prize distribution</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex items-center gap-2 my-6">
            <div className="flex items-center gap-2">
              <Wallet className={`h-4 w-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-sm">
                {isConnected ? 
                  <span className="text-green-500">Wallet Connected: {publicKey && publicKey.slice(0, 6)}...{publicKey && publicKey.slice(-4)}</span> : 
                  <span className="text-red-500">Wallet Not Connected</span>
                }
              </span>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={async () => {
                try {
                  const provider = window.phantom?.solana;
                  if (!provider) {
                    toast.error("Phantom wallet not found");
                    return;
                  }
                  
                  // Initialize the Solana program
                  await solanaClient.initializeProgram({
                    publicKey: new PublicKey(publicKey || ''),
                    signTransaction: async (tx) => provider.signTransaction(tx),
                    signAllTransactions: async (txs) => provider.signAllTransactions(txs),
                  });
                  
                  toast.success("Solana program initialized successfully");
                } catch (error) {
                  console.error("Error initializing Solana program:", error);
                  toast.error("Failed to initialize Solana program");
                }
              }}
            >
              Test Solana Connection
            </Button>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Create Challenge</Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 