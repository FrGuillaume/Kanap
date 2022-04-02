// --------------------------------------FONCTION POUR AFFICHER LE NUMERO DE COMMANDE--------------------------------------------

const confirmationDisplay = () => {
  let st = window.location;
  let params = new URL(st);
  let orderId = params.searchParams.get("orderId");

  const idDisplay = document.getElementById("orderId");
  idDisplay.textContent = orderId;

  if (orderId) {
    localStorage.clear();
  }
};

confirmationDisplay();
