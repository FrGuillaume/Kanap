let product = [];
const items = document.querySelector(".items");

// ----------------------------------FONCTION POUR RECUPERER LES DONNES DE L'API---------------------------------------------------
const getProducts = async () => {
  product = await fetch(" http://localhost:3000/api/products/").then((res) =>
    res.json()
  );
};

// ---------------------------------FONCTION POUR AFFICHER LES PRODUITS DE L'API---------------------------------------------------

const showProducts = async () => {
  // On appelle la fonction pour récupérer les données des produits de l'API
  await getProducts().then(function productDisplay() {
    // On insère dans le DOM les données pour chaque produits de l'API
    for (let productItem of product) {
      items.innerHTML = product
        .map(
          (product) =>
            `
    <a href="../html/product.html?id=${product._id}">
      <article>
      <img src="${product.imageUrl}" alt="${product.altText}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis
      enim malesuada risus sapien gravida nulla nisl arcu.</p>
      </article>
    </a>
    `
        )
        .join("");
    }
  });
};

showProducts();
