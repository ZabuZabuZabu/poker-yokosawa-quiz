const pokerData = {
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

const positions = [
    { name: "UTG", behind: 8 }, { name: "UTG+1", behind: 7 }, { name: "MP", behind: 6 },
    { name: "MP+1", behind: 5 }, { name: "HJ", behind: 4 }, { name: "CO", behind: 3 },
    { name: "BTN", behind: 2 }, { name: "SB", behind: 1 }, { name: "BB", behind: 0 }
];
const openThreshold = { 1: 8, 2: 8, 3: 8, 4: 7, 5: 5, 6: 3, 7: 2, 8: 0 };

let currentQuestion = {};
let isPracticeMode = false;
let practiceSettings = { pos: 'random', sit: 'random' };
let quizTotalCount = 0;
let quizCurrentCount = 0;
let quizCorrectCount = 0;
let wrongQuestions = []; // 間違えた問題を保存する配列
const STORAGE_KEY = 'poker_practice_history';
let sessionWrongQuestions = []; // 今回のクイズでの間違い
let allTimeWrongQuestions = []; // これまでの全間違い履歴
let isWrongQuestionQuiz = false; // ★追加：履歴クイズ中かどうかのフラグ
let wrongQuizPool = []; // ★追加：出題する間違い問題のリスト
/* --- app.js の冒頭に設定用変数を追加 --- */
let isBorderlinePriority = false;

function hideAll() {
    document.getElementById("mode-select").style.display = "none";
    document.getElementById("quiz-area").style.display = "none";
    document.getElementById("check-area").style.display = "none";
    document.getElementById("practice-setup-area").style.display = "none";
    document.getElementById("quiz-setup-area").style.display = "none";
    document.getElementById("quiz-result-area").style.display = "none";
    document.getElementById("history-area").style.display = "none"; // 追加
}

function startCheckMode() { hideAll(); document.getElementById("check-area").style.display = "block"; initCheckMode(); }
function backToMenu() { hideAll(); document.getElementById("mode-select").style.display = "block"; }

function startQuizSetup() { hideAll(); document.getElementById("quiz-setup-area").style.display = "block"; }

function startQuiz(count) {
    quizTotalCount = count;
    quizCurrentCount = 0;
    quizCorrectCount = 0;
    sessionWrongQuestions = []; // 今回の間違いをリセット
    isBorderlinePriority = document.getElementById("quiz-borderline-priority").checked; // ★追加
    loadAllTimeHistory(); // 過去の履歴を読み込んでおく
    isPracticeMode = false;
    hideAll();
    document.getElementById("quiz-area").style.display = "block";
    nextQuestion();
}

// 履歴クイズを開始する関数（新設）
function startWrongQuestionQuiz() {
    loadAllTimeHistory();
    if (allTimeWrongQuestions.length === 0) {
        alert("間違えた問題の履歴がありません。");
        return;
    }

    isWrongQuestionQuiz = true;
    isPracticeMode = false;
    // 履歴からランダムに並び替えて出題用プールを作成
    wrongQuizPool = [...allTimeWrongQuestions].sort(() => Math.random() - 0.5);
    quizTotalCount = wrongQuizPool.length;
    quizCurrentCount = 0;
    quizCorrectCount = 0;
    sessionWrongQuestions = [];

    hideAll();
    document.getElementById("quiz-area").style.display = "block";
    nextQuestion();
}

// 履歴を読み込む関数
function loadWrongQuestions() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        wrongQuestions = JSON.parse(savedData);
    } else {
        wrongQuestions = [];
    }
}

// 履歴を保存する関数
function saveWrongQuestions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wrongQuestions));
}

function startPracticeSetup() {
    hideAll();
    document.getElementById("practice-setup-area").style.display = "block";
    const pSel = document.getElementById("practice-pos");
    pSel.innerHTML = '<option value="random">ランダム</option>';
    positions.forEach((p, index) => { if (p.name !== "SB") pSel.add(new Option(p.name, index)); });
}

function startPractice() {
    isPracticeMode = true;
    quizTotalCount = 9999; // 練習モードは無限
    quizCurrentCount = 0;
    practiceSettings.pos = document.getElementById("practice-pos").value;
    practiceSettings.sit = document.getElementById("practice-sit").value;
    hideAll();
    document.getElementById("quiz-area").style.display = "block";
    nextQuestion();
}

function nextQuestion() {
    const isLastQuestionFinished = !isPracticeMode && quizCurrentCount >= quizTotalCount && quizTotalCount !== 0;

    if (isLastQuestionFinished) {
        showQuizResult();
        isWrongQuestionQuiz = false; // 終了時にフラグを戻す
        return;
    }

    const buttons = document.querySelectorAll('#quiz-area .btn-group button');
    buttons.forEach(btn => btn.disabled = false);

    quizCurrentCount++;
    document.getElementById("quiz-progress").innerText = isWrongQuestionQuiz 
        ? `苦手克服: ${quizCurrentCount} / ${quizTotalCount}` 
        : (isPracticeMode ? `練習中` : `${quizCurrentCount} / ${quizTotalCount}`);

    let hand, myPos, isRaised, oppPosName;
    const allHands = Object.keys(pokerData.data);

    if (isWrongQuestionQuiz) {
        // --- 履歴クイズの場合：保存された状況（ハンド・位置・レイズ）を完全に再現する ---
        const questionData = wrongQuizPool[quizCurrentCount - 1];
        hand = questionData.hand;
        myPos = positions.find(p => p.name === questionData.myPos);
        isRaised = (questionData.oppPos !== "なし");
        oppPosName = questionData.oppPos;
    } else {
        // --- 通常モード：出題確率を調整してハンドを決定する ---
        const borderlineHands = allHands.filter(h => pokerData.data[h] >= 4 && pokerData.data[h] <= 8);
        const otherHands = allHands.filter(h => pokerData.data[h] < 4 || pokerData.data[h] > 8);

        if (isBorderlinePriority) {
            // ボーダーライン優先：80%の確率でランク4〜8から出題
            if (Math.random() < 0.9) {
                hand = borderlineHands[Math.floor(Math.random() * borderlineHands.length)];
            } else {
                hand = otherHands[Math.floor(Math.random() * otherHands.length)];
            }
        } else {
            // 通常：参加可能(1〜8)を70%、フォールド(9)を30%で出す（フォールド連打対策）
            const playable = allHands.filter(h => pokerData.data[h] <= 8);
            const foldOnly = allHands.filter(h => pokerData.data[h] === 9);
            if (Math.random() < 0.7) {
                hand = playable[Math.floor(Math.random() * playable.length)];
            } else {
                hand = foldOnly[Math.floor(Math.random() * foldOnly.length)];
            }
        }

        // --- 重要：状況（レイズの有無と自分のポジション）を決定する ---
        // 練習モードの設定またはランダムで決定
        if (isPracticeMode && practiceSettings.sit !== 'random') {
            isRaised = (practiceSettings.sit === 'raised');
        } else {
            isRaised = Math.random() > 0.5;
        }

        if (isPracticeMode && practiceSettings.pos !== 'random') {
            myPos = positions[parseInt(practiceSettings.pos)];
            if (isRaised && parseInt(practiceSettings.pos) === 0) isRaised = false; // UTGでレイズありは矛盾するので修正
        } else {
            let availableIndices = isRaised ? [1,2,3,4,5,6,8] : [0,1,2,3,4,5,6]; 
            myPos = positions[availableIndices[Math.floor(Math.random() * availableIndices.length)]];
        }
    }

    // --- 以降は判定と表示のロジック ---
    const rank = pokerData.data[hand];
    let oppPos = null;
    let correctAnswers = [];
    let reason = "";

    if (!isRaised) {
        const canOpen = rank <= 7 && myPos.behind <= openThreshold[rank];
        correctAnswers.push(canOpen ? "レイズ" : "フォールド");
        reason = canOpen ? `ランク${rank}はオープン推奨です。` : `ランク${rank}は弱すぎます。`;
    } else {
        if (isWrongQuestionQuiz) {
            oppPos = positions.find(p => p.name === oppPosName);
        } else {
            const myIdx = positions.findIndex(p => p.name === myPos.name);
            const oppIdx = Math.floor(Math.random() * myIdx);
            oppPos = positions[oppIdx];
        }

        let oppRank = 1;
        for (let r = 7; r >= 1; r--) { if (openThreshold[r] >= oppPos.behind) { oppRank = r; break; } }

        const diff = oppRank - rank;
        if (rank <= 1 || diff >= 2) {
            correctAnswers.push("リレイズ");
            reason = rank <= 1 ? "最強ハンドです。" : `相手より2ランク以上強いためリレイズします。`;
        } else if (diff === 1 || (myPos.name === "BB" && oppPos.name === "BTN" && rank <= 8)) {
            correctAnswers.push("コール");
            reason = diff === 1 ? `1ランク強いためコール可能です。` : "BB vs BTN 特殊防御です。";
        } else {
            correctAnswers.push("フォールド");
            reason = `有利さが足りません。`;
        }
    }

    currentQuestion = { hand, correctAnswers, reason };
    document.getElementById("opp-pos-display").innerText = isRaised ? (oppPos ? oppPos.name : "-") : "なし";
    document.getElementById("my-pos-display").innerText = myPos.name;
    document.getElementById("hand-display-new").innerText = hand;
    document.getElementById("result").innerText = "";
    document.getElementById("next-btn").style.display = "none";
    updateTableUI(myPos.name, oppPos ? oppPos.name : null);
}

function checkAnswer(choice) {
    // ボタンを無効化（連打防止）
    const buttons = document.querySelectorAll('#quiz-area .btn-group button');
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = currentQuestion.correctAnswers.includes(choice);
    const rank = pokerData.data[currentQuestion.hand]; // ランク取得

    if (isCorrect) {
        // 正解の場合：クイズモード（練習モード以外）であれば正解数をカウント
        if (!isPracticeMode) {
            quizCorrectCount++;
        }
    } else {
        // 不正解の場合：間違いデータを生成
        const mistakeData = {
            hand: currentQuestion.hand,
            rank: rank,
            myPos: document.getElementById("my-pos-display").innerText,
            oppPos: document.getElementById("opp-pos-display").innerText,
            correctAction: currentQuestion.correctAnswers.join("/"),
            date: new Date().toLocaleDateString() // 日付を記録
        };

        // 1. 全履歴（復習モード用）にはモードに関わらず常に保存する
        allTimeWrongQuestions.push(mistakeData);
        saveAllTimeHistory(); // ローカルストレージに保存

        // 2. クイズモードの場合のみ、今回のリザルト画面用リストにも追加
        if (!isPracticeMode) {
            sessionWrongQuestions.push(mistakeData);
        }
    }
    
    // 以下、UI表示（結果の表示・ボタンの切り替え）
    const resDiv = document.getElementById("result");
    
    let leftHtml = `<div class="status-text" style="color: ${isCorrect ? '#ff4d4d' : '#0095ff'}">
        ${isCorrect ? '正解' : '不正解'}
    </div>`;
    if (!isCorrect) {
        leftHtml += `<div class="small" style="margin-top:5px; color:white;">正解: ${currentQuestion.answers ? currentQuestion.answers.join("/") : currentQuestion.correctAnswers.join("/")}</div>`;
    }

    const rightHtml = `
        <div style="margin-bottom: 8px; color: white;">
            <span class="rank-badge rank-bg-${rank}">${currentQuestion.hand}</span>はランク${rank}です。
        </div>
        <div style="color: #bbb; font-size: 12px;">${currentQuestion.reason}</div>
    `;

    resDiv.innerHTML = `
        <div class="res-left">${leftHtml}</div>
        <div class="res-right">${rightHtml}</div>
    `;
    
    const nextBtn = document.getElementById("next-btn");
    if (!isPracticeMode && quizCurrentCount >= quizTotalCount) {
        nextBtn.innerText = "結果を確認";
    } else {
        nextBtn.innerText = "次の問題へ";
    }
    nextBtn.style.display = "block";
}

// 履歴をすべて消去する関数（新設）
function clearHistory() {
    if (confirm("これまでの間違い履歴をすべて削除しますか？")) {
        localStorage.removeItem(STORAGE_KEY);
        wrongQuestions = [];
        showQuizResult(); // 画面を更新
    }
}


// showQuizResult 関数の中で間違えた問題リストを表示する
function showQuizResult() {
    hideAll();
    document.getElementById("quiz-result-area").style.display = "block";
    const accuracy = Math.round((quizCorrectCount / quizTotalCount) * 100);
    document.getElementById("final-accuracy").innerText = `正解率: ${accuracy}%`;
    document.getElementById("score-detail").innerText = `${quizTotalCount}問中 ${quizCorrectCount}問正解`;

    const reviewDiv = document.getElementById("session-wrong-review");
    renderMistakeList(sessionWrongQuestions, reviewDiv, "今回の間違いの復習");
}

// 履歴確認モードの開始
function startHistoryMode() {
    hideAll();
    document.getElementById("history-area").style.display = "block";
    loadAllTimeHistory();
    const historyDiv = document.getElementById("all-time-wrong-review");
    // 全履歴は新しい順（逆順）に表示すると見やすい
    renderMistakeList([...allTimeWrongQuestions].reverse(), historyDiv, "全履歴（最新順）");
}

// リスト表示用の共通関数
function renderMistakeList(list, targetElement, title) {
    if (list.length > 0) {
        let listHtml = `<h3 style="margin-top:30px; border-bottom:1px solid #555; padding-bottom:10px;">${title}</h3>`;
        list.forEach(q => {
            listHtml += `
                <div style="text-align:left; background:rgba(255,255,255,0.05); padding:10px; margin-bottom:10px; border-radius:8px; font-size:13px;">
                    <span class="rank-badge rank-bg-${q.rank}">${q.hand}</span> (ランク${q.rank}) [${q.date}]<br>
                    状況: ${q.oppPos !== "なし" ? q.oppPos + "のレイズ有" : "未レイズ"}<br>
                    自位置: ${q.myPos} / 正解: <b style="color:#f1c40f;">${q.correctAction}</b>
                </div>
            `;
        });
        targetElement.innerHTML = listHtml;
    } else {
        targetElement.innerHTML = title.includes("今回") ? '<p style="color:#2ecc71; margin-top:20px;">パーフェクト！</p>' : '<p style="color:#888; margin-top:20px;">履歴はありません</p>';
    }
}

// ストレージ操作
function loadAllTimeHistory() {
    const saved = localStorage.getItem(STORAGE_KEY);
    allTimeWrongQuestions = saved ? JSON.parse(saved) : [];
}
function saveAllTimeHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTimeWrongQuestions));
}
function clearHistory() {
    if (confirm("全履歴を削除しますか？")) {
        localStorage.removeItem(STORAGE_KEY);
        allTimeWrongQuestions = [];
        startHistoryMode();
    }
}

function updateTableUI(myPos, oppPos) {
    document.querySelectorAll('.seat').forEach(s => s.classList.remove('my-pos', 'opp-pos'));
    const formatId = (name) => `seat-${name.replace(/\+/g, '-plus-')}`;
    if (myPos) document.getElementById(formatId(myPos)).classList.add('my-pos');
    if (oppPos) document.getElementById(formatId(oppPos)).classList.add('opp-pos');
}

function initCheckMode() {
    const hSel = document.getElementById("check-hand"); hSel.innerHTML = "";
    Object.keys(pokerData.data).forEach(h => hSel.add(new Option(h, h)));
    const pSel = document.getElementById("check-pos"); pSel.innerHTML = "";
    positions.forEach(p => pSel.add(new Option(`${p.name}(後ろ${p.behind}人)`, p.name)));
    const oSel = document.getElementById("check-opp-pos"); oSel.innerHTML = "";
    positions.slice(0, -1).forEach(p => oSel.add(new Option(`${p.name}(後ろ${p.behind}人)`, p.name)));
    document.getElementById("check-result").innerHTML = "";
}

function runCheck() {
    const resultDiv = document.getElementById("check-result");
    const hand = document.getElementById("check-hand").value;
    const myPosName = document.getElementById("check-pos").value;
    const sit = document.getElementById("check-sit").value;
    const oppPosName = document.getElementById("check-opp-pos").value;
    const rank = pokerData.data[hand];
    const myPos = positions.find(p => p.name === myPosName);
    const oppPos = positions.find(p => p.name === oppPosName);
    let resultAction = "";
    let explanation = "";
    let oppRank = "-";
    if (sit === "open") {
        const canOpen = rank <= 7 && myPos.behind <= openThreshold[rank];
        resultAction = canOpen ? "レイズ" : "フォールド";
        explanation = canOpen ? "オープン圏内です。" : "レンジ外です。";
    } else {
        let tempRank = 1;
        for (let r = 7; r >= 1; r--) { if (openThreshold[r] >= oppPos.behind) { tempRank = r; break; } }
        oppRank = tempRank;
        const diff = oppRank - rank;
        if (rank <= 1 || diff >= 2) { resultAction = "リレイズ"; explanation = rank <= 1 ? "最強ハンドです。" : `圧倒的に有利です。`; } 
        else if (diff === 1 || (myPosName === "BB" && oppPosName === "BTN" && rank <= 8)) { resultAction = "コール"; explanation = "有利または特殊防御です。"; } 
        else { resultAction = "フォールド"; explanation = "有利さが足りません。"; }
    }
    // 結果表示のHTMLを更新
    resultDiv.innerHTML = `
        <div style="border-top: 1px solid #555; margin-top: 10px; padding-top: 10px;">
            <div style="margin-bottom: 8px;">
                <span class="rank-badge rank-bg-${rank}">${hand}</span>はランク${rank}です。
            </div>
            判定結果: <b style="color: #f1c40f;">${resultAction}</b><br>
            <small>${explanation}</small><br>
            <span class="small" style="color:#888;">(相手の推定ランク: ${oppRank})</span>
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