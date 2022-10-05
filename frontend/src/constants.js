
 export const data = fetch("http://localhost:33997/")
  .then((response) => 
    {
      return response.json()
    }
  )
  .then((data) => 
    {
      return data
    }
  ) 
