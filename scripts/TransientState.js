const state = {
    "governorId": 0,
    "colonyId": 0,
    "facilityMineralId": 0,
    "facilityId": 0
}

export const setFacility = (facilityId) => {
    state.facilityId = facilityId
    document.dispatchEvent(new CustomEvent("facilityChanged"))
}

export const setFacilityMineral = (facilityMineralId) => {
    state.facilityMineralId = facilityMineralId
    document.dispatchEvent(new CustomEvent("facilityMineralChanged"))
}

export const setGovernor = (governorId) => {
    state.governorId = governorId
    document.dispatchEvent(new CustomEvent("governorChanged"))
}

export const setColony = (colonyId) => {
    state.colonyId = colonyId
    document.dispatchEvent(new CustomEvent("colonyChanged"))
}

export const getFacility = () => {
    return state.facilityId
}

export const getFacilityMineral = () => {
    return state.facilityMineralId
}

export const resetTransientState = () => {
    state.governorId = 0
    state.colonyId = 0
    state.facilityMineralId = 0
    state.facilityId = 0
}

export const purchaseMineral = async () => {

    if (state.facilityId === 0 || state.facilityMineralId === 0 || state.colonyId === 0) {
        window.alert("Purchase failed: select all options before purchasing"); return;
    }

    const colonyResponse = await fetch('http://localhost:5248/api/colonyMinerals')
    const colonyMinerals = await colonyResponse.json()
    
    const facilityResponse = await fetch(`http://localhost:5248/api/facilityMinerals/${facilityMineralId}`)
    const facilityJoinTable = await facilityResponse.json()

    const colonyDetailsResponse = await fetch(`http://localhost:5248/api/colonies/${colonyId}`)
    const colony = await colonyDetailsResponse.json()

    const facilityDetailsResponse = await fetch(`http://localhost:5248/api/miningFacilities/${facilityId}`)
    const facility = await facilityDetailsResponse.json()

    const mineralResponse = await fetch(`http://localhost:5248/api/minerals/${mineralId}`)
    const mineral = await mineralResponse.json()

    const mineralPrice = mineral.Price

    if (colony.balance < mineralPrice) {
        window.alert("Insufficient funds!")
        return
    }

    let createPost = true

    for (const joinTable of colonyMinerals) {
        if (joinTable.colonyId === state.colonyId && joinTable.mineralId === facilityJoinTable.mineralId) {
            const colonyUpdate = 
            {
                colonyId: state.colonyId,
                mineralId: facilityJoinTable.mineralId,
                quantity: joinTable.quantity + 1,
            }
            await put(colonyUpdate, `/colonyMinerals/${joinTable.id}`)

            const facilityUpdate = 
            {
                facilityId: facilityJoinTable.facilityId,
                mineralId: facilityJoinTable.mineralId,
                quantity: facilityJoinTable.quantity - 1,
            }

            await put(facilityUpdate, `/facilityMinerals/${facilityJoinTable.id}`)

            createPost = false
        }
    }

    if (createPost) {

        const colonyUpdate = 
            {
                colonyId: state.colonyId,
                mineralId: facilityJoinTable.mineralId,
                quantity: 1,
            }

        await coloniesPost(colonyUpdate)

        const facilityUpdate = 
            {
                facilityId: facilityJoinTable.facilityId,
                mineralId: facilityJoinTable.mineralId,
                quantity: facilityJoinTable.quantity - 1,
            }

        await put(facilityUpdate, `/facilityMinerals/${facilityJoinTable.id}`)

    }

    const updatedCoBalance = {
        id: colony.id,
        name: colony.name,
        balance: colony.balance - mineralPrice
    }
    await put(updatedCoBalance, `/colonies/${colony.id}`)

    const updatedFacBalance = {
        id: facility.id,
        name: facility.name,
        isActive: facility.isActive,
        balance: facility.balance + mineralPrice
    }
    await put(updatedFacBalance, `/miningFacilities/${facility.id}`)

    const resetMineralId = () => {
        state.facilityMineralId = 0;
    }
    resetMineralId()

    document.dispatchEvent(new CustomEvent('purchaseSubmitted'))
}


const coloniesPost = async (objectToPost) => {
    const postOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(objectToPost)
    }
    await fetch('http://localhost:5248/api/colonyMinerals', postOptions)
}

const put = async (objectToPut, joinTableId) => {
    const postOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(objectToPut)
    }
    await fetch(`http://localhost:5248/api/${joinTableId}`, postOptions)
}