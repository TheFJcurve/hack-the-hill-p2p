"use client";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Sidenav from "./sidenav";

export default function Home() {
  interface FileProps {
    path?: string;
    lastModified: number;
    lastModifiedDate?: Date;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
  }
  const [fileData, setFileData] = useState<Array<object>>([]);

  // Function to upload files to the API
  const uploadFile = async (file: FileProps) => {
    const formData = new FormData();
    formData.append("file", file as Blob); // Append the file to formData

    try {
      const response = await fetch("http://127.0.0.1:5000/receive-file", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFileData(data.data);
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    console.log(fileData);
  }, [fileData]);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: FileProps[]) => {
    // Handle file upload here and display the files
    console.log(acceptedFiles);

    // Loop through each file and send to the API
    acceptedFiles.forEach((file) => {
      uploadFile(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidenav />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Hello there! 👋</h1>
          <p className="text-gray-600">
            Looking to share files? We can help you with that, please select
            your file below!
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            Choose a starting point you like
          </h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 rounded-lg cursor-pointer ${
              isDragActive ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Current ID:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ul>
              {Object.entries(fileData).map(([key, value]) => (
                <li key={key}>{value.path}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
