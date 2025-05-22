import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  itemName,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        ></button>

        <DialogHeader className="text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Confirm Deletion
            </DialogTitle>
          </div>

          <DialogDescription className="mt-4 text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">"{itemName}"</span>?
            This action cannot be undone and all data will be permanently
            removed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-[80px] border-gray-300 hover:bg-gray-50 text-gray-700"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="min-w-[80px] bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
