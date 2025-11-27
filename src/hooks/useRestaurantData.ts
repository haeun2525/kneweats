import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Restaurant, Menu } from '../App';

export function useRestaurantData() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedRestaurants = localStorage.getItem('restaurants');
    const savedMenus = localStorage.getItem('menus');
    if (savedRestaurants) setRestaurants(JSON.parse(savedRestaurants));
    if (savedMenus) setMenus(JSON.parse(savedMenus));
  }, []);

  // Upload Excel file and update data
  const uploadExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: 'array' });
        
        const restaurantsData = XLSX.utils.sheet_to_json(workbook.Sheets['Restaurants']);
        const menusData = XLSX.utils.sheet_to_json(workbook.Sheets['Menus']);
        
        setRestaurants(restaurantsData as Restaurant[]);
        setMenus(menusData as Menu[]);
        
        // Save to localStorage
        localStorage.setItem('restaurants', JSON.stringify(restaurantsData));
        localStorage.setItem('menus', JSON.stringify(menusData));
        
        alert('Data updated successfully!');
      } catch (error) {
        console.error('Error reading Excel file:', error);
        alert('Error uploading file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return { restaurants, menus, uploadExcelFile };
}