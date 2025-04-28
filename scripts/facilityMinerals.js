import { setFacility, setFacilityMineral } from "./TransientState.js"

export const getFacilityMinerals = () => {
    return `<section id="facilityMinerals"><h2>Facility Minerals</h2></section>`
}

const generateOptions = async (id) => {
    const response = await fetch('http://localhost:8088/facilityMinerals?_expand=mineral&_expand=facility')

    const facilityMinerals = await response.json()

    let html = ''
        facilityMinerals.forEach(facility => {
            if (facility.facility.id == id) {
                html = `<h2>Facility Minerals for ${facility.facility.name}</h2>`
            }
        });

    facilityMinerals.forEach(facility => {
        if (facility.facility.id == id && facility.quantity > 0) {
            html += `<input type="radio" name="facilityMinerals" value="${facility.id}" /> ${facility.quantity} tons of ${facility.mineral.name}`
        }
    })


    return html
}

document.addEventListener(
    'click',
    (changeEvent) => {
        const {name, value} = changeEvent.target
        
        if (name === 'facilityMinerals') {
            setFacilityMineral(parseInt(value))
        }
    }
)

let facilityMineral = 0

document.addEventListener(
    'change',
    async (changeEvent) => {
        const {id, value} = changeEvent.target

        if (id === 'facilities') {
            facilityMineral = value
            setFacility(parseInt(facilityMineral))
            document.querySelector("#facilityMinerals").innerHTML = await generateOptions(facilityMineral)
        }
    }
)

document.addEventListener(
    'purchaseSubmitted',
    async () => {
        document.querySelector("#facilityMinerals").innerHTML = await generateOptions(facilityMineral)
    }
)