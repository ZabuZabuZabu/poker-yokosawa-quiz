const pokerData = {
    // データはご提示のものをそのまま使用
    data: {
        "AA": 1, "AKs": 1, "AQs": 2, "AJs": 2, "ATs": 2, "A9s": 4, "A8s": 4, "A7s": 4, "A6s": 4, "A5s": 4, "A4s": 4, "A3s": 4, "A2s": 4,
        "AKo": 1, "KK": 1, "KQs": 2, "KJs": 3, "KTs": 4, "K9s": 4, "K8s": 6, "K7s": 6, "K6s": 6, "K5s": 6, "K4s": 6, "K3s": 6, "K2s": 6,
        "AQo": 2, "KQo": 3, "QQ": 1, "QJs": 3, "QTs": 4, "Q9s": 5, "Q8s": 6, "Q7s": 6, "Q6s": 6, "Q5s": 7, "Q4s": 7, "Q3s": 7, "Q2s": 7,
        "AJo": 3, "KJo": 4, "QJo": 5, "JJ": 2, "JTs": 3, "J9s": 5, "J8s": 6, "J7s": 6, "J6s": 7, "J5s": 8, "J4s": 8, "J3s": 8, "J2s": 8,
        "ATo": 4, "KTo": 5, "QTo": 6, "JTo": 5, "TT": 2, "T9s": 4, "T8s": 5, "T7s": 7, "T6s": 8, "T5s": 8, "T4s": 8, "T3s": 8, "T2s": 9,
        "A9o": 5, "K9o": 6, "Q9o": 6, "J9o": 6, "T9o": 6, "99": 2, "98s": 5, "97s": 6, "96s": 7, "95s": 8, "94s": 9, "93s": 9, "92s": 9,
        "A8o": 6, "K8o": 8, "Q8o": 8, "J8o": 8, "T8o": 8, "98o": 7, "88": 3, "87s": 6, "86s": 7, "85s": 8, "84s": 9, "83s": 9, "82s": 9,
        "A7o": 6, "K7o": 8, "Q7o": 8, "J7o": 9, "T7o": 9, "97o": 8, "87o": 8, "77": 3, "76s": 6, "75s": 7, "74s": 8, "73s": 9, "72s": 9,
        "A6o": 7, "K6o": 8, "Q6o": 9, "J6o": 9, "T6o": 9, "96o": 9, "86o": 9, "76o": 9, "66": 4, "65s": 6, "64s": 7, "63s": 8, "62s": 9,
        "A5o": 8, "K5o": 8, "Q5o": 9, "J5o": 9, "T5o": 9, "95o": 9, "85o": 9, "75o": 9, "65o": 9, "55": 4, "54s": 7, "53s": 8, "52s": 9,
        "A4o": 8, "K4o": 9, "Q4o": 9, "J4o": 9, "T4o": 9, "94o": 9, "84o": 9, "74o": 9, "64o": 9, "54o": 9, "44": 5, "43s": 8, "42s": 9,
        "A3o": 8, "K3o": 9, "Q3o": 9, "J3o": 9, "T3o": 9, "93o": 9, "83o": 9, "73o": 9, "63o": 9, "53o": 9, "43o": 9, "33": 5, "32s": 9,
        "A2o": 8, "K2o": 9, "Q2o": 9, "J2o": 9, "T2o": 9, "92o": 9, "82o": 9, "72o": 9, "62o": 9, "52o": 9, "42o": 9, "32o": 9, "22": 5
    }
};

// --- ポジション配列を9人（SB含む）に修正 ---
const positions = [
    { name: "UTG", behind: 8 }, { name: "UTG+1", behind: 7 }, { name: "MP", behind: 6 },
    { name: "MP+1", behind: 5 }, { name: "HJ", behind: 4 }, { name: "CO", behind: 3 },
    { name: "BTN", behind: 2 }, { name: "SB", behind: 1 }, { name: "BB", behind: 0 }
];
const openThreshold = { 1: 8, 2: 8, 3: 8, 4: 7, 5: 5, 6: 3, 7: 2, 8: 0 };

let currentQuestion = {};

// モード切り替え関数
function hideAll() {
    document.getElementById("mode-select").style.display = "none";
    document.getElementById("quiz-area").style.display = "none";
    document.getElementById("check-area").style.display = "none";
}

function startQuizMode() { hideAll(); document.getElementById("quiz-area").style.display = "block"; nextQuestion(); }
function startCheckMode() { hideAll(); document.getElementById("check-area").style.display = "block"; initCheckMode(); }
function backToMenu() { hideAll(); document.getElementById("mode-select").style.display = "block"; }

function nextQuestion() {
    const hands = Object.keys(pokerData.data);
    const hand = hands[Math.floor(Math.random() * hands.length)];
    const rank = pokerData.data[hand];
    const isRaised = Math.random() > 0.5;

    // SBを出題から除外（インデックス 0~6:UTG~BTN, 8:BB）
    let availableIndices = isRaised ? [1,2,3,4,5,6,8] : [0,1,2,3,4,5,6]; 
    let myIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    const myPos = positions[myIndex];
    
    let oppPos = null;
    let correctAnswers = [];
    let reason = "";

    if (!isRaised) {
        // --- 誰もいない（オープン）状況 ---
        const canOpen = rank <= 7 && myPos.behind <= openThreshold[rank];
        // オープン時は「レイズ」か「フォールド」のみ
        correctAnswers.push(canOpen ? "レイズ" : "フォールド");
        reason = canOpen ? `後ろ${myPos.behind}人に対しランク${rank}はオープン(レイズ)推奨です。` : `この位置からランク${rank}で参加するのは弱すぎます。`;
    } else {
        // --- 誰かがレイズしている状況 ---
        const oppIndex = Math.floor(Math.random() * myIndex);
        oppPos = positions[oppIndex];
        let oppRank = 1;
        for (let r = 7; r >= 1; r--) { if (openThreshold[r] >= oppPos.behind) { oppRank = r; break; } }

        const diff = oppRank - rank;

        // 判定ロジック：ランク8の特殊ルールを追加
        if (rank <= 1 || diff >= 2) {
            // 圧倒的に強い場合は「リレイズ」
            correctAnswers.push("リレイズ");
            reason = rank <= 1 ? "最強ハンドなのでリレイズします。" : `相手(ランク${oppRank})より2ランク以上強いためリレイズします。`;
        } else if (diff === 1) {
            // 1ランク強い場合は「コール」
            correctAnswers.push("コール");
            reason = `相手(ランク${oppRank})より1ランク強いためコール可能です。`;
        } else if (myPos.name === "BB" && oppPos.name === "BTN" && rank <= 8) {
            // 【重要】BB vs BTN の特殊防御ルール（ランク8まで含む）
            correctAnswers.push("コール");
            reason = `ランク${rank}ですが、BB vs BTN なので広くコールで守ります（ピンク色の範囲）。`;
        } else {
            correctAnswers.push("フォールド");
            reason = `相手(ランク${oppRank})に対して有利さが足りません。`;
        }
    }

    currentQuestion = { hand, correctAnswers, reason };

    // --- 【重要】新しいUIテーブルへの反映 ---
    document.getElementById("opp-pos-display").innerText = isRaised ? oppPos.name : "なし";
    document.getElementById("my-pos-display").innerText = myPos.name;
    document.getElementById("hand-display-new").innerText = hand;
    
    // 念のため以前のIDも空にしておく、または削除
    const oldHand = document.getElementById("hand-display");
    if(oldHand) oldHand.innerText = ""; 

    document.getElementById("result").innerText = "";
    document.getElementById("next-btn").style.display = "none";
    updateTableUI(myPos.name, oppPos ? oppPos.name : null);
}

function checkAnswer(choice) {
    const isCorrect = currentQuestion.correctAnswers.includes(choice);
    const resDiv = document.getElementById("result");
    resDiv.innerHTML = isCorrect ? `<span style="color:#2ecc71">⭕ 正解</span><br>${currentQuestion.reason}` : `<span style="color:#e74c3c">❌ 不正解</span><br>正解: ${currentQuestion.correctAnswers.join("/")}<br>${currentQuestion.reason}`;
    document.getElementById("next-btn").style.display = "block";
}

function updateTableUI(myPos, oppPos) {
    document.querySelectorAll('.seat').forEach(s => s.classList.remove('my-pos', 'opp-pos'));
    const formatId = (name) => `seat-${name.replace(/\+/g, '-plus-')}`;
    if (myPos) document.getElementById(formatId(myPos)).classList.add('my-pos');
    if (oppPos) document.getElementById(formatId(oppPos)).classList.add('opp-pos');
}

// チェックモード初期化
function initCheckMode() {
    const hSel = document.getElementById("check-hand"); hSel.innerHTML = "";
    Object.keys(pokerData.data).forEach(h => hSel.add(new Option(h, h)));
    const pSel = document.getElementById("check-pos"); pSel.innerHTML = "";
    positions.forEach(p => pSel.add(new Option(`${p.name}(後ろ${p.behind}人)`, p.name)));
    const oSel = document.getElementById("check-opp-pos"); oSel.innerHTML = "";
    positions.slice(0, -1).forEach(p => oSel.add(new Option(`${p.name}(後ろ${p.behind}人)`, p.name)));
    
    // 初期表示時に結果をクリア
    document.getElementById("check-result").innerHTML = "";
}

function runCheck() {
    // 1. まず結果エリアをクリア（更新されたことを分かりやすくするため）
    const resultDiv = document.getElementById("check-result");
    resultDiv.innerHTML = "計算中...";

    const hand = document.getElementById("check-hand").value;
    const myPosName = document.getElementById("check-pos").value;
    const sit = document.getElementById("check-sit").value;
    const oppPosName = document.getElementById("check-opp-pos").value;

    const rank = pokerData.data[hand];
    const myPos = positions.find(p => p.name === myPosName);
    const oppPos = positions.find(p => p.name === oppPosName);

    let resultAction = "";
    let explanation = "";

    let oppRank = "-"; // 【修正ポイント】関数の最初で定義しておく

    if (sit === "open") {
        // --- 誰もいない（オープン）状況 ---
        const canOpen = rank <= 7 && myPos.behind <= openThreshold[rank];
        resultAction = canOpen ? "レイズ" : "フォールド";
        explanation = canOpen ? "オープン(レイズ)圏内です。" : "レンジ外のためフォールドです。";
    } else {
        // --- 誰かがレイズしている状況 ---
        // 相手のランク算出（関数の外で定義した oppRank を書き換える）
        let tempRank = 1;
        for (let r = 7; r >= 1; r--) {
            if (openThreshold[r] >= oppPos.behind) {
                tempRank = r;
                break;
            }
        }
        oppRank = tempRank; // ここで値を代入

        const diff = oppRank - rank;

        if (rank <= 1 || diff >= 2) {
            resultAction = "リレイズ";
            explanation = rank <= 1 ? "最強ハンドなのでリレイズします。" : `相手(ランク${oppRank})より2ランク以上強いためリレイズします。`;
        } else if (diff === 1) {
            resultAction = "コール";
            explanation = `相手(ランク${oppRank})より1ランク強いためコール可能です。`;
        } else if (myPosName === "BB" && oppPosName === "BTN" && rank <= 8) {
            // 【重要】チェックモードにも同様の特殊ルールを適用
            resultAction = "コール";
            explanation = "BB vs BTN の特殊防御圏内（ピンク色）です。本来はフォールドの強さですが、ここでは守ります。";
        } else {
            resultAction = "フォールド";
            explanation = `相手(ランク${oppRank})に対して有利さが足りません。`;
        }
    }

    // 結果を表示（oppRank が関数のスコープにあるので、正しく表示されるようになります）
    resultDiv.innerHTML = `
        <div style="border-top: 1px solid #555; margin-top: 10px; padding-top: 10px;">
            判定結果: <b style="font-size: 1.2rem; color: #f1c40f;">${resultAction}</b><br>
            <small>${explanation}</small><br>
            <span class="small" style="color:#888;">(自分のランク: ${rank} / 相手の推定ランク: ${oppRank})</span>
        </div>
    `;
}

function toggleRangeChart() {
    const container = document.getElementById("chart-container");
    container.style.display = container.style.display === "none" ? "block" : "none";
}

function toggleOpponentSelect() {
    const sit = document.getElementById("check-sit").value;
    document.getElementById("opp-select-wrapper").style.display = (sit === "raised") ? "block" : "none";
}
