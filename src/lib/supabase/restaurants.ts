import { supabase } from "./client";

export async function getRestaurantsWithMenus() {
  // 1. 레스토랑 전체 조회
  const { data: restaurants, error: err1 } = await supabase
    .from("restaurants")
    .select("*")
    .order("id");

  if (err1) throw err1;

  // 2. 메뉴 전체 조회
  const { data: menus, error: err2 } = await supabase
    .from("menus")
    .select("*")
    .order("id");

  if (err2) throw err2;

  // 3. 메뉴를 알맞은 레스토랑에 매칭
  const result = restaurants.map(r => ({
    ...r,
    menus: menus
      .filter(m => m.restaurant_id === r.id)
      .map(m => ({
        ...m,
        allergens: m.allergens
          ? m.allergens.split(",").map(a => a.trim())
          : [],
      })),
  }));

  return result;
}
