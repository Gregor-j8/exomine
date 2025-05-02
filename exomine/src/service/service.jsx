export const GetGovernors = async() => {
    return fetch("http://localhost:5248/api/governors").then(res => res.json())
}
export const GetFacilities = async() => {
    return fetch("http://localhost:5248/api/facilities").then(res => res.json())
}
export const GetColonies = async() => {
    return fetch("http://localhost:5248/api/colonies").then(res => res.json())
}
export const GetColoniesById = async(colonyId) => {
    return fetch(`http://localhost:5248/api/colonies/${colonyId}`).then(res => res.json())
}
export const GetFacilitiesById = async(facilityId) => {
    return fetch(`http://localhost:5248/api/facilities/${facilityId}`).then(res => res.json())
}
export const GetGovernorById = async(governorId) => {
    return fetch(`http://localhost:5248/api/governors/${governorId}`).then(res => res.json())
}
export const GetColonyMineralsById = async(Id) => {
    return fetch(`http://localhost:5248/api/colonyMinerals/${Id}`).then(res => res.json())
}
export const GetFacilityMineralsById = async(id) => {
    return fetch(`http://localhost:5248/api/facilityminerals/minerals/${id}`).then(res => res.json())
}
export const PostColonyMineral = async(cm) => {
    return fetch("http://localhost:5248/api/colonyMinerals", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cm)
    }).then(res => res.json())
}
export const PutColonyMineral = async(cm) => {
    return fetch(`http://localhost:5248/api/colonyMinerals/${cm.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cm)
    }).then(res => res.json())
}
export const PutfacilityMineral = async(fm) => {
    return fetch(`http://localhost:5248/api/facilityMinerals/${fm.id}
`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fm)
    }).then(res => res.json())
}
export const PurchaseMineral = async (purchaseData) => {
    return fetch(`http://localhost:5248/api/purchase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(purchaseData)
    }).then(res => res.json())
}

  

// http://localhost:5248/api/colonyMinerals

// const urls = [
//     "http://localhost:5248/api/governors",
//     "http://localhost:5248/api/colonies",
//     "http://localhost:5248/api/colonyMinerals",
//     "http://localhost:5248/api/minerals",
//   ];
// http://localhost:5248/api/facilities

// http://localhost:5248/facilityMinerals?_expand=mineral&_expand=facility

// http://localhost:5248/api/governors
// http://localhost:5248/api/facilityMinerals/${facilityMineralId}
// http://localhost:5248/api/${joinTableId}
// http://localhost:5248/api/${joinTableId}