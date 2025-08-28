import { GraduationCap, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  return (
    <header className="glass-effect border-b sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl shadow-glow">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Student Record Manager</h1>
              <p className="text-sm text-muted-foreground">Manage student records efficiently</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={activeTab === 'list' ? 'default' : 'ghost'}
              onClick={() => onTabChange('list')}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              View Records
            </Button>
            <Button
              variant={activeTab === 'add' ? 'default' : 'ghost'}
              onClick={() => onTabChange('add')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;