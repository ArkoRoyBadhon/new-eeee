"use client";

import { Button } from "@/components/ui/button";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export const FileUpload = ({ value, onChange, accept }) => {
  const [file, setFile] = useState(value);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
          const fileUrl = reader.result;
          setFile(fileUrl);
          onChange(fileUrl);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {file ? (
        <div className="flex items-center gap-2">
          <div className="p-2 border rounded-md">
            <img
              src={file}
              alt="Preview"
              className="h-16 w-16 object-cover rounded"
            />
          </div>
          <Button variant="destructive" size="sm" onClick={removeFile}>
            Remove
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
            isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <p>
            {isDragActive
              ? "Drop the file here"
              : "Drag & drop a file here, or click to select"}
          </p>
        </div>
      )}
    </div>
  );
};