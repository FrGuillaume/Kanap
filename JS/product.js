let str = window.location.href;
let url = new URL(str);
let idProduct = url.searchParams.get("id");

const colorChoice = document.getElementById("colors");
const quantityChoice = document.getElementById("quantity");

// ----------------------------------------FONCTION POUR AFFICHER LE PRODUIT-------------------------------------
async function showProduct() {
  // await getProduct();
  await fetch("http://localhost:3000/api/products/" + idProduct)
    .then((res) => res.json())
    .then(async function (data) {
      article = data;
    });

  if (article) {
    displayProduct(article);
  }
}

// --------------------------------------------AFFICHER LES OPTIONS DU PRODUIT-----------------------------------------------

showProduct();

// Fonction pour afficher le nom, le prix et la description du produit
const itemProduct = (id, carac) => {
  let IDHtml = document.getElementById(id);
  IDHtml.textContent = carac;
};

// Fonction pour afficher le produit
const displayProduct = (article) => {
  // On insère l'image du produit
  let productImg = document.createElement("img");
  document.querySelector(".item__img").appendChild(productImg);
  productImg.src = article.imageUrl;
  productImg.alt = article.altTxt;

  // On insère le nom du produit séléctionné
  itemProduct("title", article.name);

  // On insère le prix du produit séléctionné
  itemProduct("price", article.price);

  // On insère la description du produit séléctionné
  itemProduct("description", article.description);

  // On insère le choix des couleurs
  for (let color of article.colors) {
    let productColor = document.createElement("option");
    document.querySelector("#colors").appendChild(productColor);
    productColor.value = color;
    productColor.innerHTML = color;
  }

  // Appel de la fonction pour ajouter l'article au panier
  addToCart(article);
};

// ----------------------------------------FONCTION POUR AJOUTER AU PANIER---------------------------------------------
const addToCart = (article) => {
  const add = document.getElementById("addToCart");

  // On créé un évènement avec des conditions des input selectionnés
  add.addEventListener("click", (e) => {
    if (
      quantityChoice.value > 0 &&
      quantityChoice.value <= 100 &&
      quantityChoice.value != 0
    ) {
      // On récupère la couleur
      let choiceColor = colorChoice.value;

      // On récupère la quantité choisie
      let qutityChoice = quantityChoice.value;

      // On récupère l'ensemble des options du produits choisi
      let productItem = {
        articleIMG: article.imageUrl,
        articleName: article.name,
        articleId: article._id,
        articleQuantity: qutityChoice,
        articleColor: choiceColor,
      };

      // On récupère les données du localStorage
      let productLS = JSON.parse(localStorage.getItem("product"));

      // Fonction pour créer une fenetre pop up
      const popConfirmation = () => {
        if (
          window.confirm(
            `${article.name} ${choiceColor} ${qutityChoice} a bien été ajouté au panier. Consultez le panier OK ou revenir à l'accueil ANNULER`
          )
        ) {
          window.location.href = "cart.html";
        } else {
          window.location.href = "index.html";
        }
      };

      // Fonction pour ajouter les éléments au local storage
      const addLS = () => {
        productLS.push(productItem);
        localStorage.setItem("product", JSON.stringify(productLS));
        popConfirmation();
      };

      // On ajoute une condition lors de l'ajout du produit au panier et dans le localStorage
      if (productLS) {
        // On cherche si le produit à ajouter est déjà dans le panier ou pas
        const resultFind = productLS.find(
          (el) => el.articleId == idProduct && el.articleColor === choiceColor
        );
        if (resultFind) {
          // Si le produit est déjà dans le panier
          let newQuantity =
            parseInt(productItem.articleQuantity) +
            parseInt(resultFind.articleQuantity);
          resultFind.articleQuantity = newQuantity;
          localStorage.setItem("product", JSON.stringify(productLS));
          popConfirmation();
        } else {
          // Si le produit n'est pas encore dans le panier
          addLS();
        }
      } else {
        // Si le panier est vide
        productLS = [];
        addLS();
      }
    }
  });
};
