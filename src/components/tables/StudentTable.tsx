import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getDBConnection } from "@/lib/db"; // 👈 use our direct DB helper

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  phone: string;
  bio: string;
  tenthMarks: number;
  twelfthMarks: number;
  degreeType: string;
  yearsOfStudy: number;
}

interface StudentTableProps {
  onEdit: (student: Student) => void;
}

const StudentTable = ({ onEdit }: StudentTableProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;

  // ✅ Fetch students directly from RDS
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const conn = await getDBConnection();
      const [rows] = await conn.query("SELECT * FROM students");
      setStudents(rows as Student[]);
      await conn.end();
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({ title: "Error", description: "Could not fetch student records" });
    }
    setLoading(false);
  };

  // ✅ Delete student directly in RDS
  const handleDelete = async (id: number) => {
    try {
      const conn = await getDBConnection();
      await conn.execute("DELETE FROM students WHERE id = ?", [id]);
      await conn.end();

      toast({
        title: "Deleted!",
        description: "Student record deleted successfully.",
        variant: "destructive",
      });

      fetchStudents();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Could not delete student" });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔎 Filtering & Pagination
  const filteredStudents = students.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.degreeType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getDegreeColor = (degree: string) => {
    const colors: { [key: string]: string } = {
      BSc: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      BTech: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      BA: "bg-green-500/20 text-green-300 border-green-500/30",
      BBA: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      BCA: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      BCom: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      MSc: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      MTech: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      MA: "bg-green-600/20 text-green-400 border-green-600/30",
      MBA: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      MCA: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
      MCom: "bg-pink-600/20 text-pink-400 border-pink-600/30",
    };
    return colors[degree] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  const getMarksColor = (marks: number) => {
    if (marks >= 90) return "text-green-400";
    if (marks >= 75) return "text-primary-glow";
    if (marks >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="glass-effect shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Student Records</CardTitle>
              <p className="text-sm text-muted-foreground">
                {filteredStudents.length} student
                {filteredStudents.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : currentStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              {searchTerm
                ? "No students found matching your search"
                : "No students added yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Add your first student to get started"}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Academic</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/5">
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {student.bio}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{student.phone}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{student.city}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-2">
                          <Badge
                            variant="outline"
                            className={getDegreeColor(student.degreeType)}
                          >
                            {student.degreeType}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {student.yearsOfStudy} year
                            {student.yearsOfStudy !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-muted-foreground">10th: </span>
                            <span className={getMarksColor(student.tenthMarks)}>
                              {student.tenthMarks}%
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">12th: </span>
                            <span
                              className={getMarksColor(student.twelfthMarks)}
                            >
                              {student.twelfthMarks}%
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(student)}
                            className="hover:bg-primary/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Student Record
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  {student.firstName} {student.lastName}? This
                                  action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(student.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredStudents.length)} of{" "}
                  {filteredStudents.length} students
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentTable;
