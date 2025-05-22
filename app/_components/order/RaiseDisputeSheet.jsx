"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, X, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { disputeApi } from "@/lib/api";
import { useSelector } from "react-redux";

const RaiseDisputeSheet = ({ orderId, order }) => {
  const [disputeNote, setDisputeNote] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, user } = useSelector((state) => state.auth);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + documents.length > 5) {
      toast.error("You can upload a maximum of 5 documents");
      return;
    }
    setDocuments([...documents, ...files]);
  };

  const removeDocument = (index) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const handleSubmit = async () => {
    if (!disputeNote.trim()) {
      toast.error("Please enter dispute details");
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedDocuments = [];
      for (const doc of documents) {
        const url = await uploadToCloudinary(doc);
        uploadedDocuments.push(url);
      }

      const response = await disputeApi.createDispute(
        {
          orderId,
          reason: disputeNote,
          documents: uploadedDocuments,
        },
        token
      );

      console.log("Dispute raised:", response);

      toast.success("Dispute raised successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to raise dispute");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await response.json();
    return data.secure_url;
  };

  return (
    <Sheet>
      {order?.disputePausedActions &&
      order?.disputes.find((d) => d.role === user?.role) ? (
        <div className="flex items-center gap-2 border border-[#DFB547] bg-[#DFB547] hover:bg-[#DFB547] text-[#555555] hover:text-white rounded-[55px] px-[20px] py-[8px] text-[14px] cursor-not-allowed">
          <Zap className="h-4 w-4" />
          Dispute Raised
        </div>
      ) : (
        <SheetTrigger asChild>
          <Button className="flex items-center gap-2 border border-[#DFB547] bg-white hover:bg-[#DFB547] text-[#555555] hover:text-white rounded-[55px] px-[20px] py-[8px] cursor-pointer text-[14px]">
            <Zap className="h-4 w-4" />
            Raise Dispute
          </Button>
        </SheetTrigger>
      )}

      <SheetContent className="w-full lg:min-w-[800px] px-[40px]  overflow-y-auto">
        <SheetHeader className="px-0 pt-6">
          <SheetTitle>Raise a Dispute</SheetTitle>
          <SheetDescription>
            Please provide details about your dispute for order #{orderId}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dispute-note">Dispute Details*</Label>
            <Textarea
              id="dispute-note"
              value={disputeNote}
              onChange={(e) => setDisputeNote(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Supporting Documents</Label>
            <p className="text-sm text-muted-foreground">
              Upload relevant documents (max 5 files)
            </p>
            <Label
              htmlFor="dispute-documents"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#001C44] transition-colors"
            >
              <Upload className="h-6 w-6 text-gray-500 mb-2" />
              <span className="text-sm">Click to upload</span>
              <span className="text-xs text-gray-500">
                (PDF, JPG, PNG up to 5MB each)
              </span>
              <Input
                id="dispute-documents"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
              />
            </Label>

            {documents.length > 0 && (
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 text-sm bg-gray-100 px-3 py-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{doc.name}</span>
                    </div>
                    <button
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !disputeNote.trim()}
              className="bg-[#DFB547] hover:bg-[#DFB547]/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Dispute"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RaiseDisputeSheet;
