export function getCurrentPosition(cords) {
  return new Promise((resolve)=>{
    navigator.geolocation.getCurrentPosition((position)=>{
      cords.innerHTML = `${position.coords.latitude},${position.coords.longitude}`
      resolve(position.coords)
    },(e)=>{
      cords.innerHTML = e.message
      resolve({})
    });
  })
}