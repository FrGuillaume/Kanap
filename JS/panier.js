let productLS = JSON.parse(localStorage.getItem("product"));
const boxArticle = document.getElementById("cart__items");
const showTotalQuantity = document.getElementById("totalQuantity");
const showTotalPrice = document.getElementById("totalPrice");
const formInputs = document.querySelectorAll("input");
const btnEnvoyer = document.getElementById("order");
let formArray = [];

// ---------------------------FONCTION POUR RECUPERER LE PRODUIT DE L'API-----------------------------
async function getProduct(product) {
  idProduct = productLS[product].articleId;

  await fetch("http://localhost:3000/api/products/" + idProduct)
    .then((res) => res.json())
    .then(async function (data) {
      item = data;
    });
}

// -------------------------FONCTION POUR AFFICHER LES PRODUITS DANS LE PANIER------------------------

async function showProductsToCart() {
  for (let product in productLS) {
    let productArticle = document.createElement("article");
    boxArticle.appendChild(productArticle);
    productArticle.className = "cart__item";
    productArticle.setAttribute("data-id", productLS[product].articleId);

    let productBlocImg = document.createElement("div");
    productArticle.appendChild(productBlocImg);
    productBlocImg.className = "cart__item__img";

    let productImg = document.createElement("img");
    productBlocImg.appendChild(productImg);
    productImg.src = productLS[product].articleIMG;

    let productItemContent = document.createElement("div");
    productArticle.appendChild(productItemContent);
    productItemContent.className = "cart__item__content";

    let productDescription = document.createElement("div");
    productItemContent.appendChild(productDescription);
    productDescription.className = "cart__item__content__description";

    let productName = document.createElement("h2");
    productDescription.appendChild(productName);
    productName.innerHTML = productLS[product].articleName;

    let productColor = document.createElement("p");
    productDescription.appendChild(productColor);
    productColor.innerHTML = productLS[product].articleColor;

    let productPrice = document.createElement("p");
    productDescription.appendChild(productPrice);

    await getProduct(product);
    productPrice.innerHTML = item.price + " €";

    let productBlocSettings = document.createElement("div");
    productArticle.appendChild(productBlocSettings);
    productBlocSettings.className = "cart__item__content__settings";

    let productQuantity = document.createElement("p");
    productBlocSettings.appendChild(productQuantity);
    productQuantity.innerHTML = "Qté : ";

    let productInputQuantity = document.createElement("input");
    productBlocSettings.appendChild(productInputQuantity);
    productInputQuantity.type = "number";
    productInputQuantity.className = "itemQuantity";
    productInputQuantity.name = "itemQuantity";
    productInputQuantity.min = "1";
    productInputQuantity.max = "100";
    productInputQuantity.value = productLS[product].articleQuantity;

    let productBlocDelete = document.createElement("div");
    productBlocSettings.appendChild(productBlocDelete);
    productBlocSettings.className = "cart__item__content__settings__delete";

    let productDelete = document.createElement("p");
    productBlocDelete.appendChild(productDelete);
    productDelete.className = "deleteItem";
    productDelete.innerHTML = "Supprimer";
  }

  // ----------------------------------Supprimer des produits du panier-----------------------------------
  let btn_supprimer = document.querySelectorAll(".deleteItem");

  for (let j = 0; j < btn_supprimer.length; j++) {
    btn_supprimer[j].addEventListener("click", (event) => {
      event.preventDefault();

      //Selection de l'element à supprimer en fonction de son id ET sa couleur
      let idDelete = productLS[j].articleId;
      let colorDelete = productLS[j].articleColor;

      productLS = productLS.filter(
        (el) => el.articleId !== idDelete || el.articleColor !== colorDelete
      );

      localStorage.setItem("product", JSON.stringify(productLS));

      //Alerte produit supprimé et refresh
      alert("Ce produit a bien été supprimé du panier");

      location.reload();
    });
  }

  // ------------------------------------Modifier la quantité d'un produit------------------------------
  let quantityModif = document.querySelectorAll(".itemQuantity");

  // On créé une boucle qui va parcourir tous les input de changements de quantité
  for (let k = 0; k < quantityModif.length; k++) {
    quantityModif[k].addEventListener("change", (e) => {
      e.preventDefault();

      let idToModify = productLS[k].articleId;
      // On récupère la valeur de la nouvelle quantité voule
      let valueQuantity = quantityModif[k].value;

      // On cherche dans le localStorage le produit correspondant
      const resultQuantity = productLS.find((el) => el.articleId == idToModify);

      // On modifie la valeur de la quantité dans le localStorage
      resultQuantity.articleQuantity = valueQuantity;
      productLS[k].articleQuantity = resultQuantity.articleQuantity;

      // On envoi le nouveau résultat dans le localStorage
      localStorage.setItem("product", JSON.stringify(productLS));

      location.reload();
    });
  }
}

// ------------------------------FONCTION POUR AFFICHER LE TOTAL DES PRODUITS (QTITE ET PRIX)------------------------------
async function getTotal() {
  let totalQuantity = 0;
  let totalPrice = 0;

  for (let produit in productLS) {
    totalQuantity += parseInt(productLS[produit].articleQuantity);

    let id = productLS[produit].articleId;
    await fetch("http://localhost:3000/api/products/" + id)
      .then((res) => res.json())
      .then((data) => {
        price = data.price;
      });

    totalPrice += parseInt(price * productLS[produit].articleQuantity);
    showTotalQuantity.innerHTML = parseInt(totalQuantity);
    showTotalPrice.innerHTML = parseInt(totalPrice);
  }
}

// ----------------------------REGEX POUR LA VALIDATION DES CHAMPS DU FORMULAIRE----------------------------
// Regex pour le prénom, le nom et la ville
const regexNormal = (value) => {
  return /^[A-Za-z-]{3,20}$/.test(value);
};

// Regex pour l'adresse
const addressRegex = (value) => {
  return /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+$/.test(value);
};

// Regex pour l'email
const emailRegex = (value) => {
  return /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(value);
};

// -------------------------------FONCTION POUR VALIDER LE NOM? LE PRENOM ET LA VILLE----------------------------
function validNormal(input) {
  let errorMsg = input.nextElementSibling;

  if (regexNormal(input.value)) {
    errorMsg.textContent = "";
    formArray.push(input.value);
  } else {
    errorMsg.textContent =
      "Les chiffres et les symboles ne sont pas autorisés \n Et il doit être compris entre 3 et 20 caractères";
  }
  if (input.value == "") {
    errorMsg.textContent =
      "Les chiffres et les symboles ne sont pas autorisés \n Et il doit être compris entre 3 et 20 caractères";
  }
}

// -------------------------------FONCTION POUR VALIDER L'ADRESSE----------------------------

function validAddress(input) {
  let errorMsg = input.nextElementSibling;

  if (addressRegex(input.value)) {
    errorMsg.textContent = "";
    formArray.push(input.value);
  } else {
    errorMsg.textContent = "Numéro + voie (rue,route, etc) + nom de la voie";
  }
  if (input.value == "") {
    errorMsg.textContent =
      "Les chiffres et les symboles ne sont pas autorisés \n Et il doit être compris entre 3 et 20 caractères";
  }
}

// -------------------------------FONCTION POUR VALIDER L'EMAIL----------------------------

function validEmail(input) {
  let errorMsg = input.nextElementSibling;

  if (emailRegex(input.value)) {
    errorMsg.textContent = "";
    formArray.push(input.value);
  } else {
    errorMsg.textContent = "Il doit inclure l'@";
  }
  if (input.value == "") {
    errorMsg.textContent =
      "Les chiffres et les symboles ne sont pas autorisés \n Et il doit être compris entre 3 et 20 caractères";
  }
}

// ----------------------------FONCTION POUR ECOUTER LES CHAMPS DU FORMULAIRE---------------------------------------

function getForm() {
  let form = document.querySelector(".cart__order__form");

  form.firstName.addEventListener("change", function (e) {
    validNormal(this);
  });

  form.lastName.addEventListener("change", function (e) {
    validNormal(this);
  });

  form.address.addEventListener("change", function (e) {
    validAddress(this);
  });

  form.city.addEventListener("change", function (e) {
    validNormal(this);
  });

  form.email.addEventListener("change", function (e) {
    validEmail(this);
  });
}

// ------------------------------FONCTION POUR ENVOYER LES DONNEES AU SERVEUR-----------------------
function sendForm() {
  btnEnvoyer.addEventListener("click", (e) => {
    e.preventDefault();

    let idProducts = [];
    // On fait une boucle pour récupérer chaque id de produits
    for (let s = 0; s < productLS.length; s++) {
      idProducts.push(productLS[s].articleId);
    }

    // On créer un objet contenant les données du formulaire et des id des produits
    const order = {
      contact: {
        firstName: formArray[0],
        lastName: formArray[1],
        city: formArray[2],
        address: formArray[3],
        email: formArray[4],
      },
      products: idProducts,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    // On envoi les données au serveur et on redirige le client vers la page de confirmation
    if (formArray.length == 5) {
      fetch("http://localhost:3000/api/products/order/", options)
        .then((res) => res.json())
        .then((data) => {
          location.href = "confirmation.html?orderId=" + data.orderId;
        })
        .catch((err) => {
          alert("problème avec fetch : " + err.message);
        });
    } else {
      alert(
        "Veuillez remplir le formulaire ou remplir correctement les informations demandées"
      );
    }
  });
}
// ----------------------------------AFFICHAGE DES PRODUITS DANS LE PANIER-----------------------
if (productLS === null || productLS == 0) {
  boxArticle.innerHTML = "Le panier est vide";
} else {
  showProductsToCart();
}

// ----------------------------------AFFICHAGE DES TOTAUX------------------------------------------
getTotal();

// -------------------------------FORMULAIRE--------------------------------------------

// -----------------------------Récupérer les données du formulaire--------------------
getForm();

// -----------------------------Envoyer les données au serveur-------------------------------
sendForm();
