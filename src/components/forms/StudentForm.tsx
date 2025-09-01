import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";
import { getDBConnection } from "@/lib/db"; // 👈 connect directly to RDS

// ✅ Validation schema
const studentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must not exceed 500 characters"),
  tenthMarks: z.number().min(0).max(100),
  twelfthMarks: z.number().min(0).max(100),
  degreeType: z.string().min(1, "Please select a degree type"),
  yearsOfStudy: z.number().min(1).max(10),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: StudentFormData & { id?: number };
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

const StudentForm = ({ student, isLoading = false }: StudentFormProps) => {
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

  // ✅ Submit handler (direct DB insert/update)
  const handleSubmit = async (data: StudentFormData) => {
    try {
      const conn = await getDBConnection();

      if (student?.id) {
        // update existing
        await conn.execute(
          `UPDATE students SET firstName=?, lastName=?, city=?, email=?, phone=?, bio=?, tenthMarks=?, twelfthMarks=?, degreeType=?, yearsOfStudy=? WHERE id=?`,
          [
            data.firstName,
            data.lastName,
            data.city,
            data.email,
            data.phone,
            data.bio,
            data.tenthMarks,
            data.twelfthMarks,
            data.degreeType,
            data.yearsOfStudy,
            student.id,
          ]
        );
        toast({ title: "Updated!", description: "Student updated successfully." });
      } else {
        // insert new
        await conn.execute(
          `INSERT INTO students (firstName,lastName,city,email,phone,bio,tenthMarks,twelfthMarks,degreeType,yearsOfStudy)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [
            data.firstName,
            data.lastName,
            data.city,
            data.email,
            data.phone,
            data.bio,
            data.tenthMarks,
            data.twelfthMarks,
            data.degreeType,
            data.yearsOfStudy,
          ]
        );
        toast({ title: "Success!", description: "Student added successfully." });
        form.reset();
      }

      await conn.end();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error!",
        description: "Something went wrong while saving.",
        variant: "destructive",
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
                : "Fill in the form below to add a new student record"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* form fields (unchanged) */}
            {/* ... same fields as your version ... */}

            <Button
              type="submit"
              className="w-full gap-2 shadow-elegant hover:shadow-glow transition-all duration-300"
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              {isLoading
                ? "Saving..."
                : student
                ? "Update Student"
                : "Add Student"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
