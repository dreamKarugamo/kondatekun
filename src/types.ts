// =======================================
// 型定義
// =======================================
export type Category = "肉" | "魚" | "アジア";
export type FilterDifficulty = "すべて" | "本格" | "普通" | "簡単";

export interface MenuItem {
    name: string;
    category: Category;
    diff: "本格" | "普通" | "簡単";
    time: string;
    ingredients: string;
    side: string;
}