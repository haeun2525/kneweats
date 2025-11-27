import { useState } from "react";
import { read, utils } from "xlsx";

export function RestaurantUploader() {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = read(data, { type: "array" });

        const restaurants = utils.sheet_to_json(workbook.Sheets["Restaurants"]);
        const menus = utils.sheet_to_json(workbook.Sheets["Menus"]);

        localStorage.setItem("restaurants", JSON.stringify(restaurants));
        localStorage.setItem("menus", JSON.stringify(menus));

        alert("Restaurant data updated successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <input
      type="file"
      accept=".xlsx,.xls"
      onChange={handleFileUpload}
      className="p-2 border rounded"
    />
  );
}
