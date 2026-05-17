import { useState, useMemo, useRef } from "react";

// =======================================
// 型定義
// =======================================
type Category = "肉" | "魚" | "アジア";
type Difficulty = "本格" | "普通" | "簡単";
type FilterDifficulty = Difficulty | "すべて";

interface MenuItem {
    name: string;
    category: Category;
    diff: Difficulty;
    time: string;
    ingredients: string;
    side: string;
}

// =======================================
// メニューデータ
// =======================================
const ALL_MENUS: MenuItem[] = [
    // 🥩 肉料理
    {
        name: "豚の生姜焼き",
        category: "肉",
        diff: "簡単",
        time: "15分",
        ingredients: "豚ロース肉,玉ねぎ,生姜,醤油,みりん",
        side: "キャベツの千切り・豆腐の味噌汁",
    },
    {
        name: "豚肉のしそとチーズ巻き",
        category: "肉",
        diff: "本格",
        time: "45分",
        ingredients: "豚ロース肉,チーズ,しそ,小麦粉,卵",
        side: "サラダ",
    },
    {
        name: "ハンバーグ",
        category: "肉",
        diff: "本格",
        time: "50分",
        ingredients: "合いびき肉,玉ねぎ,卵,パン粉,牛乳",
        side: "コーンスープ・ポテトサラダ",
    },
    {
        name: "肉じゃが",
        category: "肉",
        diff: "普通",
        time: "35分",
        ingredients: "豚バラ肉,じゃがいも,人参,玉ねぎ,しらたき",
        side: "ほうれん草のお浸し・冷奴",
    },
    {
        name: "鶏の照り焼き",
        category: "肉",
        diff: "普通",
        time: "30分",
        ingredients: "鶏もも肉,醤油,みりん,砂糖,酒",
        side: "きんぴらごぼう・グリーンサラダ",
    },
    {
        name: "豚キムチ炒め",
        category: "肉",
        diff: "簡単",
        time: "20分",
        ingredients: "豚バラ肉,キムチ,ニラ,もやし",
        side: "わかめスープ・チョレギサラダ",
    },
    {
        name: "牛丼",
        category: "肉",
        diff: "簡単",
        time: "20分",
        ingredients: "牛薄切り肉,玉ねぎ,紅生姜,だし汁",
        side: "お新香・ポテトサラダ",
    },
    {
        name: "親子丼",
        category: "肉",
        diff: "普通",
        time: "30分",
        ingredients: "鶏もも肉,卵,玉ねぎ,三つ葉,だし汁",
        side: "ほうれん草の胡麻和え・味噌汁",
    },
    {
        name: "チキン南蛮",
        category: "肉",
        diff: "本格",
        time: "45分",
        ingredients: "鶏もも肉,卵,タルタルソース,甘酢だれ",
        side: "春雨サラダ・具だくさん味噌汁",
    },
    {
        name: "ピーマンの肉詰め",
        category: "肉",
        diff: "普通",
        time: "30分",
        ingredients: "ピーマン,合いびき肉,玉ねぎ,卵",
        side: "コンソメスープ・ひじきの煮物",
    },
    {
        name: "豚のしそクリーム",
        category: "肉",
        diff: "本格",
        time: "30分",
        ingredients: "豚ロース肉,大葉,生クリーム,ニンニク",
        side: "温野菜・バケット",
    },
    {
        name: "タンドリーチキン",
        category: "肉",
        diff: "本格",
        time: "40分",
        ingredients: "鶏もも肉,ヨーグルト,カレー粉,ケチャップ",
        side: "コンソメライス・ラッシー風ドリンク",
    },
    {
        name: "クリームシチュー",
        category: "肉",
        diff: "普通",
        time: "30分",
        ingredients: "鶏もも肉,じゃがいも,人参,玉ねぎ,牛乳,ルウ",
        side: "ガーリックトースト・サラダ",
    },
    {
        name: "ナスとピーマンと豚肉の味噌炒め",
        category: "肉",
        diff: "普通",
        time: "40分",
        ingredients: "ナス、味噌、ピーマン、豚肉、味噌",
        side: "キュウリ、味噌汁",
    },
    // 🌏 アジア料理
    {
        name: "麻婆豆腐",
        category: "アジア",
        diff: "簡単",
        time: "15分",
        ingredients: "豆腐,豚挽肉,長ねぎ,豆板醤,甜麺醤",
        side: "中華クラゲ・焼売",
    },
    {
        name: "ビビンバ丼",
        category: "アジア",
        diff: "普通",
        time: "30分",
        ingredients: "牛挽肉,ナムル,卵,コチュジャン",
        side: "わかめスープ・キムチ",
    },
    {
        name: "チンジャオロース",
        category: "アジア",
        diff: "簡単",
        time: "20分",
        ingredients: "牛細切り肉,ピーマン,筍,オイスターソース",
        side: "卵スープ・春巻き",
    },
    {
        name: "カオマンガイ",
        category: "アジア",
        diff: "簡単",
        time: "20分",
        ingredients: "鶏もも肉,米,生姜,ニンニク,パクチー",
        side: "鶏だしスープ・きゅうりの和え物",
    },
    {
        name: "エビチリ",
        category: "アジア",
        diff: "普通",
        time: "30分",
        ingredients: "海老,長ねぎ,ケチャップ,豆板醤",
        side: "中華スープ・叩ききゅうり",
    },
    {
        name: "プルコギ",
        category: "アジア",
        diff: "簡単",
        time: "20分",
        ingredients: "牛薄切り肉,玉ねぎ,人参,ニラ,春雨",
        side: "サンチュ・キムチ",
    },
    {
        name: "チャプチェ",
        category: "アジア",
        diff: "普通",
        time: "25分",
        ingredients: "韓国春雨,牛肉,ピーマン,椎茸,人参",
        side: "韓国のり・ナムル",
    },
    {
        name: "ホイコーロー",
        category: "アジア",
        diff: "簡単",
        time: "15分",
        ingredients: "豚バラ肉,キャベツ,ピーマン,甜麺醤",
        side: "ワンタンスープ・杏仁豆腐",
    },
    {
        name: "ナス入り油淋鶏",
        category: "アジア",
        diff: "本格",
        time: "50分",
        ingredients: "鶏もも肉,ナス,長ねぎ,醤油,酢",
        side: "中華風冷奴・卵スープ",
    },
    {
        name: "カレー",
        category: "アジア",
        diff: "普通",
        time: "30分",
        ingredients: "牛肉または豚肉,じゃがいも,人参,玉ねぎ,ルウ",
        side: "福神漬け・らっきょう・サラダ",
    },
    {
        name: "水餃子",
        category: "アジア",
        diff: "本格",
        time: "45分",
        ingredients: "冷凍または手作り餃子,白菜,長ねぎ,ポン酢",
        side: "ザーサイ・炒飯",
    },
    {
        name: "焼き餃子",
        category: "アジア",
        diff: "本格",
        time: "45分",
        ingredients: "豚挽肉,キャベツ,ニラ,餃子の皮",
        side: "もやしナムル・中華スープ",
    },
    // 🐟 魚料理
    {
        name: "さばの味噌煮",
        category: "魚",
        diff: "簡単",
        time: "25分",
        ingredients: "鯖,生姜,味噌,酒,砂糖",
        side: "小松菜のお浸し・だし巻き卵",
    },
    {
        name: "鰆とアスパラのソテー",
        category: "魚",
        diff: "普通",
        time: "30分",
        ingredients: "鰆,アスパラガス,カマンベールチーズ,バター",
        side: "白ワイン・バゲット",
    },
    {
        name: "鮭のタルタルソース",
        category: "魚",
        diff: "本格",
        time: "45分",
        ingredients: "鮭,卵,玉ねぎ,マヨネーズ,小麦粉",
        side: "粉ふきいも・コンソメスープ",
    },
    {
        name: "ブリステーキ",
        category: "魚",
        diff: "簡単",
        time: "20分",
        ingredients: "ブリ,ニンニク,醤油,バター",
        side: "大根サラダ・お吸い物",
    },
    {
        name: "アジフライ",
        category: "魚",
        diff: "本格",
        time: "45分",
        ingredients: "アジ,パン粉,卵,小麦粉,キャベツ",
        side: "タルタルソース・豚汁",
    },
    {
        name: "白身魚のホイル焼き",
        category: "魚",
        diff: "普通",
        time: "30分",
        ingredients: "白身魚,きのこ,玉ねぎ,バター,レモン",
        side: "ジャーマンポテト・スープ",
    },
    {
        name: "アクアパッツァ",
        category: "魚",
        diff: "本格",
        time: "40分",
        ingredients: "白身魚,あさり,プチトマト,オリーブ,白ワイン",
        side: "ガーリックトースト・サラダ",
    },
    {
        name: "カジキマグロのトマトソース",
        category: "魚",
        diff: "簡単",
        time: "20分",
        ingredients: "カジキマグロ,トマト缶,ニンニク,オリーブオイル",
        side: "パスタ・グリル野菜",
    },
    {
        name: "マグロしらす丼",
        category: "魚",
        diff: "簡単",
        time: "20分",
        ingredients: "マグロ,しらす,大葉,刻み海苔,醤油",
        side: "茶碗蒸し・味噌汁",
    },
    {
        name: "カキフライ",
        category: "魚",
        diff: "本格",
        time: "40分",
        ingredients: "牡蠣,パン粉,卵,小麦粉",
        side: "レモン・キャベツの千切り",
    },
    {
        name: "サンマの塩焼き",
        category: "魚",
        diff: "簡単",
        time: "15分",
        ingredients: "秋刀魚,塩,大根おろし",
        side: "ひじきの煮物・味噌汁",
    },
    {
        name: "イカと里芋の煮っころがし",
        category: "魚",
        diff: "本格",
        time: "40分",
        ingredients: "イカ,里芋,醤油,砂糖,みりん",
        side: "小松菜の胡麻和え・お吸い物",
    },
    {
        name: "鮭ときのこのオリーブ炒め",
        category: "魚",
        diff: "普通",
        time: "30分",
        ingredients: "鮭,オリーブ,ニンニク,パセリ",
        side: "ポテトサラダ・パン",
    },
];

// =======================================
// 定数
// =======================================
const COLORS = [
    "#FFADAD",
    "#FFD6A5",
    "#FDFFB6",
    "#CAFFBF",
    "#9BF6FF",
    "#A0C4FF",
    "#BDB2FF",
    "#FFC6FF",
];

const CATEGORIES: { key: Category; label: string }[] = [
    { key: "肉", label: "🥩 肉" },
    { key: "魚", label: "🐟 魚" },
    { key: "アジア", label: "🌏 アジア" },
];

const DIFFICULTIES: { key: FilterDifficulty; label: string }[] = [
    { key: "すべて", label: "✨ すべて" },
    { key: "簡単", label: "🌱 簡単" },
    { key: "普通", label: "🍳 普通" },
    { key: "本格", label: "👑 本格" },
];

// =======================================
// ルーレットアクション
// =======================================
export const MenuRoulette: React.FC = () => {
    const [currentCategory, setCurrentCategory] = useState<Category>("肉");
    const [currentDifficulty, setCurrentDifficulty] =
        useState<FilterDifficulty>("すべて");
    const [rotation, setRotation] = useState<number>(0);
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [resultMenu, setResultMenu] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // 回転累積角度の保持
    const rotationRef = useRef<number>(0);

    // カテゴリ と 難易度 の両方で絞り込んだメニュー配列をメモ化
    const filteredMenus = useMemo(() => {
        return ALL_MENUS.filter((m) => {
            const matchCategory = m.category === currentCategory;
            const matchDifficulty =
                currentDifficulty === "すべて" || m.diff === currentDifficulty;
            return matchCategory && matchDifficulty;
        });
    }, [currentCategory, currentDifficulty]);

    // CSS Conic Gradientの背景を計算
    const rouletteBackground = useMemo(() => {
        if (filteredMenus.length === 0) return "#e0e0e0"; // メニューが0件の時のフォールバック背景

        const anglePerItem = 360 / filteredMenus.length;
        const gradientParts = filteredMenus.map((_, i) => {
            const start = i * anglePerItem;
            const end = (i + 1) * anglePerItem;
            return `${COLORS[i % COLORS.length]} ${start}deg ${end}deg`;
        });
        return `conic-gradient(${gradientParts.join(", ")})`;
    }, [filteredMenus]);

    // 条件変更時のリセット処理
    const handleFilterChange = (cat: Category, diff: FilterDifficulty) => {
        if (isSpinning) return;
        setCurrentCategory(cat);
        setCurrentDifficulty(diff);
        rotationRef.current = 0;
        setRotation(0);
    };

    const spin = () => {
        if (isSpinning || filteredMenus.length === 0) return;

        setIsSpinning(true);
        const extraDegree = 1800 + Math.floor(Math.random() * 360);
        const newRotation = rotationRef.current + extraDegree;
        rotationRef.current = newRotation;
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);

            const actualDegree = newRotation % 360;
            const anglePerItem = 360 / filteredMenus.length;
            const index =
                Math.floor((360 - actualDegree) / anglePerItem) %
                filteredMenus.length;

            setResultMenu(filteredMenus[index]);
            setIsModalOpen(true);
        }, 4000);
    };

    // =======================================
    // ルーレットアクション
    // =======================================
    return (
        <div style={styles.body}>
            {/* HEADER */}
            <header style={styles.header}>
                <h1 style={{ margin: "15px 0 30px 0" }}>🍳 献立くん</h1>

                {/* 1層目: カテゴリタブ */}
                <div style={styles.tabContainer}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.key}
                            style={{
                                ...styles.tabButton,
                                ...(currentCategory === cat.key
                                    ? styles.tabButtonActive
                                    : {}),
                            }}
                            disabled={isSpinning}
                            onClick={() =>
                                handleFilterChange(cat.key, currentDifficulty)
                            }
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* 2層目: 難易度タブ */}
                <div style={{ ...styles.tabContainer, marginTop: "12px" }}>
                    {DIFFICULTIES.map((diff) => (
                        <button
                            key={diff.key}
                            style={{
                                ...styles.diffTabButton,
                                ...(currentDifficulty === diff.key
                                    ? styles.diffTabButtonActive
                                    : {}),
                            }}
                            disabled={isSpinning}
                            onClick={() =>
                                handleFilterChange(currentCategory, diff.key)
                            }
                        >
                            {diff.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* ROULETTE WRAPPER */}
            <div style={styles.rouletteWrapper}>
                <div style={styles.pointer}></div>
                <div style={styles.centerCircle}></div>
                <div
                    style={{
                        ...styles.rouletteContainer,
                        background: rouletteBackground,
                        transform: `rotate(${rotation}deg)`,
                    }}
                >
                    {filteredMenus.length > 0 ? (
                        filteredMenus.map((menu, i) => {
                            const anglePerItem = 360 / filteredMenus.length;
                            const itemRotation =
                                i * anglePerItem + anglePerItem / 2;
                            return (
                                <div
                                    key={`${menu.name}-${i}`}
                                    style={{
                                        ...styles.menuItem,
                                        transform: `rotate(${itemRotation}deg)`,
                                    }}
                                >
                                    <div style={styles.menuName}>
                                        {menu.name}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        // 該当メニューが0件の場合の表示表示
                        <div style={styles.emptyMessage}>
                            該当するメニューが
                            <br />
                            ありません
                        </div>
                    )}
                </div>
            </div>

            {/* SPIN BUTTON */}
            <button
                style={{
                    ...styles.spinButton,
                    ...(isSpinning || filteredMenus.length === 0
                        ? styles.spinButtonDisabled
                        : {}),
                }}
                disabled={isSpinning || filteredMenus.length === 0}
                onClick={spin}
            >
                {isSpinning
                    ? "抽選中..."
                    : filteredMenus.length === 0
                      ? "メニューがありません"
                      : `${currentCategory}料理で決める！`}
            </button>

            {/* RESULT MODAL */}
            {isModalOpen && resultMenu && (
                <div style={styles.modal}>
                    <div style={styles.resultCard}>
                        <span style={styles.badge}>
                            🎉 今夜のメニューに決定！
                        </span>
                        <h2 style={styles.resultCardH2}>{resultMenu.name}</h2>
                        <div
                            style={{
                                marginBottom: "15px",
                                fontSize: "0.85rem",
                                color: "#666",
                            }}
                        >
                            <span>区分: {resultMenu.category}料理</span>
                            <span style={{ marginLeft: "15px" }}>
                                難易度: {resultMenu.diff}
                            </span>
                        </div>
                        <div style={styles.info}>
                            <strong
                                style={{
                                    display: "block",
                                    marginBottom: "4px",
                                }}
                            >
                                🛒 買い物リスト:
                            </strong>
                            <p style={{ margin: "0 0 12px 0" }}>
                                {resultMenu.ingredients}
                            </p>
                            <strong
                                style={{
                                    display: "block",
                                    marginBottom: "4px",
                                }}
                            >
                                🥗 副菜のヒント:
                            </strong>
                            <p style={{ margin: 0 }}>{resultMenu.side}</p>
                        </div>
                        <button
                            style={styles.closeBtn}
                            onClick={() => setIsModalOpen(false)}
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// =======================================
// スタイル定義
// =======================================
const styles: { [key: string]: React.CSSProperties } = {
    body: {
        margin: 0,
        fontFamily: "'Shippori Mincho', 'Yu Mincho', 'YuMincho', serif",
        backgroundColor: "#f7f9fc",
        color: "#333",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
    },
    header: {
        width: "100%",
        backgroundColor: "#fff",
        padding: "15px 0 20px 0",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100,
    },
    tabContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "10px",
    },
    tabButton: {
        padding: "8px 24px",
        borderRadius: "20px",
        fontSize: "0.95rem",
        fontWeight: "bold",
        cursor: "pointer",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
        transition: "0.2s ease",
    },
    tabButtonActive: {
        backgroundColor: "#ff4500",
        color: "#fff",
        border: "none",
    },
    diffTabButton: {
        padding: "6px 16px",
        borderRadius: "15px",
        fontSize: "0.85rem",
        fontWeight: "600",
        cursor: "pointer",
        border: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc",
        color: "#64748b",
        transition: "0.2s ease",
    },
    diffTabButtonActive: {
        backgroundColor: "#475569",
        color: "#fff",
        borderColor: "#475569",
    },
    rouletteWrapper: {
        position: "relative",
        width: "500px",
        height: "500px",
        margin: "50px auto",
    },
    rouletteContainer: {
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: "6px solid #fff",
        outline: "8px solid #333",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        transition: "transform 4s cubic-bezier(0.1, 0, 0.1, 1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    pointer: {
        position: "absolute",
        top: "-25px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "40px",
        height: "50px",
        backgroundColor: "#ff4500",
        clipPath: "polygon(50% 100%, 0 0, 100% 0)",
        zIndex: 10,
    },
    centerCircle: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60px",
        height: "60px",
        background: "white",
        borderRadius: "50%",
        zIndex: 5,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    menuItem: {
        position: "absolute",
        top: 0,
        left: "50%",
        height: "50%",
        width: "0",
        transformOrigin: "bottom center",
    },
    menuName: {
        position: "absolute",
        top: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        writingMode: "vertical-rl",
        fontSize: "11px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        letterSpacing: "1px",
    },
    emptyMessage: {
        color: "#666",
        fontSize: "1.1rem",
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: "1.5",
        zIndex: 2,
    },
    spinButton: {
        width: "340px",
        padding: "16px",
        fontSize: "1.1rem",
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#ff4500",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(255, 69, 0, 0.3)",
        marginBottom: "50px",
        transition: "all 0.2s user-select",
    },
    spinButtonDisabled: {
        backgroundColor: "#cbd5e1",
        color: "#94a3b8",
        cursor: "not-allowed",
        boxShadow: "none",
    },
    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    resultCard: {
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        maxWidth: "350px",
        width: "90%",
        textAlign: "center",
    },
    resultCardH2: {
        color: "#0666f7",
        margin: "15px 0 5px 0",
    },
    badge: {
        background: "#fff0e6",
        color: "#ff4500",
        padding: "5px 15px",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: "bold",
    },
    info: {
        textAlign: "left",
        fontSize: "0.9rem",
        background: "#f9f9f9",
        padding: "15px",
        borderRadius: "10px",
    },
    closeBtn: {
        marginTop: "20px",
        width: "100%",
        padding: "10px",
        border: "none",
        background: "#eee",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default MenuRoulette;
