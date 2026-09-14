const hassaanWhatsApp = "61412421374";

function formDataToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${hassaanWhatsApp}?text=${encoded}`, "_blank", "noopener,noreferrer");
}

function clean(value) {
  return value && value.trim() ? value.trim() : "Not provided";
}

const orderForm = document.querySelector("#orderForm");
const serviceForm = document.querySelector("#serviceForm");

orderForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = formDataToObject(orderForm);
  const message = [
    "New TapReview order request",
    "",
    `Business: ${clean(data.businessName)}`,
    `Google Maps/address: ${clean(data.mapsLink)}`,
    `Contact: ${clean(data.contactName)}`,
    `Phone: ${clean(data.phone)}`,
    `Card type: ${clean(data.cardType)}`,
    `Notes: ${clean(data.notes)}`,
  ].join("\n");

  openWhatsApp(message);
});

serviceForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = formDataToObject(serviceForm);
  const message = [
    "New TapReview service request",
    "",
    `Business: ${clean(data.businessName)}`,
    `Request type: ${clean(data.requestType)}`,
    `Contact: ${clean(data.contactName)}`,
    `Phone: ${clean(data.phone)}`,
    `Details: ${clean(data.details)}`,
  ].join("\n");

  openWhatsApp(message);
});
