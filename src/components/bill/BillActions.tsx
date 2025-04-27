
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Save } from 'lucide-react';
import { toast } from 'sonner';

interface BillActionsProps {
  onReset: () => void;
}

const BillActions: React.FC<BillActionsProps> = ({ onReset }) => {
  return (
    <div className="flex justify-end gap-2 mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="flex items-center gap-1"
      >
        <RefreshCw className="h-4 w-4" /> Reset
      </Button>
      <Button 
        size="sm" 
        onClick={() => toast.success("Bill saved")}
        className="bill-btn-primary flex items-center gap-1"
      >
        <Save className="h-4 w-4" /> Save
      </Button>
    </div>
  );
};

export default BillActions;
