import React from "react";

type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
      {message}
    </div>
  );
}
