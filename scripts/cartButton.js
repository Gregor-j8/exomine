import { purchaseMineral } from "./TransientState.js"

export const purchaseOrderButton = () => {
        return `
                <button id="purchaseMineral">Purchase Mineral</button>
        `
    }

export const handlePurchaseMineral = (clickEvent) => {
    if (clickEvent.target.id === "purchaseMineral"){
        purchaseMineral()
    }
}
document.addEventListener("click", handlePurchaseMineral)
