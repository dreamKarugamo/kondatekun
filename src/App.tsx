import { useState, useMemo, useRef } from "react";
import type { Category, FilterDifficulty, MenuItem } from "./types";
import { ALL_MENUS } from "./data";

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
    const [isChangingFilter, setIsChangingFilter] = useState<boolean>(false);

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

        // リセット時の逆回転を防ぐため、一時的にアニメーションを無効化
        setIsChangingFilter(true);

        setCurrentCategory(cat);
        setCurrentDifficulty(diff);
        rotationRef.current = 0;
        setRotation(0);

        // 状態の更新が反映された直後（50ms後）にアニメーションを有効に戻す
        setTimeout(() => {
            setIsChangingFilter(false);
        }, 50);
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
                <h1 style={styles.h1}>🍳 献立くん</h1>

                {/* 1層目: カテゴリタブ */}
                <div style={styles.tabContainer}>
                    <span style={styles.span}>カテゴリー：</span>
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
                    <span style={styles.span}>難易度：</span>
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
                        // 💡 変更点：フィルター切り替え時のみ transition を "none" に動的切り替え
                        transition: isChangingFilter
                            ? "none"
                            : "transform 4s cubic-bezier(0.1, 0, 0.1, 1)",
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
                            <div>
                                <div>
                                    <span style={styles.span_category}>
                                        区分：
                                    </span>
                                    <span> {resultMenu.category}料理</span>
                                </div>
                                <div>
                                    <span style={styles.span_category}>
                                        難易度：
                                    </span>
                                    <span>{resultMenu.diff}</span>
                                </div>
                            </div>
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
                            <p style={styles.modalP}>
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
                            <p style={styles.modalP}>{resultMenu.side}</p>
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "45vw",
        minWidth: "500px",
        backgroundColor: "#fff",
        padding: "0 0 20px 0",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        top: 0,
    },
    h1: {
        margin: "0 0 20px",
    },
    span: {
        display: "block",
        fontSize: "0.7rem",
        fontWeight: "700",
        padding: "10px 0",
    },
    tabContainer: {
        display: "flex",
        justifyContent: "left",
        width: "27vw",
        minWidth: "500px",
        gap: "10px",
        margin: "5px auto",
        padding: "0 25px",
    },
    tabButton: {
        padding: "8px 24px",
        borderRadius: "20px",
        fontSize: "0.5rem",
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
        fontSize: "0.5rem",
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
        width: "60vh",
        height: "60vh",
        margin: "30px auto",
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
        // 💡 変更点：インラインスタイルの指定へ移行したため、ここからは transition を削除しました
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
    modalP: {
        fontSize: "0.7rem",
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
    span_category: {
        color: "#4CB232",
        fontWeight: "700",
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
        fontSize: "0.8rem",
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
