import { supabase } from "./client";
import type { MenuItem } from "@/types/menu";

// 특정 식당의 메뉴 조회
export async function fetchMenus(restaurantId: number): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("id");

  if (error) throw error;
  return data as MenuItem[];
}

// 메뉴 추가
export async function addMenuItem(item: MenuItem) {
  const { error } = await supabase
    .from("menus")
    .insert(item);

  if (error) throw error;
}

// 메뉴 수정
export async function updateMenuItem(id: number, body: Partial<MenuItem>) {
  const { error } = await supabase
    .from("menus")
    .update(body)
    .eq("id", id);

  if (error) throw error;
}

// 메뉴 삭제
export async function deleteMenuItem(id: number) {
  const { error } = await supabase
    .from("menus")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
