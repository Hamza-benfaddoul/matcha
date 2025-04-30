import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Textarea } from "@/components/ui/textarea";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { MoreVertical } from "lucide-react";
  import { useState } from "react";
  import { useForm, Controller } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import * as z from "zod";
import axios from "axios";
  
  // Validation schema for the report form
  const reportFormSchema = z.object({
    reason: z.enum([
      "harassment",
      "spam",
      "fake_account",
      "inappropriate_content",
      "other",
    ], {
      required_error: "Please select a reason",
    }),
    details: z.string().optional(),
  });
  
  type ReportFormValues = z.infer<typeof reportFormSchema>;
  
  interface UserActionsDropdownProps {
    reporterId: string | undefined;
    reportedId: string | undefined;
    onReportSubmit: (reportData: {
      reporter_id: string | undefined;
      reported_id: string | undefined;
      reason: string;
      details?: string;
      status: string;
    }) => Promise<void>;
  }
  
  export function UserActionsDropdown({
    reporterId,
    reportedId,
    onReportSubmit,
  }: UserActionsDropdownProps) {
    const [blockModalOpen, setBlockModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<ReportFormValues>({
      resolver: zodResolver(reportFormSchema),
      defaultValues: {
        reason: undefined,
        details: "",
      },
    });
  
    const handleBlockConfirm = async () => {
      try {
        const block_response = await axios.post(
          "/api/user/block/add",
          {
            blocker_id: reporterId,
            blocked_id: reportedId,
          })
        setBlockModalOpen(false);
      } catch (error) {
        console.error("Error blocking user:", error);
      }
    };
  
    const onSubmitReport = async (data: ReportFormValues) => {
      setIsSubmitting(true);
      try {
        // await axios.post("/api/user/report/add", {
        //   reporter_id: reporterId,
        //   reported_id: reportedId,
        //   reason: data.reason,
        //   details: data.details,
        //   status: "pending",
        // });
        reset();
        setReportModalOpen(false);
      } catch (error) {
        console.error("Error submitting report:", error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <>
        {/* Three-dot dropdown trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none"
              aria-label="User actions"
            >
              <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              onClick={() => setBlockModalOpen(true)}
            >
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setReportModalOpen(true)}
            >
              Report User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  
        {/* Block User Confirmation Modal */}
        <Dialog open={blockModalOpen} onOpenChange={setBlockModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Block User</DialogTitle>
              <DialogDescription>
                Blocking will prevent this user from interacting with you. They won't
                be notified about this action.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setBlockModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBlockConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Blocking..." : "Confirm Block"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  
        {/* Report User Modal */}
        <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit(onSubmitReport)}>
              <DialogHeader>
                <DialogTitle>Report User</DialogTitle>
                <DialogDescription>
                  Please provide details about why you're reporting this user.
                </DialogDescription>
              </DialogHeader>
  
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="reason">Reason*</label>
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="harassment">Harassment</SelectItem>
                          <SelectItem value="spam">Spam or Scam</SelectItem>
                          <SelectItem value="fake_account">Fake Account</SelectItem>
                          <SelectItem value="inappropriate_content">
                            Inappropriate Content
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.reason && (
                    <p className="text-sm text-red-500">
                      {errors.reason.message}
                    </p>
                  )}
                </div>
  
                <div className="grid gap-2">
                  <label htmlFor="details">Additional Details</label>
                  <Controller
                    name="details"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="details"
                        placeholder="Please provide any additional information that might help us review this report..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
  
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setReportModalOpen(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }