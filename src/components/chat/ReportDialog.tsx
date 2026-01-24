import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Flag, X, AlertTriangle } from "lucide-react";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const reportReasons = [
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "spam", label: "Spam or scam" },
  { value: "underage", label: "Underage user" },
  { value: "other", label: "Other" },
];

const ReportDialog = ({ isOpen, onClose, onSubmit }: ReportDialogProps) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleSubmit = () => {
    const reason = selectedReason === "other" 
      ? additionalInfo.trim().slice(0, 500) || "Other" 
      : reportReasons.find(r => r.value === selectedReason)?.label || selectedReason;
    onSubmit(reason);
    setSelectedReason("");
    setAdditionalInfo("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Report User</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-warning/10 border border-warning/30">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
              <p className="text-sm text-muted-foreground">
                This will end the chat and report the user for review.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground mb-2 block">Why are you reporting?</Label>
                <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                  {reportReasons.map((reason) => (
                    <motion.div 
                      key={reason.value}
                      whileHover={{ x: 4 }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <RadioGroupItem value={reason.value} id={reason.value} />
                      <Label htmlFor={reason.value} className="cursor-pointer flex-1">
                        {reason.label}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </div>

              {selectedReason === "other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <Label htmlFor="additional" className="text-foreground mb-2 block">
                    Please describe the issue
                  </Label>
                  <Textarea
                    id="additional"
                    placeholder="Tell us what happened..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    maxLength={500}
                    className="bg-secondary/50 border-border resize-none"
                    rows={3}
                  />
                </motion.div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!selectedReason}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Submit Report
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportDialog;
