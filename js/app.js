const AIRPORTS = [
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International" },
  { code: "MAA", city: "Chennai", name: "Chennai International" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose" },
  { code: "DXB", city: "Dubai", name: "Dubai International" },
  { code: "LHR", city: "London", name: "Heathrow" },
  { code: "SIN", city: "Singapore", name: "Changi" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi" },
  { code: "JFK", city: "New York", name: "John F. Kennedy" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle" }
];

const SAMPLE_FLIGHTS = [
  { id: "SJ101", airline: "SkyJet Airlines", from: "DEL", to: "BOM", depart: "06:15", arrive: "08:25", duration: "2h 10m", stops: "Non-stop", price: 4899, cabin: "Economy" },
  { id: "SJ204", airline: "SkyJet Airlines", from: "DEL", to: "BOM", depart: "09:40", arrive: "11:55", duration: "2h 15m", stops: "Non-stop", price: 5420, cabin: "Economy" },
  { id: "SJ318", airline: "SkyJet Express", from: "DEL", to: "BOM", depart: "14:05", arrive: "17:40", duration: "3h 35m", stops: "1 stop", price: 3999, cabin: "Economy" },
  { id: "SJ501", airline: "SkyJet Airlines", from: "DEL", to: "BOM", depart: "18:20", arrive: "20:30", duration: "2h 10m", stops: "Non-stop", price: 7120, cabin: "Business" },
  { id: "SJ110", airline: "SkyJet Airlines", from: "BOM", to: "DXB", depart: "10:10", arrive: "12:05", duration: "3h 25m", stops: "Non-stop", price: 18450, cabin: "Economy" },
  { id: "SJ221", airline: "SkyJet Airlines", from: "DEL", to: "LHR", depart: "02:20", arrive: "07:10", duration: "9h 20m", stops: "Non-stop", price: 42800, cabin: "Economy" },
  { id: "SJ330", airline: "SkyJet Airlines", from: "BLR", to: "SIN", depart: "23:15", arrive: "06:05", duration: "4h 20m", stops: "Non-stop", price: 15690, cabin: "Economy" },
  { id: "SJ412", airline: "SkyJet Express", from: "MAA", to: "BKK", depart: "08:30", arrive: "12:10", duration: "3h 10m", stops: "Non-stop", price: 11240, cabin: "Economy" },
  { id: "SJ777", airline: "SkyJet Airlines", from: "HYD", to: "JFK", depart: "01:45", arrive: "11:20", duration: "17h 05m", stops: "1 stop", price: 58990, cabin: "Business" },
  { id: "SJ880", airline: "SkyJet Airlines", from: "CCU", to: "DXB", depart: "16:50", arrive: "20:35", duration: "5h 15m", stops: "Non-stop", price: 17320, cabin: "Economy" }
];

function airportLabel(code) {
  const airport = AIRPORTS.find((item) => item.code === code);
  return airport ? `${airport.city} (${airport.code})` : code;
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function fillAirportSelects() {
  document.querySelectorAll("[data-airports]").forEach((select) => {
    const current = select.value;
    select.innerHTML = AIRPORTS.map(
      (airport) => `<option value="${airport.code}">${airport.city} (${airport.code})</option>`
    ).join("");
    if (current) select.value = current;
  });
}

function setDefaultDates() {
  const depart = document.querySelector("#departDate");
  const ret = document.querySelector("#returnDate");
  if (!depart) return;
  const today = new Date();
  const outbound = new Date(today);
  outbound.setDate(today.getDate() + 7);
  const inbound = new Date(today);
  inbound.setDate(today.getDate() + 14);
  const toValue = (date) => date.toISOString().slice(0, 10);
  depart.min = toValue(today);
  depart.value = toValue(outbound);
  if (ret) {
    ret.min = toValue(today);
    ret.value = toValue(inbound);
  }
}

function saveSearch(event) {
  event.preventDefault();
  const from = document.querySelector("#fromAirport").value;
  const to = document.querySelector("#toAirport").value;
  if (from === to) {
    document.querySelector("#searchNotice").textContent = "Choose two different cities to continue.";
    return;
  }
  const search = {
    tripType: document.querySelector(".chip.active")?.dataset.trip || "round",
    from,
    to,
    departDate: document.querySelector("#departDate").value,
    returnDate: document.querySelector("#returnDate")?.value || "",
    passengers: document.querySelector("#passengers").value,
    cabin: document.querySelector("#cabin").value
  };
  localStorage.setItem("skyjetSearch", JSON.stringify(search));
  window.location.href = "flights.html";
}

function setupHome() {
  fillAirportSelects();
  setDefaultDates();
  const from = document.querySelector("#fromAirport");
  const to = document.querySelector("#toAirport");
  if (from) from.value = "DEL";
  if (to) to.value = "BOM";

  const searchCard = document.querySelector("#searchForm");
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      const returnField = document.querySelector("#returnField");
      const oneWay = chip.dataset.trip === "oneway";
      if (returnField) {
        returnField.style.display = oneWay ? "none" : "block";
      }
      searchCard?.classList.toggle("one-way", oneWay);
    });
  });

  document.querySelectorAll("[data-route]").forEach((card) => {
    card.addEventListener("click", () => {
      const [origin, dest] = card.dataset.route.split("-");
      if (from) from.value = origin;
      if (to) to.value = dest;
      const notice = document.querySelector("#searchNotice");
      if (notice) notice.textContent = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelector("#searchForm")?.addEventListener("submit", saveSearch);
}

function getSearch() {
  const raw = localStorage.getItem("skyjetSearch");
  return raw ? JSON.parse(raw) : {
    from: "DEL",
    to: "BOM",
    departDate: "",
    returnDate: "",
    passengers: "1",
    cabin: "Economy",
    tripType: "round"
  };
}

function passengerLabel(count) {
  const n = Number(count || 1);
  return n === 1 ? "1 passenger" : `${n} passengers`;
}

function flightsForSearch(search) {
  const exact = SAMPLE_FLIGHTS.filter((flight) => flight.from === search.from && flight.to === search.to);
  if (exact.length) return exact;
  return [
    { id: "SJ601", airline: "SkyJet Airlines", from: search.from, to: search.to, depart: "07:30", arrive: "10:45", duration: "3h 15m", stops: "Non-stop", price: 8699, cabin: "Economy" },
    { id: "SJ618", airline: "SkyJet Express", from: search.from, to: search.to, depart: "13:20", arrive: "18:05", duration: "4h 45m", stops: "1 stop", price: 7240, cabin: "Economy" },
    { id: "SJ690", airline: "SkyJet Airlines", from: search.from, to: search.to, depart: "21:10", arrive: "00:25", duration: "3h 15m", stops: "Non-stop", price: 15480, cabin: "Business" }
  ];
}

function renderFlights() {
  const search = getSearch();
  const list = document.querySelector("#flightsList");
  const summary = document.querySelector("#searchSummary");
  if (!list) return;

  if (summary) {
    summary.textContent = `${airportLabel(search.from)} to ${airportLabel(search.to)} · ${search.departDate || "Flexible date"} · ${passengerLabel(search.passengers)} · ${search.cabin}`;
  }

  const cabinFilterEl = document.querySelector("#cabinFilter");
  if (cabinFilterEl && !cabinFilterEl.dataset.ready && search.cabin) {
    cabinFilterEl.value = search.cabin;
    cabinFilterEl.dataset.ready = "1";
  }

  const stopsFilter = document.querySelector("input[name='stops']:checked")?.value || "all";
  const cabinFilter = cabinFilterEl?.value || "all";
  const flights = flightsForSearch(search).filter((flight) => {
    if (stopsFilter === "nonstop" && flight.stops !== "Non-stop") return false;
    if (cabinFilter !== "all" && flight.cabin !== cabinFilter) return false;
    return true;
  });

  if (!flights.length) {
    list.innerHTML = `<article class="flight-card"><div>No flights match these filters. Try another cabin or stop option.</div></article>`;
    return;
  }

  list.innerHTML = flights.map((flight) => `
    <article class="flight-card">
      <div>
        <div class="flight-route">${airportLabel(flight.from)} → ${airportLabel(flight.to)}</div>
        <div class="airline-meta">${flight.id} · ${flight.airline} · ${flight.cabin}</div>
      </div>
      <div class="times">
        <div>
          <div class="time">${flight.depart}</div>
          <div class="airline-meta">${flight.from}</div>
        </div>
        <div class="route-line"></div>
        <div>
          <div class="time">${flight.arrive}</div>
          <div class="airline-meta">${flight.to}</div>
        </div>
        <div class="airline-meta">${flight.duration}<br>${flight.stops}</div>
      </div>
      <div>
        <div class="price">${formatMoney(flight.price)}</div>
        <button class="primary-btn" data-book="${flight.id}">Select</button>
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-book]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = SAMPLE_FLIGHTS.find((flight) => flight.id === button.dataset.book);
      localStorage.setItem("skyjetFlight", JSON.stringify({ ...selected, search }));
      window.location.href = "booking.html";
    });
  });
}

function setupFlights() {
  renderFlights();
  document.querySelectorAll("input[name='stops'], #cabinFilter").forEach((input) => {
    input.addEventListener("change", renderFlights);
  });
}

function setupBooking() {
  const stored = localStorage.getItem("skyjetFlight");
  if (!stored) {
    window.location.href = "index.html";
    return;
  }
  const data = JSON.parse(stored);
  const passengers = Number(data.search.passengers || 1);
  const taxes = Math.round(data.price * 0.12);
  const total = (data.price + taxes) * passengers;

  document.querySelector("#bookingSummary").innerHTML = `
    <div class="summary-row"><span>Flight</span><strong>${data.id}</strong></div>
    <div class="summary-row"><span>Route</span><strong>${data.from} → ${data.to}</strong></div>
    <div class="summary-row"><span>Time</span><strong>${data.depart} – ${data.arrive}</strong></div>
    <div class="summary-row"><span>Cabin</span><strong>${data.cabin}</strong></div>
    <div class="summary-row"><span>Passengers</span><strong>${passengers}</strong></div>
    <div class="summary-row"><span>Fare</span><span>${formatMoney(data.price)}</span></div>
    <div class="summary-row"><span>Taxes</span><span>${formatMoney(taxes)}</span></div>
    <div class="summary-row summary-total"><span>Total</span><span>${formatMoney(total)}</span></div>
  `;

  document.querySelector("#bookingForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const booking = {
      ...data,
      passenger: {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        email: document.querySelector("#email").value,
        phone: document.querySelector("#phone").value
      },
      total,
      pnr: `SJ${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    };
    localStorage.setItem("skyjetBooking", JSON.stringify(booking));
    window.location.href = "confirmation.html";
  });
}

function setupConfirmation() {
  const stored = localStorage.getItem("skyjetBooking");
  if (!stored) {
    window.location.href = "index.html";
    return;
  }
  const booking = JSON.parse(stored);
  document.querySelector("#pnr").textContent = booking.pnr;
  document.querySelector("#confirmDetails").innerHTML = `
    <p>${booking.passenger.firstName} ${booking.passenger.lastName} is confirmed on ${booking.id} from ${booking.from} to ${booking.to}.</p>
    <p>${booking.depart} – ${booking.arrive} · ${booking.cabin} · ${formatMoney(booking.total)}</p>
    <p>A sample itinerary would be emailed to ${booking.passenger.email}.</p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "home") setupHome();
  if (page === "flights") setupFlights();
  if (page === "booking") setupBooking();
  if (page === "confirmation") setupConfirmation();
});
