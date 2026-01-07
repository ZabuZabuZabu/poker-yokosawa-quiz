const pokerData = {
    data: {
        "AA": 1, "AKs": 1, "AQs": 2, "AJs": 2, "ATs": 2, "A9s": 4, "A8s": 4, "A7s": 4, "A6s": 4, "A5s": 4, "A4s": 4, "A3s": 4, "A2s": 4,
        "AKo": 1, "KK": 1, "KQs": 2, "KJs": 3, "KTs": 4, "K9s": 4, "K8s": 4, "K7s": 4, "K6s": 4, "K5s": 4, "K4s": 4, "K3s": 4, "K2s": 4,
        "AQo": 2, "KQo": 2, "QQ": 1, "QJs": 3, "QTs": 4, "Q9s": 5, "Q8s": 6, "Q7s": 6, "Q6s": 6, "Q5s": 7, "Q4s": 7, "Q3s": 7, "Q2s": 7,
        "AJo": 3, "KJo": 4, "QJo": 4, "JJ": 2, "JTs": 3, "J9s": 4, "J8s": 6, "J7s": 6, "J6s": 7, "J5s": 8, "J4s": 8, "J3s": 8, "J2s": 8,
        "ATo": 4, "KTo": 6, "QTo": 6, "JTo": 6, "TT": 3, "T9s": 4, "T8s": 5, "T7s": 7, "T6s": 8, "T5s": 8, "T4s": 8, "T3s": 8, "T2s": 8,
        "A9o": 5, "K9o": 6, "Q9o": 6, "J9o": 6, "T9o": 6, "99": 2, "98s": 4, "97s": 6, "96s": 7, "95s": 8, "94s": 8, "93s": 8, "92s": 8,
        "A8o": 6, "K8o": 6, "Q8o": 6, "J8o": 6, "T8o": 7, "98o": 9, "88": 3, "87s": 6, "86s": 7, "85s": 8, "84s": 8, "83s": 8, "82s": 9,
        "A7o": 6, "K7o": 9, "Q7o": 9, "J7o": 9, "T7o": 9, "97o": 9, "87o": 9, "77": 3, "76s": 4, "75s": 7, "74s": 8, "73s": 9, "72s": 9,
        "A6o": 7, "K6o": 9, "Q6o": 9, "J6o": 9, "T6o": 9, "96o": 9, "86o": 9, "76o": 9, "66": 4, "65s": 6, "64s": 7, "63s": 8, "62s": 9,
        "A5o": 8, "K5o": 9, "Q5o": 9, "J5o": 9, "T5o": 9, "95o": 9, "85o": 9, "75o": 9, "65o": 9, "55": 4, "54s": 7, "53s": 8, "52s": 9,
        "A4o": 8, "K4o": 9, "Q4o": 9, "J4o": 9, "T4o": 9, "94o": 9, "84o": 9, "74o": 9, "64o": 9, "54o": 9, "44": 5, "43s": 8, "42s": 9,
        "A3o": 8, "K3o": 9, "Q3o": 9, "J3o": 9, "T3o": 9, "93o": 9, "83o": 9, "73o": 9, "63o": 9, "53o": 9, "43o": 9, "33": 5, "32s": 9,
        "A2o": 8, "K2o": 9, "Q2o": 9, "J2o": 9, "T2o": 9, "92o": 9, "82o": 9, "72o": 9, "62o": 9, "52o": 9, "42o": 9, "32o": 9, "22": 5
    }
};

const positions = [
    { name: "UTG", behind: 8 },
    { name: "UTG+1", behind: 7 },
    { name: "MP", behind: 6 },
    { name: "HJ", behind: 5 },
    { name: "CO", behind: 3 },
    { name: "BTN", behind: 2 },
    { name: "SB", behind: 1 },
    { name: "BB", behind: 0 }
];

const openThreshold = {1:8,2:8,3:8,4:7,5:5,6:3,7:2,8:0};
let currentQuestion = {};

function startQuizMode() {
    hideAll();
    document.getElementById("quiz-area").style.display = "block";
    nextQuestion();
}

function startCheckMode() {
    hideAll();
    document.getElementById("check-area").style.display = "block";
    initHandSelect();
}

function backToMenu() {
    hideAll();
    document.getElementById("mode-select").style.display = "block";
}

function hideAll() {
    document.getElementById("mode-select").style.display = "none";
    document.getElementById("quiz-area").style.display = "none";
    document.getElementById("check-area").style.display = "none";
}

function initHandSelect() {
    const sel = document.getElementById("check-hand");
    sel.innerHTML = "";
    Object.keys(pokerData.data).forEach(h => {
        const o = document.createElement("option");
        o.value = h;
        o.textContent = h;
        sel.appendChild(o);
    });
}

function nextQuestion() {
    const hands = Object.keys(pokerData.data);
    const hand = hands[Math.floor(Math.random() * hands.length)];
    const rank = pokerData.data[hand];

    const myIndex = Math.floor(Math.random() * positions.length);
    const myPos = positions[myIndex];

    const isRaised = Math.random() > 0.5;
    let correctAnswers = [];
    let reason = "";
    let sitText = "";

    if (!isRaised) {
        sitText = "全員フォールドで回ってきました";
        const canOpen = rank <= 7 && myPos.behind <= openThreshold[rank];
        if (canOpen) {
            correctAnswers.push("レイズ");
            reason = `後ろ${myPos.behind}人でカテゴリ${rank}はオープン可能です。`;
        } else {
            correctAnswers.push("フォールド");
            reason = `後ろが多く、このハンドでは厳しい状況です。`;
        }
    } else {
        const oppIndex = Math.floor(Math.random() * myIndex);
        const oppPos = positions[oppIndex];
        sitText = `${oppPos.name}がレイズで参加中`;

        let oppRank = 1;
        for (let r = 7; r >= 1; r--) {
            if (openThreshold[r] >= oppPos.behind) { oppRank = r; break; }
        }

        const canEnter = rank <= oppRank + 1 || (myPos.name === "BB" && rank <= 8);

        if (!canEnter) {
            correctAnswers.push("フォールド");
            reason = `相手レンジに対して明確に不利です。`;
        } else {
            if (rank <= 1) {
                correctAnswers.push("リレイズ");
                reason = `トップレンジなので3ベットが基本です。`;
            }
            if (rank <= oppRank + 1 && rank > 1) {
                correctAnswers.push("コール");
                reason = `戦える強さですが、3ベットするほどではありません。`;
            }
            if (myPos.name === "BB" && oppPos.name === "BTN" && rank <= 7) {
                correctAnswers.push("コール");
                reason = `BB vs BTN は広くディフェンスします。`;
            }
        }
    }

    currentQuestion = { hand, rank, correctAnswers, reason };

    document.getElementById("situation").innerText = sitText;
    document.getElementById("position").innerText =
        `あなたのポジション：${myPos.name}（後ろ${myPos.behind}人）`;
    document.getElementById("hand-display").innerText = hand;
    document.getElementById("result").innerText = "";
    document.getElementById("next-btn").style.display = "none";
}

function checkAnswer(choice) {
    const ok = currentQuestion.correctAnswers.includes(choice);
    document.getElementById("result").innerHTML = ok
        ? `⭕ 正解<br>${currentQuestion.reason}`
        : `❌ 不正解<br>正解：${currentQuestion.correctAnswers.join(" / ")}<br>${currentQuestion.reason}`;
    document.getElementById("next-btn").style.display = "inline-block";
}

function runCheck() {
    const hand = document.getElementById("check-hand").value;
    const posName = document.getElementById("check-pos").value;
    const sit = document.getElementById("check-sit").value;

    const rank = pokerData.data[hand];
    const myPos = positions.find(p => p.name === posName);
    let answers = [];

    if (sit === "open") {
        answers.push(rank <= 7 && myPos.behind <= openThreshold[rank] ? "レイズ" : "フォールド");
    } else {
        if (rank <= 1) answers.push("リレイズ");
        if (rank <= 5) answers.push("コール");
        if (answers.length === 0) answers.push("フォールド");
    }

    document.getElementById("check-result").innerHTML =
        `正解：<b>${answers.join(" / ")}</b><br>カテゴリ${rank}`;
}
