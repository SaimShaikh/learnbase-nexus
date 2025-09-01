import { useState } from "react";
import Header from "@/components/layout/Header";
import StudentForm from "@/components/forms/StudentForm";
import StudentTable, { Student } from "@/components/tables/StudentTable";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // 🔹 Handle edit click → opens form with existing student data
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setActiveTab("add");
  };

  // 🔹 Handle tab switching
  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setEditingStudent(null); // reset form when switching
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with tabs */}
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="container mx-auto px-6 py-8">
        {activeTab === "add" ? (
          // Form for adding/editing student → this will POST/PUT to RDS
          <StudentForm student={editingStudent || undefined} />
        ) : (
          // Table that fetches students from RDS
          <StudentTable onEdit={handleEditClick} />
        )}
      </main>
    </div>
  );
};

export default Index;
