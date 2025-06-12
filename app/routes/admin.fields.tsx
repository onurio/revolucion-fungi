import type { MetaFunction } from "@remix-run/node";
import React from "react";
import DynamicFieldManager from "~/components/DynamicFieldManager.client";

export const meta: MetaFunction = () => {
  return [
    { title: "Manage Dynamic Fields - Fungarium" },
    { name: "description", content: "Manage dynamic fields for fungi records" },
  ];
};

export default function AdminFields() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Dynamic Fields</h1>
        <p className="mt-2 text-gray-600">
          Add custom fields to expand the fungi data model. These fields will appear in the fungi form and details view.
        </p>
      </div>
      
      <DynamicFieldManager />
      
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Dynamic fields allow you to extend the fungi model without modifying the core structure. 
              Fields can be added for DNA processing, molecular analysis, or any other custom data you need to track.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}