import { useState } from "react";
import Header from "@/components/layout/Header";
import StudentForm from "@/components/forms/StudentForm";
import StudentTable, { Student } from "@/components/tables/StudentTable";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [students, setStudents] = useState<Student[]>([
    // Sample data for demonstration
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      city: "New York",
      email: "john.doe@email.com",
      phone: "1234567890",
      bio: "Computer Science student passionate about web development and artificial intelligence.",
      tenthMarks: 85,
      twelfthMarks: 92,
      degreeType: "BTech",
      yearsOfStudy: 3,
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      city: "Los Angeles",
      email: "jane.smith@email.com",
      phone: "0987654321",
      bio: "Business Administration student with interests in marketing and entrepreneurship.",
      tenthMarks: 78,
      twelfthMarks: 88,
      degreeType: "BBA",
      yearsOfStudy: 2,
    },
  ]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleAddStudent = (studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
    };
    setStudents([...students, newStudent]);
    toast({
      title: "Success!",
      description: "Student record added successfully.",
    });
  };

  const handleEditStudent = (studentData: Omit<Student, "id">) => {
    if (editingStudent) {
      setStudents(students.map(student => 
        student.id === editingStudent.id 
          ? { ...studentData, id: editingStudent.id }
          : student
      ));
      setEditingStudent(null);
      setActiveTab("list");
      toast({
        title: "Updated!",
        description: "Student record updated successfully.",
      });
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
    toast({
      title: "Deleted!",
      description: "Student record deleted successfully.",
      variant: "destructive",
    });
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setActiveTab("add");
  };

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setEditingStudent(null);
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="container mx-auto px-6 py-8">
        {activeTab === "add" ? (
          <StudentForm 
            student={editingStudent || undefined}
            onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
          />
        ) : (
          <StudentTable 
            students={students}
            onEdit={handleEditClick}
            onDelete={handleDeleteStudent}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
