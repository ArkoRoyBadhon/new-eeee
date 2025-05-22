// components/DocumentPreviewModal.jsx
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const DocumentPreviewModal = ({ isOpen, onClose, documentUrl, documentName }) => {
  // Determine file type based on extension
  const isPdf = documentUrl?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(documentUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{documentName || "Document Preview"}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isPdf && (
            <iframe
              src={documentUrl}
              title={documentName}
              className="w-full h-[60vh] border rounded-[16px]"
            />
          )}
          {isImage && (
            <img
              src={documentUrl}
              alt={documentName}
              className="w-full h-auto max-h-[60vh] object-contain rounded-[16px]"
            />
          )}
          {!isPdf && !isImage && (
            <div className="flex flex-col items-center justify-center h-[60vh] bg-gray-100 rounded-[16px]">
              <FileText className="h-12 w-12 text-gray-500" />
              <p className="mt-2 text-muted-foreground">
                Preview not available for this file type
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            as="a"
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90"
          >
            Open in New Tab
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;