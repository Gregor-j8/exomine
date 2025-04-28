import { resetTransientState } from "./TransientState.js"

export const getFacilities = async () => {
    const response = await fetch('http://localhost:8088/facilities')

    const facilities = await response.json()
    
    const facilityOptions = facilities.map(facility => {
        if (facility.isActive) {
            return `<option value="${facility.id}">${facility.name}</option>`
        }
    }).join('')

    return `
    <label for="facilities"> Choose a Facility:</label>
    <select id="facilities" disabled>
        <option value="0">Choose a facility...</option>
        ${facilityOptions}
    </select>
    `
}

document.addEventListener(
    'change',
    (changeEvent) => {
        if (changeEvent.target.id === "governor") {
            if (changeEvent.target.value > 0) {
                facilities.disabled = false
            } else if (changeEvent.target.value === '0'){
                facilities.disabled = true
                resetTransientState()
                document.dispatchEvent(new CustomEvent("render"))
            }
        } 
    }
)