const mainPage = "/GCR-Site/";
const subpage = window.location.pathname.split("/")[2];

const headerHtml = `
<header>
    <a id="logo-div" href="${mainPage}">
        <img id="logo-img" src="/assets/logos/logo.png" alt="logo">
        <p id="logo-title" >Great Central Rail</p>
    </a>

    <div id="nav-section">
        <a id="news" class="nav-item">News</a>
        <a id="projects" class="nav-item">Projects</a>
        <a id="operators" class="nav-item">Operators</a>
        <a id="planning" class="nav-item">Planning</a>
    </div>
</header>
`

const footerHtml = `
<footer>
    <div id="footer-logo">
        <img id="logo-img" src="/assets/logos/logo.png" alt="logo">
        <p id="logo-title" >Great Central Rail</p>
    </div>
</footer>
`

document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = headerHtml + document.body.innerHTML;
    document.body.innerHTML += footerHtml;

    for (const link of document.querySelectorAll('.nav-item')) {
        if (link.id === subpage) {
            link.classList.add('underline');
        }
        link.addEventListener('click', () => {
            window.location.href = `${mainPage}${link.id}/`;
        })
    }
});

// Smooth Scrolling
let currentScroll = window.scrollY;
let targetScroll = window.scrollY;
let isScrolling = false;

function onWheel(e) {
    e.preventDefault();

    targetScroll += e.deltaY * 0.7;

    targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));

    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScroll);
    }
}

function smoothScroll() {
    currentScroll += (targetScroll - currentScroll) * 0.1;

    if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
        isScrolling = false;
    } else {
        requestAnimationFrame(smoothScroll);
    }

    window.scrollTo(0, currentScroll);
}

window.addEventListener("wheel", onWheel, { passive: false });
