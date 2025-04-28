import { getFacilities } from "./facilities.js"
import { getFacilityMinerals } from "./facilityMinerals.js"
import { governorOptions } from "./governors.js"
import { colonyMinerals } from "./colonies.js"
import { purchaseOrderButton } from "./cartButton.js"
import { Cart } from "./displayCart.js"

let container = document.querySelector("#container")

const render = async () => {
    const governorHTML = await governorOptions()
    const facilityHTML = await getFacilities()
    const colonyMineralsHTML = await colonyMinerals ()
    const facilityMineralsHTML = getFacilityMinerals()
    const cartButtonHTML = purchaseOrderButton()
    const cartHTML = await Cart()

    const composedHTML = `
    <h1>Solar System Mining System</h1>
    
    <article class="choices">
        <section class="choices__governor">
            ${governorHTML}
        </section>

        <section class="choices__facility">
            ${facilityHTML}
        </section>

    </article>

    <article class="colonyMinerals">
        ${colonyMineralsHTML}
    </article>

    <article class="transaction">
        <section class="facilityMinerals">
            ${facilityMineralsHTML}
        </section>

        <section class="cart">
            ${cartHTML}
            ${cartButtonHTML}
        </section>
    </article>

    `
    container.innerHTML = composedHTML
}

render()

document.addEventListener('render', render)