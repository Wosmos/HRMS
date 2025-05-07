import { useState } from "react";
import { Users, Copy, Check, KeyRound, ChevronDown, ChevronUp } from "lucide-react";

export default function DemoCredentials() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState(0);
  
  const credentials = [
    { role: "Admin", email: "demo.admin@demo.com", password: "demo1234" },
    { role: "Manager", email: "demo.manager@demo.com", password: "demo1234" },
    { role: "Employee", email: "demo.employee@demo.com", password: "demo1234" },
    { role: "Finance", email: "demo.finance@demo.com", password: "demo1234" },
    { role: "Super Admin", email: "demo.superadmin@demo.com", password: "demo1234" }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyCredentials = (email: string, password: string, index: number) => {
    handleCopy(`${email} / ${password}`, index);
  };
  
  const handleRoleSelect = (index: number) => {
    setSelectedRole(index);
    setOpenDropdown(false);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-muted/80 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-muted-foreground" />
        <div className="font-semibold">Demo Credentials</div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-3">Select a role to view login credentials:</div>
      
      {/* Dropdown selector */}
      <div className="relative mb-3">
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="w-full flex items-center justify-between p-2 border rounded-md bg-background shadow-sm"
        >
          <div className={`font-medium text-primary`}>
            {credentials[selectedRole].role}
          </div>
          {openDropdown ? 
            <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          }
        </button>
        
        {/* Dropdown menu */}
        {openDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
            {credentials.map((cred, index) => (
              <button
                key={index}
                className={`w-full text-left p-2 hover:bg-muted ${index === selectedRole ? 'bg-muted' : ''} text-primary`}
                onClick={() => handleRoleSelect(index)}
              >
                {cred.role}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected credential details */}
      <div className="p-3 border rounded-md shadow-sm bg-background">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="text-sm font-medium text-foreground">{credentials[selectedRole].email}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Password</div>
            <div className="flex items-center">
              <KeyRound className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{credentials[selectedRole].password}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t flex justify-end">
          <button
            onClick={() => copyCredentials(
              credentials[selectedRole].email, 
              credentials[selectedRole].password, 
              selectedRole
            )}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            aria-label="Copy credentials"
          >
            {copiedIndex === selectedRole ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Credentials</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-center text-muted-foreground">
        All accounts use the same password: <span className="font-medium text-foreground">demo1234</span>
      </div>
    </div>
  );
}