const sheetsLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQBEmXYD_8evbsfa6t8_EQu5CDMpetII6IzqdBNXmUgBK4EX2cmuyvTOCMr0z8WydZgw4MjwDPLwAQC/pub?gid=573239968&single=true&output=tsv";
let articles = [];

/*
[0] Timestamp
[1] Title
[2] Summary
[3] Image
[4] Text
*/

const articleHtml = article => `
<div class="article">
    <img class="article-image" src="${article[3]}" alt="Article Image">
    <div class="article-side">
        <div class="article-texts">
            <h2 class="article-title">${article[1]}</h2>
            <p class="article-summary">${article[2]}</p>
        </div>
        
        <div class="article-footer">
            <a href="" target="_blank" class="article-link">Read More</a>
            <p class="article-date">${article[0]}</p>
        </div>
    </div>
</div>
`;

if (document.getElementById("articles")) {
    fetch(sheetsLink)
        .then(res => res.text())
        .then(data => {
            articles = data.split("\n").map(row => row.split("\t"));
            articles.shift();

            const grouped = {};
            for (let article of articles) {
                const timestamp = article[0];
                const dateObj = new Date(timestamp.replace(/(\d+)\/(\d+)\/(\d+)/, '$2/$1/$3'));
                const dateStr = dateObj.toLocaleDateString();
                const timeStr = dateObj.toLocaleTimeString("en-GB");
                article[0] = `${dateStr} ${timeStr}`;

                if (!grouped[dateStr]) grouped[dateStr] = [];
                grouped[dateStr].push(article);
            }

            const container = document.getElementById("articles");
            let articleCount = 0;
            container.innerHTML = "";
            for (let date in grouped) {
                for (let article of grouped[date]) {
                    if (!window.location.pathname.split("/")[2] && articleCount >= 1) break;

                    container.innerHTML += articleHtml(article);
                    articleCount++;
                }
            }
        });
}