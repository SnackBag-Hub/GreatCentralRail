const sheetsLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQBEmXYD_8evbsfa6t8_EQu5CDMpetII6IzqdBNXmUgBK4EX2cmuyvTOCMr0z8WydZgw4MjwDPLwAQC/pub?gid=573239968&single=true&output=tsv";
let articles = [];

/*
[0] Timestamp
[1] Unix Timestamp
[2] Title
[3] Summary
[4] Image
[5] Text
*/

const script = document.currentScript;
const limit = Number(script.dataset.limit) || 0;

const urlParams = new URLSearchParams(document.location.search);

const articleHtml = article => `
<div class="article" id="${article[1]}">
    <img class="article-image" src="${article[4]}" alt="Article Image">
    <div class="article-side">
        <div class="article-texts">
            <h2 class="article-title">${article[2]}</h2>
            <p class="article-summary">${article[3]}</p>
        </div>
        
        <div class="article-footer">
            <button onclick="showPopup('${article[1]}')" class="article-link">Read More</button>
            <p class="article-date">${article[0]}</p>
        </div>
    </div>
</div>
`;

const articlePopupHtml = article => `
<dialog closedby="any" class="article-popup" id="${article[1]}-popup">  
    <div class="article-content">
        <div class="article-header">
            <h2 class="article-title">${article[2]}</h2>
            
            <img class="article-image" src="${article[4]}" alt="Article Image">

            <div class="article-subtitle">
                <p class="article-summary">${article[3]}</p>
                <p class="article-date">${article[0]}</p>
            </div>
        </div>
        
        <p class="article-text">${article[5]}</p>
    </div>
</dialog>
`

if (document.getElementById("articles")) {
    fetch(sheetsLink)
        .then(res => res.text())
        .then(data => {
            articles = data.split("\n").map(row => row.split("\t"));
            articles.shift();
            articles.reverse();

            const grouped = {};
            for (let article of articles) {
                const timestamp = article[0];
                const dateObj = new Date(timestamp.replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3'));
                const dateStr = dateObj.toLocaleDateString();
                const timeStr = dateObj.toLocaleTimeString("en-GB");
                article[0] = `${dateStr} ${timeStr}`;

                if (!grouped[dateStr]) grouped[dateStr] = [];
                grouped[dateStr].push(article);

                for (let i = 0; i < 5; i++) {
                    const div = document.createElement('div');
                    div.innerHTML = article[i];
                    article[i] = div.textContent || div.innerText;
                }
            }

            const container = document.getElementById("articles");
            let articleCount = 0;
            container.innerHTML = "";
            for (let date in grouped) {
                for (let article of grouped[date]) {
                    if (limit !== 0 && articleCount >= limit) break;

                    container.innerHTML += articleHtml(article);
                    articleCount++;
                }
            }
        })
        .then(() => {
            showPopup(urlParams.get("article"));
        });
}

function showPopup(articleId) {
    for (let articlePopup of document.querySelectorAll(".article-popup")) articlePopup.remove();

    for (let article of articles) {
        if (article[1] === articleId) {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = articlePopupHtml(article);
            const dialog = wrapper.firstElementChild;
            document.body.appendChild(dialog);
            dialog.showModal();
        }
    }
}