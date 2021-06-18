const input = document.querySelector(".input");
const btnYellow = document.querySelector(".btn_yellow");
const imagesContainer = document.querySelector(".images-container");
const form = document.querySelector("#form");

class Popup {
  constructor({ whereToInsertDom }) {
    const text = `
      <div class="popup">
        <div class="popup__body">
          <div class="popup__content">
            <a href="" class="popup__close">x</a>
            <div class="popup__text">
            
            </div>
          </div>
        </div>
      </div>
    `;

    whereToInsertDom.insertAdjacentHTML("beforeend", text);
    this.dom = whereToInsertDom.querySelector(".popup");
    this.textDom = this.dom.querySelector(".popup__text");
    this.closeDom = this.dom.querySelector(".popup__close");

    this.closeDom.addEventListener("click", (e) => {
      e.preventDefault();
      this.close();
    });

    this.dom.addEventListener("click", (e) => {
      if (!e.target.closest(".popup__content")) {
        this.close();
      }
    });
  }

  open() {
    this.dom.classList.add("active");
    console.log(open());
  }

  close() {
    this.dom.classList.remove("active");
  }

  addContent(domElem) {
    if (domElem instanceof Element) {
      const clone = domElem.cloneNode(true);
      this.textDom.textContent = "";
      this.textDom.append(clone);
    }
  }
}

class Paginator {
  constructor({ whereToInsertDom }) {
    this.createBtns(whereToInsertDom);
  }

  createBtns(whereToInsertDom) {
    this.btns = [];
    for (let i = 0; i < 5; i++) {
      const btn = document.createElement("button");
      btn.setAttribute("data-id", i + 1);
      btn.classList.add("btn");
      btn.textContent = `${i + 1}`;
      btn.addEventListener("click", (e) => {
        const dataId = Number(btn.getAttribute("data-id"));
        this.clickBtn({ id: dataId, btn: btn });
      });
      this.btns.push(btn);
      whereToInsertDom.append(btn);
    }
    console.log(this.btns);
  }

  clickBtn({ id, btn }) {
    printImages({
      offset: 10,
      id: id,
      value: null,
    });

    for (const btnElem of this.btns) {
      btnElem.classList.remove("active");
    }

    btn.classList.add("active");
  }
}

const popup = new Popup({
  whereToInsertDom: document.querySelector(".popup-container"),
});

const printImages = async ({ id, offset, value }) => {
  if (value === null) {
    if (localStorage.getItem("paginator") !== null) {
      const paginatorLocalStorage = JSON.parse(
        localStorage.getItem("paginator")
      );
      value = paginatorLocalStorage.value;
    }
  }

  localStorage.setItem(
    "paginator",
    JSON.stringify({
      id: id,
      value: value,
    })
  );

  const response = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=cENQvJ74DRaUDEF1CjQtSA6fpsYFHG1l&q=${value}&limit=60`
  );
  const result = await response.json();
  const imagesArray = result.data;

  imagesContainer.textContent = "";

  id = id - 1;
  for (let i = offset * id; i < offset * id + offset; i++) {
    const image = imagesArray[i];

    const imgUrl = image.images.downsized.url;

    const imagesContainerItem = document.createElement("div");
    imagesContainerItem.classList.add("images-container__item");

    const img = document.createElement("img");
    img.src = imgUrl;
    img.classList.add("images-container__img");

    imagesContainerItem.append(img);

    img.addEventListener("click", (e) => {
      popup.addContent(img);
      popup.open();
    });

    imagesContainer.append(imagesContainerItem);
    // console.log(response);
  }
};

let startForm = false;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (startForm === false) {
    const paginator = new Paginator({
      whereToInsertDom: document.querySelector(".paginator-btns"),
    });
  }
  startForm = true;
  printImages({
    id: 1,
    offset: 10,
    value: input.value,
  });
});
