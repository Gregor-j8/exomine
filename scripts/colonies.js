import { setColony } from "./TransientState.js";

// provides HTML for structure of inventory display
export const colonyMinerals = async () => {
  return `
        <section id="colonyInventory"> <ul
            <li>Minerals</li>
            </ul>
        </section>
    `;
};
//Function to update mineral inventory when governor selected
const updateColonyInventory = async (selectedGovernorId) => {
  const fetchData = async () => {
    const urls = [
      "http://localhost:5248/api/governors",
      "http://localhost:5248/api/colonies",
      "http://localhost:5248/api/colonyMinerals",
      "http://localhost:5248/api/minerals",
    ];
    const [governors, colonies, colonyMineralData, minerals] =
      await Promise.all(
        urls.map((url) => fetch(url).then((res) => res.json())) //.map loops through url array,fetch returns the promise, .then(res coverts response to JSON
      );

    // Store fetched data in an object for later use
    return { governors, colonies, colonyMineralData, minerals };
  };
  const data = await fetchData();

  const selectedGovernor = data.governors.find(
    (gov) => gov.id === selectedGovernorId
  ); // find selected gov

  const colonyId = selectedGovernor.coloniesId; // get their assigned colony ID

  // Find the colony name
  const colony = data.colonies.find((colony) => colony.id === colonyId);
  const colonyName = colony.name;

  const colonyMinerals = data.colonyMineralData.filter(
    (mineral) => mineral.colonyId === colonyId
  ); // filters to get minerals for this colony

  // generate HTML for colony minerals
  const colonyMineralHTML = colonyMinerals.map((colonyMineral) => {
    const mineral = data.minerals.find(
      (mineral) => mineral.id === colonyMineral.mineralId
    ); // find mineral name
    return `<li>${mineral.name}: ${colonyMineral.quantity} tons</li>`; // HTML of name and quantity
  });

  document.getElementById("colonyInventory").innerHTML =
    colonyName + colonyMineralHTML.join("");
};

// listens for changes in the governor drop down
document.addEventListener("change", async (event) => {
  if (event.target.id === "governor") {
    const selectedGovernorId = parseInt(event.target.value);
    await updateColonyInventory(selectedGovernorId);

    const selectedOption = event.target.options[event.target.selectedIndex];
    setColony(parseInt(selectedOption.dataset.colony));
  }
});

document.addEventListener("purchaseSubmitted", async () => {
  const governorId = parseInt(document.querySelector("#governor").value);
  if (governorId) { await updateColonyInventory(governorId)}

});
