const input = document.getElementById("url");
const btnSbmit = document.querySelector("label button");
const urlContaier = document.querySelector(".urls .contaier");
const error = document.getElementsByClassName("error")[0];
let urls = JSON.parse(localStorage.getItem("url")) || [];
let regx = /https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-z]{2,})+(\/\S*)?/gm;
const navIcon = document.getElementsByClassName("bars")[0];
const menu = document.getElementsByClassName("nav-links")[0];

function handleResize() {
  if (window.innerWidth <= 786) {
    navIcon.style.display = "flex";
  } else {
    navIcon.style.display = "none";
    menu.classList.remove("active");
  }
}
handleResize();
document.addEventListener("resize", handleResize);
navIcon.addEventListener("click", () => {
  navIcon.classList.toggle("active");
  menu.classList.toggle("active");
});
displayUrl(urls);

function displayUrl(url) {
  let data = ``;
  for (let i = 0; i < url.length; i++) {
    data += `     <div class="url-preview">
          <p class="main-url">${url[i].mainUrl}</p>
          <div class="result">
            <p class="short-url"><a href="${url[i].shortUrl}" target="_blank">${
      url[i].shortUrl
    }</a></p>
            <div class ="btns">
             <p class="btn-copy  ${
               url[i].copied ? "copied" : ""
             }" onclick='copy("${url[i].shortUrl}" , this  ,${i})'>${
      url[i].copied ? "copied!" : "copy"
    }</p>
      <p class="btn-del" onclick='del("${i}", this) '>del</p></div>
          </div>
        </div>`;
  }
  urlContaier.innerHTML = data;
}
btnSbmit.addEventListener("click", () => {
  if (!input.value) {
    input.classList.add("in-vaild");
    error.classList.add("active");
    error.innerHTML = "please add a link";
    return;
  }

  gitShortUrl(input.value);

  input.classList.remove("in-vaild");
  error.classList.remove("active");
  input.value = "";
});
function copy(text, btn, index) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      setTimeout(() => {
        btn.innerHTML = "copied!!";
        btn.classList.add("copied");
      }, 300);
      urls[index].copied = true;
      localStorage.setItem("url", JSON.stringify(urls));
    });
  } else {
    console.log("s");
  }
}

function del(ind , btn) {
  card = btn.closest('.url-preview')
  card.classList.add('hidden')
  setTimeout(()=>{
  urls.splice(ind, 1);
  localStorage.setItem("url", JSON.stringify(urls));
  displayUrl(urls);
},300)
}

async function gitShortUrl(pram) {
  let api = await fetch(`https://tinyurl-rest-wrapper.onrender.com/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: pram }),
  });
  let data = await api.json();
  let newUrl = {
    mainUrl: pram,
    shortUrl: data.tinyurl,
    copied: false,
  };
  if (!urls.includes(newUrl) && data.tinyurl !== "Error") {
    urls.push(newUrl);
    displayUrl(urls);
    localStorage.setItem("url", JSON.stringify(urls));
    input.classList.remove("in-vaild");
    error.classList.remove("active");
  } else {
    input.classList.add("in-vaild");
    error.classList.add("active");
    error.innerHTML = "this urls is not vaild";
  }
}
