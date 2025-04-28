import { getFacility, getFacilityMineral } from "./TransientState.js"

export const Cart = async () => {
    return `
    <div id="purchaseContainer">
    <h2>Space Cart</h2>
    <section id="cartInventory"></section>
    </div> `
}

const getFacilityFromIndex = async () => {
    const facilityId = getFacility()
    const response = await fetch(`http://localhost:8088/facilities/${facilityId}`)
    const facility = await response.json()
    return facility.name
}

const getFacilityMineralFromIndex = async () => {
    const mineralId = getFacilityMineral()
    const response = await fetch(`http://localhost:8088/facilityMinerals/${mineralId}?_expand=mineral`)
    const mineral = await response.json()
    return mineral.mineral.name
}

document.addEventListener(
    "facilityMineralChanged",
    async () => {
        document.querySelector("#cartInventory").innerHTML = `1 ton of ${await getFacilityMineralFromIndex()} from ${await getFacilityFromIndex()}`
    }
)

document.addEventListener(
    "purchaseSubmitted",
    () => {
        document.querySelector("#cartInventory").innerHTML = ``
})

