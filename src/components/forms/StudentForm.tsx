import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";

const studentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio must not exceed 500 characters"),
  tenthMarks: z.number().min(0, "Marks cannot be negative").max(100, "Marks cannot exceed 100"),
  twelfthMarks: z.number().min(0, "Marks cannot be negative").max(100, "Marks cannot exceed 100"),
  degreeType: z.string().min(1, "Please select a degree type"),
  yearsOfStudy: z.number().min(1, "Years of study must be at least 1").max(10, "Years of study cannot exceed 10"),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: StudentFormData & { id?: string };
  onSubmit: (data: StudentFormData) => void;
  isLoading?: boolean;
}

const degreeOptions = [
  { value: "BSc", label: "Bachelor of Science (BSc)" },
  { value: "BTech", label: "Bachelor of Technology (BTech)" },
  { value: "BA", label: "Bachelor of Arts (BA)" },
  { value: "BBA", label: "Bachelor of Business Administration (BBA)" },
  { value: "BCA", label: "Bachelor of Computer Applications (BCA)" },
  { value: "BCom", label: "Bachelor of Commerce (BCom)" },
  { value: "MSc", label: "Master of Science (MSc)" },
  { value: "MTech", label: "Master of Technology (MTech)" },
  { value: "MA", label: "Master of Arts (MA)" },
  { value: "MBA", label: "Master of Business Administration (MBA)" },
  { value: "MCA", label: "Master of Computer Applications (MCA)" },
  { value: "MCom", label: "Master of Commerce (MCom)" },
];

const StudentForm = ({ student, onSubmit, isLoading = false }: StudentFormProps) => {
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {
      firstName: "",
      lastName: "",
      city: "",
      email: "",
      phone: "",
      bio: "",
      tenthMarks: 0,
      twelfthMarks: 0,
      degreeType: "",
      yearsOfStudy: 1,
    },
  });

  const handleSubmit = (data: StudentFormData) => {
    onSubmit(data);
    if (!student) {
      form.reset();
      toast({
        title: "Success!",
        description: "Student record has been added successfully.",
      });
    } else {
      toast({
        title: "Updated!",
        description: "Student record has been updated successfully.",
      });
    }
  };

  return (
    <Card className="glass-effect shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">
              {student ? "Edit Student Record" : "Add New Student"}
            </CardTitle>
            <CardDescription>
              {student 
                ? "Update the student information below" 
                : "Fill in the form below to add a new student record"
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email ID</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 10-digit phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a brief bio (10-500 characters)" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tenthMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>10th Marks (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter 10th marks"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="twelfthMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>12th Marks (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter 12th marks"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="degreeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border max-h-60 overflow-y-auto z-50">
                        {degreeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="yearsOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Study</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10"
                        placeholder="Enter years of study"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2 shadow-elegant hover:shadow-glow transition-all duration-300"
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : student ? "Update Student" : "Add Student"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;