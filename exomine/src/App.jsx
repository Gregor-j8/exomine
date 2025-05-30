import { useState, useEffect } from 'react'
import { GetGovernors, GetFacilities, GetFacilitiesById, GetColonyMineralsById,
   GetFacilityMineralsById, PostColonyMineral, PutColonyMineral, PutfacilityMineral, PurchaseMineral, GetColonies, GetColoniesById, GetGovernorById } from './service/service.jsx'


export const App = () => {
  const [governors, setGovernors] = useState([])
  const [facilities, setFacilities] = useState([])
  const [facility, setFacility] = useState({})
  const [governorId, setgovernorId] = useState('')
  const [facilityId, setfacilityId] = useState('')
  const [mineralItem, setMineralItem] = useState('')
  const [Colony, setColony] = useState({})
  const [Colonies, setColonies] = useState({})
  const [c, setC] = useState([])
  const [g, setg] = useState({})
  const [ColonyMinerals, setColonyMinerals] = useState([])
  const [FacilityMinerals, setFacilityMinerals] = useState([])
  const [quantity, setQuantity] = useState(0)
  const [mineralquantity, setmineralquantity] = useState(0)

  const [pirateChance, setPirateChance] = useState(0)

  useEffect(() => {
    GetGovernors().then(data => {
      setGovernors(data)
    })
  }, []) 

  useEffect(() => {
    GetFacilities().then(data => {
      setFacilities(data)
    })
  }, []) 
  useEffect(() => {
    if (governorId === '') return
    GetGovernorById(governorId).then(g => {
      setg(g)
    })
    GetColoniesById(governorId).then(data => {
      setColony(data)
      if (data?.id !== undefined) {
        GetColonyMineralsById(data.id).then(minerals => {
          setColonyMinerals(minerals)
        })
      }
    })
  }, [governorId])
  
  useEffect(() => {
    if (facilityId === '') return
    GetFacilitiesById(facilityId).then(data => {
      setFacility(data)
      if (data?.id !== undefined) {
        GetAllFacilityMineralsById(data.id).then(fm => {
          setFacilityMinerals(fm)
        })
      }
    })
  }, [facilityId])

  useEffect(() => {
    if (mineralItem) {
      setmineralquantity(mineralItem.quantity);
    }
  }, [mineralItem]);
  
      const handlePurchase = () => {
        const purchaseMineral = {
          colonyId: g?.colonyDTOs.id,
          facilityId: facility.id,
          mineralId: mineralItem.mineralId,
          quantity: quantity
        }
        if (quantity > 0) {
          PurchaseMineral(purchaseMineral).then(() => {
            GetColonyMineralsById(g?.colonyDTOs.id).then(data => {
              setColonyMinerals([...data])
            });
            GetFacilityMineralsById(facility.id).then(data => {
              setFacilityMinerals([...data])
              GetGovernorById(governorId).then(g => {
                setg(g);
              });
              setQuantity(0);
            });
          }).catch((error) => {
            alert("Purchase failed. See console for details.");
            console.error("Purchase error:", error);
          });
        }
      }
    
  const handlePurchase = () => {
    if (quantity > 0) {
      const updatedMineral = {
        colonyId: Colony.id,
        mineralId: mineralItem.mineralId,
        miningFacilityId: mineralItem.miningFacilityId,
        quantity: quantity
      }

      //generate a random number between 1 and 100 that changes on each purchase button press
      setPirateChance(Math.floor(Math.random() * 101))
  
      const foundMineral = ColonyMinerals.find(cm => cm.mineralId === updatedMineral.mineralId && cm.colonyId === updatedMineral.colonyId)
      const foundFacilityMineral = FacilityMinerals.find(fm => fm.mineralId === updatedMineral.mineralId && fm.miningFacilityId === updatedMineral.miningFacilityId)
  
      if (foundMineral && foundFacilityMineral) {
        updatedMineral.id = foundMineral.id
        updatedMineral.quantity += foundMineral.quantity
        foundFacilityMineral.quantity -= quantity
        //50% chance that the pirates will steal the resources
        if(pirateChance > 50){
          console.log("You've been robbed by pirates!")
          setQuantity(0)
          return
        }
        PutColonyMineral(updatedMineral).then(() => {
          PutfacilityMineral(foundFacilityMineral).then(() => {
            setQuantity(0)
            GetColonyMineralsById(Colony.id).then(minerals => {
              setColonyMinerals(minerals)
            })
          })
        })
      } else if (foundFacilityMineral) {
        foundFacilityMineral.quantity -= quantity
        PostColonyMineral(updatedMineral).then(() => {
          PutfacilityMineral(foundFacilityMineral).then(() => {
            setQuantity(0)
            GetColonyMineralsById(Colony.id).then(minerals => {
              setColonyMinerals(minerals)
            })
          })
        })
      }
    }
  }

  const simulateTime = async () => {
    await fetch("http://localhost:5248/api/simulate-time", {
      method: "POST",
    });
    if (facilityId !== '') {
      const updatedMinerals = await GetAllFacilityMineralsById(facilityId);
      setFacilityMinerals(updatedMinerals);
    }
  };
            
  return (
    <div>
      <h1>Exomine</h1>
      <h2>Governors</h2>
      <select onChange={(e) => setgovernorId(e.target.value)}>
        <option value="">Select a Governor</option>
        {governors.map(governor => (
          governor.isActive ? <option key={governor.id} value={governor.id}>{governor.name}</option> : ''
        ))}
      </select>

      <div>
        {!Colony.name && ColonyMinerals ? <h2>Colony Minerals</h2> : (
          <div>
            <h2>{Colony.name} Mineral</h2>
            {ColonyMinerals.map(mineral => (
              <div key={mineral.id}>              
                <p>{mineral?.minerals[0].name} {mineral.quantity}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2>Facilities</h2>
      <select onChange={(e) => setfacilityId(e.target.value)}>
        <option value="">Select a facility</option>
        {facilities.map(facility => (
          <option key={facility.id} value={facility.id}>{facility.name}</option>
        ))}
      </select>

      <h2>Facility Minerals</h2>
      {FacilityMinerals.map(fm => (
        <div key={fm.id}>
          <button onClick={() => setMineralItem(fm)}>{fm?.minerals[0].name} {fm.quantity} (+{fm.productionRate})</button>
          
        </div>
      ))}
      <button onClick={simulateTime}>Simulate Time</button>

      <h2>Shopping cart</h2>
        {mineralItem === '' ? null : (
          <div>
            <div>
            <p>{mineralItem?.minerals[0].name} {mineralItem.quantity}</p>
            <button onClick={() => {setQuantity(quantity - 1)}}>-</button>
            <span>{quantity}</span>
            <button onClick={() => {setQuantity(quantity + 1)}}>+</button>     
            </div> 
            <button onClick={handlePurchase}>Purchase items</button>
          </div>
      )}
    </div>
  )
}
